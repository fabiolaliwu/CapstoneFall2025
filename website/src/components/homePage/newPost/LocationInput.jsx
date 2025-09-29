import { useRef, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

export function useLocationInput(onChange) {
  const autocompleteRef = useRef(null);
  const locationInputRef = useRef(null);

  // Load google place API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // autocomplete form when Google Maps loads
  useEffect(() => {
    if(!isLoaded || !window.google) return;

    if (locationInputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        locationInputRef.current,
        { 
          types: ['geocode', 'establishment'],
          componentRestrictions: { country: 'us' }
        }
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.formatted_address) {
          onChange(place.formatted_address, place.geometry?.location);
        }
      });
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

            // Turn Lat and long to address
            geocoder.geocode({ location: latlng }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const address = results[0].formatted_address;
                    onChange(address, { lat: latitude, lng: longitude });
                if(locationInputRef.current) {
                    locationInputRef.current.value = address;
                }
                } else{
                    console.error("Geocoder faile: " + status);
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
    }
  };

  return { locationInputRef, autocompleteRef, isLoaded, handleUseMyLocation };
}

/**
Citation:
Address Autocomplete reference: https://www.youtube.com/watch?v=HlsubLyXMMw
*/


