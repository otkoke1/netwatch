import { useState, useRef } from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import { Link } from "react-router-dom";
import { Wifi,UserCircle, LogOut, User } from "lucide-react";
import PingLineChart from "../PingChart.jsx";


export default function PingTest() {
  const [host, setHost] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handlePing = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    if (!host.trim()) {
      setError("Host cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/pingresult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Ping Failed");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Failed to ping the host.");
    }
    setLoading(false);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-r overflow-auto from-orange-950 to-black text-white font-sans flex flex-col">
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
        <div className="relative ml-6" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-white hover:text-gray-300 focus:outline-none"
          >
            <UserCircle size={32} className="transition-transform hover:scale-105" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-3 w-44 bg-blend-color-burn rounded-xl shadow-xl py-2 z-50 fade-in-up">
              <button
                onClick={() => {setMenuOpen(false); navigate("/profile")}}
                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-100 hover:text-blue-600 transition-colors"
              >
                <User size={16} className="mr-2" /> View Profile
              </button>
              <div className="border-t my-1" />
              <button
                onClick={() => {setMenuOpen(false); logout();}}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
              >
                <LogOut size={16} className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 lg:px-16 text-center relative">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ping Test</h2>
        <p className="text-md lg:text-lg text-gray-200">Test the connectivity to a host</p>
        <Wifi size={40} className="text-white mx-auto mt-6" />
      </section>

      {/* Input Section */}
      <section className="py-8 px-4 lg:px-16 flex justify-center">
        <div className="flex items-center bg-white bg-opacity-10 rounded-lg shadow-md p-4">
          <input
            type="text"
            placeholder="Website domain name or IP"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="bg-transparent text-white placeholder-gray-400 border-none outline-none rounded-lg px-4 py-2 w-64"
          />
          <button
            className="ml-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg px-6 py-2"
            onClick={handlePing}
            disabled={loading}
          >
            {loading ? "Pinging..." : "Start"}
          </button>
        </div>
      </section>

      {/* Result Section */}
      <section className="py-12 px-4 lg:px-16">
        <div className="max-w-6xl mx-auto text-center">
          {error && (
            <div className="text-red-400 animate-fade-in-down p-4 bg-red-900 bg-opacity-20 rounded-lg">
              {error}
            </div>
          )}

          {loading && <LoadingIndicator />}

          {result && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-4 gap-4 border-t border-gray-500 pt-4">
                {/* Target Host */}
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <h3 className="text-lg font-bold">Target Host</h3>
                  <p className="text-gray-300">{result.target_host}</p>
                </div>
                {/* Address */}
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <h3 className="text-lg font-bold">Address</h3>
                  <p className="text-gray-300">{result.address}</p>
                </div>
                {/* Provider */}
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <h3 className="text-lg font-bold">Provider</h3>
                  <p className="text-gray-300">{result.provider}</p>
                </div>
                {/* Location */}
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <h3 className="text-lg font-bold">Location</h3>
                  <p className="text-gray-300">{result.location}</p>
                </div>
              </div>

              <div className="mt-8 bg-white bg-opacity-10 rounded-lg shadow-md p-4">
                <h3 className="text-lg font-bold mb-4">Ping Result</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-300">Average Ping:</p>
                    <p className="text-blue-500 font-semibold">{result.average_ping_ms} ms</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Minimum Ping:</p>
                    <p className="text-green-600 font-semibold">
                      {result.rtt_list.length ? Math.min(...result.rtt_list) : "-"} ms
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300">Maximum Ping:</p>
                    <p className="text-red-600 font-semibold">
                      {result.rtt_list.length ? Math.max(...result.rtt_list) : "-"} ms
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300">Packet Loss:</p>
                    <p className="text-purple-600 font-semibold">{result.packet_loss_percent}%</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Received (Total):</p>
                    <p className="text-green-600 font-semibold">{result.success_count}/{result.total_count}</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Jitter:</p>
                    <p className="text-pink-400 font-semibold">{result.jitter_ms} ms</p>
                  </div>
                </div>
              </div>

              {/* Ping Timeline */}
              {result?.rtt_list?.length > 0 && (
                <div className="mt-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
                  <h3 className="text-lg font-bold mb-4">Ping Timeline</h3>
                  <PingLineChart data={result.rtt_list} />
                </div>
              )}
            </div>
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

function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center space-y-4 my-8">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Wifi className="text-orange-600 animate-pulse" size={16} />
        </div>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <p className="text-orange-500 font-semibold animate-pulse">Pinging host...</p>
        <p className="text-sm text-gray-400">This may take a few seconds</p>
      </div>
    </div>
  );
}