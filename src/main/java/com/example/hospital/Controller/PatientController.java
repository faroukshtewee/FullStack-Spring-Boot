package com.example.hospital.Controller;

import com.example.hospital.DTO.PatientCreateDto;
import com.example.hospital.DTO.PatientDto;
import com.example.hospital.Service.PatientService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/patients")
public class PatientController {
    private final PatientService patientService;
    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }
    @PostMapping("")
    public PatientDto createPatient(@Valid @RequestBody PatientCreateDto patientCreateDto) {
        System.out.println("✅ Request DTO received: " + patientCreateDto.toString());
        return patientService.createPatient(patientCreateDto);
    }
    @GetMapping("")
    public List<PatientDto> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("/{id}")
    public PatientDto getPatientById(@PathVariable Long id) {
        return patientService.getPatientById(id) ;
    }
    @PutMapping("/{id}")
    public PatientDto updatePatient(@PathVariable Long id, @Valid @RequestBody PatientCreateDto patientCreateDto) {
        return patientService.updatePatient(id, patientCreateDto) ;
    }
    @DeleteMapping("/{id}")
    public void deletePatient(@PathVariable Long id) {
            patientService.deletePatient(id);
    }
    @GetMapping("/age-range")
    public List<PatientDto> getPatientsByAgeRange(@RequestParam int min, @RequestParam int max) {
        return patientService.getPatientsByAgeRange(min, max);
    }
    @GetMapping("/age-statistics")
    public Map<String, Object> getPatientAgeStatistics(){
        return patientService.getPatientAgeStatistics();
    }
    @GetMapping("/grouped-by-age")
    public Map<String, List<PatientDto>> getPatientsGroupedByAgeGroup() {
        return patientService.getPatientsGroupedByAgeGroup();
    }

    @GetMapping("/most-appointments")
    public List<PatientDto> getPatientsWithMostAppointments(@RequestParam int limit) {
        return patientService.getPatientsWithMostAppointments(limit);
    }
    @GetMapping("/search")
    public List<PatientDto> searchPatientsByName(@RequestParam String keyword) {
        return patientService.searchPatientsByName(keyword);
    }
}
