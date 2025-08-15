import { env, getDemoMode } from '../config/env';

// PUBLIC_INTERFACE
export async function geocodePlace(query) {
  /** Geocode a place name to {lng, lat, place}. Falls back to demo coordinates when in demo mode or token missing. */
  if (getDemoMode() || !env.MAPBOX_TOKEN) {
    // Simple deterministic demo fallback coords (shift by hash of query for variation)
    const hash = (query || '').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const lng = ((hash % 180) - 90) / 2; // -45..45
    const lat = ((hash % 140) - 70) / 2;  // -35..35
    return { lng, lat, place: query };
  }
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?proximity=ip&limit=1&access_token=${env.MAPBOX_TOKEN}`;
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
