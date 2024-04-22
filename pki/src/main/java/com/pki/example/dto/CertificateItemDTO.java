package com.pki.example.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.security.cert.X509Certificate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CertificateItemDTO extends CertificateDTO {
    private boolean valid;

    private boolean revoked;

    public CertificateItemDTO(X509Certificate certificate, String alias, String issuerAlias, boolean valid, boolean revoked){
        super(certificate, alias, issuerAlias);
        this.valid = valid;
        this.revoked = revoked;
    }

    public void setRevoked(boolean revoked) { this.revoked = revoked; }

    public void setValid(boolean valid) {
        this.valid = valid;
    }
}
