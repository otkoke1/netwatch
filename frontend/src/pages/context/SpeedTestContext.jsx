import { createContext, useContext, useState } from "react";

const SpeedTestContext = createContext();

export function SpeedTestProvider({ children }) {
  const [speedInfo, setSpeedInfo] = useState(null);
  const [fetched, setFetched] = useState(false);

  return (
    <SpeedTestContext.Provider value={{ speedInfo, setSpeedInfo, fetched, setFetched }}>
      {children}
    </SpeedTestContext.Provider>
  );
}

export function useSpeedTest() {
  return useContext(SpeedTestContext);
}
