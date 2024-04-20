package com.pki.example.dto;

import com.pki.example.data.Extensions;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CertificateNewDTO {
    protected String commonName;
    protected String organization;
    protected String organizationalUnit;
    protected String country;
    protected String state;
    protected String locality;
    protected String email;

    protected Extensions extensions;
    protected Date creationDate;
    protected Date expirationDate;
    protected String issuerName;

}
