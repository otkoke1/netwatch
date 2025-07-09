import { Link } from "react-router-dom";
import { Router, MonitorSmartphone } from "lucide-react";
import { useEffect } from "react";
import {useNetworkInfo} from "./context/NetworkContext.jsx";
import {useDeviceInfo} from "./context/DeviceContext.jsx";

export default function HomePage() {
  const {networkInfo, setNetworkInfo, fetched: networkFetched, setFetched: setNetworkFetched} = useNetworkInfo();
  const {connectedDevices, setConnectedDevices, fetched: deviceFetched, setFetched: setDeviceFetched} = useDeviceInfo();

  useEffect(() => {
    fetch("http://localhost:8000/api/networkinfo")
      .then((response) => response.json())
      .then((data) => {
        setNetworkInfo(data);
      })
      .catch((error) => console.error("Error fetching network info from Home:", error));
  }, []);


  useEffect(() => {
    fetch("http://localhost:8000/api/connected-devices")
      .then((response) => response.json())
      .then((data) => {
        if (data.total_devices !== undefined) {
          setConnectedDevices(data.total_devices);
        }
      })
      .catch((error) =>
        console.error("Error fetching connected devices from Home:", error)
      );
  }, []);

  const featureBoxes = [
      {
        name: "Connected Devices",
        description:
            connectedDevices !== null
          ? `Total Devices: ${connectedDevices}`
          : "Findind Devices..."
      },
      {
        name: "Internet Performance",
        description: "Testing your internet download and upload"
      },
      {
        name: "Security Measurement",
        description: "Access powerful tools for network management."
      },
    ];

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
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Welcome to Netwatch</h2>
        <p className="text-md lg:text-lg text-gray-200">Your personal network monitoring assistant</p>
        <div className="flex justify-center items-center mt-10 relative flex-col lg:flex-row gap-8 lg:gap-16">
          <div className="flex flex-col items-center mx-6 p-4 bg-white bg-opacity-10 rounded-lg shadow-lg hover:bg-opacity-20 transition-transform duration-300 hover:scale-105">
            <MonitorSmartphone size={50} className="text-white mb-4 hover:scale-110 transition-transform duration-300" />
            <p className="text-sm lg:text-base text-gray-300 font-medium">
              {networkInfo ? networkInfo.device_specs : "Loading..."}
            </p>
          </div>
          <div className="bg-white w-[2px] h-[40px] lg:h-[80px] my-4 lg:my-0"></div>
          <div className="flex flex-col items-center mx-6 p-4 bg-white bg-opacity-10 rounded-lg shadow-lg hover:bg-opacity-20 transition-transform duration-300 hover:scale-105">
            <Router size={50} className="text-white mb-4 hover:scale-110 transition-transform duration-300" />
            <p className="text-sm lg:text-base text-gray-300 font-medium">
              {networkInfo ? networkInfo.subnet : "Loading..."}
            </p>
          </div>
        </div>
      </section>

      {/* Feature Boxes */}
      <section className="py-12 px-4 lg:px-16 ">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureBoxes.map((box, index) => (
            <div
              key={index}
                className="bg-white bg-opacity-20 rounded-xl shadow-md p-6 h-[180px] lg:h-[220px] flex flex-col items-center justify-center text-center text-gray-200 text-lg font-semibold"
            >
              <h3 className="text-xl font-bold mb-2">{box.name}</h3>
              <p className="text-sm">{box.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 mt-auto">
        <p className="text-sm">© 2025 Netwatch — All rights reserved</p>
        <p className="text-xs opacity-70 mt-1">Contact us at dhung1838ygw@gmail.com</p>
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