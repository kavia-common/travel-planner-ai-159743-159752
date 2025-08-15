const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

// PUBLIC_INTERFACE
export async function fetchWeatherByCoords({ lat, lon }) {
  /** Fetch current weather using OpenWeatherMap by coordinates. */
  if (!WEATHER_API_KEY) {
    return { summary: 'Mild weather around 20°C, partly cloudy', tempC: 20 };
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
  const resp = await fetch(url);
  if (!resp.ok) return { summary: 'Weather unavailable', tempC: null };
  const data = await resp.json();
  const tempC = data?.main?.temp ?? null;
  const desc = data?.weather?.[0]?.description ?? 'unknown';
  return { summary: `${desc}, ${tempC != null ? `${Math.round(tempC)}°C` : ''}`, tempC };
}
