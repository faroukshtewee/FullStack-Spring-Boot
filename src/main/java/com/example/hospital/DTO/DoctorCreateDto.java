package com.example.hospital.DTO;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;

public class DoctorCreateDto {
    public enum Specialization {Cardiolog, Orthopedics, Pediatrics, Neurology, Dermatology,General}
    private Long id;
    @NotBlank(message = "The first Name shouldn't be empty")
    @Size(min = 2, max = 50,message = "First name must be between 2 to 50 characters")
    private String firstName;
    @NotBlank(message = "The Last Name shouldn't be empty")
    @Size(min = 2, max = 50,message = "Last name must be between 2 to 50 characters")
    private String lastName;
    @NotNull(message = "Email name cannot be null")
    @Email(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",message = "Enter valid email format")
    @NotBlank(message = "The email shouldn't be empty")
    private String email;
    @NotNull(message = "specialization cannot be null")
    @Enumerated(EnumType.STRING)
    private Specialization specialization;
    @NotNull(message = "Phone Number cannot be null")
    @NotBlank(message = "Phone Number cannot be empty")
    @Pattern(regexp = "^05\\d-\\d{7}$",message = "please enter a valid phone number format!!")
    private String phoneNumber;
    @NotNull(message = "years of experience cannot be null")
    @Min(value=0,message = "min years of experience is 0")
    @Max(value=50,message = "max years of experience is 50")
    private Integer yearsOfExperience;
    @NotNull(message = "rating cannot be null")
    @DecimalMin(value ="0.0",message="min rating is 0.0")
    @DecimalMax(value ="50.0",message="min rating is 50.0")
    private Double rating;

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

    public Specialization getSpecialization() {
        return specialization;
    }

    public void setSpecialization(Specialization specialization) {
        this.specialization = specialization;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }


}
