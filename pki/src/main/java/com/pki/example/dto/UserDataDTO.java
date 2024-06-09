package com.pki.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserDataDTO {
    private String id;
    private String username;
    private String firstName;
    private String lastName;
    private String city;
    private String country;
}
