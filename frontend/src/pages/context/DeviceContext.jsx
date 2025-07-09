import { createContext, useContext, useState } from "react";

const DeviceContext = createContext();

export function DeviceProvider({ children }) {
  const [connectedDevices, setConnectedDevices] = useState(null); // tổng số
  const [deviceList, setDeviceList] = useState([]);               // danh sách chi tiết
  const [fetched, setFetched] = useState(false);

  return (
    <DeviceContext.Provider
      value={{
        connectedDevices,
        setConnectedDevices,
        deviceList,
        setDeviceList,
        fetched,
        setFetched
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
}

export function useDeviceInfo() {
  return useContext(DeviceContext);
}
