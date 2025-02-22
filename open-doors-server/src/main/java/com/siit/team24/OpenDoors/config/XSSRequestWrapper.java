package com.siit.team24.OpenDoors.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import org.owasp.encoder.Encode;


import java.io.ByteArrayInputStream;
import java.io.IOException;

public class XSSRequestWrapper extends HttpServletRequestWrapper {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public XSSRequestWrapper(HttpServletRequest request) {
        super(request);
    }

    @Override
    public String[] getParameterValues(String parameter) {
        String[] values = super.getParameterValues(parameter);
        if (values == null) {
            return null;
        }
        int count = values.length;
        String[] encodedValues = new String[count];
        for (int i = 0; i < count; i++) {
            encodedValues[i] = sanitizeInput(values[i]);
        }
        return encodedValues;
    }

//    @Override
//    public ServletInputStream getInputStream() throws IOException {
//        ServletInputStream originalInputStream = super.getInputStream();
//        String requestBody = new String(originalInputStream.readAllBytes());
//
//        // Sanitize the JSON body
//        String sanitizedBody = sanitizeInput(requestBody);
//
//        return new ServletInputStream() {
//            @Override
//            public boolean isFinished() {
//                return false;
//            }
//
//            @Override
//            public boolean isReady() {
//                return false;
//            }
//
//            @Override
//            public void setReadListener(ReadListener readListener) {
//
//            }
//
//            private final ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(
//                    sanitizedBody.getBytes()
//            );
//
//            @Override
//            public int read() throws IOException {
//                return byteArrayInputStream.read();
//            }
//        };
//    }

    private String sanitizeInput(String string) {
        return Encode.forHtml(string);
    }
}