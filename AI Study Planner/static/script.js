// ---------- FORM 1 : Save Student Details ----------
function saveStudent() {
  const name = document.getElementById("name").value;
  const hours = document.getElementById("hours").value;

  if (name === "" || hours === "") {
    alert("Please fill all details");
    return;
  }

  localStorage.setItem("name", name);
  localStorage.setItem("hours", hours);

  window.location.href = "subject_units.html";
}

// ---------- FORM 2 : Save Subject & Units ----------
function saveSubject() {
  const subject = document.getElementById("subject").value;
  const units = document.querySelectorAll(".unit:checked");

  if (subject === "" || units.length === 0) {
    alert("Please enter subject and select units");
    return;
  }

  localStorage.setItem("subject", subject);
  localStorage.setItem("unitCount", units.length);

  window.location.href = "priority_level.html";
}

// ---------- FORM 3 : AI LOGIC + SCORE ----------
function generatePlan() {
  const unitCount = parseInt(localStorage.getItem("unitCount"));
  const hours = parseInt(localStorage.getItem("hours"));
  const difficulty = document.getElementById("difficulty").value;

  let perUnitTime;

  // AI LOGIC: Assign more time to difficult units
  if (difficulty === "Hard") {
    perUnitTime = (hours / unitCount) * 1.2;
  } else if (difficulty === "Medium") {
    perUnitTime = (hours / unitCount);
  } else {
    perUnitTime = (hours / unitCount) * 0.8;
  }

  // Avoid overload (maximum 2 hours per unit)
  if (perUnitTime > 2) {
    perUnitTime = 2;
  }

  // Score prediction logic
  let score;
  if (unitCount === 5 && hours >= 4) {
    score = "65 - 75";
  } else if (unitCount >= 3) {
    score = "45 - 60";
  } else {
    score = "25 - 35";
  }

  localStorage.setItem("perUnitTime", perUnitTime.toFixed(1));
  localStorage.setItem("score", score);

  window.location.href = "result.html";
}

// ---------- RESULT PAGE DISPLAY ----------
window.onload = function () {
  const resultDiv = document.getElementById("result");
  const table = document.getElementById("timetable");

  if (resultDiv) {
    const name = localStorage.getItem("name");
    const subject = localStorage.getItem("subject");
    const score = localStorage.getItem("score");
    const perUnitTime = localStorage.getItem("perUnitTime");
    const unitCount = parseInt(localStorage.getItem("unitCount"));

    resultDiv.innerHTML = `
      <p><b>Name:</b> ${name}</p>
      <p><b>Subject:</b> ${subject}</p>
      <p><b>Time per Unit:</b> ${perUnitTime} hrs</p>
      <p><b>Expected Score:</b> ${score} / 75</p>
    `;

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    for (let i = 0; i < unitCount; i++) {
      let row = table.insertRow();
      let cell1 = row.insertCell(0);
      let cell2 = row.insertCell(1);

      cell1.innerHTML = days[i];
      cell2.innerHTML = `Unit ${i + 1} – ${perUnitTime} hrs`;
    }
  }
};




