package com.pki.example.service;

import com.pki.example.certificates.CertificateGenerator;
import com.pki.example.data.Issuer;
import com.pki.example.data.Subject;
import com.pki.example.dto.CertificateDTO;
import com.pki.example.dto.CertificateNewDTO;
import com.pki.example.keystores.KeyStoreReader;
import com.pki.example.keystores.KeyStoreWriter;
import com.pki.example.repository.AliasRepository;
import com.pki.example.repository.PrivateKeyRepository;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x500.X500NameBuilder;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class CertificateService {

    @Autowired
    private KeyStoreReader keyStoreReader;

    @Autowired
    private KeyStoreWriter keyStoreWriter;

    @Autowired
    private AliasRepository aliasRepository;

    @Autowired
    private PrivateKeyRepository privateKeyRepository;
    //TODO u fajl:
    private final String FILE = "src/main/resources/static/keystore1.jks";
    private final String PASS = "opendoors";

    public List<CertificateDTO> getAll() {
        Map<String, X509Certificate> certificates = keyStoreReader.readAll(FILE, PASS);
        List<CertificateDTO> dtos = new ArrayList<>();
        for (String alias : certificates.keySet()){
            String issuerAlias = aliasRepository.getIssuerAlias(alias);
            dtos.add(new CertificateDTO(certificates.get(alias), alias, issuerAlias));
        }
        return dtos;
    }

    public Certificate create(CertificateNewDTO dto) {
        KeyPair keyPairSubject = generateKeyPair();

        //klasa X500NameBuilder pravi X500Name objekat koji predstavlja podatke o vlasniku
        X500NameBuilder builder = new X500NameBuilder(BCStyle.INSTANCE);
        builder.addRDN(BCStyle.CN, dto.getCommonName())
                .addRDN(BCStyle.O, dto.getOrganization())
                .addRDN(BCStyle.OU, dto.getOrganizationalUnit())
                .addRDN(BCStyle.C, dto.getCountry())
                .addRDN(BCStyle.E, dto.getEmail())
                .addRDN(BCStyle.L, dto.getLocality())
                .addRDN(BCStyle.ST, dto.getState());
        //UID (USER ID) je ID korisnika
//        builder.addRDN(BCStyle.UID, "123456");
        Subject subject = new Subject(keyPairSubject.getPublic(), builder.build());
        Issuer issuer = findIssuer(dto.getIssuerAlias());
        String serialNumber = generateSerialNumber();
        X509Certificate certificate = CertificateGenerator.generateCertificate(
                subject, issuer, dto.getStartDate(), dto.getExpirationDate(), serialNumber);

        if (dto.getExtensions().isCA()){
            privateKeyRepository.save(dto.getAlias(), keyPairSubject.getPrivate());
        }

        aliasRepository.save(dto.getIssuerAlias(), dto.getAlias());

        keyStoreWriter.write(certificate, dto.getAlias());
        keyStoreWriter.saveKeyStore(FILE, PASS.toCharArray());

        return certificate;
    }

    public CertificateDTO createDTO(CertificateNewDTO dto) {
        X509Certificate certificate = (X509Certificate) create(dto);
        return new CertificateDTO(certificate, dto.getAlias(), dto.getIssuerAlias());
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

}
