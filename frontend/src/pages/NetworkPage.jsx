import { Link } from "react-router-dom";
import { Globe, Network, Scan, Wrench } from "lucide-react";
import { useState } from "react";

export default function NetworkPage() {
  const [networkInfo, setNetworkInfo] = useState({
    subnet: "",
    gateway_ip: "",
    gateway_mac: "",
    local_ip: "",
    dns: "",
    interface_type: ""
  });

  const fetchNetworkInfo = async () => {
    try {
      const response = await fetch("http://localhost:8000/networkinfo");
      const data = await response.json();

      if (data) {
        setNetworkInfo({
          subnet: data.subnet || "",
          gateway_ip: data.gateway_ip || "",
          gateway_mac: data.gateway_mac || "",
          local_ip: data.local_ip || "",
          dns: data.dns || "",
          interface_type: data.interface_type || "",
        });
      } else {
        console.error("Missing 'subnet' field in response");
      }
    } catch (err) {
      console.error("Failed to fetch network info", err);
    }
  };

  return (
    <div className="flex h-screen w-screen font-sans">
      {/* Sidebar */}
      <aside className="w-1/5 bg-[#052659] text-white p-6">
        <div>
          <h1 className="text-3xl font-bold mb-12 tracking-wide">Netwatch</h1>
          <nav className="text-lg">
            <SidebarLink to="/network" icon={Network}>Network</SidebarLink>
            <SidebarLink to="#" icon={Globe}>Internet</SidebarLink>
            <SidebarLink to="#" icon={Wrench}>Tools</SidebarLink>
            <SidebarLink to="/rtscan" icon={Scan}>Real-Time Scan</SidebarLink>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-[#C1E8FF] flex flex-col items-start justify-start pt-12 pl-10 font-sans overflow-y-auto pb-12">
        <div className="text-2xl font-semibold text-[#052659]">
          Your Subnet: <span className="font-bold">{networkInfo.subnet}</span>
        </div>
        <button className="mt-4 px-6 py-2 bg-gradient-to-r from-[#1B3C73] to-[#144272] text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 hover:brightness-110 transition-all duration-200 ease-in-out"
          onClick={fetchNetworkInfo}>
            Scan
        </button>

        <div className="flex items-center w-full mt-16">
          <span className="text-xl font-semibold text-[#052659] mr-4">Network Information</span>
          <div className="flex-grow max-w-[569px] min-h-0.5 bg-blue-500"></div>
        </div>

        {/* Table 1 */}
        <table className="mt-6 w-full max-w-3xl table-auto bg-white rounded-lg shadow-md">
          <tbody className="text-[#052659] text-sm">
            <Row label="Netmask" value={networkInfo.subnet} />
            <Row label="Gateway IP Address" value={networkInfo.gateway_ip} />
            <Row label="Gateway MAC Address" value={networkInfo.gateway_mac} />
            <Row label="Local IP" value={networkInfo.local_ip} />
            <Row label="DNS" value={networkInfo.dns} />
            <Row label="Interface Type" value={networkInfo.interface_type} />
          </tbody>
        </table>

        <div className="flex items-center w-full mt-16">
          <span className="text-xl font-semibold text-[#052659] mr-4">Setup</span>
          <div className="flex-grow max-w-[715px] min-h-0.5 bg-blue-500"></div>
        </div>

        {/* Table 2 */}
        <table className="mt-6 w-full max-w-3xl table-auto bg-white rounded-lg shadow-md">
          <tbody className="text-[#052659] text-sm">
            <Row label="ISP" value={networkInfo.subnet} />
            <Row label="Public Address" value={networkInfo.gateway_ip} />
            <Row label="Hostname" value={networkInfo.gateway_mac} />
            <Row label="Location" value={networkInfo.local_ip} />
            <Row label="Timezone" value={networkInfo.dns} />
          </tbody>
        </table>

      </main>
    </div>
  );
}

function SidebarLink({ to, icon: Icon, children }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-2 rounded transition duration-200 hover:bg-[#1B3C73] hover:underline mb-6 text-white"
    >
      {Icon && <Icon size={20} />}
      {children}
    </Link>
  );
}

function Row({ label, value }) {
  return (
    <tr className="border-b">
      <td className="font-semibold px-4 py-3 w-1/3">{label}</td>
      <td className="px-4 py-3">{value || "-"}</td>
    </tr>
  );
}
