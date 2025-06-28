import './index.css';
import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import RTScanPage from "./pages/RTScanPage.jsx";
import NetworkPage from "./pages/NetworkPage.jsx";
import InternetPage from "./pages/InternetPage.jsx";
import ToolsPage from "./pages/ToolsPage.jsx";
import TraceRoute from "./pages/tools/TraceRoute.jsx";
import PortScan from "./pages/tools/PortScan.jsx";
import PingTest from "./pages/tools/PingTest.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rtscan" element={<RTScanPage />} />
        <Route path="/network" element={<NetworkPage /> } />
        <Route path="/internet" element={<InternetPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/tools/traceroute" element={<TraceRoute />} />
        <Route path="/tools/portscan" element={<PortScan />} />
        <Route path="/tools/pingtest" element={<PingTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
