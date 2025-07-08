import { useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function AnomalyAlert() {
  const [anomaly, setAnomaly] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const fetchAnomalyStatus = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/realtime/protocol-stats");
        const data = await res.json();
        const tcp = data["TCP"] || 0;
        const total = Object.values(data).reduce((a, b) => a + b, 0);
        const pct = total ? (tcp / total) * 100 : 0;
        setAnomaly(pct >= 85);
        setPercentage(pct.toFixed(1));
        setLastChecked(new Date().toLocaleTimeString());
      } catch (err) {
        console.error("Error fetching anomaly status:", err);
      }
    };

    fetchAnomalyStatus();
    const interval = setInterval(fetchAnomalyStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`rounded-xl p-6 shadow-xl w-full max-w-md transition duration-300
      ${anomaly ? "bg-red-900/30 border border-red-500 text-red-100" : "bg-green-900/20 border border-green-500 text-green-100"}`}>

      <div className="flex items-center gap-3 mb-4">
        {anomaly ? <ShieldAlert size={28} className="text-red-300" /> : <ShieldCheck size={28} className="text-green-300" />}
        <h3 className="text-xl font-bold">
          {anomaly ? "Anomaly Detected" : "No Anomalies"}
        </h3>
      </div>

      <p className="text-sm leading-relaxed">
        {anomaly
          ? `⚠️ Suspicious spike in TCP traffic detected.`
          : "✅ Network traffic appears normal."}
      </p>

      <div className="mt-4 text-sm border-t border-white/10 pt-2 flex flex-col gap-1">
        <span>🔍 TCP Usage: <strong>{percentage}%</strong></span>
        <span>🕒 Last Checked: {lastChecked}</span>
      </div>
    </div>
  );
}
