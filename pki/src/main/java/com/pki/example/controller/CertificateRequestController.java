package com.pki.example.controller;

import com.pki.example.dto.*;
import com.pki.example.service.CertificateRequestService;
import com.pki.example.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

    @Autowired
    private CertificateService certificateService;

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
    public ResponseEntity<Void> deny(@PathVariable Long userId) {
        service.deny(userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/generation")
    public ResponseEntity<ByteArrayResource> generate(@RequestBody UserDataDTO userDataDTO) {
        CertificateDTO certificate = service.generate(userDataDTO);

        byte[] certificateFileBytes = certificateService.getCertificateFileBytes(certificate.getAlias());

        // Create a ByteArrayResource to represent the certificate file
        ByteArrayResource resource = new ByteArrayResource(certificateFileBytes);

        // Build response headers
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificate.crt");
        headers.setContentType(MediaType.parseMediaType("application/x-x509-ca-cert"));

        service.delete(userDataDTO.getId());

        // Return the certificate file as a ResponseEntity
        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(certificateFileBytes.length)
                .body(resource);
    }

    @GetMapping("/userId/{userId}")
    public ResponseEntity<Integer> getCertificateStatus(@PathVariable Long userId) {
        int status = service.getStatusFor(userId);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }
}
