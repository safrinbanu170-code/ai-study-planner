// ---------- SAVE FORM DATA ----------
function saveFormData(step) {
  if (step === 1) {
    localStorage.setItem("name", document.getElementById("name").value);
    localStorage.setItem("exam_date", document.getElementById("exam_date").value);
    localStorage.setItem("hours", document.getElementById("hours").value);
  }

  if (step === 2) {
    localStorage.setItem("subject", document.getElementById("subject").value);

    let selectedUnits = [];
    document.querySelectorAll("input[name='units']:checked").forEach((u) => {
      selectedUnits.push(u.value);
    });
    localStorage.setItem("units", JSON.stringify(selectedUnits));
  }

  if (step === 3) {
    localStorage.setItem("difficulty", document.getElementById("difficulty").value);
  }

  alert("Saved successfully ✅ (You can continue later)");
}

// ---------- AUTO LOAD SAVED DATA ----------
function loadSavedData(step) {
  if (step === 1) {
    document.getElementById("name").value = localStorage.getItem("name") || "";
    document.getElementById("exam_date").value = localStorage.getItem("exam_date") || "";
    document.getElementById("hours").value = localStorage.getItem("hours") || "";
  }

  if (step === 2) {
    document.getElementById("subject").value = localStorage.getItem("subject") || "";

    let units = JSON.parse(localStorage.getItem("units") || "[]");
    units.forEach((unit) => {
      let checkbox = document.querySelector(`input[name='units'][value='${unit}']`);
      if (checkbox) checkbox.checked = true;
    });
  }

  if (step === 3) {
    document.getElementById("difficulty").value = localStorage.getItem("difficulty") || "Easy";
  }
}

// ---------- CLEAR SAVED DATA (OPTIONAL) ----------
function clearSavedData() {
  localStorage.clear();
  alert("Saved data cleared ✅");
  location.reload();
}
