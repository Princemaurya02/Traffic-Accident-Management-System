document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // UI FUNCTIONS
  // ==============================
  function toggleMenu() {
    const nav = document.getElementById("navLinks");
    if (nav) nav.classList.toggle("show");
  }

  // ==============================
  // ALERT + STATUS UPDATE
  // ==============================
  function updateTrafficStatus(congestion, accidentRisk) {
    const statusText = document.querySelector(".status-text");
    const alertBanner = document.getElementById("alertBanner");

    if (!statusText) return;

    if (accidentRisk === "Safe") {
      statusText.textContent = "SAFE";
      statusText.className = "status-text safe-text";
      if (alertBanner) alertBanner.classList.add("hidden");
    } else {
      statusText.textContent = "RISKY";
      statusText.className = "status-text risky-text";
      if (alertBanner) alertBanner.classList.remove("hidden");
    }
  }

  // ==============================
  // HISTORY
  // ==============================
  const historyList = document.getElementById("historyList");
  let historyData = [];

  function updateHistory(congestion, risk) {
    if (!historyList) return;

    const time = new Date().toLocaleTimeString();
    const entry = `${time} → Congestion: ${congestion}, Risk: ${risk}`;

    historyData.unshift(entry);
    if (historyData.length > 10) historyData.pop();

    historyList.innerHTML = historyData.map(item => `<li>${item}</li>`).join("");
  }

  // ==============================
  // FETCH LIVE DATA FROM BACKEND
  // ==============================
  async function fetchTrafficStatus() {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/traffic/status");
      const data = await response.json();

      const congestionEl = document.getElementById("congestion");
      const riskEl = document.getElementById("risk");

      if (congestionEl) congestionEl.textContent = data.congestion;
      if (riskEl) riskEl.textContent = data.risk;

      updateTrafficStatus(data.congestion, data.risk);
      updateHistory(data.congestion, data.risk);
      updateChart(data.congestion);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // First call
  fetchTrafficStatus();

  // Auto update every 5 seconds
  setInterval(fetchTrafficStatus, 5000);

  // ==============================
  // MAP INITIALIZATION
  // ==============================
  const mapContainer = document.getElementById("map");
  let map;

  if (mapContainer) {
    map = L.map("map").setView([19.0760, 72.8777], 12); // Mumbai

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    // Center marker
    L.marker([19.0760, 72.8777])
      .addTo(map)
      .bindPopup("Traffic Monitoring Center")
      .openPopup();
  }

  // ==============================
  // LOAD MAP MARKERS FROM BACKEND
  // ==============================
  async function loadMapMarkers() {
    if (!map) return;

    try {
      const response = await fetch("http://127.0.0.1:5000/api/traffic/map-points");
      const points = await response.json();

      points.forEach(point => {
        let color = "green";

        if (point.type === "accident") color = "red";
        if (point.type === "traffic") color = "orange";

        const circle = L.circleMarker([point.lat, point.lng], {
          radius: 10,
          color: color,
          fillColor: color,
          fillOpacity: 0.8
        }).addTo(map);

        circle.bindPopup(`Status: ${point.type}`);
      });

    } catch (error) {
      console.error("Error loading markers", error);
    }
  }

  loadMapMarkers();

  // ==============================
  // CHART.JS SETUP
  // ==============================
  const ctx = document.getElementById("trafficChart");
  let trafficChart;

  if (ctx) {
    trafficChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Congestion Level",
            data: [],
            borderColor: "#38bdf8",
            tension: 0.3,
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            min: 0,
            max: 3,
            ticks: {
              callback: function (value) {
                return ["Low", "Medium", "High"][value - 1] || "";
              }
            }
          }
        }
      }
    });
  }

  function updateChart(congestion) {
    if (!trafficChart) return;

    const mapValue = { "Low": 1, "Medium": 2, "High": 3 };
    if (!mapValue[congestion]) return;

    const time = new Date().toLocaleTimeString();

    trafficChart.data.labels.push(time);
    trafficChart.data.datasets[0].data.push(mapValue[congestion]);

    if (trafficChart.data.labels.length > 10) {
      trafficChart.data.labels.shift();
      trafficChart.data.datasets[0].data.shift();
    }

    trafficChart.update();
  }

});
