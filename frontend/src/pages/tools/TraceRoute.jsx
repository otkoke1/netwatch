import { Link } from "react-router-dom";
import { MapPin, UserCircle, User, LogOut } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";


export default function TraceRoute() {
  const [hops, setHops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState("");
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const { logout } = useAuth();


  async function handleTraceroute() {
    setError("");
    setHops([]);

    if (!target.trim()) {
      setError("Target host cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/traceroute?target=' + encodeURIComponent(target));
      const hopsData = await res.json();

      if (!res.ok) {
        throw new Error(hopsData.detail || "Traceroute failed");
      }

      setHops(hopsData.filter(hop => hop.ip));
    } catch (e) {
      console.error("Traceroute error:", e);
      setError(e.message || "Failed to fetch traceroute results.");
    } finally {
      setLoading(false);
    }
  }

  // Extract coordinates for hops with lat/lon
  const hopCoords = hops
    .filter(hop => hop.lat && hop.lon)
    .map(hop => [hop.lat, hop.lon]);

  // Center map on first hop with coordinates, or fallback
  const mapCenter = hopCoords.length > 0 ? hopCoords[0] : [20, 0];

  return (
    <div className="h-screen w-screen overflow-auto bg-gradient-to-r from-orange-950 to-black text-white font-sans flex flex-col">
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
        <h2 className="text-3xl lg:text-4xl font-bold mb-4" >Traceroute</h2>
        <MapPin size={40} className="text-white mx-auto mt-6" />
      </section>

      {/* Input bar */}
      <section className="py-8 px-4 lg:px-16 flex justify-center">
        <div className="flex items-center bg-white bg-opacity-10 rounded-lg shadow-md p-4">
          <input
            type="text"
            placeholder="Enter domain name"
            className="bg-transparent text-white placeholder-gray-400 border-none outline-none rounded-lg px-4 py-2 w-64"
            value={target}
            onChange={e => setTarget(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleTraceroute()}
          />
          <button
            className="ml-4 bg-orange-700 hover:bg-orange-800 text-white font-semibold rounded-lg px-6 py-2"
            onClick={handleTraceroute}
            disabled={loading}>
            {loading ? "Tracing..." : "Start"}
          </button>
        </div>
      </section>

      {error && (
          <div className="mt-4 text-red-400 animate-fade-in-down p-4 bg-red-900 bg-opacity-20 rounded-lg">
            {error}
          </div>
        )}

      {/* Results */}
      <section className="py-12 px-4 lg:px-16">
        <div className="max-w-6xl mx-auto text-center">
          {loading && <LoadingIndicator />}

          {!loading && hops.length > 0 && (
            <>
              <div className="mb-4 text-lg font-semibold animate-fade-in">
                Total hops: {hops.length}
              </div>
              <div className="overflow-x-auto mb-8">
                <table className="min-w-full bg-white bg-opacity-10 rounded-lg text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Hop</th>
                      <th className="px-4 py-2">IP Address</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">City</th>
                      <th className="px-4 py-2">Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hops.map((hop, idx) => (
                      <tr key={idx} className="border-b border-white border-opacity-10">
                        <td className="px-4 py-2">{hop.hop}</td>
                        <td className="px-4 py-2">{hop.ip || <span className="text-gray-400">No response</span>}</td>
                        <td className="px-4 py-2 capitalize">{hop.status}</td>
                        <td className="px-4 py-2">{hop.city === null ? "Private/Reserved" : hop.city}</td>
                        <td className="px-4 py-2">{hop.country === null ? "Private/Reserved" : hop.country}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {hopCoords.length > 0 && (
                <div className="w-full h-[600px] mb-8 rounded-lg overflow-hidden">
                  <MapContainer
                    center={mapCenter}
                    zoom={2}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    {hopCoords.map(([lat, lon], idx) => (
                      <Marker key={idx} position={[lat, lon]}>
                        <Popup>
                          Hop {hops[idx].hop}: {hops[idx].ip}
                          <br />
                          {hops[idx].city}, {hops[idx].country}
                        </Popup>
                      </Marker>
                    ))}
                    <Polyline positions={hopCoords} color="orange" />
                  </MapContainer>
                </div>
              )}
            </>
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
          <MapPin className="text-orange-600 animate-pulse" size={16} />
        </div>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <p className="text-orange-500 font-semibold animate-pulse">Tracing route...</p>
        <p className="text-sm text-gray-400">This may take a few seconds</p>
      </div>
    </div>
  );
}