import React, { createContext, useContext, ReactNode } from 'react';
import { useLoadScript } from '@react-google-maps/api';

interface MapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const MapsContext = createContext<MapsContextType>({ isLoaded: false, loadError: undefined });

export const useMaps = () => useContext(MapsContext);

interface MapsProviderProps {
  children: ReactNode;
}

export const MapsProvider: React.FC<MapsProviderProps> = ({ children }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
  });

  return (
    <MapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </MapsContext.Provider>
  );
};
