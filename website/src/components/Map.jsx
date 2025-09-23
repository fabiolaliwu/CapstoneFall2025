import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Map = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places'],
    });
    loader.load().then(() => {
      if (mapRef.current) {
        new google.maps.Map(mapRef.current, {
          center: { lat: 40.7128, lng: -74.0060 }, // data taken from google
          zoom: 12.25,
        });
      }
    });
  }, []);
  return <div ref={mapRef} style={{ height: '100vh', width: '100vw' }} />;
};
export default Map;