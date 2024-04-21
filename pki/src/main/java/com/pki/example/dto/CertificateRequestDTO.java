package com.pki.example.dto;

import com.pki.example.data.CertificateRequest;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CertificateRequestDTO extends CertificateNewRequestDTO {
    private boolean pending;
    private String issuerAlias;

    public CertificateRequestDTO(CertificateRequest request) {
        this.userId = request.getUserId();
        this.timestamp = request.getTimestamp();
        this.pending = request.isPending();
        this.issuerAlias = request.getIssuerAlias();
    }

    public CertificateRequestDTO(CertificateNewRequestDTO newRequestDTO) {
        this.userId = newRequestDTO.userId;
        this.timestamp = newRequestDTO.timestamp;
        this.issuerAlias = null;
        this.pending = true;

    }
}
