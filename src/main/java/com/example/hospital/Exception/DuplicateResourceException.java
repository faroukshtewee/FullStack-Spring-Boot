package com.example.hospital.Exception;

import com.example.hospital.DTO.AppointmentCreateDto;
import com.example.hospital.DTO.AppointmentDto;
import com.example.hospital.DTO.DoctorCreateDto;
import com.example.hospital.DTO.PatientCreateDto;

public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(DoctorCreateDto dto) {
        super(("A doctor with email " + dto.getEmail() + " already exists."));
    }
    public DuplicateResourceException(PatientCreateDto dto) {
        super(("A patient with email " + dto.getEmail() + " already exists."));
    }

    public DuplicateResourceException(AppointmentCreateDto dto) {
        super(("An AppointmentDto at this time" + dto.getAppointmentDate() +" - "+dto.getAppointmentTime() +" already exists."));

    }
    public DuplicateResourceException(String message) {
        super(message);

    }


}
