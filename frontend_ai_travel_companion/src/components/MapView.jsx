import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { env, getDemoMode } from '../config/env';

// PUBLIC_INTERFACE
export default function MapView({ center, markers }) {
  /** Mapbox map showing markers for recommended spots. Shows a demo placeholder when in demo mode or token missing. */
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const token = env.MAPBOX_TOKEN;
  const demo = getDemoMode();

  useEffect(() => {
    if (demo || !token) {
      // eslint-disable-next-line no-console
      if (!token) console.warn('Mapbox token missing. Provide REACT_APP_MAPBOX_TOKEN (or ACCESS_TOKEN) in .env');
      return;
    }
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center || [0,0],
      zoom: center ? 11 : 1.5,
    });
    mapRef.current = map;

    map.on('load', () => {
      if (Array.isArray(markers)) {
        markers.forEach(m => {
          if (!m || typeof m.lng !== 'number' || typeof m.lat !== 'number') return;
          const el = document.createElement('div');
          el.style.width = '12px';
          el.style.height = '12px';
          el.style.borderRadius = '50%';
          el.style.background = '#E74C3C';
          el.style.border = '2px solid #fff';
          new mapboxgl.Marker(el).setLngLat([m.lng, m.lat]).setPopup(
            new mapboxgl.Popup({ offset: 24 }).setHTML(`<b>${m.label || 'Location'}</b>`)
          ).addTo(map);
        });
      }
    });

    return () => map.remove();
  }, [center, markers, token, demo]);

  if (demo || !token) {
    return (
      <div className="map-container card" style={{display:'flex', alignItems:'center', justifyContent:'center', position:'relative'}}>
        <div style={{position:'absolute', top:12, left:12}} className="tag">🧪 Demo Map</div>
        <div style={{textAlign:'center', color:'var(--muted)'}}>
          Map preview is disabled in demo mode.
          <div style={{marginTop:8, fontSize:12}}>
            {Array.isArray(markers) && markers.length ? (
              <div>Sample locations: {markers.slice(0,3).map(m => m.label || 'Location').join(', ')}{markers.length > 3 ? '…' : ''}</div>
            ) : 'No markers to display yet.'}
          </div>
        </div>
      </div>
    );
  }

  return <div className="map-container card" ref={containerRef} />;
}
