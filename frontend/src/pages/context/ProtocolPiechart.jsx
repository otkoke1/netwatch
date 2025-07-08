import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const COLOR_MAP = {
  TCP: "#1E40AF",
  UDP: "#D97706",
  ICMP: "#7C3AED",
  ARP: "#059669",
  Other: "#DC2626",
  Unknown: "#6B7280",
};

export default function ProtocolBarChart() {
  const [protocolData, setProtocolData] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/realtime/protocol-stats");
        const data = await res.json();
        setProtocolData(data);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        console.error("Error fetching protocol stats:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const labels = Object.keys(protocolData);
  const values = Object.values(protocolData);
  const total = values.reduce((sum, val) => sum + val, 0);

  const barData = {
    labels,
    datasets: [
      {
        label: "Packets",
        data: values,
        backgroundColor: labels.map((proto) => COLOR_MAP[proto] || "#9CA3AF"),
        borderRadius: 6,
        barThickness: 30,
      },
    ],
  };

  const barOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const count = context.parsed.x;
            const percentage = ((count / total) * 100).toFixed(1);
            return `${context.label}: ${count} packets (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: "#D1D5DB",
        },
        grid: {
          color: "#374151",
        },
      },
      y: {
        ticks: {
          color: "#D1D5DB",
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white/5 p-6 rounded-xl shadow-lg border border-white/10 max-w-4xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-1">Network Protocol Usage</h2>
        <p className="text-sm text-gray-400">Live traffic by packet count</p>
      </div>

      <div className="h-96">
        <Bar data={barData} options={barOptions} />
      </div>

      <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
        <span>Total Packets: <strong className="text-white">{total.toLocaleString()}</strong></span>
        <span>Last updated: <strong className="text-white">{lastUpdated}</strong></span>
      </div>
    </div>
  );
}
