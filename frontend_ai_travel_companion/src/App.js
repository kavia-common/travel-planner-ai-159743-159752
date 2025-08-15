import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSun, FiMoon, FiHeart, FiHome } from 'react-icons/fi';
import './App.css';
import Home from './pages/Home';
import MyTrips from './pages/MyTrips';
import FloatingTripsButton from './components/FloatingTripsButton';

// PUBLIC_INTERFACE
function ThemeToggle({ theme, onToggle }) {
  /** Toggle the app theme (light/dark). */
  return (
    <button className="button" onClick={onToggle} aria-label="Toggle Theme" style={{display:'inline-flex',alignItems:'center',gap:8}}>
      {theme === 'light' ? <FiMoon /> : <FiSun />} {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  );
}

// PUBLIC_INTERFACE
function Shell({ children, theme, onToggle }) {
  /** App shell with side navigation and header. */
  return (
    <div className="app-shell">
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
      <div className="content">
        <div className="header">
          <div>
            <div className="title">AI Travel Companion</div>
            <div className="subtitle">Plan trips with AI itineraries, weather insights, maps and events</div>
          </div>
          <ThemeToggle theme={theme} onToggle={onToggle} />
        </div>
        {children}
      </div>
    </div>
  );
}

function PageAnimator({ children }) {
  const location = useLocation();
  const variants = useMemo(()=>({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 }
  }),[]);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// PUBLIC_INTERFACE
function AppInner() {
  /** Main app with routes and animated transitions. */
  const [theme, setTheme] = useState(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <Shell theme={theme} onToggle={toggleTheme}>
      <PageAnimator>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<MyTrips />} />
        </Routes>
      </PageAnimator>
      <FloatingTripsButton />
    </Shell>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  /** Router wrapper entry point. */
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
