package com.siit.team24.OpenDoors.controller;

import com.siit.team24.OpenDoors.dto.notification.NotificationShowDTO;
import com.siit.team24.OpenDoors.dto.userManagement.*;
import com.siit.team24.OpenDoors.model.User;
import com.siit.team24.OpenDoors.model.enums.NotificationType;
import com.siit.team24.OpenDoors.service.NotificationService;
import com.siit.team24.OpenDoors.service.PendingAccommodationService;
import com.siit.team24.OpenDoors.service.user.UserReportService;
import com.siit.team24.OpenDoors.service.user.UserService;
import com.siit.team24.OpenDoors.util.ValidationUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("open-doors/users")
public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    private PendingAccommodationService pendingAccommodationService;

    @Autowired
    private UserReportService userReportService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ValidationUtils validationUtils;

    //@PreAuthorize("hasRole('HOST') or hasRole('ADMIN') or hasRole('GUEST')")
    @PutMapping(consumes = "multipart/form-data")
    public ResponseEntity<Void> updateUser(@Valid UserFormDataDTO data) {
        validationUtils.checkForXSS(data);

        UserEditedDTO dto = null;
        UserEditedDTO userDTO = data.toEditedDTO();

        System.out.println(userDTO);
        try {
            dto = service.update(userDTO);
            System.out.println("Edited user: " + userDTO.getId());
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IOException e) {
            System.err.println("Error updating user: " + userDTO.getId());
            e.printStackTrace();
            return  new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @PreAuthorize("hasRole('HOST') or hasRole('ADMIN') or hasRole('GUEST')")
    @PutMapping(consumes = "application/json", value = "/new-password")
    public ResponseEntity<Void> updateAccount(@RequestBody NewPasswordDTO newPasswordDTO){
        validationUtils.checkForXSS(newPasswordDTO);

        this.service.changePassword(newPasswordDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

//    @PreAuthorize("hasRole('HOST') or hasRole('ADMIN') or hasRole('GUEST')")
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        validationUtils.isPotentialXSS(id);

        service.delete(id);
        pendingAccommodationService.deleteAllForHost(id);
        userReportService.deleteAllFor(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(value = "/blocked")
    public ResponseEntity<List<UserSummaryDTO>> getBlockedUsers() {
        List<UserSummaryDTO> users = service.getBlockedDTOs();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }


//    @PreAuthorize("hasRole('HOST') or hasRole('ADMIN') or hasRole('GUEST')")
    @GetMapping(value = "/{id}")
    public ResponseEntity<UserAccountViewDTO> getUser(@PathVariable String id) {
        validationUtils.isPotentialXSS(id);
        try {
            User user = service.findById(id);
            return new ResponseEntity<>(user.toAccountViewDTO(), HttpStatus.OK);
        }
        catch (EntityNotFoundException e) {
            System.err.println("Person with id " + id + " not found in database.");
            return new ResponseEntity<>(new UserAccountViewDTO(), HttpStatus.BAD_REQUEST);
        }

    }

//    @PreAuthorize("hasRole('HOST') or hasRole('ADMIN') or hasRole('GUEST')")
    @GetMapping(value = "/{userId}/notifications")
    public ResponseEntity<List<NotificationShowDTO>> getNotificationsByUserId(@PathVariable String userId) {
        validationUtils.isPotentialXSS(userId);
        List<NotificationShowDTO> notifications = notificationService.findAllByUserId(userId);
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(value = "/unblock/{id}")
    public ResponseEntity<Void> unblock(@PathVariable String id){
        validationUtils.isPotentialXSS(id);
        service.unblock(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

//    @PreAuthorize("hasRole('HOST') or hasRole('ADMIN') or hasRole('GUEST')")
    @GetMapping(value = "/{id}/disabled-notifications")
    public ResponseEntity<List<NotificationType>> getDisabledNotificationTypes(@PathVariable String id) {
        validationUtils.isPotentialXSS(id);
        List<NotificationType> types = service.getDisabledNotificationTypesFor(id);
        return new ResponseEntity<>(types, HttpStatus.OK);
    }

//    @PreAuthorize("hasRole('HOST') or hasRole('ADMIN') or hasRole('GUEST')")
    @PutMapping(value = "/{id}/disabled-notifications")
    public ResponseEntity<Void> setDisabledNotificationTypes(@PathVariable String id,
                                                             @RequestBody List<NotificationType> types) {
        validationUtils.isPotentialXSS(id);
        service.setDisabledNotificationTypesFor(id, types);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(value = "/id/{username}")
    public ResponseEntity<String> getIdForUsername(@PathVariable String username) {
        validationUtils.isPotentialXSS(username);
        String id = service.getIdForUsername(username);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }

}
