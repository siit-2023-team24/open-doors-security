package com.pki.example.controller;

import com.pki.example.dto.*;
import com.pki.example.service.CertificateRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.cert.Certificate;
import java.util.List;

@RequestMapping(value = "pki/certificate-requests")
@RestController
@CrossOrigin(origins = "https://localhost:4200")
public class CertificateRequestController {

    @Autowired
    private CertificateRequestService service;

    @GetMapping
    public ResponseEntity<List<CertificateRequestDTO>> get() {
        List<CertificateRequestDTO> dtos = service.getAll();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<CertificateRequestDTO> create(@RequestBody CertificateNewRequestDTO dto) {
        CertificateRequestDTO newRequest = service.create(dto);
        return new ResponseEntity<>(newRequest, HttpStatus.CREATED);
    }

    @PostMapping("/approve")
    public ResponseEntity<CertificateRequestDTO> approve(@RequestBody CertificateRequestApproved approvedRequest) {
        CertificateRequestDTO dto = service.approve(approvedRequest);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @DeleteMapping("/deny/{userId}")
    public ResponseEntity<CertificateRequestDTO> deny(@PathVariable Long userId) {
        service.deny(userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/generation")
    public ResponseEntity<Certificate> generate(@RequestBody UserDataDTO userDataDTO) {
        Certificate certificate = service.generate(userDataDTO);
        return new ResponseEntity<>(certificate, HttpStatus.OK);
    }
}
