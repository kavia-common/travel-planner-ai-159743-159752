import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiHeart } from 'react-icons/fi';

// PUBLIC_INTERFACE
export default function SideNav() {
  /** Left side navigation for the app. */
  return (
    <aside className="side-nav">
      <div className="brand">
        <span style={{width:12,height:12,borderRadius:4,background:'var(--color-primary)'}} />
        AI Travel Companion
      </div>
      <div className="nav-links">
        <NavLink to="/" end className={({isActive})=> isActive ? 'active' : ''}>
          <div style={{display:'flex',alignItems:'center',gap:10}}><FiHome/> Home</div>
        </NavLink>
        <NavLink to="/trips" className={({isActive})=> isActive ? 'active' : ''}>
          <div style={{display:'flex',alignItems:'center',gap:10}}><FiHeart/> My Trips</div>
        </NavLink>
      </div>
    </aside>
  );
}
