import { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import API from "../api";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Charts() {
  const [summary, setSummary] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    API.get("/stats/summary").then((res) => setSummary(res.data));
    API.get("/stats/category-breakdown").then((res) => setBreakdown(res.data));
    API.get("/stats/prediction").then((res) => setPrediction(res.data.prediction));
  }, []);

  const labels = summary.map((s) =>
    new Date(s.month).toLocaleDateString("en-US", { month: "short", year: "numeric" })
  );

  const lineData = {
    labels: prediction ? [...labels, "Next Month"] : labels,
    datasets: [
      {
        label: "Net Cashflow",
        data: summary.map((s) => s.net),
        borderColor: "rgb(75, 192, 192)",
        fill: false,
      },
      ...(prediction
        ? [
            {
              label: "Predicted Expense",
              data: [...summary.map(() => null), prediction],
              borderColor: "rgb(255, 99, 132)",
              borderDash: [5, 5],
            },
          ]
        : []),
    ],
  };

  const pieData = {
    labels: breakdown.map((b) => b.category || "Uncategorized"),
    datasets: [
      {
        label: "Category Breakdown",
        data: breakdown.map((b) => b.total),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div className="grid grid-cols-2 gap-6 mt-6">
      <div className="bg-white shadow p-4 rounded-2xl">
        <h2 className="font-bold mb-2">Monthly Cashflow</h2>
        <Line data={lineData} />
      </div>
      <div className="bg-white shadow p-4 rounded-2xl">
        <h2 className="font-bold mb-2">Category Breakdown</h2>
        <Pie data={pieData} />
      </div>
      {prediction && (
        <div className="col-span-2 bg-yellow-100 p-4 rounded-2xl text-center font-semibold mt-2">
          📊 Predicted Next Month Expense: ${prediction.toFixed(2)}
        </div>
      )}
    </div>
  );
}
