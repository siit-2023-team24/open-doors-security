package com.pki.example.service;

import com.pki.example.data.CertificateTemplate;
import com.pki.example.dto.CertificateItemDTO;
import com.pki.example.dto.CertificateNewDTO;
import com.pki.example.dto.CertificateNewTemplateDTO;
import com.pki.example.dto.CertificateTemplateDTO;
import com.pki.example.repository.CertificateTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.cert.Certificate;
import java.util.ArrayList;
import java.util.List;

@Service
public class CertificateTemplateService {

    @Autowired
    private CertificateTemplateRepository repository;

    public List<CertificateTemplateDTO> getAll() {
        List<CertificateTemplate> templates = repository.findAll();
        List<CertificateTemplateDTO> dtos = new ArrayList<>();
        for(CertificateTemplate template : templates) {
            dtos.add(new CertificateTemplateDTO(template));
        }
        return dtos;
    }

    public CertificateTemplateDTO create(CertificateNewTemplateDTO dto) {
        System.out.println(dto);
        CertificateTemplate template = new CertificateTemplate();
        template.setCA(dto.isCA());
        template.setUsage(dto.getUsage());
        template.setExtendedUsages(dto.getExtendedUsages());
        template.setName(dto.getName());
        System.out.println(dto);
        CertificateTemplate savedTemplate = repository.save(template);
        return new CertificateTemplateDTO(savedTemplate);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

}
