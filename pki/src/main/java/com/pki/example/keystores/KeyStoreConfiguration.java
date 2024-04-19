package com.pki.example.keystores;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.security.KeyStore;

@Configuration
public class KeyStoreConfiguration {

    // Define a bean for the Java KeyStore
    @Bean
    public KeyStore keyStore() throws Exception {
        // Load the KeyStore from a file (e.g., keystore.jks)
        String keystorePath = "src/main/resources/static/keystore.jks";
        String keystorePassword = "njusko123";

        KeyStore keyStore = KeyStore.getInstance("JKS");
        try (FileInputStream fis = new FileInputStream(keystorePath)) {
            keyStore.load(fis, keystorePassword.toCharArray());
        }

        return keyStore;
    }
}

