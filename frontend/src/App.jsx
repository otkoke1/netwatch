import './index.css';
import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import RTScanPage from "./pages/RTScanPage.jsx";
import NetworkPage from "./pages/NetworkPage.jsx";
import InternetPage from "./pages/InternetPage.jsx";
import ToolsPage from "./pages/ToolsPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rtscan" element={<RTScanPage />} />
        <Route path="/network" element={<NetworkPage /> } />
        <Route path="/internet" element={<InternetPage />} />
        <Route path="/tools" element={<ToolsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
