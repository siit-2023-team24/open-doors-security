package com.pki.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;


@NoArgsConstructor
@AllArgsConstructor
@Data
public class CertificateNewRequestDTO {
    protected String userId;
    protected Timestamp timestamp;
}
