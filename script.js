const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxHF7Vh_CMO3wQzalXDDKAU1c-96w4KV5NVraJu3Ls5SuY2U_RVpCGu9_hs1TFC2dHk/exec";

function showMsg(msg, success=true){
  const alertBox = document.getElementById("msg");
  if(!alertBox) return;
  alertBox.classList.remove("d-none","alert-success","alert-danger");
  alertBox.classList.add(success?"alert-success":"alert-danger");
  alertBox.textContent = msg;
}

async function loadFileNumbers(dropdownId){
  try{
    const res = await fetch(`${WEBAPP_URL}?action=getFileNumbers`);
    const fileNumbers = await res.json();
    const dropdown = document.getElementById(dropdownId);
    if(!dropdown) return;
    dropdown.innerHTML = "";
    if(fileNumbers.length===0){
      const opt = document.createElement("option");
      opt.value="";
      opt.textContent="No patients registered yet";
      dropdown.appendChild(opt);
      return;
    }
    fileNumbers.forEach(fn=>{
      const opt = document.createElement("option");
      opt.value=fn;
      opt.textContent=fn;
      dropdown.appendChild(opt);
    });
  }catch(err){
    console.error("Error loading File Numbers:", err);
  }
}

// Station 1
const regForm = document.getElementById("regForm");
if(regForm){
  regForm.addEventListener("submit", async e=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(regForm).entries());
    try{
      const res = await fetch(WEBAPP_URL,{
        method:"POST",
        body: JSON.stringify({station:"registration", data})
      });
      const out = await res.json();
      showMsg(out.status==="success"?`✅ Registered: File Number ${out.fileNumber}`:out.message,out.status==="success");
      if(out.status==="success") regForm.reset();
    }catch(err){
      showMsg("❌ Error: "+err,false);
    }
  });
}

// Stations 2,3,4
[
  {station:"triage", formId:"triageForm", dropdownId:"tokenDropdown"},
  {station:"doctor", formId:"doctorForm", dropdownId:"tokenDropdown"},
  {station:"pharmacy", formId:"pharmacyForm", dropdownId:"tokenDropdown"}
].forEach(s=>{
  const form = document.getElementById(s.formId);
  if(form){
    loadFileNumbers(s.dropdownId);
    form.addEventListener("submit", async e=>{
      e.preventDefault();
      const token = document.getElementById(s.dropdownId).value;
      if(!token){ showMsg("❌ Please select a File Number", false); return; }
      const data = Object.fromEntries(new FormData(form).entries());
      try{
        const res = await fetch(WEBAPP_URL,{
          method:"POST",
          body: JSON.stringify({station:s.station, data})
        });
        const out = await res.json();
        showMsg(out.status==="success"?`✅ ${s.station} submitted!`:out.message,out.status==="success");
        if(out.status==="success") form.reset();
        loadFileNumbers(s.dropdownId);
      }catch(err){
        showMsg("❌ Error: "+err,false);
      }
    });
  }
});

// Dashboard
const dashboardTable = document.getElementById("dashboardTable");
if(dashboardTable){
  async function loadDashboard(){
    try{
      const res = await fetch(`${WEBAPP_URL}?action=getDashboard`);
      const data = await res.json();
      const tbody = dashboardTable.querySelector("tbody");
      tbody.innerHTML = "";
      data.forEach(row=>{
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.fileNumber}</td>
          <td>${row.registration?"✅":"❌"}</td>
          <td>${row.triage?"✅":"❌"}</td>
          <td>${row.doctor?"✅":"❌"}</td>
          <td>${row.pharmacy?"✅":"❌"}</td>
        `;
        tbody.appendChild(tr);
      });
    }catch(err){console.error("Error loading dashboard:", err);}
  }
  loadDashboard();
  setInterval(()=>{ loadDashboard(); }, 5000);
}
