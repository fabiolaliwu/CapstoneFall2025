import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Map = ({ searchQuery }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null); 
  const [events, setEvents] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const eventMarkersRef = useRef([]); 
  const incidentMarkersRef = useRef([]);

  // Fetch events and incidents
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/events');
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };
    const fetchIncidents = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/incidents');
        const data = await res.json();
        setIncidents(data);
      } catch (err) {
        console.error('Error fetching incidents:', err);
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
      const map = new Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 12.25,
        mapId: 'ba9f438e91bcc80eeddbc99c'
      });
      mapInstanceRef.current = map;
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
      

    // Add Event markers
    filteredEvents.forEach(event => {
      if (event.location?.coordinates) {
        const marker = new google.maps.marker.AdvancedMarkerElement({
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
        const marker = new google.maps.marker.AdvancedMarkerElement({
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
  }, [events, incidents, searchQuery]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default Map;
