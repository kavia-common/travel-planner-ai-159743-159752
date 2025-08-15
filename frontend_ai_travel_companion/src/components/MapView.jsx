import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

// PUBLIC_INTERFACE
export default function MapView({ center, markers }) {
  /** Mapbox map showing markers for recommended spots. */
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const token = process.env.REACT_APP_MAPBOX_TOKEN;

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line no-console
      console.warn('Mapbox token missing. Provide REACT_APP_MAPBOX_TOKEN in .env');
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
  }, [center, markers, token]);

  return <div className="map-container card" ref={containerRef} />;
}
