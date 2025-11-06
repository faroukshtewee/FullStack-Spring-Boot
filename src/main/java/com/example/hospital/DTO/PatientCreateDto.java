package com.example.hospital.DTO;

import jakarta.validation.constraints.*;

public class PatientCreateDto {
    @NotBlank(message = "The first Name shouldn't be empty")
    @Size(min = 2, max = 50,message = "First name must be between 2 to 50 characters")
    private String firstName;
    @NotBlank(message = "The Last Name shouldn't be empty")
    @Size(min = 2, max = 50,message = "Last name must be between 2 to 50 characters")
    private String lastName;
//    @NotNull(message = "Email name cannot be null")
    @Email(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",message = "Enter valid email format")
    @NotBlank(message = "The email shouldn't be empty")
    private String email;
//    @NotNull(message = "Phone Number cannot be null")
    @NotBlank(message = "Phone Number cannot be empty")
    @Pattern(regexp = "^05\\d-\\d{7}$",message = "please enter a valid phone number format!!")
    private String phoneNumber;
//    @NotNull(message = "Date Of Birth cannot be null")
    @NotBlank(message = "Date Of Birth cannot be empty")
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}" ,message = "Date Of Birth must be in (YYYY-MM-DD) format ")
    private String dateOfBirth;

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


}
