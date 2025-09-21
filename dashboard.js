// 🔹 Replace with your deployed Web App URL
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzkHihudV-MHhzj2NLUbsLK2jjH75k5emY75sLGWHCmv6WF6lTLc8HYrxO_-rcZMuPO/exec";

// 🔹 Load dashboard data from Google Sheets
async function loadDashboard() {
  const tbody = document.getElementById("dashboardBody");
  tbody.innerHTML = "<tr><td colspan='8'>Loading...</td></tr>";

  try {
    const res = await fetch(WEBAPP_URL);
    const allData = await res.json();

    // Assuming allData is an array of objects from all sheets
    // Example format:
    // [{Token: "2025-09-21-001-Baldia", Sheet:"reception", ...}, {...}]

    const tokensMap = {};

    allData.forEach(row => {
      const token = row.Token || row.token; // token field from Reception
      if (!tokensMap[token]) {
        tokensMap[token] = {
          Token: token,
          VisitDate: row["Visit Date"] || "",
          FileNumber: row["File Number"] || "",
          Clinic: row.Clinic || "",
          Reception: false,
          Screening: false,
          Counsellor: false,
          Antidepressants: false
        };
      }

      switch (row.sheet) {
        case "reception": tokensMap[token].Reception = true; break;
        case "screening": tokensMap[token].Screening = true; break;
        case "counsellor": tokensMap[token].Counsellor = true; break;
        case "antidepressants": tokensMap[token].Antidepressants = true; break;
      }
    });

    tbody.innerHTML = ""; // clear loading row
    Object.values(tokensMap).forEach(tokenData => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${tokenData.Token}</td>
        <td>${tokenData.VisitDate}</td>
        <td>${tokenData.FileNumber}</td>
        <td>${tokenData.Clinic}</td>
        <td>${tokenData.Reception ? "✅" : "❌"}</td>
        <td>${tokenData.Screening ? "✅" : "❌"}</td>
        <td>${tokenData.Counsellor ? "✅" : "❌"}</td>
        <td>${tokenData.Antidepressants ? "✅" : "❌"}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("Error loading dashboard:", err);
    tbody.innerHTML = `<tr><td colspan='8'>❌ Error loading data</td></tr>`;
  }
}

// Load dashboard on page load
document.addEventListener("DOMContentLoaded", loadDashboard);
