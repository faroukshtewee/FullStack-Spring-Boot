package com.example.hospital.Entities;

import jakarta.persistence.*;

@Entity
@Table(name = "appointment")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;
    @Column(nullable = false)
    private Long doctorId;
    @Column(nullable = false)
    private Long patientId;
    @Column( nullable = false)
    private String appointmentDate;
    @Column( nullable = false)
    private String appointmentTime;
    @Column( nullable = false)
    private String status;
    @Column(nullable = false)
    private Integer duration;
    @Column(nullable = false)
    private String priority;
    @Column(nullable = false)
    private String notes;

}
