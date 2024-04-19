package com.pki.example.controller;

import com.pki.example.dto.CertificateDTO;
import com.pki.example.keystores.KeyStoreReader;
import com.pki.example.keystores.KeyStoreWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

@RestController
@RequestMapping(value = "pki/certificates")
public class CertificateController {

    @Autowired
    private KeyStore keyStore;

    @GetMapping
    public ResponseEntity<List<CertificateDTO>> getAll() {
        List<CertificateDTO> dtos = new ArrayList<>();

        try {
            Enumeration<String> aliases = keyStore.aliases();
            while (aliases.hasMoreElements()) {
                String alias = aliases.nextElement();
                Certificate certificate = keyStore.getCertificate(alias);
                if (certificate instanceof X509Certificate) {
                    X509Certificate x509Certificate = (X509Certificate) certificate;
                    CertificateDTO dto = new CertificateDTO(certificate.getU);
                    dtos.add(dto);
                }
            }
            return new ResponseEntity<>(dtos, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<CertificateDTO> create(@RequestBody CertificateDTO dto) {
        //todo
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @DeleteMapping("/{serialNumber}")
    public ResponseEntity<Void> delete(@PathVariable String serialNumber) {
        //todo
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
