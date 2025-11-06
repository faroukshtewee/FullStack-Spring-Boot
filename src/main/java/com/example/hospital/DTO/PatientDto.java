package com.example.hospital.DTO;

import java.time.LocalDate;
import java.time.Period;
import java.util.HashSet;
import java.util.Set;

public class PatientDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String dateOfBirth;
    private Integer age;
    private Set<Long> appointmentIds = new HashSet<Long>();

    public PatientDto() {
    }
    public PatientDto(Long id, String firstName, String lastName, String email, String phoneNumber, String dateOfBirth) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
    }

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Set<Long> getAppointmentIds() {
        return appointmentIds;
    }

    public void setAppointmentIds(Set<Long> appointmentIds) {
        this.appointmentIds = appointmentIds;
    }

}
