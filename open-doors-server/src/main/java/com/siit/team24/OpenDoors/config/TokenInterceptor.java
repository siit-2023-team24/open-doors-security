package com.siit.team24.OpenDoors.config;

import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.siit.team24.OpenDoors.dto.userManagement.UserTokenDTO;
import com.siit.team24.OpenDoors.service.user.UserService;
import com.siit.team24.OpenDoors.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.text.ParseException;
import java.util.List;


@Component
public class TokenInterceptor implements HandlerInterceptor {

    @Autowired
    private TokenUtils tokenUtil;

    @Autowired
    private UserService userService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        try {
            String token = tokenUtil.getToken(request);
            if (token == null) return true;

            JWTClaimsSet claims = getClaims(token);
            UserTokenDTO dto = getDto(claims);

            userService.refreshUser(dto);
            System.out.println(dto);

        } catch (Exception e) {
            System.out.println("Error reading token");
            e.printStackTrace();
        }
        return true;
    }

    private UserTokenDTO getDto(JWTClaimsSet claims) throws ParseException {
        String userId = claims.getStringClaim("sub");
        String username = claims.getStringClaim("preferred_username");
        String firstName = claims.getStringClaim("given_name");
        String lastName = claims.getStringClaim("family_name");
        String phone = claims.getStringClaim("phone");
        String country = claims.getStringClaim("country");
        String city = claims.getStringClaim("city");
        String street = claims.getStringClaim("street");
        int number = Integer.parseInt(claims.getStringClaim("number"));
        String role = getRole(claims);
        boolean enabled = claims.getBooleanClaim("email_verified");

        return new UserTokenDTO(username, role, userId, firstName, lastName, //TODO: extract role
                phone, street, number, city, country, enabled);
    }


    private JWTClaimsSet getClaims(String token) throws ParseException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        return signedJWT.getJWTClaimsSet();
    }

    private String getRole(JWTClaimsSet claims) throws ParseException {
        List<String> roles = (List<String>) claims.getJSONObjectClaim("realm_access").get("roles");
        if (roles == null) return "";
        if (roles.contains("guest")) return "ROLE_GUEST";
        if (roles.contains("host")) return "ROLE_HOST";
        if (roles.contains("admin")) return "ROLE_ADMIN";
        if (roles.contains("security")) return "ROLE_SECURITY";
        return "";
    }

}