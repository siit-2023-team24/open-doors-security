package com.siit.team24.OpenDoors.util;

import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.regex.Pattern;

@Component
public class ValidationUtils {

    public void printFields(Object o) {
        Field[] fields = o.getClass().getDeclaredFields();

        for (Field field : fields) {
            // Set the field accessible in case it's private
            field.setAccessible(true);
            try {
                if(!(field.get(o) instanceof String)) continue;
                if(isPotentialXSS((String) field.get(o))) throw new RuntimeException("XSS attack detected!");
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }

        }
    }

    private final Pattern[] XSS_PATTERNS = new Pattern[] {
            // Script tags
            Pattern.compile("<script>(.?)</script>", Pattern.CASE_INSENSITIVE),
            // src='...'
            Pattern.compile("src[\r\n]=[\r\n]'(.?)'", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),
            Pattern.compile("src[\r\n]=[\r\n]\"(.?)\"", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),
            // Lone script tags
            Pattern.compile("</script>", Pattern.CASE_INSENSITIVE),
            Pattern.compile("<script(.?)>", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),
            // eval(...) expression
            Pattern.compile("eval\\((.?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),
            // expression(...) in CSS
            Pattern.compile("expression\\((.?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL),
            // JavaScript protocol
            Pattern.compile("javascript:", Pattern.CASE_INSENSITIVE),
            // VBScript protocol
            Pattern.compile("vbscript:", Pattern.CASE_INSENSITIVE),
            // onload= attribute
            Pattern.compile("onload(.*?)=", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL)
    };

    /**

     Checks if the input string could be interpreted as an XSS injection.*
     @param input the string to check
     @return true if the input is potentially an XSS injection, false otherwise*/
    public boolean isPotentialXSS(String input) {
        if (input == null) {
            return false;}

        // Iterate over all the XSS patterns
        for (Pattern pattern : XSS_PATTERNS) {
            if (pattern.matcher(input).find()) {
                return true; // Potential XSS detected
            }
        }

        return false; // No XSS patterns detected
    }
}
