package com.pki.example.controller;

import com.pki.example.dto.CertificateRequestDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RequestMapping(value = "pki/requests")
@RestController
public class CertificateRequestController {

    @GetMapping("/certificate-requests")
    public ResponseEntity<List<CertificateRequestDTO>> getAll() {
        List<CertificateRequestDTO> dtos = new ArrayList<>();
        //todo
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<CertificateRequestDTO> create(@RequestBody CertificateRequestDTO dto) {
        //todo
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("/approve/{serialNumber}")
    public ResponseEntity<Void> approve(@PathVariable String serialNumber) {
        //todo
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/deny/{serialNumber}")
    public ResponseEntity<Void> deny(@PathVariable String serialNumber) {
        //todo
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
