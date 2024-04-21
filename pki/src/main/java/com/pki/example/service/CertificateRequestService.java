package com.pki.example.service;

import com.pki.example.data.CertificateRequest;
import com.pki.example.dto.CertificateNewRequestDTO;
import com.pki.example.dto.CertificateRequestApproved;
import com.pki.example.dto.CertificateRequestDTO;
import com.pki.example.repository.CertificateRequestRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.cert.Certificate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CertificateRequestService {

    @Autowired
    private CertificateRequestRepository repo;


    public List<CertificateRequestDTO> getPending() {
        List<CertificateRequest> requests = repo.findAll();
        List<CertificateRequestDTO> dtos = new ArrayList<>();
        for (CertificateRequest request : requests) {
            dtos.add(new CertificateRequestDTO(request));
        }
        return dtos;
    }

    public CertificateRequestDTO create(CertificateNewRequestDTO newRequest) {
        CertificateRequest request = repo.save(new CertificateRequest(newRequest));
        return new CertificateRequestDTO(request);
    }

    private CertificateRequest findById(Long id) {
        Optional<CertificateRequest> request = repo.findById(id);
        return request.orElse(null);
    }

    public CertificateRequestDTO approve(CertificateRequestApproved approvedRequest) {
        CertificateRequest request = findById(approvedRequest.getUserId());
        if (request == null) throw new EntityNotFoundException();
        request.setIssuerAlias(approvedRequest.getIssuer());
        request.setPending(false);
        return new CertificateRequestDTO(repo.save(request));
    }


    public void deny(Long userId) {
        CertificateRequest request = findById(userId);
        if (request == null) throw new EntityNotFoundException();
        repo.delete(request);
    }

    public Certificate generate(Long userId) {
        //todo
        return null;
    }
}
