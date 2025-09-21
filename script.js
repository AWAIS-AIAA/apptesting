const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyBypcYcijBIJQynVbfhGrhdsdaoNRSXAX-tqqG7fKD19MNQaoOWjk0NXIg1vFq55AB/exec"; // Replace with your Web App URL

// ---------------- Show messages ----------------
function showMsg(msg, success=true){
  const alertBox = document.getElementById("msg");
  if(!alertBox) return;
  alertBox.classList.remove("d-none","alert-success","alert-danger");
  alertBox.classList.add(success?"alert-success":"alert-danger");
  alertBox.textContent = msg;
}

// ---------------- Load Tokens into Dropdown ----------------
async function loadTokens(dropdownId){
  try{
    const res = await fetch(`${WEBAPP_URL}?action=getTokens`);
    const tokens = await res.json();
    const dropdown = document.getElementById(dropdownId);
    if(!dropdown) return;
    dropdown.innerHTML = "";
    if(tokens.length === 0){
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "No tokens available";
      dropdown.appendChild(opt);
      return;
    }
    tokens.forEach(t=>{
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      dropdown.appendChild(opt);
    });
  } catch(err){
    console.error("Error loading tokens:", err);
  }
}

// ---------------- Station 1 - Registration ----------------
const regForm = document.getElementById("regForm");
if(regForm){
  regForm.addEventListener("submit", async e=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(regForm).entries());
    try{
      const res = await fetch(WEBAPP_URL,{
        method:"POST",
        body: JSON.stringify({station:"registration", token:"", data})
      });
      const out = await res.json();
      showMsg(out.status==="success"?`✅ Token: ${out.token}`:out.message,out.status==="success");
      if(out.status==="success") regForm.reset();
    }catch(err){
      showMsg("❌ Error: "+err,false);
    }
  });
}

// ---------------- Stations 2, 3, 4 ----------------
[ 
  {station:"triage", formId:"triageForm", dropdownId:"tokenDropdown"},
  {station:"doctor", formId:"doctorForm", dropdownId:"tokenDropdown"},
  {station:"pharmacy", formId:"pharmacyForm", dropdownId:"tokenDropdown"}
].forEach(s=>{
  const form = document.getElementById(s.formId);
  if(form){
    loadTokens(s.dropdownId); // Load tokens on page load
    form.addEventListener("submit", async e=>{
      e.preventDefault();
      const token = document.getElementById(s.dropdownId).value;
      if(!token){ showMsg("❌ Please select a token", false); return; }
      const data = Object.fromEntries(new FormData(form).entries());
      try{
        const res = await fetch(WEBAPP_URL,{
          method:"POST",
          body: JSON.stringify({station:s.station, token, data})
        });
        const out = await res.json();
        showMsg(out.status==="success"?`✅ ${s.station} submitted!`:out.message,out.status==="success");
        if(out.status==="success") form.reset();
        loadTokens(s.dropdownId); // Refresh tokens if needed
      }catch(err){
        showMsg("❌ Error: "+err,false);
      }
    });
  }
});

// ---------------- Dashboard ----------------
const dashboardTable = document.getElementById("dashboardTable");
if(dashboardTable){
  async function loadDashboard(){
    try{
      const res = await fetch(`${WEBAPP_URL}?action=getTokens`);
      const tokens = await res.json();
      const tbody = dashboardTable.querySelector("tbody");
      tbody.innerHTML = "";
      tokens.forEach(token=>{
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${token}</td>
          <td>✅</td>
          <td>❌</td>
          <td>❌</td>
          <td>❌</td>
        `;
        tbody.appendChild(row);
      });
    }catch(err){
      console.error("Error loading dashboard:", err);
    }
  }
  loadDashboard();
}
