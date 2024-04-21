package com.pki.example.data;

import com.pki.example.dto.CertificateNewRequestDTO;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.Nullable;

import java.sql.Timestamp;


@Entity
public class CertificateRequest {
    @Id
    private Long userId;
    private boolean pending;
    private Timestamp timestamp;
    @Nullable
    private String issuerAlias;

    public CertificateRequest(CertificateNewRequestDTO dto) {
        this.userId = dto.getUserId();
        this.pending = true;
        this.timestamp = dto.getTimestamp();
        this.issuerAlias = null;
    }

    public CertificateRequest() {

    }

    public CertificateRequest(Long userId, boolean pending, Timestamp timestamp, @Nullable String issuerAlias) {
        this.userId = userId;
        this.pending = pending;
        this.timestamp = timestamp;
        this.issuerAlias = issuerAlias;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public boolean isPending() {
        return pending;
    }

    public void setPending(boolean pending) {
        this.pending = pending;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    @Nullable
    public String getIssuerAlias() {
        return issuerAlias;
    }

    public void setIssuerAlias(@Nullable String issuerAlias) {
        this.issuerAlias = issuerAlias;
    }

    @Override
    public String toString() {
        return "CertificateRequest{" +
                "userId=" + userId +
                ", pending=" + pending +
                ", timestamp=" + timestamp +
                ", issuerAlias='" + issuerAlias + '\'' +
                '}';
    }
}
