package com.pki.example.controller;

import com.pki.example.dto.CertificateNewTemplateDTO;
import com.pki.example.dto.CertificateTemplateDTO;
import com.pki.example.service.CertificateTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RequestMapping(value = "pki/certificate-templates")
@RestController
@CrossOrigin(origins = "https://localhost:4200")
public class CertificateTemplateController {

    @Autowired
    private CertificateTemplateService service;

    @GetMapping
    public ResponseEntity<List<CertificateTemplateDTO>> getAll() {
        List<CertificateTemplateDTO> dtos = service.getAll();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<CertificateTemplateDTO> create(@RequestBody CertificateNewTemplateDTO dto) {
        System.out.println(dto);
        CertificateTemplateDTO returnDto = service.create(dto);
        return new ResponseEntity<>(returnDto, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
