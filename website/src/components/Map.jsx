import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Map = ({ searchQuery, userLocation }) => {
  const mapRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [incidents, setIncidents] = useState([]);  
  const mapInstanceRef = useRef(null);
  const markerLibRef = useRef(null); 
  const eventMarkersRef = useRef([]); 
  const incidentMarkersRef = useRef([]);

  // Fetch events and incidents
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

  // Initialize map only once
  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'marker'],
    });

    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

      markerLibRef.current = { AdvancedMarkerElement };

      if (mapRef.current && !mapInstanceRef.current) {
        const map = new Map(mapRef.current, {
          center: { lat: 40.7128, lng: -74.0060 },
          zoom: 12,
          mapId: 'ba9f438e91bcc80eeddbc99c'
        });
        mapInstanceRef.current = map;
      }
    });
  }, []);

  // Update markers when events, incidents, or searchQuery change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear previous markers
    eventMarkersRef.current.forEach(marker => marker.setMap(null));
    incidentMarkersRef.current.forEach(marker => marker.setMap(null));
    eventMarkersRef.current = [];
    incidentMarkersRef.current = [];

    const eventIcon = document.createElement('div');
    eventIcon.style.fontSize = '2rem';
    eventIcon.innerHTML = '📍';

    const incidentIcon = document.createElement('div');
    incidentIcon.style.fontSize = '2rem';
    incidentIcon.innerHTML = '⚠️';

    const filteredEvents = searchQuery
      ? events.filter(event =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : events;

    const filteredIncidents = searchQuery
      ? incidents.filter(incident =>
          incident.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : incidents;

    // User location marker
    if (userLocation) {
      const userMarkerIcon = document.createElement('div');
      userMarkerIcon.style.width = '16px'; 
      userMarkerIcon.style.height = '16px';
      userMarkerIcon.style.backgroundColor = '#1A73E8';
      userMarkerIcon.style.borderRadius = '50%';
      userMarkerIcon.style.border = '2px solid #FFFFFF'; 
      userMarkerIcon.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';

      const { AdvancedMarkerElement } = markerLibRef.current || {};
      if (AdvancedMarkerElement && userLocation) {
        const userMarker = new AdvancedMarkerElement({
          map,
          position: userLocation,
          title: "Current Location",
          content: userMarkerIcon,
        });
      }

      map.setCenter(userLocation);
      map.setZoom(15);
    }

    // Add Event markers
    filteredEvents.forEach(event => {
      if (event.location?.coordinates) {
        const marker = new markerLibRef.current.AdvancedMarkerElement({
          map,
          position: event.location.coordinates,
          title: event.title,
          content: eventIcon.cloneNode(true)
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<h3>${event.title}</h3><p>${event.description}</p>`
        });

        marker.addListener('click', () => infoWindow.open(map, marker));
        eventMarkersRef.current.push(marker);
      }
    });

    // Add Incident markers
    filteredIncidents.forEach(incident => {
      if (incident.location?.coordinates) {
        const marker = new markerLibRef.current.AdvancedMarkerElement({
          map,
          position: incident.location.coordinates,
          title: incident.title,
          content: incidentIcon.cloneNode(true)
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<h3>${incident.title}</h3><p>${incident.description}</p>`
        });

        marker.addListener('click', () => infoWindow.open(map, marker));
        incidentMarkersRef.current.push(marker);
      }
    });
  }, [events, incidents, searchQuery, userLocation]);

  return <div ref={mapRef} style={{ height: '100%', width: '94%', marginLeft: '6%'}} />;
};

export default Map;
