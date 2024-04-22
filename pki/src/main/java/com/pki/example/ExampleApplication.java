package com.pki.example;

import com.pki.example.service.AclService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ExampleApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExampleApplication.class, args);
//		AclService aclService = new AclService();
//		aclService.doAclAll();
	}

}
