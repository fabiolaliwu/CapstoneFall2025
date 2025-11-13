import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import './Map.css';
import { useNavigate } from 'react-router-dom';

const Map = ({ searchQuery, userLocation, openChatFromMap }) => {
  const mapRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [incidents, setIncidents] = useState([]);  
  const mapInstanceRef = useRef(null);
  const markerLibRef = useRef(null); 
  const eventMarkersRef = useRef([]); 
  const incidentMarkersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const navigate = useNavigate();

  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);


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

        // Direction route setup
        directionsServiceRef.current = new google.maps.DirectionsService();
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#0646cf',
            strokeOpacity: 0.8,
            strokeWeight: 6
          }
        
        });

      }
    });
  }, []);

  // Show route bettwen curren location and event/incident
  const showRoute = (origin, destination) => {
    if (!directionsServiceRef.current || !directionsRendererRef.current) return;

    directionsServiceRef.current.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result,status)=>{
        if(status===google.maps.DirectionsStatus.OK){
          directionsRendererRef.current.setDirections(result);
        }
        else{
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

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
    if (!infoWindowRef.current) {
      infoWindowRef.current = new google.maps.InfoWindow();
    }
    map.addListener('click', () => {
      infoWindowRef.current.close();
    });  

    // Add Event markers
    filteredEvents.forEach(event => {
      if (event.location?.coordinates) {
        const marker = new markerLibRef.current.AdvancedMarkerElement({
          map,
          position: event.location.coordinates,
          title: event.title,
          content: eventIcon.cloneNode(true)
        });

        const imageHtml = event.image ? `<img src="${event.image}" class="info-window-image" alt="Event Image" />` : '';

        marker.addListener('click', () => {
          const eventCoords = event.location.coordinates;
          const content = `
            <div class="info-window-content">
              <h3>${event.title}</h3>
              <p>${event.description}</p>
              ${imageHtml}
              <a class="map-link"
                id="show-route-event-${event._id}"
                href="https://www.google.com/maps/search/?api=1&query=${event.location.coordinates.lat},${event.location.coordinates.lng}"
                target="_blank">
                Show in Map
              </a>
              <a id="chat-link-event-${event._id}" class="map-link">
                  <span class="chat-icon"></span> Chat
              </a>
            </div>
          `;
          infoWindowRef.current.close();
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(map, marker);

          google.maps.event.addListener(infoWindowRef.current, 'domready', () => { 
            const chatLink = document.getElementById(`chat-link-event-${event._id}`);
            const routeLink = document.getElementById(`show-route-event-${event._id}`);
            if (chatLink) {
              chatLink.addEventListener('click', (e) => {
                e.preventDefault();
                openChatFromMap('event', event._id);
                infoWindowRef.current.close();
              });
            }
            if (routeLink && userLocation) {
              routeLink.addEventListener('click', (e) => {
                e.preventDefault();
                showRoute(userLocation, eventCoords);
                infoWindowRef.current.close();
              });
            } 
          });
        });
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

        const imageHtml = incident.image ? `<img src="${incident.image}" class="info-window-image" alt="Incident Image" />` : '';
        
        marker.addListener('click', () => {
          const content = `
            <div class="info-window-content">
              <h3>${incident.title}</h3>
              <p>${incident.description}</p>
              ${imageHtml}
              <a class="map-link"
                  href="https://www.google.com/maps/search/?api=1&query=${incident.location.coordinates.lat},${incident.location.coordinates.lng}"
                  target="_blank">
                  Show in Map
              </a>
              <a class="map-link" id="chat-link-incident-${incident._id}" >
                    <span class="chat-icon"></span> Chat
              </a>
            </div>
            `;
            infoWindowRef.current.close();
            infoWindowRef.current.setContent(content);
            infoWindowRef.current.open(map, marker);

            google.maps.event.addListener(infoWindowRef.current, 'domready', () => { 
              const chatLink = document.getElementById(`chat-link-incident-${incident._id}`);
              if (chatLink) {
                chatLink.addEventListener('click', (e) => {
                  e.preventDefault();
                  openChatFromMap('incident', incident._id);
                  infoWindowRef.current.close();
                });
              }
            });
          });
          incidentMarkersRef.current.push(marker);
        }
    });
  }, [events, incidents, searchQuery, userLocation, openChatFromMap]);

  return <div ref={mapRef} style={{ height: '100%', width: '94%', marginLeft: '6%'}} />;
};

export default Map;
