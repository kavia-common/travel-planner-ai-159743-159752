import React from 'react';
import { useLocalTrips } from '../hooks/useLocalTrips';

// PUBLIC_INTERFACE
export default function SaveTripButton({ trip }) {
  /** Save the current trip (itinerary + meta) to localStorage. */
  const { saveTrip } = useLocalTrips();

  const handleSave = () => {
    if (!trip) return;
    const id = saveTrip({
      ...trip,
      title: trip.title || `${trip.destination || 'Trip'} (${trip.dates?.start} → ${trip.dates?.end})`
    });
    // optional UX feedback
    // eslint-disable-next-line no-alert
    alert('Trip saved!');
    return id;
  };

  return (
    <button className="button" onClick={handleSave} disabled={!trip}>Save Trip</button>
  );
}
