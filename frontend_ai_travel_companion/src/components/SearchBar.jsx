import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

// PUBLIC_INTERFACE
export default function SearchBar({ onSearch }) {
  /** Search form for destination, travel dates, and preferences. */
  const [destination, setDestination] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [prefs, setPrefs] = useState({
    food: true,
    culture: true,
    adventure: false,
    budget: 'medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destination || !start || !end) return;
    onSearch({
      destination,
      dates: { start, end },
      preferences: prefs
    });
  };

  return (
    <div className="card search-card">
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Where to?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          aria-label="Destination"
          required
        />
        <input className="input" type="date" value={start} onChange={(e)=>setStart(e.target.value)} required />
        <input className="input" type="date" value={end} onChange={(e)=>setEnd(e.target.value)} required />
        <select
          className="select"
          value={prefs.budget}
          onChange={(e) => setPrefs(p => ({ ...p, budget: e.target.value }))}
          aria-label="Budget"
        >
          <option value="low">Budget</option>
          <option value="medium">Moderate</option>
          <option value="high">Premium</option>
        </select>
        <button className="button" type="submit"><FiSearch />&nbsp;Explore</button>
      </form>
      <div style={{display:'flex', gap:12, marginTop:12, flexWrap:'wrap'}}>
        <label className="tag"><input type="checkbox" checked={prefs.food} onChange={(e)=>setPrefs(p=>({...p,food:e.target.checked}))}/> Food</label>
        <label className="tag"><input type="checkbox" checked={prefs.culture} onChange={(e)=>setPrefs(p=>({...p,culture:e.target.checked}))}/> Culture</label>
        <label className="tag"><input type="checkbox" checked={prefs.adventure} onChange={(e)=>setPrefs(p=>({...p,adventure:e.target.checked}))}/> Adventure</label>
      </div>
    </div>
  );
}
