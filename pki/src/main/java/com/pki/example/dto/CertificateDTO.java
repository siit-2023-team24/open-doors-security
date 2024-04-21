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
    private BigInteger serialNumber;
    private String subjectPublicKey;

    public CertificateDTO() {
        super();
    }

    public CertificateDTO(X509Certificate certificate, String alias, String issuerAlias) {
        this.serialNumber = certificate.getSerialNumber();
        this.subjectPublicKey = Base64.getEncoder().encodeToString(certificate.getPublicKey().getEncoded());

        this.startDate = certificate.getNotBefore();
        this.expirationDate = certificate.getNotAfter();

        this.extensions = new Extensions();


        //TODO ne radi ovo za CA

//        this.extensions.setCA(certificate.getBasicConstraints() != -1);
//        this.extensions.setUsage(certificate.getKeyUsage());

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
