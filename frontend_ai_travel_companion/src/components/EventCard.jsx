import React from 'react';

// PUBLIC_INTERFACE
export default function EventCard({ event }) {
  /** Card to display an event suggestion from Ticketmaster/Eventbrite. */
  const url = event.url || event.link;
  return (
    <div className="card" style={{padding:14}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontWeight:700}}>{event.name}</div>
          {event.venue ? <div style={{fontSize:12,color:'var(--muted)'}}>📍 {event.venue}</div> : null}
          {event.date ? <div style={{fontSize:12,color:'var(--muted)'}}>🗓 {event.date}</div> : null}
        </div>
        {url ? <a className="button secondary" href={url} target="_blank" rel="noreferrer">View</a> : null}
      </div>
    </div>
  );
}
