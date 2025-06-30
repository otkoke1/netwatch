import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import {useState} from "react";
import axios from "axios";

export default function TraceRoute() {
      const [target, setTarget] = useState("");
      const [hops, setHops] = useState([]);
      const [loading, setLoading] = useState(false);

      const handleTrace = async () => {
        if (!target) return;
        setLoading(true);
        setHops([]);

        try {
          const res = await axios.get(`http://localhost:8000/traceroute?target=${target}`);
          setHops(res.data);
        } catch (err) {
          console.error("Traceroute failed", err);
        } finally {
          setLoading(false);
        }
      };

    const validHops = hops.filter((hop) => hop.lat && hop.lon);
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
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Traceroute</h2>
        <MapPin size={40} className="text-white mx-auto mt-6" />
      </section>

        {/* Input bar */}
        <section className="py-8 px-4 lg:px-16 flex justify-center">
        <div className="flex items-center bg-white bg-opacity-10 rounded-lg shadow-md p-4">
          <input type="text" placeholder="Enter domain name" className="bg-transparent text-white placeholder-gray-400 border-none outline-none rounded-lg px-4 py-2 w-64"/>
          <button className="ml-4 bg-orange-700 hover:bg-orange-800 text-white font-semibold rounded-lg px-6 py-2">
            Start
          </button>
        </div>
        </section>

      {/* Content Section */}
      <section className="py-12 px-4 lg:px-16">
        <div className="max-w-6xl mx-auto text-center">
        </div>
      </section>

      <section className="py-12 px-4 lg:px-16">
        <div className="max-w-6xl mx-auto text-center">
          {validHops.length > 0 ? (
            <MapContainer
              center={[validHops[0].lat, validHops[0].lon]}
              zoom={4}
              scrollWheelZoom={true}
              style={{ height: "500px", width: "100%", borderRadius: "12px" }}
            >
              <TileLayer
                attribution='© OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {validHops.map((hop, idx) => (
                <Marker key={idx} position={[hop.lat, hop.lon]}>
                  <Popup>
                    <div>
                      <strong>Hop {hop.hop}</strong><br />
                      IP: {hop.ip}<br />
                      Status: {hop.status}
                    </div>
                  </Popup>
                </Marker>
              ))}
              <Polyline
                positions={validHops.map((hop) => [hop.lat, hop.lon])}
                color="orange"
              />
            </MapContainer>
          ) : !loading && (
            <p className="text-gray-400 text-sm">No result yet.</p>
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

