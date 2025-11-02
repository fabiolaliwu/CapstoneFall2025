import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Map = ({userLocation}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [events, setEvents] = useState([]);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    const fetchIncidents = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/incidents');
        const data = await response.json();
        setIncidents(data);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      }
    };

    fetchEvents();
    fetchIncidents();
  }, []);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'marker'],
    });

    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

      if (mapRef.current) {
        const mapInstance = new Map(mapRef.current, {
          center: { lat: 40.7128, lng: -74.0060 },
          zoom: 12,
          mapId: 'ba9f438e91bcc80eeddbc99c'
        });
        setMap(mapInstance);

        const eventMarkerIcon = document.createElement('div');
        eventMarkerIcon.style.fontSize = '2rem'; 
        eventMarkerIcon.innerHTML = '📍';

        const incidentMarkerIcon = document.createElement('div');
        incidentMarkerIcon.style.fontSize = '2rem';
        incidentMarkerIcon.innerHTML = '⚠️';

        if (userLocation) {
          const userMarkerIcon = document.createElement('div');
          // blue dot created by google gemini
          userMarkerIcon.style.width = '16px'; 
          userMarkerIcon.style.height = '16px';
          userMarkerIcon.style.backgroundColor = '#1A73E8';
          userMarkerIcon.style.borderRadius = '50%';
          userMarkerIcon.style.border = '2px solid #FFFFFF'; 
          userMarkerIcon.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';

          const userMarker = new AdvancedMarkerElement({
            map: mapInstance,
            position: userLocation,
            title: "Current Location",
            content: userMarkerIcon,
          });
      
          mapInstance.setCenter(userLocation);
          mapInstance.setZoom(15); 
        }

        // --- Add Event Markers ---
        events.forEach(event => {
          if (event.location && event.location.coordinates) {
            const marker = new AdvancedMarkerElement({
              map: mapInstance,
              position: event.location.coordinates,
              title: event.title,
              // Set the marker's content to the emoji element
              content: eventMarkerIcon.cloneNode(true),
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `
                  <h3>${event.title}</h3>
                  <p>${event.description}</p>
                `
            });
    
            marker.addListener('click', () => {
                infoWindow.open(mapInstance, marker);
            });
          }
        });

        // --- Add Incident Markers ---
        incidents.forEach(incident => {
          if (incident.location && incident.location.coordinates) {
            const marker = new AdvancedMarkerElement({
              map: mapInstance,
              position: incident.location.coordinates,
              title: incident.title,
              // Set the marker's content to the emoji element
              content: incidentMarkerIcon.cloneNode(true),
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `
                  <h3>${incident.title}</h3>
                  <p>${incident.description}</p>
                `
            });
    
            marker.addListener('click', () => {
                infoWindow.open(mapInstance, marker);
            });
          }
        });
      }
    });
  }, [events, incidents, userLocation]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default Map;