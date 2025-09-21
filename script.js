// 🔹 Replace with your deployed Web App URL
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwiQF8kvbUfjCjxfQ0Gws9EKRDcTB-GyFfYcQRvfbgxbNr9tjIwA1zH6mZQebCbolkP/exec";

// 🔹 Load all available tokens from Reception for dropdowns
async function loadTokens(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.innerHTML = "<option value=''>Select Token</option>"; // default option
  try {
    const res = await fetch(WEBAPP_URL);           // fetch tokens via doGet
    const tokens = await res.json();
    tokens.forEach(token => {
      const option = document.createElement("option");
      option.value = token;
      option.text = token;
      dropdown.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading tokens:", err);
    alert("❌ Could not load tokens. Please try again.");
  }
}

// 🔹 Handle form submission for any station
function submitForm(formId, sheetName) {
  const form = document.getElementById(formId);
  form.addEventListener("submit", async e => {
    e.preventDefault();

    // Gather all form data into an object
    const data = { sheet: sheetName };
    [...form.elements].forEach(el => {
      if (el.name) {
        data[el.name] = el.value;
      }
    });

    try {
      // Send data to Google Apps Script Web App
      await fetch(WEBAPP_URL, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        mode: "no-cors" // required due to CORS limitations with GAS
      });

      alert("✅ Submitted successfully!");
      form.reset();

      // Reload tokens for downstream stations
      if (sheetName !== "reception") {
        loadTokens("tokenDropdown");
      }

    } catch (err) {
      console.error("Submission error:", err);
      alert("❌ Error submitting data: " + err);
    }
  });
}
