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
    protected String alias;
    protected String commonName;
    protected String organization;
    protected String organizationalUnit;
    protected String locality;
    protected String state;
    protected String country;
    protected String email;

    protected Extensions extensions;
    protected Date startDate;
    protected Date expirationDate;
    protected String issuerAlias;

}
