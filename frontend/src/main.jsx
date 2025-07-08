import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'leaflet/dist/leaflet.css';
import {SpeedTestProvider} from "./pages/context/SpeedTestContext.jsx";
import {NetworkInfoProvider} from "./pages/context/NetworkContext.jsx";
import {DeviceProvider} from "./pages/context/DeviceContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <SpeedTestProvider>
        <NetworkInfoProvider>
            <DeviceProvider>
                <App />
            </DeviceProvider>
        </NetworkInfoProvider>
    </SpeedTestProvider>
);

