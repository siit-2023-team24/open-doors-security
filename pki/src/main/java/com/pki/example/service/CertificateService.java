package com.pki.example.service;

import com.pki.example.certificates.CertificateGenerator;
import com.pki.example.data.Issuer;
import com.pki.example.data.Subject;
import com.pki.example.dto.CertificateDTO;
import com.pki.example.dto.CertificateItemDTO;
import com.pki.example.dto.CertificateNewDTO;
import com.pki.example.keystores.KeyStoreReader;
import com.pki.example.keystores.KeyStoreWriter;
import com.pki.example.repository.AliasRepository;
import com.pki.example.repository.PrivateKeyRepository;
import com.pki.example.repository.RevocationRepository;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x500.X500NameBuilder;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.math.BigInteger;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateEncodingException;
import java.security.cert.X509Certificate;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.*;

@Service
public class CertificateService {

    @Autowired
    private KeyStoreReader keyStoreReader;

    @Autowired
    private KeyStoreWriter keyStoreWriter;

    @Autowired
    private AliasRepository aliasRepository;

    @Autowired
    private RevocationRepository revocationRepository;

    @Autowired
    private PrivateKeyRepository privateKeyRepository;

    @Autowired
    private OcspService ocspService;
    
    private final String FILE = "src/main/resources/static/keystore1.jks";
    private String PASS = "";

    public CertificateService() {
        try(BufferedReader in = new BufferedReader(new FileReader("src/main/resources/static/kspass.txt"))){
            PASS = in.readLine();
        } catch (IOException e) {
            System.err.println("Invalid ks password");
            throw new RuntimeException(e);
        }
    }

    public List<CertificateItemDTO> getAll() {
        Map<String, X509Certificate> certificates = keyStoreReader.readAll(FILE, PASS);
        List<CertificateItemDTO> dtos = new ArrayList<>();
        for (String alias : certificates.keySet()) {
            String issuerAlias = aliasRepository.getIssuerAlias(alias);
            X509Certificate certificate = certificates.get(alias);
            CertificateDTO certificateDTO = new CertificateDTO(certificate, alias, issuerAlias);
            boolean valid = ocspService.isValid(certificateDTO);
            boolean revoked = ocspService.isRevoked(certificateDTO.getSerialNumber());
            dtos.add(new CertificateItemDTO(certificate, alias, issuerAlias, valid, revoked));
        }
        return dtos;
    }

    public Certificate create(CertificateNewDTO dto) {

        // check whether issuer is CA
        if(!isIssuerEligibleCA(dto.getIssuerAlias()))
        {
            return null;
        }

        // check that alias is unique
        if(aliasAlreadyExists(dto.getAlias())) {
            return null;
        }

        // check issuer validity
        if(!isIssuerValid(dto.getIssuerAlias())) {
            return null;
        }

        // check whether cert dates are within issuer dates and that start date is not before today and that start date is before end date
        if(!areDatesValid(dto)) {
            return null;
        }

        KeyPair keyPairSubject = generateKeyPair();

        X500NameBuilder builder = new X500NameBuilder(BCStyle.INSTANCE);
        builder.addRDN(BCStyle.CN, dto.getCommonName())
                .addRDN(BCStyle.O, dto.getOrganization())
                .addRDN(BCStyle.OU, dto.getOrganizationalUnit())
                .addRDN(BCStyle.C, dto.getCountry())
                .addRDN(BCStyle.E, dto.getEmail())
                .addRDN(BCStyle.L, dto.getLocality())
                .addRDN(BCStyle.ST, dto.getState());

        Subject subject = new Subject(keyPairSubject.getPublic(), builder.build());
        Issuer issuer = findIssuer(dto.getIssuerAlias());
        String serialNumber = generateSerialNumber();
        X509Certificate certificate = CertificateGenerator.generateCertificate(
                subject, issuer, dto.getStartDate(), dto.getExpirationDate(), serialNumber, dto.getExtensions());

        if (dto.getExtensions().isCA()){
            privateKeyRepository.save(dto.getAlias(), keyPairSubject.getPrivate());
        }

        aliasRepository.save(dto.getIssuerAlias(), dto.getAlias());
        revocationRepository.save(certificate.getSerialNumber(), false);

        keyStoreWriter.write(certificate, dto.getAlias());
        keyStoreWriter.saveKeyStore(FILE, PASS.toCharArray());

        return certificate;
    }

    private boolean isIssuerEligibleCA(String issuerAlias) {
        X509Certificate issuer = keyStoreReader.getCertificateByAlias(FILE, PASS, issuerAlias);
        return isCACertificate(issuer) && hasLessThenThreeSigned(issuerAlias);
    }

    private static boolean isCACertificate(X509Certificate certificate) {
        try {
            // Get the Basic Constraints extension
            byte[] basicConstraints = certificate.getExtensionValue("2.5.29.19");

            if (basicConstraints != null) {
                // If the certificate is a CA certificate, the basicConstraints value will not be null
                // and the "cA" field of the Basic Constraints extension must be true
                return (basicConstraints[4] == 0x01);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // If the Basic Constraints extension is not present or the "cA" field is not set, return false
        return false;
    }

    private boolean hasLessThenThreeSigned(String alias) {
        return aliasRepository.getAllSignedBy(alias).size() < 3;
    }

    private boolean aliasAlreadyExists(String alias) {
        Map<String, X509Certificate> certificateMap = keyStoreReader.readAll(FILE, PASS);
        return certificateMap.containsKey(alias);
    }

    private boolean isIssuerValid(String issuerAlias) {
        X509Certificate certificate = keyStoreReader.getCertificateByAlias(FILE, PASS, issuerAlias);
        Date startDate = certificate.getNotBefore();
        Date endDate = certificate.getNotAfter();
        Date now = new Date();
        if (certificate == null) {
            return false;
        }
        return startDate.before(now) && endDate.after(now) && !revocationRepository.isRevoked(certificate.getSerialNumber().toString());
    }

    private boolean areDatesValid(CertificateNewDTO dto) {
        X509Certificate issuer = keyStoreReader.getCertificateByAlias(FILE, PASS, dto.getIssuerAlias());
        Date issuerStartDate = issuer.getNotBefore();
        Date issuerEndDate = issuer.getNotAfter();
        return dto.getStartDate().before(dto.getExpirationDate()) && !issuerStartDate.after(dto.getStartDate()) && !issuerEndDate.before(dto.getExpirationDate());
    }

    public CertificateDTO createDTO(CertificateNewDTO dto) {
        X509Certificate certificate = (X509Certificate) create(dto);
        if(certificate == null) {return null;}
        CertificateDTO certificateDTO = new CertificateDTO(certificate, dto.getAlias(), dto.getIssuerAlias());
        return certificateDTO;
    }

    private KeyPair generateKeyPair() {
        try {
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
            SecureRandom random = SecureRandom.getInstance("SHA1PRNG", "SUN");
            keyGen.initialize(2048, random);
            return keyGen.generateKeyPair();
        } catch (NoSuchAlgorithmException | NoSuchProviderException e) {
            e.printStackTrace();
        }
        return null;
    }

    private Issuer findIssuer(String issuerAlias) {
        PrivateKey privateKey = privateKeyRepository.find(issuerAlias);

        X509Certificate certificate = (X509Certificate)keyStoreReader.readCertificate(FILE, PASS, issuerAlias);
        return new Issuer(privateKey, certificate.getPublicKey(), new X500Name(certificate.getSubjectX500Principal().getName()));
    }

    private String generateSerialNumber() {
        String characters = "123456789";
        int length = 10;

        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            int randomIndex = random.nextInt(characters.length());
            char randomChar = characters.charAt(randomIndex);
            sb.append(randomChar);
        }

        return sb.toString() + System.currentTimeMillis();
    }

    public void delete(String alias) {
        X509Certificate certificate = (X509Certificate) keyStoreReader.readCertificate(FILE, PASS, alias);
        aliasRepository.deleteSubject(alias);

        List<String> signedAliases = aliasRepository.getAllSignedBy(alias);
        for (String signedAlias: signedAliases) {
            delete(signedAlias);
        }

        keyStoreWriter.delete(alias);
        keyStoreWriter.saveKeyStore(FILE, PASS.toCharArray());

        privateKeyRepository.delete(alias);
    }

    public void revoke(CertificateDTO dto) {
        System.out.println(dto.getSerialNumber());
        revocationRepository.revokeCertificate(dto);
    }


    public List<String> getEligibleIssuers() {
        Set<String> issuers = new HashSet<>();
        Map<String, X509Certificate> certificateMap = keyStoreReader.readAll(FILE, PASS);

        for (String alias : certificateMap.keySet()) {
            X509Certificate certificate = certificateMap.get(alias);
            if (certificate != null && isCACertificate(certificate)) {
                issuers.add(alias);
            }
        }
        return issuers.stream().toList();
    }

    public byte[] getCertificateFileBytes(String alias) {
        X509Certificate certificate = keyStoreReader.getCertificateByAlias(FILE,PASS,alias);
        try {
            return certificate.getEncoded();
        } catch (CertificateEncodingException e) {
            throw new RuntimeException(e);
        }

    }
}
