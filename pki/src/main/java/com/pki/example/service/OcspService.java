package com.pki.example.service;

import java.math.BigInteger;
import java.util.Date;

import com.pki.example.dto.CertificateDTO;
import com.pki.example.repository.RevocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OcspService {

    @Autowired
    private RevocationRepository revocationRepository;

    public boolean checkCertificateStatus(CertificateDTO certificate) {
        return isValid(certificate) && !isRevoked(certificate.getSerialNumber());
    }

    private boolean isValid(CertificateDTO certificate) {
        Date expirationDate = certificate.getExpirationDate();
        Date currentDate = new Date();
        Date startDate = certificate.getStartDate();
        return !currentDate.after(expirationDate) && !currentDate.before(startDate);
    }

    private boolean isRevoked(BigInteger serialNumber) {
        return revocationRepository.isRevoked(serialNumber);
    }


}

