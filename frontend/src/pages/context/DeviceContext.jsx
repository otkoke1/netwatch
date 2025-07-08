import { createContext, useContext, useState } from "react";

const DeviceContext = createContext();

export function DeviceProvider({ children }) {
  const [connectedDevices, setConnectedDevices] = useState(null);
  const [fetched, setFetched] = useState(false);

  return (
    <DeviceContext.Provider value={{ connectedDevices, setConnectedDevices, fetched, setFetched }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDeviceInfo() {
  return useContext(DeviceContext);
}
