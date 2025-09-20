const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyYfAQvw-lrnJvs7Uh-MsAK44JoEWrz2RjWMpaa_BrH8BU85om7NRqTWilxh47zhc5q/exec"; // replace with your Google Apps Script URL

// Load tokens into dropdown
async function loadTokens() {
  const dropdowns = document.querySelectorAll("#tokenDropdown");
  if (!dropdowns.length) return;

  const res = await fetch(`${WEBAPP_URL}?action=getTokens`);
  const tokens = await res.json();

  dropdowns.forEach(dropdown => {
    dropdown.innerHTML = "";
    tokens.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      dropdown.appendChild(opt);
    });
  });
}

// Helper to show messages
function showMsg(msg, isSuccess = true) {
  const alertBox = document.getElementById("msg");
  alertBox.classList.remove("d-none", "alert-success", "alert-danger");
  alertBox.classList.add(isSuccess ? "alert-success" : "alert-danger");
  alertBox.textContent = msg;
}

// Station 1
const regForm = document.getElementById("regForm");
if (regForm) {
  regForm.addEventListener("submit", async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(regForm).entries());
    const res = await fetch(WEBAPP_URL, {
      method: "POST",
      body: JSON.stringify({ station: "registration", token: "", data }),
    });
    const out = await res.json();
    showMsg(out.status === "success" ? `✅ Token: ${out.token}` : out.message, out.status === "success");
    if(out.status==="success") regForm.reset();
  });
}

// Station 2
const triageForm = document.getElementById("triageForm");
if (triageForm) {
  loadTokens();
  triageForm.addEventListener("submit", async e => {
    e.preventDefault();
    const token = document.getElementById("tokenDropdown").value;
    const data = Object.fromEntries(new FormData(triageForm).entries());
    const res = await fetch(WEBAPP_URL, {
      method: "POST",
      body: JSON.stringify({ station: "triage", token, data }),
    });
    const out = await res.json();
    showMsg(out.status === "success" ? "✅ Triage saved!" : out.message, out.status === "success");
    if(out.status==="success") triageForm.reset();
  });
}

// Station 3
const doctorForm = document.getElementById("doctorForm");
if (doctorForm) {
  loadTokens();
  doctorForm.addEventListener("submit", async e => {
    e.preventDefault();
    const token = document.getElementById("tokenDropdown").value;
    const data = Object.fromEntries(new FormData(doctorForm).entries());
    const res = await fetch(WEBAPP_URL, {
      method: "POST",
      body: JSON.stringify({ station: "doctor", token, data }),
    });
    const out = await res.json();
    showMsg(out.status === "success" ? "✅ Doctor notes saved!" : out.message, out.status === "success");
    if(out.status==="success") doctorForm.reset();
  });
}

// Station 4
const pharmacyForm = document.getElementById("pharmacyForm");
if (pharmacyForm) {
  loadTokens();
  pharmacyForm.addEventListener("submit", async e => {
    e.preventDefault();
    const token = document.getElementById("tokenDropdown").value;
    const data = Object.fromEntries(new FormData(pharmacyForm).entries());
    const res = await fetch(WEBAPP_URL, {
      method: "POST",
      body: JSON.stringify({ station: "pharmacy", token, data }),
    });
    const out = await res.json();
    showMsg(out.status === "success" ? "✅ Pharmacy data saved!" : out.message, out.status === "success");
    if(out.status==="success") pharmacyForm.reset();
  });
}

// Dashboard
const dashboardTable = document.getElementById("dashboardTable");
if(dashboardTable){
  async function loadDashboard(){
    const res = await fetch(`${WEBAPP_URL}?action=getTokens`);
    const tokens = await res.json();
    const tbody = dashboardTable.querySelector("tbody");
    tbody.innerHTML="";
    tokens.forEach(token=>{
      const row = document.createElement("tr");
      row.innerHTML = `<td>${token}</td>
        <td>✅</td>
        <td>❌</td>
        <td>❌</td>
        <td>❌</td>`;
      tbody.appendChild(row);
    });
  }
  loadDashboard();
}
