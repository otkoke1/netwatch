import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import PropTypes from "prop-types";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function PingLineChart({ data }) {
  if (!data || data.length === 0) return <p>No ping data</p>;

  const jitterList = data.map((val, i, arr) => (i === 0 ? 0 : Math.abs(val - arr[i - 1])));

  const chartData = {
    labels: data.map((_, i) => `Packet ${i + 1}`),
    datasets: [
      {
        label: "Latency (ms)",
        data,
        borderColor: "rgb(75, 192, 192)",
        yAxisID: "y-latency",
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Jitter (ms)",
        data: jitterList,
        borderColor: "rgb(255, 99, 132)",
        yAxisID: "y-jitter",
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // 👉 Cấu hình options
  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.raw;
            return `${label}: ${value} ms`;
          },
        },
      },
      legend: {
        position: "top",
      },
    },
    scales: {
      "y-latency": {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Latency (ms)",
        },
      },
      "y-jitter": {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "Jitter (ms)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
