import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import "./OffersStatsChartGeneralDash.css";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const OffersStatsChartGeneralDash = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:7001/api/dashboard/stats-per-day", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        const labels = Object.keys(data);

        const chartPoints = labels.map(day => {
          const companies = Object.entries(data[day]).map(([companyName, info]) => ({
            name: companyName,
            totalOffers: info.totalOffers,
            offers: info.offers,
            logo: info.logo
          }));

          const totalOffers = companies.reduce((sum, c) => sum + c.totalOffers, 0);
          return { day, totalOffers, companies };
        });

        const datasets = [{
          label: 'Total Offers',
          data: chartPoints.map(point => point.totalOffers),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 10,
          fill: true,
          tension: 0.5,
          borderWidth: 4,
        }];

        setChartData({ labels, datasets, chartPoints });

      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  if (!chartData) return (
    <div className="chart-container">
      <div className="loading-message">Loading chart...</div>
    </div>
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "top",
        labels: { usePointStyle: true, font: { size: 14, weight: '500' }, color: '#065f46' }
      },
      title: { 
        display: true, 
        text: "Total Offers per Day",
        font: { size: 20, weight: '600' },
        color: '#065f46',
        padding: 20
      },
      tooltip: {
        enabled: false,
        external: context => {
          let tooltipEl = document.getElementById('chartjs-tooltip');

          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.className = 'chart-tooltip';
            tooltipEl.style.opacity = 0; // cache au départ
            document.body.appendChild(tooltipEl);
          }

          const tooltipModel = context.tooltip;

          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          const index = tooltipModel.dataPoints[0].dataIndex;
          const point = chartData.chartPoints[index];

          // Contenu du tooltip
          let innerHtml = `<div class="tooltip-date">${point.day}</div>`;
          innerHtml += `<div class="tooltip-company-grid">`;
          point.companies.forEach(c => {
            const logoPath = `http://localhost:7001/images/${c.logo}`;
            innerHtml += `
              <div class="tooltip-company-card">
                <img src="${logoPath}" alt="${c.name}" class="tooltip-logo"/>
                <div class="tooltip-company-name">${c.name}</div>
                <div class="tooltip-offers">${c.offers.join(', ')}</div>
              </div>
            `;
          });
          innerHtml += `</div>`;
          tooltipEl.innerHTML = innerHtml;

          // Position dynamique
          const canvas = context.chart.canvas;
          const rect = canvas.getBoundingClientRect();
          const tooltipWidth = tooltipEl.offsetWidth;
          const tooltipHeight = tooltipEl.offsetHeight;

          let left = rect.left + window.pageXOffset + tooltipModel.caretX - tooltipWidth / 2;
          let top = rect.top + window.pageYOffset + tooltipModel.caretY - tooltipHeight - 10;

          // Limites écran
          if (left + tooltipWidth > window.innerWidth - 10) left = window.innerWidth - tooltipWidth - 10;
          if (left < 10) left = 10;
          if (top < 10) top = rect.top + window.pageYOffset + tooltipModel.caretY + 10;

          tooltipEl.style.left = left + "px";
          tooltipEl.style.top = top + "px";
          tooltipEl.style.opacity = 1;
        }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(16, 185, 129, 0.1)', drawBorder: false }, ticks: { color: '#065f46', font: { size: 13, weight: '500' } } },
      y: { beginAtZero: true, grid: { color: 'rgba(16, 185, 129, 0.1)', drawBorder: false }, ticks: { color: '#065f46', font: { size: 13, weight: '500' } } },
    },
    interaction: { intersect: true, mode: 'nearest' },
    elements: { line: { borderCapStyle: 'round', borderJoinStyle: 'round' } },
  };

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default OffersStatsChartGeneralDash;
