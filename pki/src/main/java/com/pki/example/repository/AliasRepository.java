package com.pki.example.repository;

import org.springframework.stereotype.Component;

import java.io.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class AliasRepository {

    private final String filePath = "src/main/resources/static/aliases.csv";
    public void save(String issuerAlias, String subjectAlias) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath, true))) {
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

    public void deleteSubject(String alias) {
        List<String> lines = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] values = line.split(",");
                if (!values[1].trim().equals(alias))
                    lines.add(line);
            }

        } catch (IOException e) {
            System.err.println("Error reading CSV file: " + e.getMessage());
        }

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
            for (String row : lines) {
                writer.write(row);
                writer.newLine();
            }
        } catch (IOException e) {
            System.err.println("Error writing CSV file: " + e.getMessage());
        }
    }

    public List<String> getAllSignedBy(String alias) {
        List<String> signedAliases = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] values = line.split(",");
                if (values[0].trim().equals(alias))
                    signedAliases.add(values[1].trim());
            }
        } catch (IOException e) {
            System.err.println("Error reading CSV file: " + e.getMessage());
        }
        return signedAliases;
    }

    public List<String> delete(String alias) {
        List<String> children = new ArrayList<>();
        List<String[]> remaining = new ArrayList<>();
        children.add(alias);
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] values = line.split(",");
                if (children.contains(values[0].trim())) children.add(values[1]);
                else remaining.add(values);
            }
        } catch (IOException e) {
            System.err.println("Error reading CSV file: " + e.getMessage());
        }
        saveAll(remaining);
        return children;
    }

    public void saveAll(List<String[]> values) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
            for(String[] value : values) {
                String row = escapeSpecialCharacters(value[0]) + "," + escapeSpecialCharacters(value[1]);
                writer.write(row);
                writer.newLine();
            }
        } catch (IOException e) {
            System.err.println("Error writing CSV file: " + e.getMessage());
        }
    }

    public Set<String> getIssuers() {
        Set<String> issuers = new HashSet<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] values = line.split(",");
                    issuers.add(values[0].trim());
            }
        } catch (IOException e) {
            System.err.println("Error reading CSV file: " + e.getMessage());
        }
        return issuers;
    }
}
