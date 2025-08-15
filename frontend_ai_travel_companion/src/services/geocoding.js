const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

// PUBLIC_INTERFACE
export async function geocodePlace(query) {
  /** Geocode a place name to {lng, lat, place}. */
  if (!MAPBOX_TOKEN) {
    // Simple fallback guessing coords
    return { lng: 0, lat: 0, place: query };
  }
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?proximity=ip&limit=1&access_token=${MAPBOX_TOKEN}`;
  const resp = await fetch(url);
  if (!resp.ok) return null;
  const data = await resp.json();
  const feat = data?.features?.[0];
  if (!feat) return null;
  return { lng: feat.center[0], lat: feat.center[1], place: feat.place_name };
}

// PUBLIC_INTERFACE
export async function geocodeMany(names = []) {
  /** Geocode multiple place names to an array of {lng, lat, label}. */
  const results = [];
  for (const name of names) {
    const g = await geocodePlace(name);
    if (g) results.push({ lng: g.lng, lat: g.lat, label: g.place });
  }
  return results;
}
