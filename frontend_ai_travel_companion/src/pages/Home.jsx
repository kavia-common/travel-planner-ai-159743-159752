import React, { useMemo, useState } from 'react';
import SearchBar from '../components/SearchBar';
import ItineraryCard from '../components/ItineraryCard';
import EventCard from '../components/EventCard';
import MapView from '../components/MapView';
import SaveTripButton from '../components/SaveTripButton';
import { geocodePlace, geocodeMany } from '../services/geocoding';
import { fetchWeatherByCoords } from '../services/weather';
import { fetchEvents } from '../services/events';
import { generateItinerary } from '../services/openai';
import { extractLocationsFromItinerary } from '../utils/itineraryUtils';

// PUBLIC_INTERFACE
export default function Home() {
  /** Home page: search, results, and map. */
  const [loading, setLoading] = useState(false);
  const [center, setCenter] = useState(null);
  const [weather, setWeather] = useState(null);
  const [events, setEvents] = useState([]);
  const [itinerary, setItinerary] = useState(null);
  const [searchMeta, setSearchMeta] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [error, setError] = useState('');

  const onSearch = async ({ destination, dates, preferences }) => {
    setError('');
    setLoading(true);
    setSearchMeta({ destination, dates, preferences });
    try {
      // Geocode destination
      const destGeo = await geocodePlace(destination);
      if (destGeo) setCenter([destGeo.lng, destGeo.lat]);

      // Weather by coords
      const w = destGeo ? await fetchWeatherByCoords({ lat: destGeo.lat, lon: destGeo.lng }) : null;
      setWeather(w);

      // Events by city and date
      const ev = await fetchEvents({ city: destination, startDate: dates.start, endDate: dates.end });
      setEvents(ev);

      // AI itinerary
      const plan = await generateItinerary({ destination, dates, preferences, weather: w, events: ev });
      setItinerary(plan);

      // Geocode itinerary locations
      const locs = extractLocationsFromItinerary(plan);
      const geocoded = await geocodeMany(locs);
      setMarkers(geocoded);
    } catch (e) {
      setError('Failed to fetch recommendations. Please try again.');
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const highlightChips = useMemo(() => itinerary?.highlights || [], [itinerary]);

  const tripToSave = itinerary && searchMeta ? {
    destination: searchMeta.destination,
    dates: searchMeta.dates,
    preferences: searchMeta.preferences,
    summary: itinerary.summary,
    itinerary: itinerary
  } : null;

  return (
    <div>
      <div className="search-area">
        <SearchBar onSearch={onSearch} />
      </div>

      {error ? <div className="card" style={{padding:12, borderColor:'#fca5a5', background:'rgba(252,165,165,0.1)'}}>{error}</div> : null}

      <div className="results-grid">
        <section className="itinerary-section">
          <div className="card" style={{padding:12, marginBottom:12}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <strong>Recommendations</strong>
                <div className="subtitle">{loading ? 'Generating itinerary...' : (weather?.summary ? `Weather: ${weather.summary}` : 'Enter a destination to begin')}</div>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                {highlightChips.length ? (
                  <div className="chips">
                    {highlightChips.map((h,idx)=><span className="tag" key={idx}>{h}</span>)}
                  </div>
                ) : null}
                <SaveTripButton trip={tripToSave} />
              </div>
            </div>
          </div>

          <div className="itinerary-list">
            {itinerary?.days?.map(d => <ItineraryCard key={d.day} day={d.day} items={d.items} />)}
            {!itinerary && !loading && (
              <div className="card" style={{padding:14}}>
                <div style={{color:'var(--muted)'}}>Your personalized plan will appear here.</div>
              </div>
            )}
          </div>

          <div style={{marginTop:16}}>
            <div style={{fontWeight:700, marginBottom:8}}>Local Events</div>
            <div style={{display:'grid', gap:12}}>
              {events.map((e,idx)=><EventCard key={idx} event={e} />)}
              {!events.length && !loading ? <div className="card" style={{padding:14, color:'var(--muted)'}}>No events found for your dates.</div> : null}
            </div>
          </div>
        </section>

        <section className="map-section">
          <div className="card" style={{padding:12, marginBottom:12}}>
            <div style={{display:'flex',alignItems:'center', gap:8}}>
              <span className="tag">🗺 Map</span>
              <span className="tag">📍 Spots</span>
            </div>
          </div>
          <MapView center={center} markers={markers} />
        </section>
      </div>
    </div>
  );
}
