import { useState } from "react";
import { Link } from "react-router-dom";
import { Server } from "lucide-react";

export default function PortScan() {
  const [address, setAddress] = useState("");
  const [openPorts, setOpenPorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async () => {
    setLoading(true);
    setError("");
    setOpenPorts([]);
    try {
      const res = await fetch("http://localhost:8000/api/scanports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Scan Failed");
      } else {
        setOpenPorts(data["Open Ports"]);
      }
    }
    catch (err) {
      setError("Failed to scan for ports.");
    }
    setLoading(false);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-orange-950 to-black text-white font-sans flex flex-col">
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
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Port Scanner</h2>
        <p className="text-md lg:text-lg text-gray-200">Scan for open ports on a host</p>
        <Server size={40} className="text-white mx-auto mt-6" />
      </section>

      <section className="py-8 px-4 lg:px-16 flex justify-center">
        <div className="flex items-center bg-white bg-opacity-10 rounded-lg shadow-md p-4">
          <input
            type="text"
            placeholder="Website domain name or IP"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="bg-transparent text-white placeholder-gray-400 border-none outline-none rounded-lg px-4 py-2 w-64"
          />
          <button
            className="ml-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg px-6 py-2"
            onClick={handleScan}
            disabled={loading}
          >
            {loading ? "Scanning..." : "Start"}
          </button>
        </div>
      </section>
      <section className="py-12 px-4 lg:px-16">
        <div className="max-w-6xl mx-auto text-center">
          {error && <p className="text-red-400">{error}</p>}
          {openPorts.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-2">Open Ports:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {openPorts.map(port => (
                  <span key={port} className="bg-orange-700 px-3 py-1 rounded text-white">{port}</span>
                ))}
              </div>
            </div>
          )}
          {!loading && openPorts.length === 0 && !error && (
            <p className="text-gray-400">No open ports found or scan not started.</p>
          )}
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