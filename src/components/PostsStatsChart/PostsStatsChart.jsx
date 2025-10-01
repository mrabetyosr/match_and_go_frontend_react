import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import "./PostsStatsChart.css"; // <-- import du CSS

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PostsStatsChart = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:7001/api/dashboard/posts-per-day", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Erreur fetch stats:", err);
      }
    };
    fetchStats();
  }, []);

  const data = {
    labels: stats.map((item) => item.date),
    datasets: [
      {
        label: "Posts per day",
        data: stats.map((item) => item.count),
        backgroundColor: "rgba(34,197,94,0.8)", // vert
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
    external: (context) => {
  let tooltipEl = document.getElementById("chartjs-custom-tooltip");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.id = "chartjs-custom-tooltip";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.background = "#fff";
    tooltipEl.style.border = "1px solid #e5e7eb";
    tooltipEl.style.borderRadius = "8px";
    tooltipEl.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
    tooltipEl.style.padding = "10px";
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.transition = "all 0.1s ease";
    document.body.appendChild(tooltipEl);
  }

  const tooltipModel = context.tooltip;

  if (tooltipModel.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  if (tooltipModel.dataPoints) {
    const index = tooltipModel.dataPoints[0].dataIndex;
    const item = stats[index];

    tooltipEl.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <img src="http://localhost:7001/images/${item.user.image}" 
             alt="avatar" 
             style="width:45px;height:45px;border-radius:50%;object-fit:cover;" />
        <div>
          <div style="font-weight:bold;color:#111827;font-size:14px;">
            ${item.user.username}
          </div>
          <div style="color:#374151;font-size:13px;">
            ${item.count} post${item.count > 1 ? "s" : ""}
          </div>
          <div style="font-size:12px;color:#6b7280;">
            ${item.date}
          </div>
        </div>
      </div>
    `;
  }

  const canvasRect = context.chart.canvas.getBoundingClientRect();
  const caretX = tooltipModel.caretX;
  const caretY = tooltipModel.caretY;

  tooltipEl.style.opacity = 1;

  // Centre horizontalement
  tooltipEl.style.left = canvasRect.left + window.scrollX + caretX - tooltipEl.offsetWidth / 2 + "px";

  // Position verticale adaptative
  const spaceAbove = caretY;
  const spaceBelow = canvasRect.height - caretY;

  if (spaceAbove > tooltipEl.offsetHeight + 10) {
    // assez d'espace au-dessus → afficher au-dessus
    tooltipEl.style.top = canvasRect.top + window.scrollY + caretY - tooltipEl.offsetHeight - 10 + "px";
  } else {
    // pas assez d'espace → afficher en dessous
    tooltipEl.style.top = canvasRect.top + window.scrollY + caretY + 10 + "px";
  }
}

,
      },
    },
    scales: {
      x: { ticks: { color: "#374151", font: { weight: "bold" } }, grid: { display: false } },
      y: { ticks: { color: "#374151" }, grid: { color: "#e5e7eb" } },
    },
  };

  return (
    <div className="posts-chart-card">
      <h2>Posts per Day</h2>
      <div className="posts-chart-container">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default PostsStatsChart;
