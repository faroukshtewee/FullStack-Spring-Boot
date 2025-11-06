package com.example.hospital.Service;

import com.example.hospital.DTO.AppointmentDto;
import com.example.hospital.DTO.DoctorDto;
import com.example.hospital.DTO.PatientCreateDto;
import com.example.hospital.DTO.PatientDto;
import com.example.hospital.Exception.DuplicateResourceException;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PatientService {
    private List<PatientDto> patients = new ArrayList<>();
    private Long nextId = 1L;
    // Helper Method - חישוב גיל
    private Integer calculateAge(String dateOfBirth) {
         LocalDate currentDate=LocalDate.now();
         LocalDate localdateOfBirth = LocalDate.parse(dateOfBirth);;
         Period period = Period.between(localdateOfBirth, currentDate);
        return  period.getYears();
    }
    // CRUD בסיסי
    public PatientDto createPatient(PatientCreateDto dto) {
        boolean patientExist= patients.stream().anyMatch(patientDto -> patientDto.getEmail().equals(dto.getEmail()));
        PatientDto newPatient;
        if (patientExist) {
            throw new DuplicateResourceException(dto);
        }
        else{
            newPatient = new PatientDto();
            newPatient.setId(nextId++);
            newPatient.setFirstName(dto.getFirstName());
            newPatient.setLastName(dto.getLastName());
            newPatient.setEmail(dto.getEmail());
            newPatient.setDateOfBirth(dto.getDateOfBirth());
            newPatient.setPhoneNumber(dto.getPhoneNumber());
            newPatient.setAge(calculateAge(dto.getDateOfBirth()));
            patients.add(newPatient);
        }
        return newPatient;
    }
    public List<PatientDto> getAllPatients() {
        return patients;
    }
    public PatientDto getPatientById(Long id) {
        PatientDto patientExist = patients.stream().filter(patientDto -> patientDto.getId().equals(id)).findFirst().orElse(null);
        if(patientExist==null){
            throw new ResourceNotFoundException("This patient id not exist!!");
        }
        else{
            return patientExist;
        }
    }
    public PatientDto updatePatient(Long id, PatientCreateDto dto) {
        PatientDto patientExist = patients.stream().filter(patientDto -> patientDto.getId().equals(id)).findFirst().orElse(null);
        PatientDto patientEmailExist = patients.stream().filter(patientDto -> patientDto.getEmail().equals(dto.getEmail())).findFirst().orElse(null);
        if (patientExist == null) {
            throw new ResourceNotFoundException("This patient id not exist!!");
        } else {
            if (patientEmailExist.getEmail().equals(dto.getEmail())&&patientEmailExist.getId()!=id) {
                throw new DuplicateResourceException(dto);
            } else {
                patientExist.setFirstName(dto.getFirstName());
                patientExist.setLastName(dto.getLastName());
                patientExist.setEmail(dto.getEmail());
                patientExist.setDateOfBirth(dto.getDateOfBirth());
                patientExist.setPhoneNumber(dto.getPhoneNumber());
                patientExist.setAge(calculateAge(dto.getDateOfBirth()));
            }
            return patientExist;
        }
    }
    public PatientDto updatePatient(PatientDto patientDto) {
        Long id = patientDto.getId();
        for (int i = 0; i < patients.size(); i++) {
            // Find the patient by ID
            if (patients.get(i).getId().equals(id)) {
                // Replace the old DTO with the new, modified DTO
                patients.set(i, patientDto);
                return patientDto;
            }
        }
        throw new ResourceNotFoundException("Patient with ID " + id + " not found for update.");
    }

    public void deletePatient(Long id) {
        PatientDto patientExist = patients.stream().filter(patientDto -> patientDto.getId().equals(id)).findFirst().orElse(null);
        if(patientExist == null){
            throw new ResourceNotFoundException("this patient doesn't exist");
        }
        else{
            patients.remove(patientExist);
        }

    }
    public List<PatientDto> getPatientsByAgeRange(int minAge, int maxAge){
        List<PatientDto> patientsExperience = patients.stream().filter(patientDto -> patientDto.getAge()>=minAge&&patientDto.getAge()<=maxAge).collect(Collectors.toList());
        Collections.sort(patientsExperience, Comparator.comparingDouble(PatientDto::getAge));
        return patientsExperience;

    }
    public Map<String, Object> getPatientAgeStatistics(){
        Map<String, Object> results = new HashMap<>();
        IntSummaryStatistics stats = patients.stream().mapToInt(PatientDto::getAge).summaryStatistics();
        if (stats.getCount() > 0) {
            results.put("minAge", stats.getMin());
            results.put("maxAge", stats.getMax());
            results.put("averageAge", stats.getAverage());
        } else {
            results.put("minAge", 0);
            results.put("maxAge", 0);
            results.put("averageAge", 0.0);
        }
        results.put("totalPatients", stats.getCount());
        return results;
    }
    public Map<String, List<PatientDto>> getPatientsGroupedByAgeGroup(){
        return patients.stream().collect(Collectors.groupingBy(patient ->getAgeGroup(patient.getAge())));

    }
    private String getAgeGroup(int age) {
        if (age <= 18) {
            return "0-18 (ילדים)";
        } else if (age <= 35&&age>=19) {
            return "19-35 (צעירים)";
        } else if (age <= 60 &&age>=36) {
            return "36-60 (מבוגרים)";
        } else {
            return "61+ (קשישים)";
        }
    }
    public List<PatientDto> getPatientsWithMostAppointments(int limit){
        List<PatientDto>mostAppointments=patients;
        Collections.sort(mostAppointments, Comparator.comparingLong((PatientDto patient) -> patient.getAppointmentIds().size()).reversed());
        return mostAppointments.stream().limit(limit).collect(Collectors.toList());

    }
    public List<PatientDto> searchPatientsByName(String keyword){
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }
        final String lowerCaseKeyword = keyword.trim().toLowerCase();
        List<PatientDto> patientsByName= patients.stream().filter(patient -> patient.getFirstName().toLowerCase().contains(lowerCaseKeyword) || patient.getLastName().toLowerCase().contains(lowerCaseKeyword)).collect(Collectors.toList());
        Collections.sort(patientsByName, Comparator.comparing(PatientDto::getLastName));
        return patientsByName;
    }

}
