import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Ban, Gauge, Activity } from "lucide-react";
import { useDeviceInfo } from "../context/DeviceContext.jsx";
import { formatBytes, formatBandwidth } from "../context/formatters/byteFormatters.js";
import { useState, useEffect } from "react";


export default function DeviceDetail() {
  const { ip } = useParams();
  const { deviceList } = useDeviceInfo();
  const device = deviceList.find((d) => d.ip === ip);
  const [networkStats, setNetworkStats] = useState(null);

  useEffect(() => {
    const fetchNetworkStats = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/device-usage/${ip}`);
        const data = await response.json();
        console.log("Polling network stats:", data);
        if (data.status === "success") {
          setNetworkStats(data.data);
        } else {
          console.error("Error:", data.message);
        }
      } catch (error) {
        console.error("Error fetching network stats:", error);
      }
    };

    fetchNetworkStats();
    const interval = setInterval(fetchNetworkStats, 1000);
    return () => clearInterval(interval);
  }, [ip]);

  const handleBlockInternet = () => {
    console.log(`[+] Block Internet Access for ${device.ip}`);
  };

const checkNetworkUsage = async () => {
    try {
      // Show loading state
      setNetworkStats(null);

      const response = await fetch(`http://localhost:8000/api/device-usage/${ip}`);
      const data = await response.json();

      if (data.status === "success" && data.data) {
        const stats = data.data;
        setNetworkStats({
          bytes_sent: parseInt(stats.bytes_sent),
          bytes_received: parseInt(stats.bytes_received),
          bandwidth_sent: parseFloat(stats.bandwidth_sent),
          bandwidth_received: parseFloat(stats.bandwidth_received),
          packets_sent: parseInt(stats.packets_sent),
          packets_received: parseInt(stats.packets_received)
        });
      } else {
        console.error("Failed to get network stats:", data.message);
        // Set default values
        setNetworkStats({
          bytes_sent: 0,
          bytes_received: 0,
          bandwidth_sent: 0,
          bandwidth_received: 0,
          packets_sent: 0,
          packets_received: 0
        });
      }
    } catch (error) {
      console.error("Error checking network usage:", error);
      setNetworkStats(null);
    }
  };

  return (
    <div className="h-screen w-screen overflow-auto bg-gradient-to-r from-orange-950 to-black text-white font-sans flex flex-col">
      <div className="w-full max-w-6xl mx-auto mb-8">
        <Link to="/network" className="flex items-center gap-2 text-white hover:underline">
          <ArrowLeft size={20} />
          Back to Devices
        </Link>
      </div>

      {/* Device Info Box */}
      <div className="w-full max-w-6xl mx-auto bg-white/5 border border-gray-700 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Device Details</h2>

        {device ? (
          <>
            <table className="w-full text-left text-sm text-gray-200 table-auto mb-10">
              <tbody>
                <Row label="IP Address" value={device.ip} />
                <Row label="MAC Address" value={device.mac} />
                <Row label="Vendor" value={device.vendor || "Unknown"} />
                <Row
                  label="Status"
                  value={
                    <span className={`font-semibold ${device.available ? "text-green-400" : "text-red-400"}`}>
                      {device.available ? "Online" : "Offline"}
                    </span>
                  }
                />
                <Row label="Last Seen" value={device.last_seen} />
                <Row label="Response Time" value={device.response_time || "N/A"} />
              </tbody>
            </table>

            {/* Network Usage Stats */}
            {networkStats && (
              <div className="mb-10 bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Network Usage</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatsBox
                    label="Data Sent"
                    value={formatBytes(networkStats.bytes_sent)}
                    icon={<Activity className="text-orange-400" />}
                  />
                  <StatsBox
                    label="Data Received"
                    value={formatBytes(networkStats.bytes_received)}
                    icon={<Activity className="text-green-400" />}
                  />
                  <StatsBox
                    label="Bandwidth (Send)"
                    value={formatBandwidth(networkStats.bandwidth_sent)}
                    icon={<Gauge className="text-orange-400" />}
                  />
                  <StatsBox
                    label="Bandwidth (Receive)"
                    value={formatBandwidth(networkStats.bandwidth_received)}
                    icon={<Gauge className="text-green-400" />}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ActionButton icon={<Activity size={18} />} text="Check Network Usage" onClick={checkNetworkUsage} />
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400">Device not found.</p>
        )}
      </div>
    </div>
  );
}

function StatsBox({ label, value, icon }) {
  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-gray-400">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <tr className="border-b border-gray-800">
      <td className="py-3 text-gray-400">{label}</td>
      <td className="py-3">{value}</td>
    </tr>
  );
}

function ActionButton({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}
