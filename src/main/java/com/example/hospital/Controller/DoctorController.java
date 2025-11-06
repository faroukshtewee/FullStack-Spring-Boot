package com.example.hospital.Controller;

import com.example.hospital.DTO.DoctorCreateDto;
import com.example.hospital.DTO.DoctorDto;
import com.example.hospital.DTO.PatientDto;
import com.example.hospital.Service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/doctors")
public class DoctorController {
    private final DoctorService doctorService;
    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }
    @PostMapping("")
    public DoctorDto createDoctor(@Valid @RequestBody DoctorCreateDto dto){
        return doctorService.createDoctor(dto);
    }
    @GetMapping("")
    public List<DoctorDto> getAllDoctors() {
        return doctorService.getAllDoctors();
    }
    @GetMapping("/{id}")
    public DoctorDto getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id);
    }
    @PutMapping("/{id}")
    public DoctorDto updateDoctor(@PathVariable Long id, @Valid @RequestBody DoctorCreateDto doctorCreateDto) {
        return doctorService.updateDoctor(id, doctorCreateDto);
    }
    @DeleteMapping("/{id}")
    public void deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
    }
    @GetMapping("/by-specialization-map")
    public Map<String, List<DoctorDto>> getDoctorsBySpecializationMap(){
        return doctorService.getDoctorsBySpecializationMap();
    }
    @GetMapping("/top-rated")
    public List<DoctorDto> getTopRatedDoctors(@RequestParam int limit) {
        return doctorService.getTopRatedDoctors(limit);
    }
    @GetMapping("/experience-range")
    public List<DoctorDto> getDoctorsByExperienceRange(@RequestParam int min,@RequestParam int max) {
        return doctorService.getDoctorsByExperienceRange(min, max) ;
    }
    @GetMapping("/average-rating-by-spec")
    public Map<String, Double> getAverageRatingBySpecialization(){
        return doctorService.getAverageRatingBySpecialization();
    }
    @GetMapping("/most-appointments")
    public List<DoctorDto> getDoctorsWithMostAppointments(@RequestParam int limit) {
        return doctorService.getDoctorsWithMostAppointments(limit);
    }
    @GetMapping("/search")
    public List<DoctorDto> searchDoctorsByName(@RequestParam String keyword) {
        return doctorService.searchDoctorsByName(keyword);
    }
    @GetMapping("/specializations")
    public List<String> getSpecializations() {
        return doctorService.getSpecializations();
    }
}
