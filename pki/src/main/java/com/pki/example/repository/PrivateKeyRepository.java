package com.pki.example.repository;

import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.bouncycastle.openssl.jcajce.JcaPEMWriter;
import org.bouncycastle.util.io.pem.PemObject;
import org.bouncycastle.util.io.pem.PemReader;
import org.springframework.stereotype.Component;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.security.PrivateKey;

@Component
public class PrivateKeyRepository {
    private final String filePath = "src/main/resources/static/privateKeys/";
    public void save(String alias, PrivateKey privateKey) {
        try (FileWriter fileWriter = new FileWriter(filePath + alias + ".pem");
             JcaPEMWriter pemWriter = new JcaPEMWriter(fileWriter)) {
            pemWriter.writeObject(privateKey);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public PrivateKey find(String alias) {
        try (FileReader fileReader = new FileReader(filePath + alias + ".pem");
            PEMParser pemParser = new PEMParser(fileReader)) {
            Object object = pemParser.readObject();
            if (object instanceof PEMKeyPair) {
                // If the PEM file contains a key pair, extract the private key
                PEMKeyPair pemKeyPair = (PEMKeyPair) object;
                JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
                return converter.getPrivateKey(pemKeyPair.getPrivateKeyInfo());
            } else if (object instanceof PrivateKeyInfo) {
                // If the PEM file contains only a private key (without key pair info)
                PrivateKeyInfo privateKeyInfo = (PrivateKeyInfo) object;
                JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
                return converter.getPrivateKey(privateKeyInfo);
            } else {
                throw new IllegalArgumentException("Unsupported PEM object: " + object.getClass());
            }
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
