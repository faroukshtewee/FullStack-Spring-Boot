package com.example.hospital.Service;

import com.example.hospital.DTO.DoctorCreateDto;
import com.example.hospital.DTO.DoctorDto;
import com.example.hospital.DTO.PatientDto;
import com.example.hospital.Exception.DuplicateResourceException;
import com.example.hospital.Exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DoctorService {
    private List<DoctorDto> doctors = new ArrayList<>();
    private Long nextId = 1L;
    public DoctorDto createDoctor(DoctorCreateDto dto) {
        boolean doctorExist= doctors.stream().anyMatch(doctorDto -> doctorDto.getEmail().equals(dto.getEmail()));
        DoctorDto newDoctor;
        if (doctorExist) {
            throw new DuplicateResourceException(dto);
        }
        else{
            newDoctor = new DoctorDto();
            newDoctor.setId(nextId++);
            newDoctor.setFirstName(dto.getFirstName());
            newDoctor.setLastName(dto.getLastName());
            newDoctor.setEmail(dto.getEmail());
            newDoctor.setSpecialization(dto.getSpecialization().toString());
            newDoctor.setPhoneNumber(dto.getPhoneNumber());
            newDoctor.setYearsOfExperience(dto.getYearsOfExperience());
            newDoctor.setRating(dto.getRating());
            doctors.add(newDoctor);
        }
        return newDoctor;
    }
    public List<DoctorDto> getAllDoctors() {
        return doctors;
    }
    public DoctorDto getDoctorById(Long id) {
        DoctorDto doctorExist = doctors.stream().filter(doctorDto -> doctorDto.getId().equals(id)).findFirst().orElse(null);
        if(doctorExist == null){
            throw new ResourceNotFoundException("This doctor id not exist!!");
        }
        else{
            return doctorExist;
        }

    }//
    public DoctorDto updateDoctor(Long id, DoctorCreateDto dto) {
        DoctorDto doctorExist = doctors.stream().filter(doctorDto -> doctorDto.getId().equals(id)).findFirst().orElse(null);
        DoctorDto doctorEmailExist = doctors.stream().filter(doctorDto -> doctorDto.getEmail().equals(dto.getEmail())).findFirst().orElse(null);
        if (doctorExist == null) {
            throw new ResourceNotFoundException("This doctor id not exist!!");
        } else {
            if (doctorEmailExist.getEmail().equals(dto.getEmail())&&doctorEmailExist.getId()!=id) {
                throw new DuplicateResourceException(dto);
            } else {
                doctorExist.setFirstName(dto.getFirstName());
                doctorExist.setLastName(dto.getLastName());
                doctorExist.setEmail(dto.getEmail());
                doctorExist.setSpecialization(dto.getSpecialization().toString());
                doctorExist.setPhoneNumber(dto.getPhoneNumber());
                doctorExist.setYearsOfExperience(dto.getYearsOfExperience());
                doctorExist.setRating(dto.getRating());
            }
            return doctorExist;
        }
    }
    public DoctorDto updateDoctor(DoctorDto doctorDto) {
        Long id = doctorDto.getId();
        for (int i = 0; i < doctors.size(); i++) {
            if (doctors.get(i).getId().equals(id)) {
                doctors.set(i, doctorDto);
                return doctorDto;
            }
        }
        throw new org.apache.velocity.exception.ResourceNotFoundException("Patient with ID " + id + " not found for update.");
    }
    public void deleteDoctor(Long id) {
        DoctorDto doctorExist = doctors.stream().filter(doctorDto -> doctorDto.getId().equals(id)).findFirst().orElse(null);
        if(doctorExist == null){
            throw new ResourceNotFoundException("this doctor doesn't exist");
        }
        else{
            doctors.remove(doctorExist);
        }
    }
    public Map<String, List<DoctorDto>> getDoctorsBySpecializationMap(){
        return doctors.stream().collect(Collectors.groupingBy(DoctorDto::getSpecialization));
    }
    public List<DoctorDto> getTopRatedDoctors(int limit){
        List<DoctorDto>topRatedDoctors=doctors;
        Collections.sort(topRatedDoctors, Comparator.comparingDouble(DoctorDto::getRating).reversed());
        return topRatedDoctors.stream().limit(limit).collect(Collectors.toList());
    }
    public List<DoctorDto> getDoctorsByExperienceRange(int minYears, int maxYears){
        System.out.println("min: "+minYears+" max: "+maxYears);
        List<DoctorDto> doctorExperience = doctors.stream().filter(doctorDto -> doctorDto.getYearsOfExperience()>=minYears&&doctorDto.getYearsOfExperience()<=maxYears).collect(Collectors.toList());
        Collections.sort(doctorExperience,Comparator.comparingDouble(DoctorDto::getYearsOfExperience));
        return doctorExperience;
    }
    public Map<String, Double> getAverageRatingBySpecialization(){
       return doctors.stream().collect(Collectors.groupingBy(DoctorDto::getSpecialization,Collectors.averagingDouble(DoctorDto::getRating)));
    }//
    public List<DoctorDto> getDoctorsWithMostAppointments(int limit){
        List<DoctorDto>doctorsWithMostAppointments=doctors;

        Collections.sort(doctorsWithMostAppointments, Comparator.comparingLong((DoctorDto doctor) -> doctor.getAppointmentIds().size()).reversed());
        return doctorsWithMostAppointments.stream().limit(limit).collect(Collectors.toList());
    }
    public List<String> getSpecializations() {
        return Arrays.stream(DoctorCreateDto.Specialization.values()).map(Enum::name).collect(Collectors.toList());
    }
    public List<DoctorDto> searchDoctorsByName(String keyword){
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }
        final String lowerCaseKeyword = keyword.trim().toLowerCase();
        List<DoctorDto> doctorsByName= doctors.stream().filter(doctor -> doctor.getFirstName().toLowerCase().contains(lowerCaseKeyword) || doctor.getLastName().toLowerCase().contains(lowerCaseKeyword)).collect(Collectors.toList());
        Collections.sort(doctorsByName, Comparator.comparing(DoctorDto::getLastName));
        return doctorsByName;
    }

}
