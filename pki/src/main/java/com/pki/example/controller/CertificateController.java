package com.pki.example.controller;

import com.pki.example.dto.CertificateDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "pki")
public class CertificateController {

    @GetMapping("/certificates")
    public ResponseEntity<List<CertificateDTO>> getAll() {
        List<CertificateDTO> dtos = new ArrayList<>();
        //todo
        return new ResponseEntity<>(dtos, HttpStatus.OK);
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
