import './index.css';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import RTScanPage from "./pages/RTScanPage.jsx";
import NetworkPage from "./pages/NetworkPage.jsx";
import InternetPage from "./pages/InternetPage.jsx";
import ToolsPage from "./pages/ToolsPage.jsx";
import TraceRoute from "./pages/tools/TraceRoute.jsx";
import PortScan from "./pages/tools/PortScan.jsx";
import PingTest from "./pages/tools/PingTest.jsx";
import DeviceDetail from "./pages/tools/DeviceDetails.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import {AuthProvider, useAuth} from "./pages/context/AuthContext.jsx";
import ViewProfilePage from "./pages/ViewProfilePage.jsx";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/rtscan" element={<PrivateRoute><RTScanPage /></PrivateRoute>} />
          <Route path="/network" element={<PrivateRoute><NetworkPage /></PrivateRoute>} />
          <Route path="/internet" element={<PrivateRoute><InternetPage /></PrivateRoute>} />
          <Route path="/tools" element={<PrivateRoute><ToolsPage /></PrivateRoute>} />
          <Route path="/tools/traceroute" element={<PrivateRoute><TraceRoute /></PrivateRoute>} />
          <Route path="/tools/portscan" element={<PrivateRoute><PortScan /></PrivateRoute>} />
          <Route path="/tools/pingtest" element={<PrivateRoute><PingTest /></PrivateRoute>} />
          <Route path="/device/:ip" element={<PrivateRoute><DeviceDetail /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ViewProfilePage /></PrivateRoute>} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
