package com.pki.example.dto;


import com.pki.example.data.Extensions;
import lombok.Getter;
import lombok.Setter;

import java.math.BigInteger;
import java.security.cert.X509Certificate;
import java.util.Base64;

@Getter
@Setter
public class CertificateDTO extends CertificateNewDTO {
    private BigInteger serialNumber;
    private String subjectPublicKey;

    public CertificateDTO() {
        super();
    }

    public CertificateDTO(X509Certificate certificate) {
        this.serialNumber = certificate.getSerialNumber();
        this.subjectPublicKey = Base64.getEncoder().encodeToString(certificate.getPublicKey().getEncoded());

        this.creationDate = certificate.getNotBefore();
        this.expirationDate = certificate.getNotAfter();

//        this.issuerPublicKey = Base64.getEncoder().encodeToString(certificate.getIssuerX500Principal());
        this.issuerName = certificate.getIssuerX500Principal().getName();
        this.extensions = new Extensions();
        this.extensions.setCA(certificate.getBasicConstraints() != -1);
        this.extensions.setUsage(certificate.getKeyUsage());

        setRDN(certificate.getIssuerX500Principal().getName());
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
                case "OU": this.organizationalUnit = value; break;
                case "O": this.organization = value; break;
                case "L": this.locality = value; break;
                case "ST": this.state = value; break;
                case "C": this.country = value; break;
            }
        }
    }

}
