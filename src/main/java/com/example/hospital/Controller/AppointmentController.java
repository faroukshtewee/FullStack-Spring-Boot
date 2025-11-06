package com.example.hospital.Controller;

import com.example.hospital.DTO.AppointmentCreateDto;
import com.example.hospital.DTO.AppointmentDto;
import com.example.hospital.Service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }
    @PostMapping
    public AppointmentDto createAppointment(@Valid @RequestBody AppointmentCreateDto appointmentCreateDto) {
        return appointmentService.createAppointment(appointmentCreateDto);
    }
    @GetMapping
    public List<AppointmentDto> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }
    @GetMapping("/{id}")
    public AppointmentDto getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id);
    }//
    @PutMapping("/{id}")
    public AppointmentDto updateAppointment(@PathVariable Long id, @Valid @RequestBody AppointmentCreateDto appointmentDto) {
        return  appointmentService.updateAppointment(id, appointmentDto);
    }
    @DeleteMapping("/{id}")
    public void deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
    }
    @PutMapping("/{id}/cancel")
    public AppointmentDto cancelAppointment(@PathVariable Long id) {
        return appointmentService.cancelAppointment(id);
    }
    @PutMapping("/{id}/complete")
    public AppointmentDto completeAppointment(@PathVariable Long id) {
        return appointmentService.completeAppointment(id);
    }
    @GetMapping("/priority/{priority}")
    public List<AppointmentDto> getAppointmentsByPriority(@PathVariable String priority) {
        return appointmentService.getAppointmentsByPriority(priority) ;
    }
    @GetMapping("/upcoming")
    public List<AppointmentDto> getUpcomingAppointments(@RequestParam int days) {
        return appointmentService.getUpcomingAppointments(days);
    }
    @GetMapping("/statistics-by-status")
    public Map<String, Integer> getAppointmentStatisticsByStatus()  {
        return appointmentService.getAppointmentStatisticsByStatus();
    }
    @GetMapping("/date-range")
    public List<AppointmentDto> getAppointmentsByDateRange(@RequestParam String start, @RequestParam String end) {
        return  appointmentService.getAppointmentsByDateRange(start, end);
    }
    @GetMapping("/daily-schedule/{doctorId}")
    public List<AppointmentDto>getDailySchedule(@PathVariable Long doctorId, @RequestParam String date) {
        return appointmentService.getDailySchedule(doctorId, date);
    }
    @GetMapping("/available-slots/{doctorId}")
    public List<String> getAvailableTimeSlots(@PathVariable Long doctorId, @RequestParam String date) {
        return appointmentService.getAvailableTimeSlots(doctorId, date);
    }
    @GetMapping("/most-busy-day")
    public String getMostBusyDay(){
        return appointmentService.getMostBusyDay();
    }
    @GetMapping("/duration-range")
    public List<AppointmentDto> getAppointmentsByDurationRange(@RequestParam int min, @RequestParam int max) {
        return appointmentService.getAppointmentsByDurationRange(min, max);
    }
    @GetMapping("/cancelled-report")
    public Map<String, Object> getCancelledAppointmentsReport() {
        return appointmentService.getCancelledAppointmentsReport();
    }
}
