package com.pki.example.controller;

import com.pki.example.dto.CertificateDTO;
import com.pki.example.dto.CertificateNewDTO;
import com.pki.example.keystores.KeyStoreReader;
import com.pki.example.keystores.KeyStoreWriter;
import com.pki.example.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.KeyStore;
import java.security.NoSuchAlgorithmException;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.security.spec.InvalidKeySpecException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

@RestController
@RequestMapping(value = "pki/certificates")
public class CertificateController {

    @Autowired
    private CertificateService service;

    @GetMapping
    public ResponseEntity<List<CertificateDTO>> getAll() {
        List<CertificateDTO> dtos = service.getAll();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<CertificateDTO> create(@RequestBody CertificateNewDTO dto) {
        CertificateDTO returnDto = service.create(dto);
        return new ResponseEntity<>(returnDto, HttpStatus.CREATED);
    }

    @DeleteMapping("/{alias}")
    public ResponseEntity<Void> delete(@PathVariable String alias) {
        service.delete(alias);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
