package com.pki.example.dto;

import com.pki.example.data.CertificateTemplate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CertificateTemplateDTO extends CertificateNewTemplateDTO {
    private Long id;
    public CertificateTemplateDTO(CertificateTemplate template) {
        super(template.isCA(), template.getUsage(), template.getExtendedUsages(), template.getName());
        this.id = template.getId();
    }
}
