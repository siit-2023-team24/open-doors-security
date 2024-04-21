package com.pki.example.service;

import java.math.BigInteger;
import java.security.cert.X509Certificate;
import java.util.Date;
import java.util.Set;

import com.pki.example.dto.CertificateDTO;
import com.pki.example.repository.RevocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OcspService {

    @Autowired
    private RevocationRepository revocationRepository;

    public boolean checkCertificateStatus(CertificateDTO certificate) {
        return isValidCertificate(certificate) && !isRevoked(certificate.getSerialNumber());
    }

    private boolean isValidCertificate(CertificateDTO certificate) {
        Date expirationDate = certificate.getExpirationDate();
        Date currentDate = new Date();
        return currentDate.after(expirationDate);
    }

    private boolean isRevoked(BigInteger serialNumber) {
        return revocationRepository.getCertificateRevocationStatus(serialNumber);
    }


}

