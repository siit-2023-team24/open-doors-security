package com.siit.team24.OpenDoors.model;

import com.siit.team24.OpenDoors.dto.userManagement.UserAccountViewDTO;
import com.siit.team24.OpenDoors.dto.userManagement.UserEditedDTO;
import com.siit.team24.OpenDoors.model.enums.NotificationType;
import com.siit.team24.OpenDoors.model.enums.UserRole;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.springframework.lang.Nullable;

import java.util.List;

@SQLDelete(sql = "UPDATE users SET deleted=true WHERE id=?")
//@Where(clause = "deleted=false")
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    @Column(unique = true, nullable = false)
    private String username;
    @Enumerated
    private UserRole role;
    private String firstName;
    private String lastName;
    private String phone;
    @OneToOne(cascade = {CascadeType.ALL})
    @Nullable
    private Image image;
    @Embedded
    private Address address;
    private boolean enabled;
    private boolean blocked;
    private boolean deleted;
    private List<NotificationType> disabledTypes;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Image getImage() {
        return image;
    }

    public void setImage(Image image) {
        this.image = image;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String email) {
        this.username = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isBlocked() {
        return blocked;
    }

    public void setBlocked(boolean blocked) {
        this.blocked = blocked;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public List<NotificationType> getDisabledTypes() {
        return disabledTypes;
    }

    public void setDisabledTypes(List<NotificationType> disabledTypes) {
        this.disabledTypes = disabledTypes;
    }

    public User(){

    }

    public User(Long id, String email, UserRole role, String firstName, String lastName, String phone, @Nullable Image image, Address address, boolean enabled, List<NotificationType> disabledTypes) {
        this.id = id;
        this.username = email;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.image = image;
        this.address = address;
        this.enabled = enabled;
        this.disabledTypes = disabledTypes;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", role=" + role +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", phone='" + phone + '\'' +
                ", image=" + image +
                ", address=" + address +
                ", enabled=" + enabled +
                ", blocked=" + blocked +
                ", deleted=" + deleted +
                ", disabledTypes=" + disabledTypes +
                '}';
    }

    public UserEditedDTO toEditedDTO() {
        Long imgId = (image != null)? image.getId() : null;
        return new UserEditedDTO(id, firstName, lastName, phone, address.getStreet(), address.getNumber(), address.getCity(),
                address.getCountry().toString(), imgId, null);
    }

    public UserAccountViewDTO toAccountViewDTO() {
        Long imgId = (image != null)? image.getId() : null;
        return new UserAccountViewDTO(id, firstName, lastName, phone, address.getStreet(), address.getNumber(),
                address.getCity(), address.getCountry().getCountryName(), imgId, this.getUsername(),
                this.getRole().toString());
    }

    public void updateSimpleValues(UserEditedDTO dto) {
        this.firstName = dto.getFirstName();
        this.lastName = dto.getLastName();
        this.phone = dto.getPhone();
        this.address.update(dto.getCountry(), dto.getCity(), dto.getStreet(), dto.getNumber());
    }
}
