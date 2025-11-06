document.addEventListener("DOMContentLoaded", () => {
    // ===============================
    // DOM Elements
    // ===============================
    const appointmentForm = document.getElementById("appointment-form");
    const appointmentIdInput = document.getElementById("appointment-id");

    const doctorIdInput = document.getElementById("appointmentDoctorId");
    const patientIdInput = document.getElementById("appointmentPatientId");
    const dateInput = document.getElementById("appointmentDate");
    // const timeInput = document.getElementById("appointmentTime");
    const timeInput = document.getElementById("appointmentTimeAvailable");
    const statusInput = document.getElementById("status");
    const durationInput = document.getElementById("duration");
    const priorityInput = document.getElementById("priority");
    const priorityFilterInput = document.getElementById("priority-filter");
    const upcomingFilterInput = document.getElementById("upcoming-filter");
    const notesInput = document.getElementById("notes");
    const refreshDoctorsListBtn = document.getElementById("refresh-doctors-btn");
    const refreshPatientsListBtn = document.getElementById("refresh-patients-btn");

    const submitButton = appointmentForm.querySelector('button[type="submit"]');
    const cancelEditBtn = document.getElementById("cancel-edit-btn-appointment");
    const upcomingFilterBtn = document.getElementById("upcoming-appointments-btn");

    const appointmentsTableBody = document.getElementById("appointments-table-body");
    const searchInput = document.getElementById("search-input");
    const refreshBtn = document.getElementById("refresh-btn");
    const statusMessageDoctor = document.getElementById('status-message-doctor');
    const statusMessagePatient = document.getElementById('status-message-patient');
    const statusMessageTimeAvailable = document.getElementById('status-message-time-available');
    // availableTimeSlotsDiv=document.getElementById("available-time-slots-div");




    const totalCountSpan = document.getElementById("total-count");
    const featureToggle = document.getElementById('id-toggle-appointment');
    const priorityAppointmentsBtn = document.getElementById("priority-appointments-btn");
    const specializationButton = document.getElementById("specialization-btn");
    const limit = document.getElementById("limit");
    const MostAppointmentsBtn = document.getElementById("most-appointments-doctors-btn");
    const limitAppointments = document.getElementById("limitAppointments");

    // date Filter Elements
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");
    const applyDateFilterBtn = document.getElementById("apply-date-filter-btn");
    const clearDateFilterBtn = document.getElementById("clear-date-filter-btn");
    const filteredCountDiv = document.getElementById("stats");
    const filteredCountValue = document.getElementById("total-count");
    const applySpecificDateFilterBtn = document.getElementById("apply-specific-date-filter-btn");
    const specificDateInput = document.getElementById("specific-date");
    const refreshDoctorsFilterListBtn = document.getElementById("refresh-doctors-filter-btn");
    const doctorIdFilterInput = document.getElementById("appointmentDoctorIdFilter");
    const statusMessageDoctorFilter = document.getElementById('status-message-doctor-filter');
    const mostBusyDayBtn = document.getElementById('most-busy-day-btn');
    const minDurationInput= document.getElementById('min-duration');
    const maxDurationInput= document.getElementById('max-duration');
    const durationBtn= document.getElementById("duration-btn");
    const canceledBtn= document.getElementById("canceled-appointments-btn" );//
    //statics
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error-message');
    const errorDetail = document.getElementById('error-detail');
    const statsGrid = document.getElementById('stats-grid');
  
//     // ===============================
//     // API Configuration
//     // ===============================
    const API_URL = "http://localhost:8080/appointments";
    const API_URL_PATIENTS = "http://localhost:8080/patients";
    const API_URL_TO_GET_DOCTORS = "http://localhost:8080/doctors";
    const API_URL_PRIORITY = "http://localhost:8080/appointments/priority";
    const API_URL_UPCOMING = "http://localhost:8080/appointments/upcoming";
    const API_URL_STATISTICS = "http://localhost:8080/appointments/statistics-by-status";
    const API_URL_DATE_RANGE = "http://localhost:8080/appointments/date-range";
    const API_URL_DAILY = "http://localhost:8080/appointments/daily-schedule";
    const API_URL_AVAILABLE_SLOTS = "http://localhost:8080/appointments/available-slots";
    const API_URL_MOST_BUSY_DAY = "http://localhost:8080/appointments/most-busy-day";
    const API_URL_DURATION_RANGE = "http://localhost:8080/appointments/duration-range";
    const API_URL_CANCELLED_REPORT = "http://localhost:8080/appointments/cancelled-report";


    const SPECIALIZATION_API_URL_MAP = "http://localhost:8080/doctors/by-specialization-map";
    const TOP_RATED_API_URL = "http://localhost:8080/doctors/top-rated";
    const EXPERIENCE_API_URL_RANGE = "http://localhost:8080/doctors/experience-range";
    const MOST_APPOINTMENTS_API_URL = "http://localhost:8080/doctors/most-appointments";
    const AVERAGE_RATING_BY_SPEC_API_URL = "http://localhost:8080/doctors/average-rating-by-spec";
    const SEARCH_API_URL_NAME = "http://localhost:8080/doctors/search";

    // ===============================
    // State
    // ===============================
    let allappointments = [];
    let alldoctors = [];
    let allTimes = [];
    let allpatients=[];
    let groupedData = [];
    let currentExperienceFilter = null;
    let appointmentByName=[];

    // ===============================
    // Functions
    // ===============================

      const fetchAndRenderAppointments = async () => {
      featureToggle.checked = false; 
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        allappointments = await response.json();
        console.log("Fetched all appointments:", allappointments);
        renderTable(allappointments);
        updateStats();
        loadDashboard();
      } catch (error) {
        console.error("Error fetching appointments:", error);
        appointmentsTableBody.innerHTML = `
            <tr>
              <td colspan="10" style="text-align:center; color: red;">
                ❌ שגיאה בטעינת הנתונים מהשרת.
                ודא ש-Spring Boot רץ על http://localhost:8080
              </td>
            </tr>`;
      }
    };
    const handleFormSubmit = async (event) => {
        console.log("timeInput value before conversion:", timeInput.value);
        const dateFormat=convertToYYYYMMDD(dateInput.value.trim());
        // const timeFormat=convertToHHMM(timeInput.value.trim());
        const timeFormat=timeInput.value.trim();
        console.log("Converted Date:", dateFormat, "Converted Time:", timeFormat);
        const convertDuration=convertDurationToConstant(durationInput.value.trim());  
        event.preventDefault();
        console.log("Form submission initiated.",dateFormat);
        const appointmentData = {
          doctorId: doctorIdInput.value.trim(),
          patientId: patientIdInput.value.trim(),
          appointmentDate: dateFormat,
          appointmentTime: timeFormat,
          status: statusInput.value.trim(),
          duration: convertDuration,
          priority: priorityInput.value.trim(),
          notes: notesInput.value.trim()
        };
        console.log("Prepared appointment data for submission:", appointmentData);
    
        const appointmentId = appointmentIdInput.value;
        console.log("Submitting appointment data:", appointmentData, "ID:", appointmentId);
        try {
          const method = appointmentId ? "PUT" : "POST";
          const url = appointmentId ? `${API_URL}/${appointmentId}` : API_URL;
    
          const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(appointmentData),
          });
              console.log("Submitting to URL:",response );
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "שגיאה בשמירת התור");
          }
    
          resetForm();
          await fetchAndRenderAppointments();
          alert(appointmentId ? "✅ התור עודכן בהצלחה!" : "✅ התור נוסף בהצלחה!");
        //   loadDashboard();
        } catch (error) {
          console.error("Error submitting form:", error);
          alert(`❌ שגיאה: ${error.message}`);
        }
      };

    const getAllDoctors = async () => {
        try {
            const response = await fetch(API_URL_TO_GET_DOCTORS);
            console.log("Fetching all doctors from:", API_URL_TO_GET_DOCTORS);
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            alldoctors = await response.json(); 
            console.log("Fetched all doctors:", alldoctors);
            return alldoctors;
        } catch (error) {
            console.error("Error fetching doctors:", error);
            return [];
        }
    };
    const getAllPatients = async () => {
        try {
            const response = await fetch(API_URL_PATIENTS);
            console.log("Fetching all patients from:", API_URL_PATIENTS);
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            allpatients = await response.json(); 
            console.log("Fetched all patients:", allpatients);
            return allpatients;
        } catch (error) {
            console.error("Error fetching patients:", error);
            return [];
        }
    };
    
    const initDoctorsDropdown= async () => {
        // A. Set Loading State
        doctorIdInput.innerHTML = `<option selected disabled>${"...טוען רופאים"}</option>`;
        doctorIdInput.disabled = true;
        statusMessageDoctor.textContent = "טוען נתונים מהשרת...";
        statusMessageDoctor.classList.remove('text-green-500', 'text-red-500');
        statusMessageDoctor.classList.add('text-indigo-600');
    
        try {
            await getAllDoctors(); 
            
            const doctorsData = alldoctors; 
             console.log("Doctors data for dropdown:", doctorsData);
            // C. Success: Render the data
            renderDropdownForDoctor(doctorsData);

    
        } catch (error) {
            // D. Error: Display a meaningful error to the user
            doctorIdInput.innerHTML = `<option selected disabled>שגיאה בטעינה</option>`;
            statusMessageDoctor.textContent = `שגיאה: ${error.message}`;
            statusMessageDoctor.classList.remove('text-indigo-600', 'text-green-500');
            statusMessageDoctor.classList.add('text-red-500');
            console.error("Error fetching doctors:", error);
        } finally {
            // E. Cleanup and enable interaction
            doctorIdInput.disabled = false;
        }
    }   
    function renderDropdownForDoctor(doctors) {
        console.log("Rendering doctors dropdown with data:", doctors);
        let optionsAdded = 0; 
        
        // 1. Clear any existing content
        doctorIdInput.innerHTML = '';
    
        // 2. Add the default placeholder/selection prompt
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "בחר רופא/ה";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        doctorIdInput.appendChild(defaultOption);
    
        // 3. Add the actual data options
        doctors.forEach(doctor => {

            if (typeof doctor== 'object' && doctor !== null && doctor.firstName) {
                const option = document.createElement('option');
                option.value = doctor.id || doctor.firstName; 
                option.textContent = doctor.id+" ("+doctor.firstName+" "+doctor.lastName+")";
                doctorIdInput.appendChild(option); 
                optionsAdded++;
            } else {
                console.warn("Skipping invalid doctor data format:", doctor);
            }
        });
    
        // 4. Update status
        if (optionsAdded > 0) {
            statusMessageDoctor.textContent = `הטעינה הושלמה בהצלחה. נמצאו ${optionsAdded} רופאים.`;
            statusMessageDoctor.classList.remove('text-indigo-600', 'text-red-500');
            statusMessageDoctor.classList.add('text-green-500');
        } else {
             statusMessageDoctor.textContent = "אזהרה: לא נמצאו רופאים להצגה.";
            statusMessageDoctor.classList.remove('text-indigo-600', 'text-green-500');
            statusMessageDoctor.classList.add('text-red-500');
        }
    }
    const initPatientsDropdown= async () => {
        // A. Set Loading State
        patientIdInput.innerHTML = `<option selected disabled>${"...טוען מטופלים"}</option>`;
        patientIdInput.disabled = true;
        statusMessagePatient.textContent = "טוען נתונים מהשרת...";
        statusMessagePatient.classList.remove('text-green-500', 'text-red-500');
        statusMessagePatient.classList.add('text-indigo-600');

        try {
            await getAllPatients(); 
            
            const patientsData = allpatients; 
            console.log("patients data for dropdown:", patientsData);
            // C. Success: Render the data
            renderDropdownForPatients(patientsData);

        } catch (error) {
            // D. Error: Display a meaningful error to the user
            patientIdInput.innerHTML = `<option selected disabled>שגיאה בטעינה</option>`;
            statusMessagePatient.textContent = `שגיאה: ${error.message}`;
            statusMessagePatient.classList.remove('text-indigo-600', 'text-green-500');
            statusMessagePatient.classList.add('text-red-500');
            console.error("Error fetching patients:", error);
        } finally {
            // E. Cleanup and enable interaction
            patientIdInput.disabled = false;
        }
    }   
    function renderDropdownForPatients(patients) {
        console.log("Rendering patients dropdown with data:", patients);
        let optionsAdded = 0; 
        
        // 1. Clear any existing content
        patientIdInput.innerHTML = '';

        // 2. Add the default placeholder/selection prompt
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "בחר מטופל";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        patientIdInput.appendChild(defaultOption);

        // 3. Add the actual data options
        patients.forEach(patient => {

            if (typeof patient== 'object' && patient !== null && patient.firstName) {
                const option = document.createElement('option');
                option.value = patient.id || patient.firstName; 
                option.textContent = patient.id+" ("+patient.firstName+" "+patient.lastName+")";
                patientIdInput.appendChild(option); 
                optionsAdded++;
            } else {
                console.warn("Skipping invalid patient data format:", patient);
            }
        });

        // 4. Update status
        if (optionsAdded > 0) {
            statusMessagePatient.textContent = `הטעינה הושלמה בהצלחה. נמצאו ${optionsAdded} מטופלים.`;
            statusMessagePatient.classList.remove('text-indigo-600', 'text-red-500');
            statusMessagePatient.classList.add('text-green-500');
        } else {
            statusMessagePatient.textContent = "אזהרה: לא נמצאו מטופלים להצגה.";
            statusMessagePatient.classList.remove('text-indigo-600', 'text-green-500');
            statusMessagePatient.classList.add('text-red-500');
        }
    }
    const initDoctorsDropdownForFilter= async () => {
        // A. Set Loading State
        doctorIdFilterInput.innerHTML = `<option selected disabled>${"...טוען רופאים"}</option>`;
        doctorIdFilterInput.disabled = true;
        statusMessageDoctorFilter.textContent = "טוען נתונים מהשרת...";
        statusMessageDoctorFilter.classList.remove('text-green-500', 'text-red-500');
        statusMessageDoctorFilter.classList.add('text-indigo-600');
    
        try {
            await getAllDoctors(); 
            
            const doctorsData = alldoctors; 
             console.log("Doctors data for dropdown:", doctorsData);
            // C. Success: Render the data
            renderDropdownForDoctorFilter(doctorsData);
    
        } catch (error) {
            // D. Error: Display a meaningful error to the user
            doctorIdFilterInput.innerHTML = `<option selected disabled>שגיאה בטעינה</option>`;
            statusMessageDoctorFilter.textContent = `שגיאה: ${error.message}`;
            statusMessageDoctorFilter.classList.remove('text-indigo-600', 'text-green-500');
            statusMessageDoctorFilter.classList.add('text-red-500');
            console.error("Error fetching doctors:", error);
        } finally {
            // E. Cleanup and enable interaction
            doctorIdFilterInput.disabled = false;
        }
    }  
    function renderDropdownForDoctorFilter(doctors) {
        console.log("Rendering doctors dropdown with data:", doctors);
        let optionsAdded = 0; 
        
        // 1. Clear any existing content
        doctorIdFilterInput.innerHTML = '';
    
        // 2. Add the default placeholder/selection prompt
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "בחר רופא/ה";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        doctorIdFilterInput.appendChild(defaultOption);
    
        // 3. Add the actual data options
        doctors.forEach(doctor => {

            if (typeof doctor== 'object' && doctor !== null && doctor.firstName) {
                const option = document.createElement('option');
                option.value = doctor.id || doctor.firstName; 
                option.textContent = doctor.id+" ("+doctor.firstName+" "+doctor.lastName+")";
                doctorIdFilterInput.appendChild(option); 
                optionsAdded++;
            } else {
                console.warn("Skipping invalid doctor data format:", doctor);
            }
        });
    
        // 4. Update status
        if (optionsAdded > 0) {
            statusMessageDoctorFilter.textContent = `הטעינה הושלמה בהצלחה. נמצאו ${optionsAdded} רופאים.`;
            statusMessageDoctorFilter.classList.remove('text-indigo-600', 'text-red-500');
            statusMessageDoctorFilter.classList.add('text-green-500');
        } else {
            statusMessageDoctorFilter.textContent = "אזהרה: לא נמצאו רופאים להצגה.";
            statusMessageDoctorFilter.classList.remove('text-indigo-600', 'text-green-500');
            statusMessageDoctorFilter.classList.add('text-red-500');
        }
    } 

    const initTimesDropdown= async () => {
        // A. Set Loading State
        timeInput.innerHTML = `<option selected disabled>${"...טוען זמנים"}</option>`;
        timeInput.disabled = true;
        statusMessageTimeAvailable.textContent = "טוען נתונים מהשרת...";
        statusMessageTimeAvailable.classList.remove('text-green-500', 'text-red-500');
        statusMessageTimeAvailable.classList.add('text-indigo-600');
    
        try {
            await getAvailableTimeSlots(doctorIdInput.value); 
            
            const times = allTimes; 
             console.log("Times data for dropdown:", times);
            // C. Success: Render the data
            renderTimeDropdown(times);
    
        } catch (error) {
            // D. Error: Display a meaningful error to the user
            timeInput.innerHTML = `<option selected disabled>שגיאה בטעינה</option>`;
            statusMessageTimeAvailable.textContent = `שגיאה: ${error.message}`;
            statusMessageTimeAvailable.classList.remove('text-indigo-600', 'text-green-500');
            statusMessageTimeAvailable.classList.add('text-red-500');
            console.error("Error fetching times:", error);
        } finally {
            // E. Cleanup and enable interaction
            timeInput.disabled = false;
        }
    }  
    function renderTimeDropdown(times) {
        console.log("Rendering times dropdown with data:", times);
        let optionsAdded = 0; 
        
        // 1. Clear any existing content
        timeInput.innerHTML = '';
    
        // 2. Add the default placeholder/selection prompt
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "בחר זמן";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        timeInput.appendChild(defaultOption);
    
        // 3. Add the actual data options
        times.forEach(time => {

            if (typeof time=== 'string' && time !== null) {
                const option = document.createElement('option');
                option.value = time; 
                option.textContent = time;
                timeInput.appendChild(option); 
                optionsAdded++;
            } else {
                console.warn("Skipping invalid time data format:", time);
            }
        });
    
        // 4. Update status
        if (optionsAdded > 0) {
            statusMessageDoctorFilter.textContent = `הטעינה הושלמה בהצלחה. נמצאו ${optionsAdded} רופאים.`;
            statusMessageDoctorFilter.classList.remove('text-indigo-600', 'text-red-500');
            statusMessageDoctorFilter.classList.add('text-green-500');
        } else {
            statusMessageDoctorFilter.textContent = "אזהרה: לא נמצאו רופאים להצגה.";
            statusMessageDoctorFilter.classList.remove('text-indigo-600', 'text-green-500');
            statusMessageDoctorFilter.classList.add('text-red-500');
        }
    } 
 initDoctorsDropdown();
 initPatientsDropdown();
 initDoctorsDropdownForFilter();
 const renderTable = (appointments) => {
    appointmentsTableBody.innerHTML = "";
  if (appointments.length === 0) {
    appointmentsTableBody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align:center;">
            📋 אין רופא/הים במערכת. הוסף רופא/ה ראשון!
          </td>
        </tr>`;
    return;
  }


  appointments.forEach((appointment) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHTML(appointment.id)}</td>
        <td>${escapeHTML(appointment.doctorId)}</td>
        <td>${escapeHTML(appointment.patientId)}</td>
        <td>${appointment.appointmentDate || "-"}</td>
        <td>${appointment.appointmentTime || "-"}</td>
        <td>${appointment.status || "-"}</td>      
        <td>${escapeHTML(appointment.duration) || "-"}</td>
        <td>${escapeHTML(appointment.priority) || "-"}</td>
        <td>${escapeHTML(appointment.notes) || "-"}</td>
      <td class="actions-cell">
          <button class="edit-btn" data-id="${appointment.id}">✏️ עריכה</button>
          <button class="delete-btn" data-id="${appointment.id}">🗑️ מחיקה</button>
          <button class="cancel-btn" data-id="${appointment.id}">❌ ביטול</button>
          <button class="complete-btn" data-id="${appointment.id}">✅ הושלם</button>
        </td>`;
        appointmentsTableBody.appendChild(row);
  });
};
const updateFilteredCount = (count) => {
  if (currentExperienceFilter || searchInput.value) {
    filteredCountDiv.style.display = "block";
    filteredCountValue.textContent = count;
  } else {
    filteredCountDiv.style.display = "none";
  }
};

 function convertToYYYYMMDD(dateString) {
    console.log("Converting date string:", dateString);
    if (!dateString || typeof dateString !== 'string') {
        return '';
    }
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
    }
    const parts = dateString.split('/');
    if (parts.length === 3) {
        const mm = parts[0].padStart(2, '0');
        const dd = parts[1].padStart(2, '0');
        const yyyy = parts[2];
        if (yyyy.length === 4 && mm.length === 2 && dd.length === 2) {
             return `${yyyy}-${mm}-${dd}`;
        }
    }
    console.warn(`Could not convert date string: ${dateString}. Returning as is.`);
    console.log("Converted date string:", dateString);
    return dateString;
}
// /**
//  * ממיר סוגי זמן שונים (Date, ISO string, AM/PM)
//  * למחרוזת 24 שעות בפורמט "HH:MM".
//  * @param {Date | string | object} timeInput - הקלט שיש להמיר.
//  * @returns {string} הזמן בפורמט "HH:MM".
//  */
// function convertToHHMM(timeString) {
// if (!timeString) return '';

// // אנו יוצרים אובייקט Date זמני כדי שהדפדפן יטפל בפירוש AM/PM
// const dummyDateString = `01/01/2000 ${timeString}`; 
// const dateObj = new Date(dummyDateString);

// // בדיקה אם הפירוש נכשל
// if (isNaN(dateObj.getTime())) {
//     // אם זה כבר HH:MM תקין (וזו גם ברירת המחדל של <input type="time">), נחזיר אותו.
//     if (timeString.match(/^\d{2}:\d{2}$/)) {
//         return timeString;
//     }
//     return ''; 
// }

// // מוציא את השעות והדקות בפורמט 24 שעות וממלא באפסים מובילים
// const hours = String(dateObj.getHours()).padStart(2, '0');
// const minutes = String(dateObj.getMinutes()).padStart(2, '0');

// return `${hours}:${minutes}`;
// }
function convertDurationToConstant(durationMinutes) {
const duration = Number(durationMinutes); 
const durationMap = {
    15: "FIFTEEN_MINUTES",
    30: "THIRTY_MINUTES",
    45: "FORTY_FIVE_MINUTES",
    60: "SIXTY_MINUTES"
};

const result = durationMap[duration];
if (result) {
    return result;
} else {
    console.warn(`Invalid duration input: ${durationMinutes}. Expected 15, 30, 45, or 60.`);
    return ""; // החזר ערך בטוח
}
}
const cancelAppointmentfunction=async(appointmentId)=>{
    try {
        const response = await fetch(`${API_URL}/${appointmentId}/cancel`, {
          method: "PUT",
        });
    
        if (!response.ok) {
          throw new Error("שגיאה בביטול התור");
        }
    
        await fetchAndRenderAppointments();
        alert("✅ התור בוטל בהצלחה!");
      } catch (error) {
        console.error("Error cancelling appointment:", error);
        alert("❌ שגיאה בביטול התור");
      }
}
const completeAppointmentfunction=async(appointmentId)=>{
    try {
        const response = await fetch(`${API_URL}/${appointmentId}/complete`, {
            method: "PUT",
        });
    
        if (!response.ok) {
            throw new Error("שגיאה בסימון התור כהושלם");
        }
    
        await fetchAndRenderAppointments();
        alert("✅ התור סומן כהושלם בהצלחה!");
        } catch (error) {
        console.error("Error completing appointment:", error);
        alert("❌ שגיאה בסימון התור כהושלם");
        }
}

const getAppointmentsByPriority = async (priority) => {
        try {
            const response = await fetch(`${API_URL_PRIORITY}/${priority}`);
            console.log("Fetching appointments by priority from:", API_URL_PRIORITY);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const appointments = await response.json();
            console.log("Fetched appointments by priority:", appointments);
            renderTable(appointments);
            updateFilteredCount(appointments.length);
            return appointments;
        } catch (error) {
            console.error("Error fetching appointments by priority:", error);
            renderTable([]);
            updateFilteredCount(0);
            return [];
        }
};
const getUpcomingAppointments = async () => {
        try {
            if(upcomingFilterInput.value===""){
                fetchAndRenderAppointments();
                return [];
            }
            const response = await fetch(`${API_URL_UPCOMING}?days=${upcomingFilterInput.value}`);
            console.log("Fetching upcoming appointments from:", API_URL_UPCOMING+"?days="+upcomingFilterInput.value);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const appointments = await response.json();
            console.log("Fetched upcoming appointments:", appointments);
            renderTable(appointments);
            updateFilteredCount(appointments.length);
            return appointments;
        } catch (error) {
            console.error("Error fetching upcoming appointments:", error);
            renderTable([]);
            updateFilteredCount(0);
            return [];
        }
};
const getAppointmentsStatisticsByStatus = async () => {
        try {
            const response = await fetch(API_URL_STATISTICS);
            console.log("Fetching appointment statistics by status from:", API_URL_STATISTICS);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const stats = await response.json();
            console.log("Fetched appointment statistics by status:", stats);
            return stats;
        } catch (error) {
            console.error("Error fetching appointment statistics by status:", error);
            return {};
        }
};
    // const getSpecializations = async () => {
    //     try {
    //         const response = await fetch(API_URL_SPECIALIZATIONS);
    //         console.log("Fetching specializations from: getSpecializations()", API_URL_SPECIALIZATIONS);
    //         if (!response.ok) {
    //         throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         const specializations = await response.json();
    //         console.log( specializations);
    //         return specializations;
    //     } catch (error) {
    //         console.error("Error fetching specializations:", error);
    //         return [];
    //     }
    //     }
 

        

//     const getDoctorsByExperienceRange = async (minExperience, maxExperience) => {
//       try {
//         const response = await fetch(
//           `${EXPERIENCE_API_URL_RANGE}?min=${minExperience}&max=${maxExperience}`
//         );
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const doctors = await response.json();
//         return doctors;
//       } catch (error) {
//         console.error("Error fetching doctors by experience range:", error);
//         return [];
//       }
//     };
//     const getAverageRatingBySpecialization = async () => {
//         console.log("Fetching average rating by specialization from:");
//         try {
//             const response = await fetch(AVERAGE_RATING_BY_SPEC_API_URL);
//             if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const ratings = await response.json();
//             console.log("Average Ratings by Specialization:", ratings);
//             return ratings;
//         } catch (error) {
//             console.error("Error fetching average rating by specialization:", error);
//             return null;
//         }
//         };
//     const getDoctorsWithMostAppointments = async () => {
//         const lmt = limitAppointments.value;
//         try {
//             const response = await fetch(`${MOST_APPOINTMENTS_API_URL}?limit=${lmt}`);
//             if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const doctors = await response.json();
//             console.log("Doctors with Most Appointments:", doctors);
//             renderTable(doctors);
//             updateFilteredCount(doctors.length);
//             return doctors;
//         } catch (error) {
//             console.error("Error fetching Doctors with most appointments:", error);
//             return [];
//         }
    
//         };
//     const getdoctorById=async (id) => {
//       try {
//         const response = await fetch(
//           `${API_URL}/${id}`
//         );
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const doctor = await response.json();
//         return doctor;
//       } catch (error) {
//         console.error("Error fetching doctor by ID:", error);
//         return null;
//       }
//     }

//     const getDoctorsBySpecializationMap=async(value)=> {
//       try {
//         const response = await fetch(SPECIALIZATION_API_URL_MAP);
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//          groupedData = await response.json();
//         console.log("Grouped Data:", groupedData[value]);
//         renderTable(groupedData[value] || []);
//         return groupedData;
//       } catch (error) {
//         console.error("Error fetching doctors grouped by experience group:", error);
//         return null;
//       }
    
//   };
const renderStatistics = (stats,flag) => {
    if(flag===1){
        document.getElementById('countScheduled').textContent = stats["SCHEDULED"] ||0;
        document.getElementById('countCompleted').textContent = stats["COMPLETED"]||0;
        document.getElementById('countCanceled').textContent = stats["CANCELLED"]||0;
    }
    else{
        document.getElementById('totalCancelled').textContent = stats["totalCancelled"] ||0;
        console.log("Rendering cancelledByDoctor stats:",  stats["cancelledByPatient"].length);
        // console.log("Rendering cancelledByPatient stats:", stats["cancelledByPatient"].length);
        document.getElementById('cancelledByDoctor').textContent =Object.keys(stats["cancelledByDoctor"] || {}).length;
        document.getElementById('cancelledByPatient').textContent = Object.keys(stats["cancelledByPatient"] || {}).length;
    }
      

      statsGrid.classList.remove('hidden');
};
  
const loadDashboard = async () => {
      loadingDiv.classList.remove('hidden');
      errorDiv.classList.add('hidden');
      statsGrid.classList.add('hidden');
  
      try {
          const stats = await getAppointmentsStatisticsByStatus();
          const statsCanceled = await getCancelledAppointmentsReport();
          console.log("Dashboard statsCanceled:", statsCanceled);
          if(stats||statsCanceled){
            if (stats) {
                renderStatistics(stats,1);
            } 
                if (statsCanceled) {
                renderStatistics(statsCanceled,2);
            }
        }  
          else {
              throw new Error("Received empty or invalid data from the service.");
          }
      } catch (error) {
          errorDetail.textContent = `Could not load data. ${error.message}`;
          errorDiv.classList.remove('hidden');
          console.error(error);
      } finally {
          loadingDiv.classList.add('hidden');
      }
};
const getAppointmentsByDateRange= async () => {
        const startDate = convertToYYYYMMDD(startDateInput.value.trim());
        const endDate = convertToYYYYMMDD(endDateInput.value.trim());
        if(startDate==="" || endDate===""){
            alert("❌ אנא הזן תאריכים תקינים לטווח התאריכים.");
            fetchAndRenderAppointments();
            return [];
        }
        try {
            const response = await fetch(`${API_URL_DATE_RANGE}?start=${startDate}&end=${endDate}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const appointments = await response.json();
            console.log("Appointments in Date Range:", appointments);
            renderTable(appointments);
            updateFilteredCount(appointments.length);
            return appointments;
        } catch (error) {
            console.error("Error fetching appointments by date range:", error);
            return [];
        }
};
const getDailySchedule =  async (doctorId,date) => {
    // const day=convertToYYYYMMDD(specificDateInput.value.trim());
    const day=date;
    try {
        const response = await fetch(`${API_URL_DAILY}/${doctorId}?date=${day}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const appointments = await response.json();
        console.log("Daily Schedule for Doctor ID", doctorId, ":", appointments);
        renderTable(appointments);
        updateFilteredCount(appointments.length);
        return appointments;
    } catch (error) {
        console.error("Error fetching daily schedule:", error);
        return [];
    }
};
const getAvailableTimeSlots= async (doctorId) => {
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
        // const day=convertToYYYYMMDD(specificDateInput.value.trim());
        const day = convertToYYYYMMDD(specificDateInput.value.trim())||formattedDate;
    try {
        const response = await fetch(`${API_URL_AVAILABLE_SLOTS}/${doctorId}?date=${day}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
         allTimes = await response.json();
        console.log("Available Time Slots for Doctor ID", doctorId, "on", day, ":", allTimes);
        return allTimes;
    } catch (error) {
        console.error("Error fetching available time slots:", error);
        return [];
    }
};
const getMostBusyDays = async () => {
        try {
            const response = await fetch(API_URL_MOST_BUSY_DAY);
            console.log("Fetching most busy days from:", API_URL_MOST_BUSY_DAY);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const busyDays = await response.text();
            console.log("Fetched most busy days:", busyDays);
            const busyDaysToRender= allappointments.filter(appointment => busyDays.includes(appointment.appointmentDate));
            renderTable(busyDaysToRender);
            updateFilteredCount(busyDaysToRender.length);
            return busyDaysToRender;
        } catch (error) {
            console.error("Error fetching most busy days:", error);
            return [];
        }
};
const getAppointmentsByDurationRange = async () => {
        const minDuration = parseInt(minDurationInput.value) || 15;
        const maxDuration = parseInt(maxDurationInput.value) || 60;
        if(minDuration<0 || maxDuration<0|| minDuration>60|| maxDuration>60){
            alert("❌ אנא הזן ערכים תקינים לטווח משך התור.");
            fetchAndRenderAppointments();
            return [];
        }
        try {
            const response = await fetch(
            `${API_URL_DURATION_RANGE}?min=${minDuration}&max=${maxDuration}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const appointments = await response.json();
            console.log("Appointments by Duration Range:", appointments);
            renderTable(appointments);
            updateFilteredCount(appointments.length);
            return appointments;
        } catch (error) {
            console.error("Error fetching appointments by duration range:", error);
            return [];
        }
};
const getCancelledAppointmentsReport= async () => {
        try {
            const response = await fetch(API_URL_CANCELLED_REPORT);
            console.log("Fetching cancelled appointments report from:", API_URL_CANCELLED_REPORT);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const cancelledAppointments = await response.json();
            console.log("Fetched cancelled appointments report:", cancelledAppointments);
            return cancelledAppointments;
        } catch (error) {
            console.error("Error fetching cancelled appointments report:", error);
            return [];
        }   
};
const getAppointmentById=async (id) => {
        try {
            const response = await fetch(
            `${API_URL}/${id}`
            );
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            const appointment = await response.json();
            return appointment;
        } catch (error) {
            console.error("Error fetching appointment by ID:", error);
            return null;
        }
};        
 window.onload = loadDashboard;


    
    const applyFilters = async () => {
      let filteredAppointments = [...allappointments];
  
      // Check for ID-only lookup feature
      if (featureToggle.checked) {
          const appointmentId = searchInput.value.trim();
          if (appointmentId) {
              const appointment = await getAppointmentById(appointmentId);
              filteredAppointments = appointment && appointment.id ? [appointment] : [];
          } else {
              // If toggle is checked but search is empty, show nothing
              renderTable(allappointments);
              updateFilteredCount(allappointments.length);
          }
      }     
      renderTable(filteredAppointments);
      updateFilteredCount(filteredAppointments.length);
    };
  
 
  
    const applyExperienceFilter = async () => {
      const minExperience = parseInt(minExperienceInput.value) || 0;
      const maxExperience = parseInt(maxExperienceInput.value) || 150;
      console.log("Applying experience filter:", { minExperience, maxExperience });
      featureToggle.checked=false; 
      if (minExperience > maxExperience) {
        alert("❌ נסיון בשנים מינימלי לא יכול להיות גדול מנסיון בשנים מקסימלי");
        return;
      }
  
      currentExperienceFilter = { min: minExperience, max: maxExperience };
      await applyFilters();
  
      // Visual feedback
      applyExperienceFilterBtn.textContent = "✓ סינון פעיל";
      setTimeout(() => {
        applyExperienceFilterBtn.textContent = "החל סינון";
      }, 1500);
    };
  
const clearDateFilter = async () => {
    currentDateFilter = null;
    startDateInput.value = "";
    endDateInput.value = "";
    await fetchAndRenderAppointments();

    // Visual feedback
    clearDateFilterBtn.textContent = "✓ סינון נוקה";
    setTimeout(() => {
    clearDateFilterBtn.textContent = "נקה סינון";
    }, 1500);
};
const populateFormForEdit = (appointment) => {
        appointmentIdInput.value = appointment.id;
        doctorIdInput.value=appointment.doctorId,
        patientIdInput.value=appointment.patientId,
        dateInput.value=appointment.appointmentDate,
        timeInput.value =appointment.appointmentTime,
        statusInput.value=appointment.status,
        durationInput.value=appointment.duration,
        priorityInput.value=appointment.priority,
        notesInput.value=appointment.notes|| "",

      submitButton.textContent = "עדכן תור";
      submitButton.classList.remove("btn-primary");
      submitButton.classList.add("edit-btn-appointment");
      cancelEditBtn.style.display = "inline-block";
      loadDashboard();

      window.scrollTo({ top: 0, behavior: "smooth" });
};
  
const resetForm = () => {
    appointmentForm.reset();
    appointmentIdInput.value = "";
    doctorIdInput.value="";
    patientIdInput.value="";
    dateInput.value="";
    timeInput.value ="";
    statusInput.value="";
    durationInput.value="";
    priorityInput.value="";
    notesInput.value="";
    submitButton.textContent = "הוסף תור";
    submitButton.classList.remove("edit-btn-doctor");
    submitButton.classList.add("btn-primary");
    cancelEditBtn.style.display = "none";
};
  
const handleDelete = async (appointmentId) => {
    if (!confirm("❓ האם אתה בטוח שברצונך למחוק את התור?")) {
    return;
    }

    try {
    const response = await fetch(`${API_URL}/${appointmentId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("שגיאה במחיקת התור");
    }

    await fetchAndRenderAppointments();
    alert("✅ התור נמחק בהצלחה!");
    loadDashboard();

    } catch (error) {
    console.error("Error deleting appointment:", error);
    alert("❌ שגיאה במחיקת התור");
    }
};
  
    const handleCheckboxChange = async (checkboxElement) => {
          featureToggle.checked = true; 
      const isChecked = checkboxElement.checked;
      const appointmentId = searchInput.value.trim(); 
  
      // Log the action to the console for debugging
      console.log(`Checkbox ID: ${checkboxElement.id} | New State: ${isChecked ? 'Checked' : 'Unchecked'}`);
      
  
      if (isChecked) {
          if (!appointmentId) {
              alert("⚠️ אנא הזן מספר תור בשדה החיפוש כדי לבצע בדיקה.", 'warning');
              await applyFilters(); // Reset to normal
              return;
          }
  
          alert(`Status:  בודק רשומה של תור לפי מספר מזהה ${appointmentId}...`);
  
          // Correct asynchronous fetch and wait for the result
          const appointment = await getAppointmentById(appointmentId);
  
          if (appointment && appointment.id) {
              console.log(`✅ תור ID ${appointmentId} נמצא:`, appointment);
              alert(`✅ תור ID ${appointment.id} נמצא! (הנתונים המלאים נרשמו לקונסול)`, 'success');
          } else {
              console.error(`❌ תור ID ${appointmentId} לא נמצא.`);
              alert(`❌ תור ID ${appointmentId} לא נמצא.`, 'error');
              appointmentToRender = [];
          }
      } else {
          // Handle unchecked state
          alert("Status: בדיקת רשומות ID מושבתת.", 'error');
      }
    // Re-apply all filters based on the new toggle state
    await applyFilters();
  };

const updateStats = () => {
    totalCountSpan.textContent = allappointments.length;
};
const escapeHTML = (str) => {
    if (str === null || str === undefined) return "";
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
};
    // ===============================
    // Event Delegation for Edit/Delete
    // ===============================
    appointmentsTableBody.addEventListener("click", (event) => {
      if (event.target.classList.contains("edit-btn")) {
        const appointmentId = event.target.dataset.id;
        const appointment = allappointments.find((p) => p.id == appointmentId);
        if (appointment) {
          populateFormForEdit(appointment);
        }
      }
  
      if (event.target.classList.contains("delete-btn")) {
        const appointmentId = event.target.dataset.id;
        handleDelete(appointmentId);
      }

      if (event.target.classList.contains("cancel-btn")) {
        const appointmentId = event.target.dataset.id;
        cancelAppointmentfunction(appointmentId);
      }
      if (event.target.classList.contains("complete-btn")) {
        const appointmentId = event.target.dataset.id;
        completeAppointmentfunction(appointmentId);
      }
    });
  
    // ===============================
    // Event Listeners
    // ===============================
    appointmentForm.addEventListener("submit", handleFormSubmit);
    cancelEditBtn.addEventListener("click", resetForm);
    refreshBtn.addEventListener("click", fetchAndRenderAppointments);
    searchInput.addEventListener("input",  async () => {await applyFilters();});
    // Experience Filter Event Listeners
    applyDateFilterBtn.addEventListener("click", async () => {await getAppointmentsByDateRange() ;});
    clearDateFilterBtn.addEventListener("click", clearDateFilter);
    applySpecificDateFilterBtn.addEventListener("click", async () => {await getDailySchedule(doctorIdFilterInput.value,specificDateInput.value.trim()) ;});
    mostBusyDayBtn.addEventListener("click", async () => {await getMostBusyDays();});

    doctorIdInput.addEventListener("", async () => {await initDoctorsDropdown();});
    refreshDoctorsListBtn.addEventListener("click", async () => {await initDoctorsDropdown();});
    refreshPatientsListBtn.addEventListener("click", async () => {await initPatientsDropdown();});
    priorityAppointmentsBtn.addEventListener("click",async () => {await getAppointmentsByPriority(priorityFilterInput.value);});
    // specializationButton.addEventListener("click",async () => {await getDoctorsBySpecializationMap(specializationFilterInput.value);});
    upcomingFilterBtn.addEventListener("click",async () => {await getUpcomingAppointments();});
    refreshDoctorsFilterListBtn.addEventListener("click", async () => {await initDoctorsDropdown();});
    durationBtn.addEventListener("click", async () => {await getAppointmentsByDurationRange();});
    // canceledBtn.addEventListener("click", async () => {await getCancelledAppointmentsReport();});
    // Allow Enter key in experience inputs
    startDateInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyExperienceFilter();
      }
    });
  
    endDateInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyExperienceFilter();
      }
    });
    doctorIdInput.addEventListener("change", async () => {await initTimesDropdown();});
    featureToggle.addEventListener("change",  async () => {await handleCheckboxChange(featureToggle);});

    // ===============================
    // Initial Load
    // ===============================
    fetchAndRenderAppointments();

  });
  