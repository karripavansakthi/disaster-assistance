import React, { createContext, useContext, useState, useEffect } from 'react';

// Curated supported disaster management locations
export const SUPPORTED_LOCATIONS = [
  {
    id: 'visakhapatnam',
    name: 'Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    lat: 17.6868,
    lng: 83.2185,
    fullAddress: 'Visakhapatnam, Andhra Pradesh',
    floodRisk: 'High',
    riskColor: 'red',
    rainfall: '45 mm',
    windSpeed: '36 km/h',
    activeEmergencies: 42,
    peopleAffected: 1248,
    activeNotice: 'Severe cyclonic surge & coastal waterlogging active in low-lying zones.',
  },
  {
    id: 'vijayawada',
    name: 'Vijayawada',
    district: 'NTR / Krishna',
    state: 'Andhra Pradesh',
    lat: 16.5062,
    lng: 80.6480,
    fullAddress: 'Vijayawada, Andhra Pradesh',
    floodRisk: 'Critical',
    riskColor: 'red',
    rainfall: '68 mm',
    windSpeed: '28 km/h',
    activeEmergencies: 38,
    peopleAffected: 2150,
    activeNotice: 'Krishna river flood discharge at Prakasam Barrage exceeds warning levels.',
  },
  {
    id: 'guntur',
    name: 'Guntur',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    lat: 16.3067,
    lng: 80.4365,
    fullAddress: 'Guntur, Andhra Pradesh',
    floodRisk: 'Moderate',
    riskColor: 'amber',
    rainfall: '22 mm',
    windSpeed: '18 km/h',
    activeEmergencies: 16,
    peopleAffected: 540,
    activeNotice: 'Minor inundation in eastern agricultural sectors. Relief camps active.',
  },
  {
    id: 'nellore',
    name: 'Nellore',
    district: 'SPSR Nellore',
    state: 'Andhra Pradesh',
    lat: 14.4426,
    lng: 79.9865,
    fullAddress: 'Nellore, Andhra Pradesh',
    floodRisk: 'High',
    riskColor: 'red',
    rainfall: '52 mm',
    windSpeed: '42 km/h',
    activeEmergencies: 29,
    peopleAffected: 1100,
    activeNotice: 'Pennar river rising; coastal warnings issued for fishermen.',
  },
  {
    id: 'kakinada',
    name: 'Kakinada',
    district: 'Kakinada',
    state: 'Andhra Pradesh',
    lat: 16.9891,
    lng: 82.2475,
    fullAddress: 'Kakinada, Andhra Pradesh',
    floodRisk: 'High',
    riskColor: 'red',
    rainfall: '38 mm',
    windSpeed: '40 km/h',
    activeEmergencies: 24,
    peopleAffected: 890,
    activeNotice: 'Port Trust alert in effect. Low-lying beach wards relocated to camps.',
  },
  {
    id: 'rajahmundry',
    name: 'Rajahmundry',
    district: 'East Godavari',
    state: 'Andhra Pradesh',
    lat: 17.0005,
    lng: 81.8040,
    fullAddress: 'Rajahmundry, Andhra Pradesh',
    floodRisk: 'High',
    riskColor: 'red',
    rainfall: '44 mm',
    windSpeed: '22 km/h',
    activeEmergencies: 21,
    peopleAffected: 780,
    activeNotice: 'Godavari barrage inflow rising. Ghat roads closed for traffic.',
  },
  {
    id: 'tirupati',
    name: 'Tirupati',
    district: 'Tirupati',
    state: 'Andhra Pradesh',
    lat: 13.6288,
    lng: 79.4192,
    fullAddress: 'Tirupati, Andhra Pradesh',
    floodRisk: 'Low',
    riskColor: 'emerald',
    rainfall: '8 mm',
    windSpeed: '12 km/h',
    activeEmergencies: 5,
    peopleAffected: 120,
    activeNotice: 'Normal weather conditions. Emergency response teams on standby.',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    lat: 17.3850,
    lng: 78.4867,
    fullAddress: 'Hyderabad, Telangana',
    floodRisk: 'Moderate',
    riskColor: 'amber',
    rainfall: '28 mm',
    windSpeed: '20 km/h',
    activeEmergencies: 19,
    peopleAffected: 620,
    activeNotice: 'Urban waterlogging alert issued for Musi river catchment areas.',
  },
  {
    id: 'chennai',
    name: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
    fullAddress: 'Chennai, Tamil Nadu',
    floodRisk: 'High',
    riskColor: 'red',
    rainfall: '58 mm',
    windSpeed: '46 km/h',
    activeEmergencies: 34,
    peopleAffected: 1850,
    activeNotice: 'Coastal squalls and reservoir discharge alerts active across city.',
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    fullAddress: 'Bengaluru, Karnataka',
    floodRisk: 'Low',
    riskColor: 'emerald',
    rainfall: '14 mm',
    windSpeed: '15 km/h',
    activeEmergencies: 8,
    peopleAffected: 180,
    activeNotice: 'Localized lake overflow monitoring in low-lying eastern zones.',
  },
];

// Distance calculator (Haversine formula in KM)
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

// Find the closest supported city from coordinates
export const findNearestCity = (lat, lng) => {
  let closest = null;
  let minDistance = Infinity;

  SUPPORTED_LOCATIONS.forEach((loc) => {
    const dist = calculateDistanceKm(lat, lng, loc.lat, loc.lng);
    if (dist !== null && dist < minDistance) {
      minDistance = dist;
      closest = loc;
    }
  });

  return closest ? { ...closest, distanceToCoords: minDistance } : null;
};

const LocationContext = createContext();

const STORAGE_KEY = 'disasterAssistLocation';

export function LocationProvider({ children }) {
  // A location is only available after user consent or an explicit saved location.
  const [currentLocation, setCurrentLocationState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.lat && parsed.lng) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved location from localStorage:', e);
    }
    return null;
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [detectError, setDetectError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Set location and persist to localStorage
  const setLocation = (newLoc) => {
    if (!newLoc) return;
    const locationData = {
      ...newLoc,
      fullAddress: newLoc.fullAddress || `${newLoc.name}, ${newLoc.state || ''}`.trim(),
    };
    setCurrentLocationState(locationData);
    setDetectError(null);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(locationData));
    } catch (e) {
      console.warn('Failed to save location to localStorage:', e);
    }
  };

  // Browser Geolocation Detection
  const detectCurrentLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        const err = 'Geolocation is not supported by your browser.';
        setDetectError(err);
        resolve({ success: false, error: err });
        return;
      }

      setIsDetecting(true);
      setDetectError(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Attempt reverse geocoding via OpenStreetMap, with automatic fallback
          let detectedCityName = '';
          let detectedState = '';
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
              { signal: controller.signal }
            );
            clearTimeout(timeoutId);
            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              detectedCityName =
                addr.city || addr.town || addr.municipality || addr.county || addr.state_district || '';
              detectedState = addr.state || '';
            }
          } catch (fetchErr) {
            console.info('Reverse geocoding network skipped; using geometric proximity match.');
          }

          // Match closest catalog location or build custom location object
          const nearest = findNearestCity(latitude, longitude);
          const finalLocation = {
            id: detectedCityName ? detectedCityName.toLowerCase().replace(/\s+/g, '-') : 'current-location',
            name: detectedCityName || 'Current location',
            district: detectedCityName || '',
            state: detectedState || '',
            lat: latitude,
            lng: longitude,
            fullAddress: detectedCityName
              ? `${detectedCityName}${detectedState ? `, ${detectedState}` : ''}`
              : `Current GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
            isGpsDetected: true,
          };

          setLocation(finalLocation);
          setIsDetecting(false);
          resolve({ success: true, location: finalLocation });
        },
        (error) => {
          setIsDetecting(false);
          let userMessage = 'Unable to retrieve your current location.';
          if (error.code === 1) {
            userMessage = 'Location permission was denied. You can manually search and pick a location below.';
          } else if (error.code === 2) {
            userMessage = 'Location unavailable or GPS signal lost. Please choose manually.';
          } else if (error.code === 3) {
            userMessage = 'Location request timed out. Please try again or select from the list.';
          }
          setDetectError(userMessage);
          resolve({ success: false, error: userMessage });
        },
        { timeout: 10000, enableHighAccuracy: true, maximumAge: 60000 }
      );
    });
  };

  // Search locations helper
  const searchLocations = (query) => {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    return SUPPORTED_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.district.toLowerCase().includes(q) ||
        loc.state.toLowerCase().includes(q)
    );
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        setLocation,
        detectCurrentLocation,
        isDetecting,
        detectError,
        modalOpen,
        setModalOpen,
        availableLocations: SUPPORTED_LOCATIONS,
        searchLocations,
        calculateDistanceKm,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}

// Alias for convenience
export const useLocation = useLocationContext;

