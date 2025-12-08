import { useRef, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const LIBRARIES = ['places'];

export function useLocationInput(onChange) {
  const autocompleteRef = useRef(null);
  const locationInputRef = useRef(null);

  // Load google place API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  // autocomplete form when Google Maps loads
  useEffect(() => {
    if(!isLoaded || !window.google) return;

    if (!autocompleteRef.current && locationInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        locationInputRef.current,
        {
          types: ['geocode', 'establishment'],
          componentRestrictions: { country: 'us' },
        }
      );
    
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          const geometry = place.geometry?.location;
          const coordinates = geometry
            ? { lat: geometry.lat(), lng: geometry.lng() }
            : null;
    
          console.log('Coordinates:', coordinates);
          onChange(place.formatted_address, coordinates);
        } else {
          console.error('No formatted address found for the selected place.');
        }
      });
      autocompleteRef.current = autocomplete;
    }    
  }, [isLoaded, onChange]);

  // Handle "Use My Location"  click
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocoder = new window.google.maps.Geocoder();
          const latlng = { lat: latitude, lng: longitude };

          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const address = results[0].formatted_address;
              // Return both address and coordinates
              onChange(address, { lat: latitude, lng: longitude });
              if(locationInputRef.current) {
                locationInputRef.current.value = address;
              }
            } else {
              console.error("Geocoder failed: " + status);
              alert("Unable to retrieve address. Please try again.");
            }
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          if(error.code === error.PERMISSION_DENIED) {
            alert('Location permission denied. Please allow location access.');
          } 
          else {
            alert('Error getting location: ' + error.message);
          }
        }
      );
    } else {
        alert('Geolocation is not supported by your browser.');
        return;
    }
  };

  return { locationInputRef, autocompleteRef, isLoaded, handleUseMyLocation };
}

/**
Citation:
Address Autocomplete reference: https://www.youtube.com/watch?v=HlsubLyXMMw
*/

