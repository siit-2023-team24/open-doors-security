package com.siit.team24.OpenDoors.dto.userManagement;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserTokenDTO {
    protected String username;
    protected String role;
    protected String id;
    protected String firstName;
    protected String lastName;
    @Pattern(regexp = "\\d{10}")
    protected String phone;
    protected String street;
    @Min(1)
    protected int number;
    protected String city;
    protected String country;
    protected boolean enabled;
}
