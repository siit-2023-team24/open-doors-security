package com.pki.example.dto;

import com.pki.example.data.CertificateTemplate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Arrays;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CertificateNewTemplateDTO {
    protected boolean CA;
    protected int[] usage;
    protected int[] extendedUsages;
    protected String name;

    public CertificateNewTemplateDTO(CertificateTemplate template) {
        this(template.isCA(), template.getUsage(), template.getExtendedUsages(), template.getName());
    }

    @Override
    public String toString() {
        return "CertificateNewTemplateDTO{" +
                "CA=" + CA +
                ", usage=" + Arrays.toString(usage) +
                ", extendedUsages=" + Arrays.toString(extendedUsages) +
                ", name='" + name + '\'' +
                '}';
    }
}
