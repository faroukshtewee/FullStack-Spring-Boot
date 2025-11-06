package com.example.hospital.Exception;

import com.example.hospital.DTO.AppointmentCreateDto;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String message) {
        super("error: 404 "+message);
    }
    public ResourceNotFoundException(AppointmentCreateDto dto,String val) {
        super("this " + val + " with id " +  ("doctor".equalsIgnoreCase(val) ? String.valueOf(dto.getDoctorId()) : ("patient".equalsIgnoreCase(val) ? String.valueOf(dto.getPatientId()) : "unknown") )+ " not exist!!");

//        super("this "+val+" with id "+dto.getDoctorId()+" not exist!!");
    }
}
