package com.pki.example.service;

import com.pki.example.dto.CertificateDTO;
import com.pki.example.keystores.KeyStoreReader;
import com.pki.example.keystores.KeyStoreWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

@Service
public class CertificateService {

    @Autowired
    private KeyStoreReader keyStoreReader;

    @Autowired
    private KeyStoreWriter keyStoreWriter;

    private final String FILE = "src/main/resources/static/keystore1.jks";
    private final String PASS = "opendoors";

    public List<CertificateDTO> getAll() {
        List<X509Certificate> certificates = keyStoreReader.readAll(FILE, PASS);
        List<CertificateDTO> dtos = new ArrayList<>();
        for (X509Certificate certificate : certificates){
            dtos.add(new CertificateDTO(certificate));
        }
        return dtos;
    }
}
