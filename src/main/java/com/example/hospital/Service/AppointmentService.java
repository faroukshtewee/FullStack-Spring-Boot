package com.example.hospital.Service;

import com.example.hospital.DTO.*;
import com.example.hospital.Exception.DuplicateResourceException;
import com.example.hospital.Exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AppointmentService {
    private List<AppointmentDto> appointments = new ArrayList<>();
    private Long nextId = 1L;
    private final DoctorService doctorService;
    private final PatientService patientService;
    private String doctor = "doctor";
    private String patient = "patient";
    // Start with a fresh copy of all possible slots
    List<String> availableSlots = new ArrayList<>(ALL_SLOTS);
    private static final List<String> ALL_SLOTS = generateAllSlots();
    public AppointmentService(DoctorService doctorService, PatientService patientService) {
        this.doctorService = doctorService;
        this.patientService = patientService;
    }

    // Helper method to generate the base 15-minute slots (9:00 - 16:45)
    private static List<String> generateAllSlots() {
        List<String> slots = new ArrayList<>();
        for (int hour = 9; hour < 17; hour++){
            slots.add(String.format("%02d:00", hour));
            slots.add(String.format("%02d:15", hour));
            slots.add(String.format("%02d:30", hour));
            slots.add(String.format("%02d:45", hour));
        }
        return Collections.unmodifiableList(slots); // Make it read-only
    }
    // CRUD בסיסי
    public AppointmentDto createAppointment(AppointmentCreateDto dto) {
        boolean appointmentExist = appointments.stream().anyMatch(appointment -> appointment.getDoctorId().equals(dto.getDoctorId()) &&appointment.getAppointmentDate().equals(dto.getAppointmentDate()) && appointment.getAppointmentTime().equals(dto.getAppointmentTime()));
        DoctorDto doctorExist = doctorService.getDoctorById(dto.getDoctorId());
        PatientDto patientExist = patientService.getPatientById(dto.getPatientId());
        AppointmentDto appointmentDto = new AppointmentDto();
        if (appointmentExist) {
            throw new DuplicateResourceException(dto);
        } else {
//            if (!appointmentExist) {
                if (doctorExist == null) {
                    throw new ResourceNotFoundException(dto, doctor);
                } else if (patientExist == null) {
                    throw new ResourceNotFoundException(dto, patient);
                }
            List<AppointmentDto> conflicts = getConflictingAppointments(
                    dto.getDoctorId(),
                    dto.getAppointmentDate(),
                    dto.getAppointmentTime(),
                    dto.getDuration().getMinutes()
            );

            if (!conflicts.isEmpty()) {
                throw new DuplicateResourceException(dto);
            }
                appointmentDto.setId(nextId++);
                appointmentDto.setDoctorId(dto.getDoctorId());
                appointmentDto.setPatientId(dto.getPatientId());
                appointmentDto.setAppointmentDate(dto.getAppointmentDate());
                appointmentDto.setAppointmentTime(dto.getAppointmentTime());
                appointmentDto.setPriority(dto.getPriority().toString());
                appointmentDto.setNotes(dto.getNotes());
                appointmentDto.setDuration(dto.getDuration().getMinutes());
                appointmentDto.setAppointmentTime(dto.getAppointmentTime());
                appointmentDto.setStatus(dto.getStatus().toString());

                patientExist.getAppointmentIds().add(appointmentDto.getId());
                patientService.updatePatient(patientExist);

                doctorExist.getAppointmentIds().add(appointmentDto.getId());
                doctorService.updateDoctor(doctorExist);

                appointments.add(appointmentDto);
//            }
        }
        return appointmentDto;
    }

    public List<AppointmentDto> getAllAppointments() {
        return appointments;
    }

    public AppointmentDto getAppointmentById(Long id) {
        AppointmentDto appointmentExist = appointments.stream().filter(appointment -> appointment.getId().equals(id)).findFirst().orElse(null);
        if (appointmentExist.equals(null)) {
            throw new ResourceNotFoundException("This appointment id not exist!!");
        } else {
            return appointmentExist;
        }

    }

    public AppointmentDto updateAppointment(Long id, AppointmentCreateDto dto) {
        AppointmentDto appointmentExist = appointments.stream().filter(appointmentDto -> appointmentDto.getId().equals(id)).findFirst().orElse(null);
        if (appointmentExist == null) {
            throw new ResourceNotFoundException("This appointment id not exist!!");
        } else {

            if (appointmentExist.getAppointmentDate().equals(dto.getAppointmentDate()) && appointmentExist.getAppointmentTime().equals(dto.getAppointmentTime())) {
                throw new DuplicateResourceException(dto);
            } else {
                appointmentExist.setDoctorId(dto.getDoctorId());
                appointmentExist.setPatientId(dto.getPatientId());
                appointmentExist.setAppointmentDate(dto.getAppointmentDate());
                appointmentExist.setAppointmentTime(dto.getAppointmentTime());
                appointmentExist.setStatus(dto.getStatus().toString());
                appointmentExist.setDuration(dto.getDuration().getMinutes());
                appointmentExist.setAppointmentTime(dto.getAppointmentTime());
                appointmentExist.setStatus(dto.getStatus().toString());
            }

        }
        return appointmentExist;
    }

    public void deleteAppointment(Long id) {
        AppointmentDto appointmentExist = appointments.stream().filter(appointmentDto -> appointmentDto.getId().equals(id)).findFirst().orElse(null);
        if (appointmentExist == null) {
            throw new ResourceNotFoundException("this doctor doesn't exist");
        } else {
            appointments.remove(appointmentExist);
        }

    }

    public List<AppointmentDto> getAppointmentsByPriority(String priority) {
        List<AppointmentDto> appointmentExist = appointments.stream().filter(appointment -> appointment.getPriority().equals(priority)).collect(Collectors.toList());
        if (appointmentExist.isEmpty()) {
            throw new ResourceNotFoundException("This priority appointment not exist!!");
        } else {
            Collections.sort(appointmentExist, Comparator.comparing(AppointmentDto::getAppointmentDate).thenComparing(AppointmentDto::getAppointmentTime));
            return appointmentExist;
        }
    }

    public List<AppointmentDto> getUpcomingAppointments(int days) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(days);

        return appointments.stream().filter(appointment -> {
            try {
                boolean isScheduled = "SCHEDULED".equalsIgnoreCase(appointment.getStatus());
                if (!isScheduled) return false;
                LocalDate appointmentDate = LocalDate.parse(appointment.getAppointmentDate());
                boolean isWithinRange = (appointmentDate.isEqual(today) || appointmentDate.isAfter(today)) && (appointmentDate.isEqual(futureDate) || appointmentDate.isBefore(futureDate));

                return isWithinRange;

            } catch (DateTimeParseException e) {
                return false;
            }
        }).sorted(Comparator.comparing(appointment -> LocalDate.parse(((AppointmentDto) appointment).getAppointmentDate())).thenComparing(appointment -> LocalTime.parse(((AppointmentDto) appointment).getAppointmentTime()))).collect(Collectors.toList());

    }

    public Map<String, Integer> getAppointmentStatisticsByStatus() {
        return appointments.stream().collect(Collectors.groupingBy(AppointmentDto::getStatus, Collectors.collectingAndThen(Collectors.counting(), Long::intValue)));

    }

    public List<AppointmentDto> getAppointmentsByDateRange(String startDateStr, String endDateStr) {
            final LocalDate startDate = LocalDate.parse(startDateStr);
            final LocalDate endDate = LocalDate.parse(endDateStr);
            return appointments.stream().filter(appointment -> {LocalDate appointmentDate = LocalDate.parse(appointment.getAppointmentDate());boolean isAfterOrEqualStart = !appointmentDate.isBefore(startDate);boolean isBeforeOrEqualEnd = !appointmentDate.isAfter(endDate);return isAfterOrEqualStart && isBeforeOrEqualEnd;}).collect(Collectors.toList());
    }
    public List<AppointmentDto> getDailySchedule(Long doctorId, String date){
        List<AppointmentDto> appointmentExist = appointments.stream().filter(appointment -> appointment.getDoctorId().equals(doctorId)&& appointment.getAppointmentDate().equals(date)).collect(Collectors.toList());
        Collections.sort(appointmentExist, Comparator.comparing(AppointmentDto::getAppointmentTime));
        return appointmentExist;
    }
//    public List<String> getAvailableTimeSlots(Long doctorId, String date){
////        List<String> allSlots = new ArrayList<>();
//        List<AppointmentDto>  appointmentExist=getDailySchedule( doctorId, date);
////        for (int hour = 9; hour < 17; hour++){
////            allSlots.add(String.format("%02d:00", hour));
////            allSlots.add(String.format("%02d:15", hour));
////            allSlots.add(String.format("%02d:30", hour));
////            allSlots.add(String.format("%02d:45", hour));
////        }
//        Set<String> bookedSlots = new HashSet<>();
//        for (AppointmentDto appointment : appointmentExist) {
//            try {
//                LocalTime startTime = LocalTime.parse(appointment.getAppointmentTime());
//                int durationMinutes = appointment.getDuration();
//                LocalTime slotMarker = startTime;
//
//                while (slotMarker.isBefore(startTime.plusMinutes(durationMinutes))) {
//                    String slotString = slotMarker.toString();
//                    if (allSlots.contains(slotString)) {
//                        bookedSlots.add(slotString);
//                    }
//                    slotMarker = slotMarker.plusMinutes(15);
//                }
//            } catch (DateTimeParseException | NullPointerException e) {
//                System.err.println("Skipping invalid appointment data: " + e.getMessage());
//            }
//        }
//
//        allSlots.removeAll(bookedSlots);
//        return allSlots.stream()
//                .map(LocalTime::parse)
//                .sorted()
//                .map(LocalTime::toString)
//                .collect(Collectors.toList());
//    }
public List<String> getAvailableTimeSlots(Long doctorId, String date){

    List<AppointmentDto> appointmentExist = getDailySchedule(doctorId, date);
    Set<String> bookedSlots = new HashSet<>();
    for (AppointmentDto appointment : appointmentExist) {
        try {
            LocalTime startTime = LocalTime.parse(appointment.getAppointmentTime());
            int durationMinutes = appointment.getDuration();
            LocalTime slotMarker = startTime;

            while (slotMarker.isBefore(startTime.plusMinutes(durationMinutes))) {
                String slotString = slotMarker.format(DateTimeFormatter.ofPattern("HH:mm")); // Format to match ALL_SLOTS format

                if (ALL_SLOTS.contains(slotString)) {
                    bookedSlots.add(slotString);
                }
                slotMarker = slotMarker.plusMinutes(15);
            }
        } catch (DateTimeParseException | NullPointerException e) {
            System.err.println("Skipping invalid appointment data: " + e.getMessage());
        }
    }

    availableSlots.removeAll(bookedSlots);

    return availableSlots.stream()
            .map(LocalTime::parse)
            .sorted()
            .map(LocalTime::toString)
            .collect(Collectors.toList());
}
    public List<AppointmentDto> getConflictingAppointments(Long doctorId, String date, String time, int duration){
        List<AppointmentDto> existingAppointments = getDailySchedule(doctorId, date);
        LocalTime newStart;
        LocalTime newEnd;
        try {
            newStart = LocalTime.parse(time);
            newEnd = newStart.plusMinutes(duration);
        } catch (DateTimeParseException e) {
            System.err.println("Invalid time format for new appointment: " + time);
            return new ArrayList<>();
        }

        return existingAppointments.stream().filter(existing -> isConflicting(newStart, newEnd, existing)).collect(Collectors.toList());
    }
    private boolean isConflicting(LocalTime newStart, LocalTime newEnd, AppointmentDto existingAppointment) {
        LocalTime existingStart;
        LocalTime existingEnd;
        try {
            existingStart = LocalTime.parse(existingAppointment.getAppointmentTime());
            Duration existingDuration = Duration.ofMinutes(existingAppointment.getDuration());
            existingEnd = existingStart.plus(existingDuration);
        } catch (DateTimeParseException | NullPointerException e) {
            return false;
        }
        boolean noOverlap = newEnd.isBefore(existingStart) || newEnd.equals(existingStart) ||
                existingEnd.isBefore(newStart) || existingEnd.equals(newStart);
        return !noOverlap;
    }
    public String getMostBusyDay(){
        Map<String, Long> appointmentsPerDay = appointments.stream().filter(appointment -> "SCHEDULED".equalsIgnoreCase(appointment.getStatus())).collect(Collectors.groupingBy(AppointmentDto::getAppointmentDate, Collectors.counting()));
        Optional<Map.Entry<String, Long>> mostBusyDayEntry = appointmentsPerDay.entrySet().stream().max(Comparator.comparing(Map.Entry::getValue));
        return mostBusyDayEntry.map(Map.Entry::getKey).orElse("no appointments scheduled");
    }
    public List<AppointmentDto> getAppointmentsByDurationRange(int minDuration, int maxDuration){
        if (minDuration > maxDuration) {
            throw new IllegalArgumentException("Minimum duration cannot be greater than maximum duration.");
        }
        return appointments.stream().filter(appointment -> {int duration = appointment.getDuration();return duration >= minDuration && duration <= maxDuration;}).collect(Collectors.toList());
    }
    public Map<String, Object> getCancelledAppointmentsReport(){
        List<AppointmentDto> cancelledAppointments = appointments.stream().filter(appointment -> "CANCELLED".equalsIgnoreCase(appointment.getStatus())).collect(Collectors.toList());
        long totalCancelled = cancelledAppointments.size();
        Map<Long, Long> cancelledByDoctor = cancelledAppointments.stream().collect(Collectors.groupingBy(AppointmentDto::getDoctorId,Collectors.counting()));
        Map<Long, Long> cancelledByPatient = cancelledAppointments.stream().collect(Collectors.groupingBy(AppointmentDto::getPatientId,Collectors.counting()));
        Map<String, Object> report = new HashMap<>();
        report.put("totalCancelled", totalCancelled);
        report.put("cancelledByDoctor", convertLongKeyMapToStringKey(cancelledByDoctor));
        report.put("cancelledByPatient", convertLongKeyMapToStringKey(cancelledByPatient));
        return report;
    }
    private Map<String, Long> convertLongKeyMapToStringKey(Map<Long, Long> longKeyMap) {
        return longKeyMap.entrySet().stream().collect(Collectors.toMap(entry -> String.valueOf(entry.getKey()),Map.Entry::getValue));
    }
    public AppointmentDto cancelAppointment( Long id){
        AppointmentDto appointmentDto =getAppointmentById(id);
        appointmentDto.setStatus("CANCELLED");
        return appointmentDto;
    }
    public AppointmentDto completeAppointment( Long id){
        AppointmentDto appointmentDto =getAppointmentById(id);
        appointmentDto.setStatus("COMPLETED");
        return appointmentDto;
    }
}
