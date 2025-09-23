import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Map = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'AIzaSyDE-2chTGwM3ZyKgIe3fdBuzuz6FkQcvBM', // this key should be private
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
  return <div ref={mapRef} style={{ height: '900px', width: '100vw' }} />;
};
export default Map;