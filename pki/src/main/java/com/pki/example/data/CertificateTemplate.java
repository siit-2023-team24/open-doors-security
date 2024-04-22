package com.pki.example.data;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

//@Getter
//@Setter
//@Entity
public class CertificateTemplate {
//    @Id
    private Long id;

    private boolean ca;
    private int[] usage;
    private int extendedUsage;

    private String name;

}
