import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'ai-travel-trips';

// PUBLIC_INTERFACE
export function useLocalTrips() {
  /** Manage saved trips in localStorage. */
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTrips(JSON.parse(raw));
    } catch {
      setTrips([]);
    }
  }, []);

  const persist = useCallback((next) => {
    setTrips(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // noop
    }
  }, []);

  const saveTrip = useCallback((trip) => {
    const withId = { id: trip.id || `${Date.now()}`, ...trip };
    persist([withId, ...trips]);
    return withId.id;
  }, [persist, trips]);

  const removeTrip = useCallback((id) => {
    persist(trips.filter(t => t.id !== id));
  }, [persist, trips]);

  const getTrip = useCallback((id) => trips.find(t => t.id === id), [trips]);

  return { trips, saveTrip, removeTrip, getTrip };
}
