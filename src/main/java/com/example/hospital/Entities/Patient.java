package com.example.hospital.Entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "patient")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;
    @Column(nullable = false)
    private String firstName;
    @Column(nullable = false)
    private String lastName;
    @Column(unique = true, nullable = false)
    private String email;
    @Column( nullable = false)
    private String phoneNumber;
    @Column( nullable = false)
    private String dateOfBirth;
    @Column( nullable = false)
    private Integer age;
    private Set<Long> appointmentIds;
}







