import { Link } from "react-router-dom";
import { Wifi } from "lucide-react";
import { useEffect, useState } from "react";

export default function InternetPage() {
  const [speedInfo, setSpeedInfo] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/speedtest")
      .then(response => response.json())
      .then(data => setSpeedInfo(data))
      .catch(error => console.error("Error fetching speed test data:", error));
  }, []);

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
      <section className="py-16 px-4 lg:px-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Internet Performance</h2>
        <p className="text-lg text-gray-200">
          Monitor and test your internet speed and reliability
        </p>
        <Wifi size={40} className="text-white mx-auto mt-6" />
      </section>

      {/* Speed Test Result Section */}
      <section className="py-12 px-4 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Speed Test Results</h3>
            <p className="text-1xl font-bold text-white">
              Last Update: {speedInfo ? new Date().toLocaleTimeString() : "Loading..."}
            </p>
          </div>
          {speedInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SpeedCard label="Download" value={speedInfo.download} unit="Mbps" />
              <SpeedCard label="Upload" value={speedInfo.upload} unit="Mbps" />
              <SpeedCard label="Ping" value={speedInfo.ping} unit="ms" />
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Loading speed test data...</p>
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

function SpeedCard({ label, value, unit }) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 shadow-lg border border-gray-700 flex flex-col items-center justify-center">
      <p className="text-sm uppercase text-gray-400">{label}</p>
      <h2 className="text-3xl font-extrabold text-white mt-2">
        {value !== null ? value.toFixed(2) : "..."} <span className="text-lg">{unit}</span>
      </h2>
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