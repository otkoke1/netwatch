import { createContext, useContext, useState} from "react";

const NetworkContext = createContext();

export function NetworkInfoProvider({ children }) {
    const [networkInfo, setNetworkInfo] = useState(null);
    const [fetched, setFetched] = useState(false);

    return(
        <NetworkContext.Provider value={{ networkInfo, setNetworkInfo, fetched, setFetched }}>
            {children}
        </NetworkContext.Provider>
    )
}

export function  useNetworkInfo() {
    return useContext(NetworkContext);
}