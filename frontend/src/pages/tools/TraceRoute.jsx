import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function TraceRoute() {
  const [hops, setHops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState("");

    async function handleTraceroute() {
      if (!target) return;
      setLoading(true);
      setHops([]);
      try {
        const res = await fetch('http://localhost:8000/api/traceroute?target=' + encodeURIComponent(target));
        const hopsData = await res.json();
        setHops(hopsData.filter(hop => hop.ip));
      } catch (e) {
        console.error("Traceroute error:", e);
        alert("Failed to fetch traceroute results.");
      }
      setLoading(false);
    }

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
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 lg:px-16 text-center relative">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Traceroute</h2>
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

      {/* Results */}
      <section className="py-12 px-4 lg:px-16">
        <div className="max-w-6xl mx-auto text-center">{hops.length > 0 && (
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