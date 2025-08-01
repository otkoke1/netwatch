import { useState, useRef } from "react";
import {Link, useNavigate} from "react-router-dom";
import { Server, X, UserCircle, LogOut, User } from "lucide-react";
import {useAuth} from "../context/AuthContext.jsx";
import {getPortDescription} from "../context/PortDescription.jsx";
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
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Server className="text-blue-600 animate-pulse" size={16} />
        </div>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <p className="text-blue-500 font-semibold animate-pulse">Scanning ports...</p>
        <p className="text-sm text-gray-400">This may take a few moments</p>
      </div>
    </div>
  );
}

function PortPopup({ port, onClose, onConfirm }) {
  const description = getPortDescription(port);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-900 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 relative animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <h3 className="text-xl font-bold mb-2">Port {port}</h3>
        <p className="text-sm text-gray-400 mb-4">{description}</p>
        <p className="text-gray-300 mb-6">
          Do you want to close this port? This action might affect your system's functionality.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            No
          </button>
          <button
            onClick={() => {
              onConfirm(port);
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Yes, Close Port
          </button>
        </div>
      </div>
    </div>
  );
}

function PortBadge({ port, isUDP, onClick }) {
  return (
    <button
      onClick={() => onClick(port)}
      className={`${
        isUDP ? "bg-orange-700" : "bg-blue-700"
      } px-3 py-1 rounded hover:opacity-80 transition-opacity animate-fade-in-down cursor-pointer`}
    >
      {port}
    </button>
  );
}

export default function PortScan() {
  const [address, setAddress] = useState("");
  const [tcpResults, setTcpResults] = useState(null);
  const [udpResults, setUdpResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPort, setSelectedPort] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleScan = async () => {
    if (tcpResults || udpResults) {
      setTcpResults(null);
      setUdpResults(null);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

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
        setTcpResults(data.tcp);
        setUdpResults(data.udp);
      }
    } catch (err) {
      setError("Failed to scan ports.");
    }

    setLoading(false);
  };

  const handlePortClick = (port) => {
    setSelectedPort(port);
  };

const handleClosePort = async (port) => {
    if (port < 9000 || port > 9999) {
        setError("Ports related to system are not allowed to be closed");
        return;
    }

    try {
        setError("");
        console.log(`Attempting to close port ${port}`);

        const res = await fetch("http://localhost:8000/api/closeport", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                port: parseInt(port),
                address: address
            }),
        });

        const data = await res.json();
        console.log("Server response:", data);

        if (!res.ok) {
            throw new Error(data.message || "Failed to close port");
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
        await handleScan();

    } catch (err) {
        console.error("Port closure error:", err);
        setError(err.message);
    }
};

  return (
    <div className="overflow-auto h-screen w-screen bg-gradient-to-r from-orange-950 to-black text-white font-sans flex flex-col">
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

      <section className="py-16 px-4 lg:px-16 text-center relative">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Port Scanner</h2>
        <p className="text-md lg:text-lg text-gray-200">
          Scan for any open port to detect services running on a server or security vulnerabilities.
        </p>
        <Server size={40} className="text-white mx-auto mt-6" />
      </section>

      <section className="py-8 px-4 lg:px-16 flex flex-col items-center gap-6">
        <div className="flex items-center bg-white bg-opacity-10 rounded-lg shadow-md p-4">
          <input
            type="text"
            placeholder="Website domain name or IP"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="bg-transparent text-white placeholder-gray-400 border-none outline-none rounded-lg px-4 py-2 w-64"
          />
          <button
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2 transition-all duration-300"
            onClick={handleScan}
            disabled={loading}
          >
            {loading ? "Scanning..." : (tcpResults || udpResults ? "Scan Again" : "Start Scan")}
          </button>
        </div>

        {loading && <LoadingIndicator />}

        {error && (
          <p className="text-red-400 animate-fade-in">{error}</p>
        )}

        {!loading && (tcpResults || udpResults) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg transform transition-all duration-300 hover:bg-opacity-15 animate-fade-in">
              <h3 className="text-xl font-bold mb-4">TCP Ports</h3>
              {tcpResults && (
                <div className="space-y-4">
                  <div className="animate-fade-in">
                    <p className="text-gray-300 mb-2">Target: {tcpResults.Target}</p>
                    <p className="text-gray-300 mb-4">IP: {tcpResults["Resolved IP"]}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 animate-fade-in">
                    {tcpResults["Open Ports"].length > 0 ? (
                      tcpResults["Open Ports"].map(port => (
                        <PortBadge
                          key={port}
                          port={port}
                          isUDP={false}
                          onClick={handlePortClick}
                        />
                      ))
                    ) : (
                      <p className="text-gray-400">No TCP ports found</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white bg-opacity-10 p-6 rounded-lg transform transition-all duration-300 hover:bg-opacity-15 animate-fade-in">
              <h3 className="text-xl font-bold mb-4">UDP Ports</h3>
              {udpResults && (
                <div className="space-y-4">
                  <div className="animate-fade-in">
                    <p className="text-gray-300 mb-2">Target: {udpResults.Target}</p>
                    <p className="text-gray-300 mb-4">IP: {udpResults["Resolved IP"]}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 animate-fade-in">
                    {udpResults["Open Ports"].length > 0 ? (
                      udpResults["Open Ports"].map(port => (
                        <PortBadge
                          key={port}
                          port={port}
                          isUDP={true}
                          onClick={handlePortClick}
                        />
                      ))
                    ) : (
                      <p className="text-gray-400">No UDP ports found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {selectedPort && (
        <PortPopup
          port={selectedPort}
          onClose={() => setSelectedPort(null)}
          onConfirm={handleClosePort}
        />
      )}

      <footer className="text-center py-6 mt-auto">
        <p className="text-sm">© 2025 Netwatch — All rights reserved</p>
        <p className="text-xs opacity-70 mt-1">Contact us at support@netwatch.io</p>
      </footer>
    </div>
  );
}