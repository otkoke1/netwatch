import './index.css';
import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import RTScanPage from "./pages/RTScanPage.jsx";
import NetworkPage from "./pages/NetworkPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rtscan" element={<RTScanPage />} />
        <Route path="/network" element={<NetworkPage /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
