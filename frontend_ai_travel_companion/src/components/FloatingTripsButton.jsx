import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

// PUBLIC_INTERFACE
export default function FloatingTripsButton() {
  /** Floating action button to quickly open My Trips page. */
  const navigate = useNavigate();
  const location = useLocation();
  if (location.pathname === '/trips') return null;

  return (
    <button className="fab" onClick={()=>navigate('/trips')} aria-label="Open Saved Trips">
      <FiHeart />
    </button>
  );
}
