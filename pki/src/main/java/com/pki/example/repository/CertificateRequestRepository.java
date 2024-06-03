package com.pki.example.repository;

import com.pki.example.data.CertificateRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificateRequestRepository extends JpaRepository<CertificateRequest, String> {
}
