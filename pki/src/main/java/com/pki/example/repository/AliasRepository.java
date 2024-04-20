package com.pki.example.repository;

import org.springframework.stereotype.Component;

import java.io.*;

@Component
public class AliasRepository {

    private final String filePath = "src/main/resources/static/aliases.csv";
    public void save(String issuerAlias, String subjectAlias) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
            String row = escapeSpecialCharacters(issuerAlias) + "," + escapeSpecialCharacters(subjectAlias);
            writer.write(row);
            writer.newLine();
        } catch (IOException e) {
            System.err.println("Error writing CSV file: " + e.getMessage());
        }
    }

    private String escapeSpecialCharacters(String field) {
        if (field.contains(",") || field.contains("\"")) {
            return "\"" + field.replace("\"", "\"\"") + "\"";
        } else {
            return field;
        }
    }

    public String getIssuerAlias(String alias) {
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] values = line.split(",");
                if (values[1].trim().equals(alias)) return values[0].trim();
            }
        } catch (IOException e) {
            System.err.println("Error reading CSV file: " + e.getMessage());
        }
        return "";
    }
}
