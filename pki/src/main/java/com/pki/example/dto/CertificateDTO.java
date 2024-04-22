package com.pki.example.dto;


import com.pki.example.data.Extensions;
import lombok.Getter;
import lombok.Setter;
import org.bouncycastle.asn1.x500.RDN;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.bouncycastle.asn1.x500.style.IETFUtils;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;

import javax.security.auth.x500.X500Principal;
import java.math.BigInteger;
import java.security.cert.CertificateEncodingException;
import java.security.cert.CertificateParsingException;
import java.security.cert.X509Certificate;
import java.util.Base64;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
public class CertificateDTO extends CertificateNewDTO {
    protected BigInteger serialNumber;
    protected String subjectPublicKey;

    public CertificateDTO() {
        super();
    }

    public CertificateDTO(X509Certificate certificate, String alias, String issuerAlias) {
        this.serialNumber = certificate.getSerialNumber();
        this.subjectPublicKey = Base64.getEncoder().encodeToString(certificate.getPublicKey().getEncoded());

        this.startDate = certificate.getNotBefore();
        this.expirationDate = certificate.getNotAfter();

        this.extensions = new Extensions();

        //TODO za ostale ostale ext.


        this.extensions.setCA(isCACertificate(certificate));

        this.extensions.setUsage(certificate.getKeyUsage());

        this.alias = alias;
        this.issuerAlias = issuerAlias;
        setRDN(certificate.getSubjectX500Principal().getName());

        X500Name x500name = null;
        try {
            x500name = new JcaX509CertificateHolder(certificate).getSubject();
            RDN cn = x500name.getRDNs(BCStyle.E)[0];
            this.email = IETFUtils.valueToString(cn.getFirst().getValue());
        } catch (CertificateEncodingException | IndexOutOfBoundsException e) {}
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

    private void setRDN(String names) {
        String[] rdns = names.split(",");
        String[] parts;

        for (String rdn : rdns) {
            parts = rdn.trim().split("=");
            if (parts.length != 2) continue;
            String type = parts[0].trim();
            String value = parts[1].trim();

            switch (type){
                case "CN": this.commonName = value; break;
                case "L": this.locality = value; break;
                case "O": this.organization = value; break;
                case "ST": this.state = value; break;
                case "C": this.country = value; break;
                case "OU": this.organizationalUnit = value; break;
            }
        }
    }

}
