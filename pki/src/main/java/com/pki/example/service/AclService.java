package com.pki.example.service;

import com.sun.jna.platform.win32.Netapi32Util;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.AclEntry;
import java.nio.file.attribute.AclEntryPermission;
import java.nio.file.attribute.AclFileAttributeView;
import java.nio.file.attribute.UserPrincipal;
import java.util.List;

import static java.nio.file.attribute.AclEntryType.DENY;

@Service
public class AclService {

    public void doAclAll() {
        String[] files = {"src/main/resources/static/privateKeys",
                            "src/main/resources/static/aliases.csv",
                            "src/main/resources/static/keystore1.jks",
                            "src/main/resources/static/kspass.txt",
                            "src/main/resources/static/revocations.csv",
                            "src/main/resources/application.properties"};
        Netapi32Util.User[] users = Netapi32Util.getUsers();
        for(Netapi32Util.User user : users) {
            Netapi32Util.Group[] groups = Netapi32Util.getUserGroups(user.name);
            boolean isAdmin = false;
            for (Netapi32Util.Group group : groups) {
                if (group.name.equalsIgnoreCase("Administrators")) {
                    isAdmin = true;
                    break;
                }
            }
            if (!isAdmin) continue;
            for (String file : files) {
                 doAcl(user.name, file);
            }
        }
    }

    public void doAcl(String username, String filepath) {
        Path path = Path.of(filepath);
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