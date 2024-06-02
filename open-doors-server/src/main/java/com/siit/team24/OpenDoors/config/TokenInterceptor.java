package com.siit.team24.OpenDoors.config;

import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.siit.team24.OpenDoors.util.TokenUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import java.text.ParseException;


@Component
public class TokenInterceptor implements HandlerInterceptor {

    @Autowired
    private TokenUtils tokenUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        String token = tokenUtil.getToken(request);
        if (token == null) return true;

        JWTClaimsSet claims = getClaims(token);

        // Extract user information
        String userId = claims.getStringClaim("sub"); // Subject (user id)
        String username = claims.getStringClaim("preferred_username"); // Username
        String email = claims.getStringClaim("email"); // Email

        System.out.println("User ID: " + userId);
        System.out.println("Username: " + username);
        System.out.println("Email: " + email);

        return true;
    }


    public JWTClaimsSet getClaims(String token) throws ParseException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        return signedJWT.getJWTClaimsSet();
    }

}