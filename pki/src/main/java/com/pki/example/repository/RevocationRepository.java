package com.pki.example.repository;

import com.pki.example.dto.CertificateDTO;
import com.pki.example.keystores.KeyStoreReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.*;
import java.math.BigInteger;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class RevocationRepository {

    @Autowired
    private AliasRepository aliasRepository;

    @Autowired
    private KeyStoreReader keyStoreReader;

    private final String filePath = "src/main/resources/static/revocations.csv";

    private final String FILE = "src/main/resources/static/keystore1.jks";
    private final String PASS = "opendoors";

    public void save(BigInteger certificateSerialNumber, boolean isRevoked) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath, true))) {
            String row = certificateSerialNumber.toString() + "," + String.valueOf(isRevoked);
            writer.write(row);
            writer.newLine();
        } catch (IOException e) {
            System.err.println("Error writing CSV file: " + e.getMessage());
        }
    }

    public boolean isRevoked(String serialNumber) {
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] values = line.split(",");
                if (values[0].trim().equals(serialNumber)) return Boolean.parseBoolean(values[1].trim());
            }
        } catch (IOException e) {
            System.err.println("Error reading CSV file: " + e.getMessage());
        }
        return false;
    }

    public void revokeCertificate(CertificateDTO dto) {

        String serialNumber = dto.getSerialNumber().toString();
        String alias = dto.getAlias();

        ArrayList<String> revocationAliases = getChildAliases(alias);
        ArrayList<String> revocationSerialNumbers = getRevocationSerialNumbers(revocationAliases);

        List<String> lines = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] values = line.split(",");
                if (revocationSerialNumbers.contains(values[0].trim())) {
                    lines.add(serialNumber + ",true");
                } else {
                    lines.add(line);
                }
            }

        } catch (IOException e) {
            System.err.println("Error reading CSV file: " + e.getMessage());
        }

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
            for (String row : lines) {
                writer.write(row);
                writer.newLine();
            }
        } catch (IOException e) {
            System.err.println("Error writing CSV file: " + e.getMessage());
        }
    }

    private ArrayList<String> getChildAliases(String alias) {
        ArrayList<String> allAliases = new ArrayList<>();
        for(String childAlias: aliasRepository.getAllSignedBy(alias)) {
            allAliases.addAll(getChildAliases(childAlias));
        }
        allAliases.add(alias);
        return allAliases;
    }

    private ArrayList<String> getRevocationSerialNumbers(ArrayList<String> revocationAliases) {
        Map<String, X509Certificate> certificateMap = keyStoreReader.readAll(FILE, PASS);
        ArrayList<String> revocationSerialNumbers = new ArrayList<>();

        for (String alias : revocationAliases) {
            X509Certificate certificate = certificateMap.get(alias);
            if (certificate != null) {
                BigInteger serialNumber = certificate.getSerialNumber();
                revocationSerialNumbers.add(serialNumber.toString());
            }
        }

        return revocationSerialNumbers;
    }
}

