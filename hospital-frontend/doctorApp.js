document.addEventListener("DOMContentLoaded", () => {
    // ===============================
    // DOM Elements
    // ===============================
    const doctorForm = document.getElementById("doctor-form");
    const doctorIdInput = document.getElementById("doctor-id");
    const firstNameInput = document.getElementById("doctorFirstName");
    const lastNameInput = document.getElementById("doctorLastName");
    const specializationInput = document.getElementById("specialization");
    const specializationFilterInput = document.getElementById("specialization-filter");
    const yearsOfExperienceInput = document.getElementById("yearsOfExperience");
    const phoneInput = document.getElementById("doctorPhoneNumber");
    const emailInput = document.getElementById("doctorEmail");
    const ratingInput = document.getElementById("rating");
    const submitButton = doctorForm.querySelector('button[type="submit"]');
    const statusMessage = document.getElementById('status-message');


    const cancelEditBtn = document.getElementById("cancel-edit-btn-doctor");
    const doctorsTableBody = document.getElementById("doctors-table-body");
    const searchInput = document.getElementById("search-input");
    const refreshBtn = document.getElementById("refresh-btn");

    const totalCountSpan = document.getElementById("total-count");
    const featureToggle = document.getElementById('id-toggle-doctor');
    const nameToggle = document.getElementById("name-toggle-doctor");
    const topRatedDoctorsBtn = document.getElementById("top-rated-doctors-btn");
    const specializationButton = document.getElementById("specialization-btn");
    const limit = document.getElementById("limit");
    const MostAppointmentsBtn = document.getElementById("most-appointments-doctors-btn");
    const limitAppointments = document.getElementById("limitAppointments");

    // experience Filter Elements
    const minExperienceInput = document.getElementById("min-year-experience");
    const maxExperienceInput = document.getElementById("max-year-experience");
    const applyExperienceFilterBtn = document.getElementById("apply-experience-filter-btn");
    const clearExperienceFilterBtn = document.getElementById("clear-experience-filter-btn");
    const filteredCountDiv = document.getElementById("stats");
    const filteredCountValue = document.getElementById("total-count");
  
    //statics
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error-message');
    const errorDetail = document.getElementById('error-detail');
    const statsGrid = document.getElementById('stats-grid');
  
//     // ===============================
//     // API Configuration
//     // ===============================
    const API_URL = "http://localhost:8080/doctors";
    const API_URL_SPECIALIZATIONS = "http://localhost:8080/doctors/specializations";

    const SPECIALIZATION_API_URL_MAP = "http://localhost:8080/doctors/by-specialization-map";
    const TOP_RATED_API_URL = "http://localhost:8080/doctors/top-rated";
    const EXPERIENCE_API_URL_RANGE = "http://localhost:8080/doctors/experience-range";
    const MOST_APPOINTMENTS_API_URL = "http://localhost:8080/doctors/most-appointments";
    const AVERAGE_RATING_BY_SPEC_API_URL = "http://localhost:8080/doctors/average-rating-by-spec";
    const SEARCH_API_URL_NAME = "http://localhost:8080/doctors/search";

    // ===============================
    // State
    // ===============================
    let alldoctors = [];
    let groupedData = [];
    let currentExperienceFilter = null;
    const doctorByName=[];
    // ===============================
    // Functions
    // ===============================
  
        const getSpecializations = async () => {
            try {
                const response = await fetch(API_URL_SPECIALIZATIONS);
                console.log("Fetching specializations from: getSpecializations()", API_URL_SPECIALIZATIONS);
                if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                }
                const specializations = await response.json();
                console.log( specializations);
                return specializations;
            } catch (error) {
                console.error("Error fetching specializations:", error);
                return [];
            }
            }
        function renderDropdown(specialties) {
            let optionsAdded = 0; 
            // const selectElement = document.getElementById('specialization' ); // Using 'specialization' as per your latest snippet
            // const statusMessage = document.getElementById('status-message');
            // 1. Clear any existing content
            specializationInput.innerHTML = '';

            // 2. Add the default placeholder/selection prompt
            const defaultOption = document.createElement('option');
            defaultOption.value = "";
            defaultOption.textContent = "בחר התמחות";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            specializationInput.appendChild(defaultOption);

            // 3. Add the actual data options
            specialties.forEach(specialty => {
                const option = document.createElement('option');
               // --- FIX: Check if the item is a String or an Object ---
            if (typeof specialty === 'string') {
                // 1. אם זה מחרוזת: השתמש במחרוזת גם כ-value וגם כטקסט
                option.value = specialty; 
                option.textContent = specialty;
                specializationInput.appendChild(option);
                optionsAdded++;
            } 
            else if (typeof specialty === 'object' && specialty !== null && specialty.name) {
                // 2. אם זה אובייקט (המבנה האידיאלי): השתמש במאפיינים id/name
                option.value = specialty.id || specialty.name; 
                option.textContent = specialty.name;
                specializationInput.appendChild(option);
                optionsAdded++;
            }
            specializationInput.appendChild(option);
            });

            // 4. Update status
            statusMessage.textContent = "הטעינה הושלמה בהצלחה.";
            statusMessage.classList.remove('text-indigo-600', 'text-red-500');
            statusMessage.classList.add('text-green-500');
        }
        function renderDropdownForFilter(specialties) {
            let optionsAdded = 0; 
            // const selectElement = document.getElementById("specialization-filter" ); 
            // const statusMessage = document.getElementById('status-message');
            // 1. Clear any existing content
            specializationFilterInput.innerHTML = '';

            // 2. Add the default placeholder/selection prompt
            const defaultOption = document.createElement('option');
            defaultOption.value = "";
            defaultOption.textContent = "בחר התמחות";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            specializationFilterInput.appendChild(defaultOption);

            // 3. Add the actual data options
            specialties.forEach(specialty => {
                const option = document.createElement('option');
               // --- FIX: Check if the item is a String or an Object ---
            if (typeof specialty === 'string') {
                // 1. אם זה מחרוזת: השתמש במחרוזת גם כ-value וגם כטקסט
                option.value = specialty; 
                option.textContent = specialty;
                specializationFilterInput.appendChild(option);
                optionsAdded++;
            } 
            else if (typeof specialty === 'object' && specialty !== null && specialty.name) {
                // 2. אם זה אובייקט (המבנה האידיאלי): השתמש במאפיינים id/name
                option.value = specialty.id || specialty.name; 
                option.textContent = specialty.name;
                specializationFilterInput.appendChild(option);
                optionsAdded++;
            }
            specializationFilterInput.appendChild(option);
            });

            // 4. Update status
            statusMessage.textContent = "הטעינה הושלמה בהצלחה.";
            statusMessage.classList.remove('text-indigo-600', 'text-red-500');
            statusMessage.classList.add('text-green-500');
        }
        /**
         * Handles the loading and error states for the dropdown.
         */
    const initSpecialtyDropdown= async () => {
        // A. Set Loading State (The state your app is stuck in)
        // Inside window.initSpecialtyDropdown = async function() { ... }
        // const selectElement = document.getElementById('specialization');//'specialization'
        // const statusMessage = document.getElementById('status-message');
        specializationInput.innerHTML = `<option selected disabled>${"טוען התמחויות..."}</option>`;
        specializationInput.disabled = true;
        statusMessage.textContent = "טוען נתונים מהשרת...";
        statusMessage.classList.remove('text-green-500', 'text-red-500');
        statusMessage.classList.add('text-indigo-600');

        try {
            const specialties = await getSpecializations(); // Set to true to test error case

            // C. Success: Render the data
            renderDropdown(specialties);

        } catch (error) {
            // D. Error: Display a meaningful error to the user
            specializationInput.innerHTML = `<option selected disabled>שגיאה בטעינה</option>`;
            statusMessage.textContent = `שגיאה: ${error.message}`;
            statusMessage.classList.remove('text-indigo-600', 'text-green-500');
            statusMessage.classList.add('text-red-500');
            console.error("Error fetching specialties:", error);
        } finally {
            // E. Cleanup and enable interaction
            specializationInput.disabled = false;
        }
    }
    const initSpecialtyDropdownForFilter= async () => {
        // A. Set Loading State (The state your app is stuck in)
        // Inside window.initSpecialtyDropdown = async function() { ... }
        // const selectElement = document.getElementById("specialization-filter");
        // const statusMessage = document.getElementById('status-message');
        specializationFilterInput.innerHTML = `<option selected disabled>${"טוען התמחויות..."}</option>`;
        specializationFilterInput.disabled = true;
        statusMessage.textContent = "טוען נתונים מהשרת...";
        statusMessage.classList.remove('text-green-500', 'text-red-500');
        statusMessage.classList.add('text-indigo-600');

        try {
            const specialties = await getSpecializations(); // Set to true to test error case

            // C. Success: Render the data
            renderDropdownForFilter(specialties);

        } catch (error) {
            // D. Error: Display a meaningful error to the user
            specializationFilterInput.innerHTML = `<option selected disabled>שגיאה בטעינה</option>`;
            statusMessage.textContent = `שגיאה: ${error.message}`;
            statusMessage.classList.remove('text-indigo-600', 'text-green-500');
            statusMessage.classList.add('text-red-500');
            console.error("Error fetching specialties:", error);
        } finally {
            // E. Cleanup and enable interaction
            specializationFilterInput.disabled = false;
        }
    }
        // קריאה חד-פעמית לפונקציית הטעינה כאשר ה-DOM מוכן
        initSpecialtyDropdown();
        initSpecialtyDropdownForFilter();
        
    const fetchAndRenderdoctors = async () => {
      featureToggle.checked = false; 
      nameToggle.checked = false; 
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        alldoctors = await response.json();
        console.log("Fetched all doctors:", alldoctors);
        renderTable(alldoctors);
        updateStats();
        loadDashboard();
      } catch (error) {
        console.error("Error fetching doctors:", error);
        doctorsTableBody.innerHTML = `
            <tr>
              <td colspan="9" style="text-align:center; color: red;">
                ❌ שגיאה בטעינת הנתונים מהשרת.
                ודא ש-Spring Boot רץ על http://localhost:8080
              </td>
            </tr>`;
      }
    };
    const getDoctorsByExperienceRange = async (minExperience, maxExperience) => {
      try {
        const response = await fetch(
          `${EXPERIENCE_API_URL_RANGE}?min=${minExperience}&max=${maxExperience}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const doctors = await response.json();
        return doctors;
      } catch (error) {
        console.error("Error fetching doctors by experience range:", error);
        return [];
      }
    };
    const getAverageRatingBySpecialization = async () => {
        console.log("Fetching average rating by specialization from:");
        try {
            const response = await fetch(AVERAGE_RATING_BY_SPEC_API_URL);
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            const ratings = await response.json();
            console.log("Average Ratings by Specialization:", ratings);
            return ratings;
        } catch (error) {
            console.error("Error fetching average rating by specialization:", error);
            return null;
        }
        };
    const getDoctorsWithMostAppointments = async () => {
        const lmt = limitAppointments.value;
        try {
            const response = await fetch(`${MOST_APPOINTMENTS_API_URL}?limit=${lmt}`);
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            const doctors = await response.json();
            console.log("Doctors with Most Appointments:", doctors);
            renderTable(doctors);
            updateFilteredCount(doctors.length);
            return doctors;
        } catch (error) {
            console.error("Error fetching Doctors with most appointments:", error);
            return [];
        }
    
        };
    const getdoctorById=async (id) => {
      try {
        const response = await fetch(
          `${API_URL}/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const doctor = await response.json();
        return doctor;
      } catch (error) {
        console.error("Error fetching doctor by ID:", error);
        return null;
      }
    }

    const getDoctorsBySpecializationMap=async(value)=> {
      try {
        const response = await fetch(SPECIALIZATION_API_URL_MAP);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
         groupedData = await response.json();
        console.log("Grouped Data:", groupedData[value]);
        renderTable(groupedData[value] || []);
        return groupedData;
      } catch (error) {
        console.error("Error fetching doctors grouped by experience group:", error);
        return null;
      }
    
  };
    const renderStatistics = (stats) => {
      document.getElementById('averageCardiolog').textContent = stats["Cardiolog"] ||0;
      document.getElementById('averageOrthopedics').textContent = stats["Orthopedics"]||0;
      document.getElementById('averagePediatrics').textContent = stats["Pediatrics"]||0;
      document.getElementById('averageDermatology').textContent = stats["Dermatology"]||0;
      document.getElementById('averageNeurology').textContent = stats["Neurology"]||0;
      document.getElementById('averageGeneral').textContent = stats["General"]||0;
 
      statsGrid.classList.remove('hidden');
  };
  
  const loadDashboard = async () => {
      loadingDiv.classList.remove('hidden');
      errorDiv.classList.add('hidden');
      statsGrid.classList.add('hidden');
  
      try {
          const stats = await getAverageRatingBySpecialization();
          if (stats) {
              renderStatistics(stats);
          } else {
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
  const getTopRatedDoctors = async () => {
      const lmt = limit.value;
        if(lmt==="" || lmt<0){
            alert("❌ אנא הזן ערך תקין למספר המגבלה.");
            fetchAndRenderdoctors();
            return [];
        }
      try {
          const response = await fetch(`${TOP_RATED_API_URL}?limit=${lmt}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const doctors = await response.json();
        console.log("Top Rated Doctors:", doctors);
        renderTable(doctors);
        updateFilteredCount(doctors.length);
        return doctors;
      } catch (error) {
        console.error("Error fetching top Rated Doctors:", error);
        return [];
      }
  
    };
 window.onload = loadDashboard;
  const searchDoctorsByName = async () => {
      const nameQuery = searchInput.value.trim();
      try {
             const response = await fetch(`${SEARCH_API_URL_NAME}?keyword=${nameQuery}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const doctors = await response.json();
        console.log("Search Results1:", doctors);
        return doctors;
      } catch (error) {
        console.error("Error searching doctors by name:", error);
        return [];
      }
  };
  

    
    const applyFilters = async () => {
      let filteredDoctors = [...alldoctors];
  
      // Apply search filter
      const searchTerm = searchInput.value.toLowerCase();
      if (!featureToggle.checked &&!nameToggle.checked) {
      if (searchTerm) {
          if(searchTerm.length==0){
              renderTable(alldoctors);
              updateFilteredCount(alldoctors.length);
          }
          else{
               filteredDoctors = filteredDoctors.filter(
          (doctor) =>
            (doctor.phoneNumber &&doctor.phoneNumber.toLowerCase().includes(searchTerm)) ||
            (doctor.email && doctor.email.toLowerCase().includes(searchTerm))
        );
          }
     
      }
  }
      // Check for ID-only lookup feature
      if (featureToggle.checked&&!nameToggle.checked) {
          const doctorId = searchInput.value.trim();
          if (doctorId) {
              const doctor = await getdoctorById(doctorId);
              filteredDoctors = doctor && doctor.id ? [doctor] : [];
          } else {
              // If toggle is checked but search is empty, show nothing
              renderTable(alldoctors);
              updateFilteredCount(alldoctors.length);
          }
          // experience filter is ignored when ID-only lookup is active
      } 
      if (nameToggle.checked&&!featureToggle.checked) {
          const doctorName = searchInput.value.trim();
          console.log("Searching for doctor name----------------:", doctorByName);
  
          if (doctorName) {
              const doctor = await searchDoctorsByName();
              filteredDoctors = doctor || [];
              console.log("Filtered doctors by Name:", filteredDoctors);
          } else {
              // If toggle is checked but search is empty, show nothing
              renderTable(alldoctors);
              updateFilteredCount(alldoctors.length);
          }
          // experience filter is ignored when firstname-only lookup is active
      } 
      // Apply experience filter
      if (currentExperienceFilter) {
        console.log("Applying experience filter in applyFilters():", currentExperienceFilter);
      filteredDoctors = await getDoctorsByExperienceRange(currentExperienceFilter.min, currentExperienceFilter.max);
      console.log("list recieved applyFilters() ",filteredDoctors);
      }
  
      renderTable(filteredDoctors);
      updateFilteredCount(filteredDoctors.length);
    };
  
    const renderTable = (doctors) => {
      doctorsTableBody.innerHTML = "";
      if (doctors.length === 0) {
        doctorsTableBody.innerHTML = `
            <tr>
              <td colspan="9" style="text-align:center;">
                📋 אין רופא/הים במערכת. הוסף רופא/ה ראשון!
              </td>
            </tr>`;
        return;
      }
  
   
      doctors.forEach((doctor) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${escapeHTML(doctor.id)}</td>
            <td>${escapeHTML(doctor.firstName)}</td>
            <td>${escapeHTML(doctor.lastName)}</td>
            <td>${doctor.yearsOfExperience || "-"}</td>
            <td>${doctor.specialization || "-"}</td>
            <td>${doctor.rating || "-"}</td>      
            <td>${escapeHTML(doctor.phoneNumber) || "-"}</td>
            <td>${escapeHTML(doctor.email) || "-"}</td>
            <td>${escapeHTML(doctor.appointmentIds) || "-"}</td>
          <td class="actions-cell">
              <button class="edit-btn" data-id="${doctor.id}">✏️ עריכה</button>
              <button class="delete-btn" data-id="${doctor.id}">🗑️ מחיקה</button>
            </td>`;
        doctorsTableBody.appendChild(row);
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
  
    const applyExperienceFilter = async () => {
      const minExperience = parseInt(minExperienceInput.value) || 0;
      const maxExperience = parseInt(maxExperienceInput.value) || 150;
      console.log("Applying experience filter:", { minExperience, maxExperience });
      featureToggle.checked=false; // Disable ID-only lookup when applying experience filter
      nameToggle.checked = false; 
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
  
    const clearExperienceFilter = async () => {
      currentExperienceFilter = null;
      minExperienceInput.value = "";
      maxExperienceInput.value = "";
      await fetchAndRenderdoctors();
  
      // Visual feedback
      clearExperienceFilterBtn.textContent = "✓ סינון נוקה";
      setTimeout(() => {
        clearExperienceFilterBtn.textContent = "נקה סינון";
      }, 1500);
    };
  
    const handleFormSubmit = async (event) => {
      event.preventDefault();
  
      const doctorData = {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        specialization: specializationInput.value.trim(),
        yearsOfExperience: yearsOfExperienceInput.value.trim(),
        phoneNumber: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        rating: ratingInput.value.trim()
      };
  
      const doctorId = doctorIdInput.value;
  console.log("Submitting doctor data:", doctorData, "ID:", doctorId);
      try {
        const method = doctorId ? "PUT" : "POST";
        const url = doctorId ? `${API_URL}/${doctorId}` : API_URL;
  
        const response = await fetch(url, {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(doctorData),
        });
            console.log("Submitting to URL:",response );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "שגיאה בשמירת הרופא/ה");
        }
  
        resetForm();
        await fetchAndRenderdoctors();
        alert(doctorId ? "✅ הרופא/ה עודכן בהצלחה!" : "✅ הרופא/ה נוסף בהצלחה!");
        loadDashboard();
      } catch (error) {
        console.error("Error submitting form:", error);
        alert(`❌ שגיאה: ${error.message}`);
      }
    };
  
    const populateFormForEdit = (doctor) => {
      doctorIdInput.value = doctor.id;
      firstNameInput.value = doctor.firstName;
      lastNameInput.value = doctor.lastName;
      specializationInput.value=doctor.specialization || "";
       yearsOfExperienceInput.value=doctor.yearsOfExperience || "";
      phoneInput.value = doctor.phoneNumber || "";
      emailInput.value = doctor.email || "";
      ratingInput.value = doctor.rating || "";
  
      submitButton.textContent = "עדכן רופא/ה";
      submitButton.classList.remove("btn-primary");
      submitButton.classList.add("edit-btn-doctor");
      cancelEditBtn.style.display = "inline-block";
      loadDashboard();

      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  
    const resetForm = () => {
      doctorForm.reset();
      doctorIdInput.value = "";
      specializationInput.value="";
      submitButton.textContent = "הוסף רופא/ה";
      submitButton.classList.remove("edit-btn-doctor");
      submitButton.classList.add("btn-primary");
      cancelEditBtn.style.display = "none";
    };
  
    const handleDelete = async (doctorId) => {
      if (!confirm("❓ האם אתה בטוח שברצונך למחוק את הרופא/ה?")) {
        return;
      }
  
      try {
        const response = await fetch(`${API_URL}/${doctorId}`, {
          method: "DELETE",
        });
  
        if (!response.ok) {
          throw new Error("שגיאה במחיקת הרופא/ה");
        }
  
        await fetchAndRenderdoctors();
        alert("✅ הרופא/ה נמחק בהצלחה!");
        loadDashboard();

      } catch (error) {
        console.error("Error deleting doctor:", error);
        alert("❌ שגיאה במחיקת הרופא/ה");
      }
    };
  
    const handleCheckboxChange = async (checkboxElement) => {
          featureToggle.checked = true; 
      nameToggle.checked = false; 
      const isChecked = checkboxElement.checked;
      const doctorId = searchInput.value.trim(); 
  
      // Log the action to the console for debugging
      console.log(`Checkbox ID: ${checkboxElement.id} | New State: ${isChecked ? 'Checked' : 'Unchecked'}`);
      
  
      if (isChecked) {
          if (!doctorId) {
              alert("⚠️ אנא הזן מספר רופא/ה בשדה החיפוש כדי לבצע בדיקה.", 'warning');
              await applyFilters(); // Reset to normal
              return;
          }
  
          alert(`Status:  בודק רשומה של רופא/ה לפי מספר מזהה ${doctorId}...`);
  
          // Correct asynchronous fetch and wait for the result
          const doctor = await getdoctorById(doctorId);
  
          if (doctor && doctor.id) {
              console.log(`✅ רופא/ה ID ${doctorId} נמצא:`, doctor);
              alert(`✅ רופא/ה ID ${doctor.id} נמצא! (הנתונים המלאים נרשמו לקונסול)`, 'success');
          } else {
              console.error(`❌ רופא/ה ID ${doctorId} לא נמצא.`);
              alert(`❌ רופא/ה ID ${doctorId} לא נמצא.`, 'error');
              doctorToRender = [];
          }
      } else {
          // Handle unchecked state
          alert("Status: בדיקת רשומות ID מושבתת.", 'error');
      }
    // Re-apply all filters based on the new toggle state
    await applyFilters();
  };
  const handleCheckboxNameChange = async (checkboxElement) => {
      featureToggle.checked = false; 
      nameToggle.checked = true; 
      const isChecked = checkboxElement.checked;
      const doctorName = searchInput.value.trim(); 
  
      // Log the action to the console for debugging
      console.log(`Checkbox ID: ${checkboxElement.id} | New State: ${isChecked ? 'Checked' : 'Unchecked'}`);
  
  
      if (isChecked) {
          if (!doctorName) {
              alert("⚠️ אנא הזן שם רופא/ה בשדה החיפוש כדי לבצע בדיקה.", 'warning');
               
              await applyFilters(); // Reset to normal
              return;
          }
  
          alert(`Status: בודק רשומה של שם רופא/ה  ${doctorName}...`);
  
          // Correct asynchronous fetch and wait for the result
           doctorByName = await searchdoctorsByName();
           console.log("doctor By Name Fetched handleCheckboxNameChange:", doctorByName);
  
          if (doctorName) {
              console.log(`✅ שם רופא/ה ${doctorName} נמצא:`, doctorByName);
              alert(`✅ שם רופא/ה  ${doctorName} נמצא! (הנתונים המלאים נרשמו לקונסול)`, 'success');
          } else {
              console.error(`❌ שם רופא/ה  ${doctorName} לא נמצא.`);
              alert(`❌ שם רופא/ה  ${doctorName} לא נמצא.`, 'error');
          }
      } else {
          // Handle unchecked state
          alert("Status: בדיקת רשומות לפי שם פרטי מושבתת.", 'error');
      }
    // Re-apply all filters based on the new toggle state
    await applyFilters();
  };
    const updateStats = () => {
      totalCountSpan.textContent = alldoctors.length;
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
    doctorsTableBody.addEventListener("click", (event) => {
      if (event.target.classList.contains("edit-btn")) {
        const doctorId = event.target.dataset.id;
        const doctor = alldoctors.find((p) => p.id == doctorId);
        if (doctor) {
          populateFormForEdit(doctor);
        }
      }
  
      if (event.target.classList.contains("delete-btn")) {
        const doctorId = event.target.dataset.id;
        handleDelete(doctorId);
      }
    });
  
    // ===============================
    // Event Listeners
    // ===============================
    doctorForm.addEventListener("submit", handleFormSubmit);
    cancelEditBtn.addEventListener("click", resetForm);
    refreshBtn.addEventListener("click", fetchAndRenderdoctors);
    searchInput.addEventListener("input",  async () => {await applyFilters();});
    // Experience Filter Event Listeners
    applyExperienceFilterBtn.addEventListener("click", async () => {await applyExperienceFilter() ;});
    clearExperienceFilterBtn.addEventListener("click", clearExperienceFilter);

    topRatedDoctorsBtn.addEventListener("click",async () => {await getTopRatedDoctors();});
    specializationButton.addEventListener("click",async () => {await getDoctorsBySpecializationMap(specializationFilterInput.value);});
    MostAppointmentsBtn.addEventListener("click",async () => {await getDoctorsWithMostAppointments();});

  
    // Allow Enter key in experience inputs
    minExperienceInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyExperienceFilter();
      }
    });
  
    maxExperienceInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyExperienceFilter();
      }
    });
    featureToggle.addEventListener("change",  async () => {await handleCheckboxChange(featureToggle);});
    nameToggle.addEventListener("change",  async () => {await handleCheckboxNameChange(nameToggle);});
    // ===============================
    // Initial Load
    // ===============================
    fetchAndRenderdoctors();
  });
  