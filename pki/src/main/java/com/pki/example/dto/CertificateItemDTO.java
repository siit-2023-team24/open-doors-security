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

    public CertificateItemDTO(X509Certificate certificate, String alias, String issuerAlias, boolean valid){
        super(certificate, alias, issuerAlias);
        this.valid = valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }
}
