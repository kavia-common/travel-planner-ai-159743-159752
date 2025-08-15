import React from 'react';
import { useLocalTrips } from '../hooks/useLocalTrips';

// PUBLIC_INTERFACE
export default function MyTrips() {
  /** List of saved trips from localStorage with remove option. */
  const { trips, removeTrip } = useLocalTrips();

  return (
    <div>
      <div className="card" style={{padding:14, marginBottom:12}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <strong>My Trips</strong>
          <span className="tag">{trips.length} saved</span>
        </div>
      </div>

      <div style={{display:'grid', gap:12}}>
        {trips.map(t => (
          <div className="card" key={t.id} style={{padding:14}}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <div>
                <div style={{fontWeight:700}}>{t.title || t.destination || 'Trip'}</div>
                {t.dates ? <div className="subtitle">{t.dates.start} → {t.dates.end}</div> : null}
                {t.summary ? <div style={{fontSize:13, color:'var(--muted)'}}>{t.summary}</div> : null}
              </div>
              <div style={{display:'flex', gap:8}}>
                <button className="button accent" onClick={()=>window.alert('Loading trip view not implemented in this minimal build.')}>Open</button>
                <button className="button secondary" onClick={()=>removeTrip(t.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {!trips.length ? <div className="card" style={{padding:14, color:'var(--muted)'}}>You have no saved trips yet.</div> : null}
      </div>
    </div>
  );
}
