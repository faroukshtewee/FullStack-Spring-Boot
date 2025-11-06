document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // DOM Elements
  // ===============================
  const patientForm = document.getElementById("patient-form");
  const patientIdInput = document.getElementById("patient-id");
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const dateOfBirthInput = document.getElementById("dateOfBirth");
  const phoneInput = document.getElementById("phoneNumber");
  const emailInput = document.getElementById("email");
  const submitButton = patientForm.querySelector('button[type="submit"]');
  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  const patientsTableBody = document.getElementById("patients-table-body");
  const searchInput = document.getElementById("search-input");
  const refreshBtn = document.getElementById("refresh-btn");
  const totalCountSpan = document.getElementById("total-count");
  const featureToggle = document.getElementById('feature-toggle');
  const nameToggle = document.getElementById("name-toggle");
  const mostappointments = document.getElementById("most-appointments-btn");
  const limit = document.getElementById("limit");

  // Age Filter Elements
  const minAgeInput = document.getElementById("min-age");
  const maxAgeInput = document.getElementById("max-age");
  const applyAgeFilterBtn = document.getElementById("apply-age-filter-btn");
  const clearAgeFilterBtn = document.getElementById("clear-age-filter-btn");
  const quickFilterBtns = document.querySelectorAll(".quick-filter-btn");
  const filteredCountDiv = document.getElementById("stats");
  const filteredCountValue = document.getElementById("total-count");
  //statics
  const loadingDiv = document.getElementById('loading');
  const errorDiv = document.getElementById('error-message');
  const errorDetail = document.getElementById('error-detail');
  const statsGrid = document.getElementById('stats-grid');

  // ===============================
  // API Configuration
  // ===============================
  const API_URL = "http://localhost:8080/patients";
  const AGE_API_URL_RANGE = "http://localhost:8080/patients/age-range";
  const AGE_API_URL_STATS = "http://localhost:8080/patients/age-statistics";
  const AGE_API_URL_GROUPED = "http://localhost:8080/patients/grouped-by-age";
  const MOST_APPOINTMENTS_API_URL = "http://localhost:8080/patients/most-appointments";
  const SEARCH_API_URL_NAME = "http://localhost:8080/patients/search";

  // ===============================
  // State
  // ===============================
  let allPatients = [];
  let currentAgeFilter = null;
  const patientByName=[];
  // ===============================
  // Functions
  // ===============================

  const fetchAndRenderPatients = async () => {
    featureToggle.checked = false; 
    nameToggle.checked = false; 
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      allPatients = await response.json();
      renderTable(allPatients);
      updateStats();
      loadDashboard();
    } catch (error) {
      console.error("Error fetching patients:", error);
      patientsTableBody.innerHTML = `
          <tr>
            <td colspan="9" style="text-align:center; color: red;">
              ❌ שגיאה בטעינת הנתונים מהשרת.
              ודא ש-Spring Boot רץ על http://localhost:8080
            </td>
          </tr>`;
    }
  };
  const getPatientsByAgeRange = async (minAge, maxAge) => {
    try {
      const response = await fetch(
        `${AGE_API_URL_RANGE}?min=${minAge}&max=${maxAge}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const patients = await response.json();
      return patients;
    } catch (error) {
      console.error("Error fetching patients by age range:", error);
      return [];
    }
  };
  const getPatientById=async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/${id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const patient = await response.json();
      return patient;
    } catch (error) {
      console.error("Error fetching patient by ID:", error);
      return null;
    }
  }
  const getPatientAgeStatistics=async() => {
    try {
        
      const response = await fetch(AGE_API_URL_STATS);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const stats = await response.json();
      return stats;
    } catch (error) {
      console.error("Error fetching patient age statistics:", error);
      return null;
    }
  };
  const getPatientsGroupedByAgeGroup=async()=> {
    try {
      const response = await fetch(AGE_API_URL_GROUPED);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const groupedData = await response.json();
    //   console.log("Grouped Data:", groupedData);
      return groupedData;
    } catch (error) {
      console.error("Error fetching patients grouped by age group:", error);
      return null;
    }
  
};
  const renderStatistics = (stats) => {
    document.getElementById('minAge').textContent = stats.minAge.toLocaleString();
    document.getElementById('maxAge').textContent = stats.maxAge.toLocaleString();
    // Format average age to two decimal places
    document.getElementById('averageAge').textContent = stats.averageAge.toFixed(2);
    document.getElementById('totalPatients').textContent = stats.totalPatients.toLocaleString();
    statsGrid.classList.remove('hidden');
};

const loadDashboard = async () => {
    loadingDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');
    statsGrid.classList.add('hidden');

    try {
        const stats = await getPatientAgeStatistics();
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
// Load data when the page finishes loading
window.onload = loadDashboard;
  
const getPatientsWithMostAppointments = async () => {
    const lmt = limit.value;
    try {
        const response = await fetch(`${MOST_APPOINTMENTS_API_URL}?limit=${lmt}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const patients = await response.json();
      console.log("Patients with Most Appointments:", patients);
      renderTable(patients);
      updateFilteredCount(patients.length);
      return patients;
    } catch (error) {
      console.error("Error fetching patients with most appointments:", error);
      return [];
    }

  };
const searchPatientsByName = async () => {
    const nameQuery = searchInput.value.trim();
    try {
           const response = await fetch(`${SEARCH_API_URL_NAME}?keyword=${nameQuery}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const patients = await response.json();
      console.log("Search Results1:", patients);
      return patients;
    } catch (error) {
      console.error("Error searching patients by name:", error);
      return [];
    }

};


  const applyFilters = async () => {
    let filteredPatients = [...allPatients];

    // Apply search filter
    const searchTerm = searchInput.value.toLowerCase();
    if (!featureToggle.checked &&!nameToggle.checked) {
    if (searchTerm) {
        if(searchTerm.length==0){
            renderTable(allPatients);
            updateFilteredCount(allPatients.length);
        }
        else{
              filteredPatients = filteredPatients.filter(
        (patient) =>
        //   patient.lastName.toLowerCase().includes(searchTerm) ||
          (patient.phoneNumber &&patient.phoneNumber.toLowerCase().includes(searchTerm)) ||
          (patient.email && patient.email.toLowerCase().includes(searchTerm))
      );
        }
  
    }
}
    // Check for ID-only lookup feature
    if (featureToggle.checked&&!nameToggle.checked) {
        // clearAgeFilter();
        const patientId = searchInput.value.trim();
        if (patientId) {
            const patient = await getPatientById(patientId);
            filteredPatients = patient && patient.id ? [patient] : [];
        } else {
            // If toggle is checked but search is empty, show nothing
            // filteredPatients = [];
            renderTable(allPatients);
            updateFilteredCount(allPatients.length);
        }
        // Age filter is ignored when ID-only lookup is active
    } 
    if (nameToggle.checked&&!featureToggle.checked) {
        // clearAgeFilter();
        const patientName = searchInput.value.trim();
        console.log("Searching for patient name----------------:", patientByName);

        if (patientName) {
            const patient = await searchPatientsByName();
            filteredPatients = patient || [];
            console.log("Filtered Patients by Name:", filteredPatients);
        } else {
            // If toggle is checked but search is empty, show nothing
            // filteredPatients = [];
            renderTable(allPatients);
            updateFilteredCount(allPatients.length);
        }
        // Age filter is ignored when firstname-only lookup is active
    } 
    // Apply age filter
    if (currentAgeFilter) {
    filteredPatients = await getPatientsByAgeRange(currentAgeFilter.min, currentAgeFilter.max);
    // console.log(filteredPatients);
    }

    renderTable(filteredPatients);
    updateFilteredCount(filteredPatients.length);
  };

  const renderTable = (patients) => {
    patientsTableBody.innerHTML = "";
    if (patients.length === 0) {
      patientsTableBody.innerHTML = `
          <tr>
            <td colspan="9" style="text-align:center;">
              📋 אין מטופלים במערכת. הוסף מטופל ראשון!
            </td>
          </tr>`;
      return;
    }

 
    patients.forEach((patient) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${escapeHTML(patient.id)}</td>
          <td>${escapeHTML(patient.firstName)}</td>
          <td>${escapeHTML(patient.lastName)}</td>
          <td>${patient.dateOfBirth || "-"}</td>
          <td><strong>${
            patient.age !== null && patient.age !== undefined
              ? patient.age
              : "-"
          }</strong></td>          
          <td>${escapeHTML(patient.phoneNumber) || "-"}</td>
          <td>${escapeHTML(patient.email) || "-"}</td>
          <td>${escapeHTML(patient.appointmentIds) || "-"}</td>
        <td class="actions-cell">
            <button class="edit-btn" data-id="${patient.id}">✏️ עריכה</button>
            <button class="delete-btn" data-id="${patient.id}">🗑️ מחיקה</button>
          </td>`;
      patientsTableBody.appendChild(row);
    });
  };
  const updateFilteredCount = (count) => {
    if (currentAgeFilter || searchInput.value) {
      filteredCountDiv.style.display = "block";
      filteredCountValue.textContent = count;
    } else {
      filteredCountDiv.style.display = "none";
    }
  };

  const applyAgeFilter = async () => {
    const minAge = parseInt(minAgeInput.value) || 0;
    const maxAge = parseInt(maxAgeInput.value) || 150;
    featureToggle.checked=false; // Disable ID-only lookup when applying age filter
    if (minAge > maxAge) {
      alert("❌ גיל מינימלי לא יכול להיות גדול מגיל מקסימלי");
      return;
    }

    currentAgeFilter = { min: minAge, max: maxAge };
    await applyFilters();

    // Visual feedback
    applyAgeFilterBtn.textContent = "✓ סינון פעיל";
    setTimeout(() => {
      applyAgeFilterBtn.textContent = "החל סינון";
    }, 1500);
  };

  const clearAgeFilter = async () => {
    currentAgeFilter = null;
    minAgeInput.value = "";
    maxAgeInput.value = "";
    await fetchAndRenderPatients();

    // Visual feedback
    clearAgeFilterBtn.textContent = "✓ סינון נוקה";
    setTimeout(() => {
      clearAgeFilterBtn.textContent = "נקה סינון";
    }, 1500);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const patientData = {
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      dateOfBirth: dateOfBirthInput.value,
      phoneNumber: phoneInput.value.trim(),
      email: emailInput.value.trim(),
    };

    const patientId = patientIdInput.value;

    try {
      const method = patientId ? "PUT" : "POST";
      const url = patientId ? `${API_URL}/${patientId}` : API_URL;

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "שגיאה בשמירת המטופל");
      }

      resetForm();
      await fetchAndRenderPatients();
      alert(patientId ? "✅ המטופל עודכן בהצלחה!" : "✅ המטופל נוסף בהצלחה!");
      loadDashboard();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`❌ שגיאה: ${error.message}`);
    }
  };

  const populateFormForEdit = (patient) => {
    patientIdInput.value = patient.id;
    firstNameInput.value = patient.firstName;
    lastNameInput.value = patient.lastName;
    dateOfBirthInput.value = patient.dateOfBirth || "";
    phoneInput.value = patient.phoneNumber || "";
    emailInput.value = patient.email || "";
    // loadDashboard();

    submitButton.textContent = "עדכן מטופל";
    submitButton.classList.remove("btn-primary");
    submitButton.classList.add("edit-btn");
    cancelEditBtn.style.display = "inline-block";

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    patientForm.reset();
    patientIdInput.value = "";
    submitButton.textContent = "הוסף מטופל";
    submitButton.classList.remove("edit-btn");
    submitButton.classList.add("btn-primary");
    cancelEditBtn.style.display = "none";
  };

  const handleDelete = async (patientId) => {
    if (!confirm("❓ האם אתה בטוח שברצונך למחוק את המטופל?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${patientId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("שגיאה במחיקת המטופל");
      }

      await fetchAndRenderPatients();
      alert("✅ המטופל נמחק בהצלחה!");
      loadDashboard();
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("❌ שגיאה במחיקת המטופל");
    }
  };

  const handleCheckboxChange = async (checkboxElement) => {
        featureToggle.checked = true; 
    nameToggle.checked = false; 
    const isChecked = checkboxElement.checked;
    const patientId = searchInput.value.trim(); 

    // Log the action to the console for debugging
    console.log(`Checkbox ID: ${checkboxElement.id} | New State: ${isChecked ? 'Checked' : 'Unchecked'}`);
    

    if (isChecked) {
        if (!patientId) {
            alert("⚠️ אנא הזן מספר מטופל בשדה החיפוש כדי לבצע בדיקה.", 'warning');
            await applyFilters(); // Reset to normal
            return;
        }

        alert(`Status:  בודק רשומה של מטופל לפי מספר מזהה ${patientId}...`);

        // Correct asynchronous fetch and wait for the result
        const patient = await getPatientById(patientId);

        if (patient && patient.id) {
            console.log(`✅ מטופל ID ${patientId} נמצא:`, patient);
            alert(`✅ מטופל ID ${patient.id} נמצא! (הנתונים המלאים נרשמו לקונסול)`, 'success');
        } else {
            console.error(`❌ מטופל ID ${patientId} לא נמצא.`);
            alert(`❌ מטופל ID ${patientId} לא נמצא.`, 'error');
            patientToRender = [];
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
    const patientName = searchInput.value.trim(); 

    // Log the action to the console for debugging
    console.log(`Checkbox ID: ${checkboxElement.id} | New State: ${isChecked ? 'Checked' : 'Unchecked'}`);


    if (isChecked) {
        if (!patientName) {
            alert("⚠️ אנא הזן שם מטופל בשדה החיפוש כדי לבצע בדיקה.", 'warning');
             
            await applyFilters(); // Reset to normal
            return;
        }

        alert(`Status: בודק רשומה של שם מטופל  ${patientName}...`);

        // Correct asynchronous fetch and wait for the result
         patientByName = await searchPatientsByName();
         console.log("Patient By Name Fetched handleCheckboxNameChange:", patientByName);

        if (patientName) {
            console.log(`✅ שם מטופל ${patientName} נמצא:`, patientByName);
            alert(`✅ שם מטופל  ${patientName} נמצא! (הנתונים המלאים נרשמו לקונסול)`, 'success');
        } else {
            console.error(`❌ שם מטופל  ${patientName} לא נמצא.`);
            alert(`❌ שם מטופל  ${patientName} לא נמצא.`, 'error');
        }
    } else {
        // Handle unchecked state
        alert("Status: בדיקת רשומות לפי שם פרטי מושבתת.", 'error');
    }
  // Re-apply all filters based on the new toggle state
  await applyFilters();
};
  const updateStats = () => {
    totalCountSpan.textContent = allPatients.length;
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
  patientsTableBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-btn")) {
      const patientId = event.target.dataset.id;
      const patient = allPatients.find((p) => p.id == patientId);
      if (patient) {
        populateFormForEdit(patient);
      }
    }

    if (event.target.classList.contains("delete-btn")) {
      const patientId = event.target.dataset.id;
      handleDelete(patientId);
    }
  });

  // ===============================
  // Event Listeners
  // ===============================
  patientForm.addEventListener("submit", handleFormSubmit);
  cancelEditBtn.addEventListener("click", resetForm);
  refreshBtn.addEventListener("click", fetchAndRenderPatients);
  searchInput.addEventListener("input",  async () => {await applyFilters();});
  // Age Filter Event Listeners
  applyAgeFilterBtn.addEventListener("click", applyAgeFilter);
  clearAgeFilterBtn.addEventListener("click", clearAgeFilter);
  // Quick Filter Buttons
  quickFilterBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const minAge = parseInt(btn.dataset.min);
      const maxAge = parseInt(btn.dataset.max);
    //   console.log(`Quick Filter Applied: Min Age = ${minAge}, Max Age = ${maxAge}`);
    const result=await getPatientsGroupedByAgeGroup();
    if(maxAge<=18){
        renderTable(result["0-18 (ילדים)"] || []);
    }
    else if(maxAge<=35&& minAge>=19){
        renderTable(result["19-35 (צעירים)"] || []);
    }
    else if(maxAge<=60&&minAge>=36){
        renderTable(result["36-60 (מבוגרים)"] || []);
    }
    else{
        renderTable(result["61+ (קשישים)"] || []);
    }
      currentAgeFilter = { min: minAge, max: maxAge };
      updateFilteredCount(result.length);
    });
  });
  mostappointments.addEventListener("click",async () => {await getPatientsWithMostAppointments();});


  // Allow Enter key in age inputs
  minAgeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyAgeFilter();
    }
  });

  maxAgeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyAgeFilter();
    }
  });
  featureToggle.addEventListener("change",  async () => {await handleCheckboxChange(featureToggle);});
  nameToggle.addEventListener("change",  async () => {await handleCheckboxNameChange(nameToggle);});
  // ===============================
  // Initial Load
  // ===============================
  fetchAndRenderPatients();
});
