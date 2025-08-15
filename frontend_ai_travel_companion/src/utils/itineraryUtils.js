 // PUBLIC_INTERFACE
export function extractLocationsFromItinerary(itinerary) {
  /** Returns array of distinct location names from itinerary days[].items[].location */
  const set = new Set();
  itinerary?.days?.forEach(d => d.items?.forEach(i => { if (i.location) set.add(i.location); }));
  return Array.from(set);
}
