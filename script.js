const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyBypcYcijBIJQynVbfhGrhdsdaoNRSXAX-tqqG7fKD19MNQaoOWjk0NXIg1vFq55AB/exec"; // replace with your Web App URL

function showMsg(msg, success=true){
  const alertBox = document.getElementById("msg");
  if(!alertBox) return;
  alertBox.classList.remove("d-none","alert-success","alert-danger");
  alertBox.classList.add(success?"alert-success":"alert-danger");
  alertBox.textContent = msg;
}

async function loadTokens(){
  const res = await fetch(`${WEBAPP_URL}?action=getTokens`);
  const tokens = await res.json();
  document.querySelectorAll("#tokenDropdown").forEach(dropdown=>{
    dropdown.innerHTML="";
    tokens.forEach(t=>{
      const opt = document.createElement("option");
      opt.value=t;
      opt.textContent=t;
      dropdown.appendChild(opt);
    });
  });
}

// ---------------- Station 1 ----------------
const regForm = document.getElementById("regForm");
if(regForm){
  regForm.addEventListener("submit", async e=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(regForm).entries());
    const res = await fetch(WEBAPP_URL,{
      method:"POST",
      body: JSON.stringify({station:"registration", token:"", data})
    });
    const out = await res.json();
    showMsg(out.status==="success"?`✅ Token: ${out.token}`:out.message,out.status==="success");
    if(out.status==="success") regForm.reset();
  });
}

// ---------------- Stations 2,3,4 ----------------
["triage","doctor","pharmacy"].forEach(station=>{
  const form = document.getElementById(station+"Form");
  if(form){
    loadTokens();
    form.addEventListener("submit", async e=>{
      e.preventDefault();
      const token = document.getElementById("tokenDropdown").value;
      const data = Object.fromEntries(new FormData(form).entries());
      const res = await fetch(WEBAPP_URL,{
        method:"POST",
        body: JSON.stringify({station, token, data})
      });
      const out = await res.json();
      showMsg(out.status==="success"?`✅ ${station} saved!`:out.message,out.status==="success");
      if(out.status==="success") form.reset();
    });
  }
});

// ---------------- Dashboard ----------------
const dashboardTable = document.getElementById("dashboardTable");
if(dashboardTable){
  async function loadDashboard(){
    const res = await fetch(`${WEBAPP_URL}?action=getTokens`);
    const tokens = await res.json();
    const tbody = dashboardTable.querySelector("tbody");
    tbody.innerHTML="";
    tokens.forEach(token=>{
      const row = document.createElement("tr");
      row.innerHTML = `<td>${token}</td><td>✅</td><td>❌</td><td>❌</td><td>❌</td>`;
      tbody.appendChild(row);
    });
  }
  loadDashboard();
}
