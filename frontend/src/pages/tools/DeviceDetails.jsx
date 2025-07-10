import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Ban, Gauge, Activity } from "lucide-react";
import { useDeviceInfo } from "../context/DeviceContext.jsx";

export default function DeviceDetail() {
  const { ip } = useParams();
  const { deviceList } = useDeviceInfo();
  const device = deviceList.find((d) => d.ip === ip);

  const handleLimitUsage = () => {
    console.log(`[+] Limit Internet Usage for ${device.ip}`);
    // TODO: Call API or run script
  };

  const handleBlockInternet = () => {
    console.log(`[+] Block Internet Access for ${device.ip}`);
    // TODO: Call API or firewall command
  };

  const handlePortScan = () => {
    console.log(`[+] Check Open Port for ${device.ip}`);
    // TODO: Redirect to scan result or call API
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-orange-950 to-black text-white font-sans flex flex-col px-6 py-10">
      {/* Back Button */}
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

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ActionButton icon={<Gauge size={18} />} text="Limit Internet Usage" onClick={handleLimitUsage} />
              <ActionButton icon={<Ban size={18} />} text="Block Internet Access" onClick={handleBlockInternet} />
              <ActionButton icon={<Activity size={18} />} text="Check Network Usage " onClick={handlePortScan} />
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400">Device not found.</p>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <tr className="border-b border-gray-700">
      <td className="px-4 py-3 font-semibold w-1/3">{label}</td>
      <td className="px-4 py-3">{value}</td>
    </tr>
  );
}

function ActionButton({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-orange-800 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition duration-200"
    >
      {icon}
      {text}
    </button>
  );
}
