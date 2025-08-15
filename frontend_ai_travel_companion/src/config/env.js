//
// Centralized environment configuration and demo mode detection
//

/**
 * Normalizes truthy string flags like "true", "1", "yes".
 */
function isTruthy(val) {
  if (typeof val === 'boolean') return val;
  if (typeof val !== 'string') return false;
  return ['1', 'true', 'yes', 'on'].includes(val.trim().toLowerCase());
}

/**
 * Returns the first non-empty environment variable value from a list of names.
 */
function firstEnv(...names) {
  for (const n of names) {
    const v = process.env[n];
    if (typeof v === 'string' && v.trim().length > 0) return v.trim();
  }
  return '';
}

const OPENAI_API_KEY = firstEnv('REACT_APP_OPENAI_API_KEY', 'OPENAI_API_KEY');
const OPENAI_BASE_URL = firstEnv('REACT_APP_OPENAI_BASE_URL', 'OPENAI_BASE_URL') || 'https://api.openai.com/v1';
const OPENAI_MODEL = firstEnv('REACT_APP_OPENAI_MODEL', 'OPENAI_MODEL') || 'gpt-4o-mini';

const MAPBOX_TOKEN = firstEnv('REACT_APP_MAPBOX_TOKEN', 'REACT_APP_MAPBOX_ACCESS_TOKEN', 'MAPBOX_ACCESS_TOKEN');

const WEATHER_API_KEY = firstEnv('REACT_APP_WEATHER_API_KEY', 'REACT_APP_OPENWEATHERMAP_API_KEY', 'OPENWEATHERMAP_API_KEY');

const TICKETMASTER_API_KEY = firstEnv('REACT_APP_TICKETMASTER_API_KEY', 'TICKETMASTER_API_KEY');
const EVENTBRITE_TOKEN = firstEnv('REACT_APP_EVENTBRITE_TOKEN', 'REACT_APP_EVENTBRITE_API_KEY', 'EVENTBRITE_API_KEY');

const DEMO_FLAG = isTruthy(firstEnv('REACT_APP_DEMO_MODE', 'DEMO_MODE'));

const missing = {
  openai: !OPENAI_API_KEY,
  mapbox: !MAPBOX_TOKEN,
  weather: !WEATHER_API_KEY,
  // Events feature is considered available if at least one provider has a token
  events: !TICKETMASTER_API_KEY && !EVENTBRITE_TOKEN,
};

const AUTO_DEMO = missing.openai || missing.mapbox || missing.weather || missing.events;

const DEMO_MODE = DEMO_FLAG || AUTO_DEMO;

// PUBLIC_INTERFACE
export const env = {
  /** Resolved OpenAI API key (supports REACT_APP_OPENAI_API_KEY or OPENAI_API_KEY). */
  OPENAI_API_KEY,
  /** Resolved OpenAI base URL or defaults to https://api.openai.com/v1. */
  OPENAI_BASE_URL,
  /** Resolved OpenAI model name or defaults to gpt-4o-mini. */
  OPENAI_MODEL,

  /** Resolved Mapbox token (supports REACT_APP_MAPBOX_TOKEN, REACT_APP_MAPBOX_ACCESS_TOKEN). */
  MAPBOX_TOKEN,

  /** Resolved OpenWeatherMap key (supports REACT_APP_WEATHER_API_KEY, REACT_APP_OPENWEATHERMAP_API_KEY). */
  WEATHER_API_KEY,

  /** Resolved Ticketmaster key. */
  TICKETMASTER_API_KEY,
  /** Resolved Eventbrite key/token. */
  EVENTBRITE_TOKEN,

  /** True when demo mode is active either via flag or missing any required API keys. */
  DEMO_MODE,

  /** Which features are missing credentials. */
  missing,
};

// PUBLIC_INTERFACE
export function getDemoMode() {
  /** Returns true if demo mode is active (flag or missing credentials). */
  return DEMO_MODE;
}

// PUBLIC_INTERFACE
export function getMissingFeatures() {
  /** Returns an object with boolean flags for which feature credentials are missing. */
  return { ...missing };
}
