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
  if (!data || data.length === 0) return <p>Chưa có dữ liệu ping</p>;

  const chartData = {
    labels: data.map((_, i) => `Lần ${i + 1}`),
    datasets: [
      {
        label: "Ping (ms)",
        data,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3,
      },
    ],
  };

  return <Line data={chartData} />;
}

PingLineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
};
