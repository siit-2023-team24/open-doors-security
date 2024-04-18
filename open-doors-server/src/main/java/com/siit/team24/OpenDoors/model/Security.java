package com.siit.team24.OpenDoors.model;

import jakarta.persistence.Entity;
import org.hibernate.annotations.SQLDelete;

@SQLDelete(sql = "UPDATE users SET deleted=true WHERE id=?")
//@Where(clause = "deleted=false")
@Entity
public class Security extends User {
    public Security(){

    }

}