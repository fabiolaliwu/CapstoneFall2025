import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Map = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'AIzaSyDE-2chTGwM3ZyKgIe3fdBuzuz6FkQcvBM',
      version: 'weekly',
      libraries: ['places'],
    });

    loader.load().then(() => {
      if (mapRef.current) {
        new google.maps.Map(mapRef.current, {
          center: { lat: 37.7749, lng: -122.4194 }, 
          zoom: 12,
        });
      }
    });
  }, []);
  return <div ref={mapRef} style={{ height: '100vh', width: '100vw' }} />;
};
export default Map;