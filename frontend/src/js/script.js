// NAVBAR TOGGLE (Mobile)
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("show");
}

// SMOOTH SCROLLING
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth"
      });
    }

    // Close menu on mobile after click
    document.getElementById("navLinks").classList.remove("show");
  });
});

// ==============================
// DYNAMIC STATUS (TEMP MOCK DATA)
// ==============================

// You will later replace this with real API calls

function updateTrafficStatus(congestion, accidentRisk) {
  const congestionLevels = document.querySelectorAll(".level");
  const statusText = document.querySelector(".status-text");

  // Reset styles
  congestionLevels.forEach(el => el.classList.remove("active"));

  if (congestion === "Low") {
    document.querySelector(".low").classList.add("active");
  } else if (congestion === "Medium") {
    document.querySelector(".medium").classList.add("active");
  } else if (congestion === "High") {
    document.querySelector(".high").classList.add("active");
  }

  if (accidentRisk === "Safe") {
    statusText.textContent = "SAFE";
    statusText.className = "status-text safe-text";
  } else {
    statusText.textContent = "RISKY";
    statusText.className = "status-text risky-text";
  }
}

// DEMO AUTO UPDATE (REMOVE LATER)
setTimeout(() => {
  updateTrafficStatus("High", "Risky");
}, 3000);

// ==============================
// BACKEND API CONNECTION (LATER)
// ==============================

// Example function (we will connect Flask here)
async function fetchLiveTrafficData() {
  try {
    const response = await fetch("http://localhost:5000/api/traffic/status");
    const data = await response.json();

    updateTrafficStatus(data.congestion, data.risk);
  } catch (error) {
    console.log("Backend not connected yet.");
  }
}

// Later you can call this every 5 seconds
// setInterval(fetchLiveTrafficData, 5000);
