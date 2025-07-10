import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { useEffect } from "react";
import { useNetworkInfo } from "./context/NetworkContext";
import { useDeviceInfo } from "./context/DeviceContext";
import { useNavigate } from "react-router-dom";


export default function NetworkPage() {
  const { networkInfo, setNetworkInfo } = useNetworkInfo();
  const { deviceList, setDeviceList } = useDeviceInfo();
  const navigate = useNavigate();

  useEffect(() => {
    if (!networkInfo) {
      fetch("http://localhost:8000/api/networkinfo")
        .then((res) => res.json())
        .then((data) => setNetworkInfo(data))
        .catch((err) => console.error("Error fetching network info:", err));
    }
  }, [networkInfo]);

  useEffect(() => {
    if (deviceList.length === 0) {
      fetch("http://localhost:8000/api/connected-devices")
        .then((res) => res.json())
        .then((data) => setDeviceList(data.devices || []))
        .catch((err) => console.error("Error fetching device list:", err));
    }
  }, [deviceList]);

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-orange-950 to-black text-white font-sans flex flex-col relative overflow-y-auto">
      {/* Navbar */}
      <header className="py-5 px-8 shadow-lg flex items-center w-full z-10 bg-opacity-80">
        <Link to="/" className="block w-fit">
          <h1 className="text-3xl font-bold tracking-wide cursor-pointer text-white">
            Netwatch
          </h1>
        </Link>
        <nav className="flex gap-8 justify-start ml-auto">
          <NavbarLink to="/network">Network</NavbarLink>
          <NavbarLink to="/internet">Internet</NavbarLink>
          <NavbarLink to="/tools">Tools</NavbarLink>
          <NavbarLink to="/rtscan">Real-Time Scan</NavbarLink>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 lg:px-16 text-center relative">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Network Monitoring</h2>
        <p className="text-md lg:text-lg text-gray-200">
          Keep track of your network details and configurations
        </p>
        <Globe size={40} className="text-white mx-auto mt-6" />
      </section>

      {/* Network Info Table */}
      <section className="py-12 px-4 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">Network Information</h3>
            <p className="text-1xl font-bold text-white">
              Last Update: {networkInfo ? new Date().toLocaleTimeString() : "Loading..."}
            </p>
          </div>
          {networkInfo ? (
            <table className="w-full rounded-lg shadow-md">
              <tbody className="text-gray-200 text-sm">
                <Row label="Subnet" value={networkInfo.subnet} />
                <Row label="Gateway IP Address" value={networkInfo.gateway_ip} />
                <Row label="Gateway MAC Address" value={networkInfo.gateway_mac} />
                <Row label="Local IP" value={networkInfo.local_ip} />
                <Row label="Interface Type" value={networkInfo.interface_type} />
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-sm">Loading network info...</p>
          )}
        </div>
      </section>

      {/* Devices Section */}
      <section className="py-12 px-4 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white">Devices</h3>
          </div>
          <div className="overflow-x-auto rounded-md shadow-md border border-gray-700">
            <table className="w-full text-left text-sm text-gray-200">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-3 border-b border-gray-700">IP Address</th>
                  <th className="px-4 py-3 border-b border-gray-700">MAC Address</th>
                  <th className="px-4 py-3 border-b border-gray-700">Vendor</th>
                  <th className="px-4 py-3 border-b border-gray-700">Status</th>
                  <th className="px-4 py-3 border-b border-gray-700">Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {deviceList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-400 py-6 animate-pulse">
                      Loading Devices.
                    </td>
                  </tr>
                ) : (
                  deviceList.map((device, idx) => (
                    <tr
                      key={idx}
                      onClick={() => navigate(`/device/${device.ip}`)}
                      className="border-b border-gray-800 hover:bg-white/5 transition-colors duration-150"
                    >
                      <td className="px-4 py-3">{device.ip}</td>
                      <td className="px-4 py-3">{device.mac}</td>
                      <td className="px-4 py-3">{device.vendor || "Unknown"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-semibold ${
                            device.available ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {device.available ? "Online" : "Offline"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{device.last_seen}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 mt-auto">
        <p className="text-sm">© 2025 Netwatch — All rights reserved</p>
        <p className="text-xs opacity-70 mt-1">Contact us at support@netwatch.io</p>
      </footer>
    </div>
  );
}

function NavbarLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-white hover:underline transition duration-150 text-sm lg:text-base xl:text-lg"
    >
      {children}
    </Link>
  );
}

function Row({ label, value }) {
  return (
    <tr className="border-b border-gray-600">
      <td className="font-semibold px-4 py-3 w-1/3">{label}</td>
      <td className="px-4 py-3">{value || "-"}</td>
    </tr>
  );
}
