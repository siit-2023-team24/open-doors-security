package com.pki.example;

import com.pki.example.certificates.CertificateExample;
import com.pki.example.keystores.KeyStoreReader;
import com.pki.example.keystores.KeyStoreWriter;
import com.pki.example.service.AclService;
import com.pki.example.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.security.cert.Certificate;

@SpringBootApplication
public class ExampleApplication {

	private static CertificateExample certExample;
	private static KeyStoreReader keyStoreReader;

	private static KeyStoreWriter keyStoreWriter;

	private static ApplicationContext context;

	@Autowired
	private static CertificateService certificateService;

	public static void main(String[] args) {
//		AclService aclService = new AclService();
//		aclService.doAclAll();
		context = SpringApplication.run(ExampleApplication.class, args);

		keyStoreReader = (KeyStoreReader) context.getBean("keyStoreReader");
		keyStoreWriter = (KeyStoreWriter) context.getBean("keyStoreWriter");
		certExample = (CertificateExample) context.getBean("certificateExample");

//		com.pki.example.data.Certificate certificate = certExample.getCertificate();
//		System.out.println("Novi sertifikat:");
//		System.out.println(certificate.getX509Certificate());

		String PASS = "";
		try(BufferedReader in = new BufferedReader(new FileReader("src/main/resources/static/kspass.txt"))){
			PASS = in.readLine();
		} catch (IOException e) {
			System.err.println("Invalid ks password");
			throw new RuntimeException(e);
		}

		// Inicijalizacija fajla za cuvanje sertifikata
		System.out.println("Cuvanje certifikata u jks fajl:");
		keyStoreWriter.loadKeyStore("src/main/resources/static/keystore1.jks",  PASS.toCharArray());
//		PrivateKey pk = certificate.getIssuer().getPrivateKey();
//		keyStoreWriter.write("cert1", pk, "password".toCharArray(), certificate.getX509Certificate());
//		keyStoreWriter.saveKeyStore("src/main/resources/static/example.jks",  "password".toCharArray());
//		System.out.println("Cuvanje certifikata u jks fajl zavrseno.");

		System.out.println("Ucitavanje sertifikata iz jks fajla:");
		Certificate loadedCertificate = keyStoreReader.readCertificate("src/main/resources/static/keystore1.jks", PASS, "rootca");
		System.out.println(loadedCertificate);
	}

}
