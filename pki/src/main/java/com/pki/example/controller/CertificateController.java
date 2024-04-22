package com.pki.example.controller;

import com.pki.example.dto.CertificateDTO;
import com.pki.example.dto.CertificateItemDTO;
import com.pki.example.dto.CertificateNewDTO;
import com.pki.example.keystores.KeyStoreReader;
import com.pki.example.keystores.KeyStoreWriter;
import com.pki.example.service.CertificateService;
import com.pki.example.service.OcspService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.util.List;

@RestController
@RequestMapping(value = "pki/certificates")
@CrossOrigin(origins = "https://localhost:4200")
public class CertificateController {

    @Autowired
    private CertificateService service;

    @Autowired
    private OcspService ocspService;
    @Autowired
    private CertificateService certificateService;

    @GetMapping
    public ResponseEntity<List<CertificateItemDTO>> getAll() {
        List<CertificateItemDTO> dtos = service.getAll();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<CertificateDTO> create(@RequestBody CertificateNewDTO dto) {
        CertificateDTO returnDto = service.createDTO(dto);
        if(returnDto == null) {return new ResponseEntity<>(returnDto, HttpStatus.BAD_REQUEST);}
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

    @GetMapping("/issuers")
    public ResponseEntity<List<String>> getEligibleIssuers() {
        List<String> issuers = service.getEligibleIssuers();
        return new ResponseEntity<>(issuers, HttpStatus.OK);
    }

    @GetMapping("/downloadCertificate/{alias}")
    public ResponseEntity<ByteArrayResource> downloadCertificate(@PathVariable String alias) {
        // Read the certificate file as byte array
        byte[] certificateFileBytes = certificateService.getCertificateFileBytes(alias);

        // Create a ByteArrayResource to represent the certificate file
        ByteArrayResource resource = new ByteArrayResource(certificateFileBytes);

        // Build response headers
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificate.crt");
        headers.setContentType(MediaType.parseMediaType("application/x-x509-ca-cert"));

        // Return the certificate file as a ResponseEntity
        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(certificateFileBytes.length)
                .body(resource);
    }

}
