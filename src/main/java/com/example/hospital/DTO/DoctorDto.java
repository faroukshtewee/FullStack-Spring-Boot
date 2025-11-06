package com.example.hospital.DTO;

import jakarta.validation.constraints.*;

import java.util.HashSet;
import java.util.Set;

public class DoctorDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String specialization;
    private String phoneNumber;
    private Integer yearsOfExperience;
    private Double rating;
    private Set<Long> appointmentIds= new HashSet<>();

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DoctorDto(Long id, String firstName, String lastName, String email, String specialization, String phoneNumber, Integer yearsOfExperience, Double rating) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.specialization = specialization;
        this.phoneNumber = phoneNumber;
        this.yearsOfExperience = yearsOfExperience;
        this.rating = rating;
    }

    public DoctorDto() {
    }

    @Override
    public String toString() {
        return "DoctorDto{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", specialization='" + specialization + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", yearsOfExperience=" + yearsOfExperience +
                ", rating=" + rating +
                ", appointmentIds=" + appointmentIds +
                '}';
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public void setAppointmentIds(Set<Long> appointmentIds) {
        this.appointmentIds = appointmentIds;
    }

    public String getSpecialization() {
        return specialization;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public Double getRating() {
        return rating;
    }

    public Set<Long> getAppointmentIds() {
        return appointmentIds;
    }
}