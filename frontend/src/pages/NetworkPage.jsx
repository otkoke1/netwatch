import { Link } from "react-router-dom";
import {Globe} from "lucide-react";
import { useEffect } from "react";
import { useNetworkInfo } from "./context/NetworkContext";

export default function NetworkPage() {
  const { networkInfo, setNetworkInfo, fetched, setFetched } = useNetworkInfo();

  useEffect(() => {
    if (!fetched) {
      fetch("http://localhost:8000/api/networkinfo")
        .then(response => response.json())
        .then(data => {
          setNetworkInfo(data);
          setFetched(true);
        })
        .catch(error => console.error("Error fetching network info:", error));
    }
  }, [fetched]);

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
        <p className="text-md lg:text-lg text-gray-200">Keep track of your network details and configurations</p>
        <Globe size={40} className="text-white mx-auto mt-6" />
      </section>

      {/* Network Information Section */}
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
    <Link to={to} className="text-white hover:underline transition duration-150 text-sm lg:text-base xl:text-lg">
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