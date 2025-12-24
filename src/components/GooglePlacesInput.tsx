import React, { useEffect, useRef, useState } from 'react';
import { MapPin, X } from 'lucide-react';

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

interface GooglePlacesInputProps {
  value: string;
  onChange: (address: string, placeData?: any) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  city?: string;
}

const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  value,
  onChange,
  placeholder = "Search for a location...",
  className = "",
  required = false,
  city = ""
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Load Google Maps script
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_API_KEY' || apiKey === 'your_google_maps_api_key_here') {
      console.warn('Google Maps API key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file');
      return;
    }

    if (window.google && window.google.maps) {
      setIsGoogleLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGoogleLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Google Maps API. Please check your API key.');
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Initialize autocomplete when Google Maps is loaded
  useEffect(() => {
    if (!isGoogleLoaded || !inputRef.current) return;

    try {
      const options = {
        componentRestrictions: city ? { country: 'kh' } : undefined, // Restrict to Cambodia
        fields: ['formatted_address', 'geometry', 'address_components', 'name', 'place_id'],
        types: ['address', 'establishment'] // Allow addresses and establishments
      };

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );

      autocompleteRef.current.addListener('place_changed', () => {
        try {
          const place = autocompleteRef.current.getPlace();
          
          if (place.geometry && place.geometry.location) {
            const address = place.formatted_address || place.name || value;
            const location = {
              lat: typeof place.geometry.location.lat === 'function' 
                ? place.geometry.location.lat() 
                : place.geometry.location.lat,
              lng: typeof place.geometry.location.lng === 'function'
                ? place.geometry.location.lng()
                : place.geometry.location.lng
            };

            setSelectedLocation(location);
            onChange(address, {
              formatted_address: place.formatted_address,
              geometry: location,
              address_components: place.address_components,
              place_id: place.place_id
            });

            // Initialize map if not already shown
            if (!showMap) {
              setShowMap(true);
            }
          }
        } catch (error) {
          console.error('Error handling place selection:', error);
        }
      });

      return () => {
        if (autocompleteRef.current && window.google?.maps?.event) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
    }
  }, [isGoogleLoaded, city, onChange, value, showMap]);

  // Initialize map when location is selected
  useEffect(() => {
    if (!showMap || !selectedLocation || !mapRef.current || !isGoogleLoaded) return;

    try {
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: selectedLocation,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true
        });

        markerRef.current = new window.google.maps.Marker({
          map: mapInstanceRef.current,
          draggable: true,
          animation: window.google.maps.Animation.DROP
        });

        // Update location when marker is dragged
        markerRef.current.addListener('dragend', (event: any) => {
          try {
            const newLocation = {
              lat: typeof event.latLng.lat === 'function' ? event.latLng.lat() : event.latLng.lat,
              lng: typeof event.latLng.lng === 'function' ? event.latLng.lng() : event.latLng.lng
            };
            setSelectedLocation(newLocation);
            
            // Reverse geocode to get address
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: newLocation }, (results: any[], status: string) => {
              if (status === 'OK' && results[0]) {
                onChange(results[0].formatted_address, {
                  formatted_address: results[0].formatted_address,
                  geometry: newLocation,
                  address_components: results[0].address_components
                });
              }
            });
          } catch (error) {
            console.error('Error handling marker drag:', error);
          }
        });
      }

      // Update map center and marker position
      mapInstanceRef.current.setCenter(selectedLocation);
      markerRef.current.setPosition(selectedLocation);

      // Update input value when map is initialized
      if (value && inputRef.current && !inputRef.current.value) {
        inputRef.current.value = value;
      }
    } catch (error) {
      console.error('Error initializing Google Map:', error);
    }
  }, [showMap, selectedLocation, isGoogleLoaded, value, onChange]);

  // Handle click on map to set location
  const handleMapClick = (event: any) => {
    if (!mapInstanceRef.current || !markerRef.current) return;

    try {
      const location = {
        lat: typeof event.latLng.lat === 'function' ? event.latLng.lat() : event.latLng.lat,
        lng: typeof event.latLng.lng === 'function' ? event.latLng.lng() : event.latLng.lng
      };

      setSelectedLocation(location);
      markerRef.current.setPosition(location);

      // Reverse geocode
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location }, (results: any[], status: string) => {
        if (status === 'OK' && results[0]) {
          const address = results[0].formatted_address;
          onChange(address, {
            formatted_address: address,
            geometry: location,
            address_components: results[0].address_components
          });
          if (inputRef.current) {
            inputRef.current.value = address;
          }
        }
      });
    } catch (error) {
      console.error('Error handling map click:', error);
    }
  };

  // Add click listener to map
  useEffect(() => {
    if (mapInstanceRef.current) {
      const listener = mapInstanceRef.current.addListener('click', handleMapClick);
      return () => {
        window.google.maps.event.removeListener(listener);
      };
    }
  }, [mapInstanceRef.current]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const hasValidApiKey = apiKey && apiKey !== 'YOUR_API_KEY' && apiKey !== 'your_google_maps_api_key_here';

  // Fallback to regular textarea if API key is not configured
  if (!hasValidApiKey) {
    return (
      <div className="w-full">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={3}
          className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-orange focus:outline-none focus:ring-2 focus:ring-primary-orange/20 ${className}`}
        />
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>💡 Tip:</strong> Add your Google Maps API key to enable location picker with map selection.
            Add <code className="bg-blue-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY=your_key</code> to your <code className="bg-blue-100 px-1 rounded">.env</code> file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
          <MapPin className="w-5 h-5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-12 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-orange focus:outline-none focus:ring-2 focus:ring-primary-orange/20 ${className}`}
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setSelectedLocation(null);
              setShowMap(false);
              if (inputRef.current) {
                inputRef.current.value = '';
              }
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Map Toggle Button */}
      {value && (
        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className="mt-2 text-sm text-primary-orange hover:text-primary-blue flex items-center gap-2 transition-colors"
        >
          <MapPin className="w-4 h-4" />
          {showMap ? 'Hide Map' : 'Show Map to Select Location'}
        </button>
      )}

      {/* Map Container */}
      {showMap && selectedLocation && (
        <div className="mt-4 rounded-lg overflow-hidden border-2 border-gray-200">
          <div
            ref={mapRef}
            style={{ height: '400px', width: '100%' }}
            className="rounded-lg"
          />
          <div className="bg-gray-50 p-3 text-xs text-gray-600 border-t border-gray-200">
            💡 Drag the marker or click on the map to select your exact pickup location
          </div>
        </div>
      )}

      {!isGoogleLoaded && hasValidApiKey && (
        <p className="mt-2 text-xs text-gray-500">
          Loading Google Maps...
        </p>
      )}
    </div>
  );
};

export default GooglePlacesInput;

