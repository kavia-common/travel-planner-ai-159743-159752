import React from 'react';

// PUBLIC_INTERFACE
export default function ItineraryCard({ day, items }) {
  /** Card rendering itinerary for a specific day. */
  return (
    <div className="card itinerary-card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <strong>Day {day}</strong>
        <div className="chips">
          {items?.map((i, idx) => <span key={idx} className="tag">{i.time || 'Anytime'}</span>)}
        </div>
      </div>
      <ul style={{margin:0,paddingLeft:18}}>
        {items?.map((i,idx)=>(
          <li key={idx} style={{margin:'8px 0'}}>
            <div style={{fontWeight:700}}>{i.title}</div>
            <div style={{fontSize:13, color:'var(--muted)'}}>{i.description}</div>
            {i.location ? <div style={{fontSize:12, color:'var(--muted)'}}>📍 {i.location}</div> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
