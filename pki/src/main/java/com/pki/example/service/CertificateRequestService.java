package com.pki.example.service;

import com.pki.example.data.CertificateRequest;
import com.pki.example.data.Extensions;
import com.pki.example.dto.*;
import com.pki.example.repository.CertificateRequestRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.cert.Certificate;
import java.util.*;

@Service
public class CertificateRequestService {

    @Autowired
    private CertificateRequestRepository repo;

    @Autowired
    private CertificateService certificateService;


    public List<CertificateRequestDTO> getAll() {
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

    private CertificateRequest findById(String id) {
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


    public void deny(String userId) {
        CertificateRequest request = findById(userId);
        if (request == null) throw new EntityNotFoundException();
        repo.delete(request);
    }

    public CertificateDTO generate(UserDataDTO userData) {
        CertificateRequest request = findById(userData.getId());
        if (request == null) throw new EntityNotFoundException();

        //spakujem novi CertificateNewDTO
        CertificateNewDTO newDTO = new CertificateNewDTO();
        newDTO.setAlias(userData.getUsername() + System.currentTimeMillis());
        newDTO.setCommonName(userData.getFirstName() + " " + userData.getLastName());
        newDTO.setOrganization("Open Doors");
        newDTO.setOrganizationalUnit("Open Doors");
        newDTO.setLocality(userData.getCity());
        newDTO.setState(userData.getCountry());
        newDTO.setCountry(userData.getCountry());
        newDTO.setEmail(userData.getUsername());

        newDTO.setExtensions(new Extensions(false, new int[] {7}, new int[] {}));

        Date today = new Date();
        Calendar c = Calendar.getInstance();
        c.setTime(today);
        c.add(Calendar.YEAR, 1);
        newDTO.setStartDate(today);
        newDTO.setExpirationDate(c.getTime());

        newDTO.setIssuerAlias(request.getIssuerAlias());

        return certificateService.createDTO(newDTO);
    }

    public int getStatusFor(String userId) {
        CertificateRequest request = findById(userId);
        if (request == null) return -1;
        if (request.isPending()) return 0;
        return 1;
    }

    public void delete(String id) {
        repo.deleteById(id);
    }
}
