package com.example.hospital.Entities;

import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "doctor")
public class Doctor {
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
    private String specialization;

    @Column( nullable = false)
    private String phoneNumber;
    @Column( nullable = false)
    private Integer yearsOfExperience;
    @Column( nullable = false)
    private double rating;
    private Set<Long> appointmentIds;


    // ========== OneToMany Relationship ==========
//    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval
//            = true)
//    private List<Book> books = new ArrayList<>();
}
