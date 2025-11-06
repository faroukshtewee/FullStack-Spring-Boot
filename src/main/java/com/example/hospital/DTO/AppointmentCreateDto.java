package com.example.hospital.DTO;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AppointmentCreateDto {
    public enum Duration {
        FIFTEEN_MINUTES(15),
        THIRTY_MINUTES(30),
        FORTY_FIVE_MINUTES(45),
        SIXTY_MINUTES(60);

        private final int minutes;

        Duration(int minutes) {
            this.minutes = minutes;
        }

        public int getMinutes() {
            return minutes;
        }
    }
    public enum Priority {
        LOW,
        MEDIUM,
        HIGH,
        URGENT
    }
    public enum Status {
        SCHEDULED,
        COMPLETED,
        CANCELLED
    }
    @NotNull(message = "doctorId cannot be null")
    private Long doctorId;
    @NotNull(message = "patientId cannot be null")
    private Long patientId;
    @NotNull(message = "Appointment Date cannot be null")
    @NotBlank(message = "Appointment Date cannot be empty")
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}" ,message = "Appointment Date must be in (YYYY-MM-DD) format ")
    private String appointmentDate;
    @NotNull(message = "Appointment Time cannot be null")
    @NotBlank(message = "Appointment Time cannot be empty")
    @Pattern(regexp = "\\d{2}:\\d{2}" ,message = "Appointment Time must be in (HH:MM) format ")
    private String appointmentTime;
    @NotNull(message = "status cannot be null")
    @Enumerated(EnumType.STRING)
    private Status status;
    @NotNull(message = "duration cannot be null")
    @Enumerated(EnumType.STRING)
    private Duration duration;
    @NotNull(message = "priority cannot be null")
    @Enumerated(EnumType.STRING)
    private Priority priority;
    @Size(max = 500,message = "max notes should be 500 charachters")
    private String notes;
    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(String appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Duration getDuration() {
        return duration;
    }

    public void setDuration(Duration duration) {
        this.duration = duration;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }


}
