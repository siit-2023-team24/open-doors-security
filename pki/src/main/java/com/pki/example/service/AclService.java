package com.pki.example.service;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.AclEntry;
import java.nio.file.attribute.AclEntryPermission;
import java.nio.file.attribute.AclFileAttributeView;
import java.nio.file.attribute.UserPrincipal;
import java.util.List;

import static java.nio.file.attribute.AclEntryType.ALLOW;
import static java.nio.file.attribute.AclEntryType.DENY;

@Service
public class AclService {


    public void doAclAll() {
        try {
            // Path to the directory containing user profiles on Windows
            Path userProfilesPath = Paths.get("C:/Users");

            // List all files and directories in the user profiles directory
            List<Path> userDirectories = Files.list(userProfilesPath).toList();

            // Extract usernames from directory names
            for (Path userDirectory : userDirectories) {
                String username = userDirectory.getFileName().toString();
                System.out.println(username);
                //if(!username.equals("milic"))
                    //doAcl(username);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void doAcl(String username) {
        Path path = Path.of("src/main/resources/static/milica2.txt");
        System.out.println(username);
        UserPrincipal user;

        {
            try {
                user = path.getFileSystem().getUserPrincipalLookupService().lookupPrincipalByName(username);
                System.out.println(user);

            } catch (IOException e) {
                throw new RuntimeException(e);
            }

            AclFileAttributeView view = Files.getFileAttributeView(path, AclFileAttributeView.class);
            System.out.println(view);
            AclEntry entry = AclEntry.newBuilder().setType(DENY).setPrincipal(user).setPermissions(AclEntryPermission.READ_DATA, AclEntryPermission.EXECUTE, AclEntryPermission.WRITE_DATA).build();
            System.out.println(entry);
            try {
                List<AclEntry> aclEntries = view.getAcl();
                aclEntries.add(0, entry);
                Files.setAttribute(path, "acl:acl", aclEntries);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
