package com.siit.team24.OpenDoors.service.user;

import com.siit.team24.OpenDoors.dto.userManagement.*;
import com.siit.team24.OpenDoors.dto.image.ImageFileDTO;
import com.siit.team24.OpenDoors.exception.ConfirmedReservationRequestsFound;
import com.siit.team24.OpenDoors.exception.CredentialsNotValidException;
import com.siit.team24.OpenDoors.exception.PasswordNotConfirmedException;
import com.siit.team24.OpenDoors.exception.PasswordValidationException;
import com.siit.team24.OpenDoors.model.*;
import com.siit.team24.OpenDoors.model.enums.*;
import com.siit.team24.OpenDoors.repository.user.UserRepository;
import com.siit.team24.OpenDoors.service.AccommodationService;
import com.siit.team24.OpenDoors.service.HostReviewService;
import com.siit.team24.OpenDoors.service.ImageService;
import com.siit.team24.OpenDoors.service.ReservationRequestService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private ImageService imageService;

    @Autowired
    private ReservationRequestService reservationRequestService;

    @Autowired
    private AccommodationService accommodationService;

//    @Autowired
//    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender javaMailSender;

//    @Autowired
//    private AuthenticationManager authenticationManager;

    @Autowired
    private HostReviewService hostReviewService;

    public User findById(String id) {
        Optional<User> user = repo.findById(id);
        if (user.isEmpty()){
            throw new EntityNotFoundException();}
        return user.get();
    }

    public UserService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public User findByUsername(String username) {
        return repo.findByUsername(username);
    }

    public void changePassword(NewPasswordDTO dto) {

//        if (!dto.getNewPassword().equals(dto.getRepeatPassword()))
//            throw new PasswordNotConfirmedException();
////        if (!dto.getNewPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,20}$"))
//        if (dto.getNewPassword().length() < 5)
//            throw new PasswordValidationException();
//
//        User user = repo.findByUsername(dto.getUsername());
//        if (user == null)
//            throw new EntityNotFoundException();
//
//        try {
//            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getOldPassword()));
//        } catch (BadCredentialsException e) {
//            e.printStackTrace();
//            throw new CredentialsNotValidException();
//        }
//
//        String encodedPassword = passwordEncoder.encode(dto.getNewPassword());
//        user.setPassword(encodedPassword);
//        repo.save(user);
    }

    public UserEditedDTO update(UserEditedDTO newData) throws IOException {
        User user = this.findById(newData.getId());

        Image oldImage = user.getImage();
        if (oldImage != null && (newData.getImageId() == null || newData.getFile() != null)) { //the user wants to delete or replace their image
            user.setImage(null);
            imageService.delete(oldImage.getId());
        }
        if (newData.getFile() != null) {    //uploaded new image
            Image newImage = imageService.save(new ImageFileDTO(newData.getImageId(), newData.getFile(), ImageType.PROFILE, user.getId()));
            user.setImage(newImage);
        }
        user.updateSimpleValues(newData); //updates all attributes except for image
        User updated = repo.save(user);
        return updated.toEditedDTO();
    }

//    public void sendActivationEmail(String recipient, String link) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setFrom("opendoorsteam24@gmail.com");
//        message.setTo(recipient);
//        message.setSubject("Activation mail");
//        message.setText("Please verify your account here. Otherwise it will expire in the next 24 hours.\n" + link);
//        javaMailSender.send(message);
//    }


    public void delete(String id) {
        User user = findById(id);

        if (user.getRole() == UserRole.ROLE_GUEST) {
            if (!reservationRequestService.findByUsernameAndStatus(user.getUsername(), ReservationRequestStatus.CONFIRMED).isEmpty())
                throw new ConfirmedReservationRequestsFound();
            reservationRequestService.deletePendingForGuest(user.getUsername());
        }

        else if (user.getRole() == UserRole.ROLE_HOST) {
            List<Accommodation> accommodations = accommodationService.findAllByHostId(user.getId());
            for (Accommodation accommodation: accommodations) {
                if (!reservationRequestService.isAccommodationReadyForDelete(accommodation.getId()))
                    throw new ConfirmedReservationRequestsFound();
            }
            for (Accommodation accommodation: accommodations) {
                removeFromAnyFavorites(accommodation);
                accommodationService.delete(accommodation.getId());
            }
            hostReviewService.deleteAllForHost(id);
        }
        else return;

        if (user.getImage() != null)
            imageService.delete(user.getImage().getId());

        repo.deleteById(id);
    }

    public void removeFromAnyFavorites(Accommodation accommodation) {
        List<User> users = repo.findAll();
        for (User user: users) {
            if (!user.getRole().equals(UserRole.ROLE_GUEST))
                continue;
            Guest guest = (Guest) user;
            if (guest.getFavorites().contains(accommodation)) {
                guest.removeFavoriteAccommodation(accommodation);
                repo.save(guest);
            }
        }
    }

//    public void activateUser(Long id){
//        Optional<User> user = repo.findById(id);
//        if (user.isEmpty()) return;
//        user.get().setEnabled(true);
//        repo.save(user.get());
//    }

    public void save(User user) {
        repo.save(user);
    }

    public HostPublicDataDTO getPublicData(String hostId) {
        Host host = (Host) repo.findById(hostId).get();
        HostPublicDataDTO dto = new HostPublicDataDTO(host);
        return dto;
    }

    public List<String> getUsernames(List<String> ids) { return this.repo.findUsernamesByIds(ids); }

    public List<UserSummaryDTO> getBlockedDTOs() {
        return repo.getBlockedDTOs();
    }

    public void block(String id, UserRole role) {
        User user = findById(id);
        if (role.equals(UserRole.ROLE_GUEST))
            handlePendingRequests(user.getUsername());
        else if (role.equals(UserRole.ROLE_HOST))
            disableHostsAccommodations(id);
        else return;
        user.setBlocked(true);
        repo.save(user);
    }

    private void disableHostsAccommodations(String id) {
        List<Accommodation> accommodations = accommodationService.findAllByHostId(id);
        for (Accommodation accommodation: accommodations) {
            reservationRequestService.denyActiveForAccommodation(accommodation.getId());
            removeFromAnyFavorites(accommodation);
            accommodationService.softDelete(accommodation.getId());
        }

    }

    private void handlePendingRequests(String username) {
        reservationRequestService.deletePendingForGuest(username);
        reservationRequestService.cancelFutureForGuest(username);
    }

    public void unblock(String id) {
        User user = findById(id);
        if (user.getRole() == UserRole.ROLE_HOST)
            accommodationService.reviveByHostId(id);
        user.setBlocked(false);
        repo.save(user);
    }

    public List<NotificationType> getDisabledNotificationTypesFor(String id) {
        User user = findById(id);
        return user.getDisabledTypes();
    }

    public void setDisabledNotificationTypesFor(String id, List<NotificationType> types) {
        User user = findById(id);
        user.setDisabledTypes(types);
        repo.save(user);
    }

    public String getIdForUsername(String username) {
        User user = repo.findByUsername(username);
        return user.getId();
    }

    public void refreshUser(UserTokenDTO dto) {
        User user = findByUsername(dto.getUsername());
        if (user == null) { //new user
            if (UserRole.valueOf(dto.getRole()).equals(UserRole.ROLE_ADMIN)) user = new Admin();
            else if (UserRole.valueOf(dto.getRole()).equals(UserRole.ROLE_HOST)) user = new Host();
            else if (UserRole.valueOf(dto.getRole()).equals(UserRole.ROLE_SECURITY)) user = new Security();
            else user = new Guest();
            user.setId(dto.getId());
            user.setUsername(dto.getUsername());
            user.setRole(UserRole.valueOf(dto.getRole()));
        }
        //update values
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhone(dto.getPhone());
        user.setEnabled(dto.isEnabled());
        Address address = new Address(dto.getStreet(), dto.getNumber(), dto.getCity(), Country.fromString(dto.getCountry()));
        user.setAddress(address);

        repo.save(user);
    }

}
