package com.pki.example.controller;

import com.pki.example.dto.CertificateDTO;
import com.pki.example.dto.CertificateNewDTO;
import com.pki.example.keystores.KeyStoreReader;
import com.pki.example.keystores.KeyStoreWriter;
import com.pki.example.service.CertificateService;
import com.pki.example.service.OcspService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.util.List;

@RestController
@RequestMapping(value = "pki/certificates")
public class CertificateController {

    @Autowired
    private CertificateService service;

    @Autowired
    private OcspService ocspService;

    @GetMapping
    public ResponseEntity<List<CertificateDTO>> getAll() {
        List<CertificateDTO> dtos = service.getAll();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<CertificateDTO> create(@RequestBody CertificateNewDTO dto) {
        CertificateDTO returnDto = service.create(dto);
        //checkCertificateValidity(returnDto);
        return new ResponseEntity<>(returnDto, HttpStatus.CREATED);
    }

    @GetMapping("/validity")
    public ResponseEntity<CertificateDTO> checkCertificateValidity(@RequestBody CertificateDTO dto) {
        if(ocspService.checkCertificateStatus(dto)) {
            return new ResponseEntity<>(dto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(dto, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{alias}")
    public ResponseEntity<Void> delete(@PathVariable String alias) {
        service.delete(alias);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/revoke")
    public ResponseEntity<CertificateDTO> revoke(@RequestBody CertificateDTO dto) {
        service.revoke(dto);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
