import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useMaps } from '../contexts/MapsContext';

export interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  address?: string;
}

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  markers: MapMarker[];
  zoom?: number;
  height?: string;
  className?: string;
}

const Map: React.FC<MapProps> = ({ center, markers, zoom = 12, height = '400px', className = '' }) => {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const { isLoaded, loadError } = useMaps();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (loadError) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center text-gray-500">
          <i className="fas fa-map-marked-alt text-4xl mb-2"></i>
          <p>Error loading maps</p>
        </div>
      </div>
    );
  }

  if (!isLoaded || !apiKey) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center text-gray-500">
          <i className="fas fa-map-marked-alt text-4xl mb-2"></i>
          <p>{!apiKey ? 'Map unavailable - API key not configured' : 'Loading map...'}</p>
        </div>
      </div>
    );
  }

  const containerStyle = {
    width: '100%',
    height: height,
  };

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.title}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <h3 className="font-bold text-primary-600 mb-1">{selectedMarker.title}</h3>
              {selectedMarker.address && (
                <p className="text-sm text-gray-600">{selectedMarker.address}</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;
