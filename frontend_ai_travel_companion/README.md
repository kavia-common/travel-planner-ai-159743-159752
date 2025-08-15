# AI Travel Companion (React)

A minimalist, pastel-themed React app that helps plan personalized trips with AI itineraries, live weather, event suggestions, Mapbox maps, and local saving.

## Features
- Search destination and travel dates
- Personalized AI itinerary suggestions (OpenAI)
- Live weather integration (OpenWeatherMap)
- Event suggestions (Ticketmaster, Eventbrite)
- Map view for recommended spots (Mapbox GL)
- Save Trip to localStorage + My Trips page
- Floating action button to access saved trips
- Smooth page transitions (Framer Motion)
- Auto theme with a manual toggle (light/dark)

## Quick Start
1. Install dependencies
   ```bash
   npm install
   ```
2. Copy the environment file and (optionally) fill your keys
   ```bash
   cp .env.example .env
   # Open .env and set values as needed (see below)
   ```
3. Start the app
   ```bash
   npm start
   ```

## Demo Mode
This app supports a fully functional demo mode with sample data for itineraries, weather, events, and maps. Demo mode is enabled automatically if required API keys are missing, or explicitly via:
```
REACT_APP_DEMO_MODE=true
```
When demo mode is active, a "Demo Mode" badge is shown in the header, the map displays a placeholder, and sections are tagged with "Demo data".

## Environment Variables
The app reads multiple commonly used variable names for convenience. You can use either the REACT_APP_* names or the alternates:

- OpenAI
  - REACT_APP_OPENAI_API_KEY or OPENAI_API_KEY
  - REACT_APP_OPENAI_BASE_URL or OPENAI_BASE_URL (default: https://api.openai.com/v1)
  - REACT_APP_OPENAI_MODEL or OPENAI_MODEL (default: gpt-4o-mini)
- Mapbox
  - REACT_APP_MAPBOX_TOKEN or REACT_APP_MAPBOX_ACCESS_TOKEN or MAPBOX_ACCESS_TOKEN
- OpenWeatherMap
  - REACT_APP_WEATHER_API_KEY or REACT_APP_OPENWEATHERMAP_API_KEY or OPENWEATHERMAP_API_KEY
- Ticketmaster
  - REACT_APP_TICKETMASTER_API_KEY or TICKETMASTER_API_KEY
- Eventbrite
  - REACT_APP_EVENTBRITE_TOKEN or REACT_APP_EVENTBRITE_API_KEY or EVENTBRITE_API_KEY
- Demo flag
  - REACT_APP_DEMO_MODE or DEMO_MODE

Important: Calling third-party APIs directly from the frontend exposes keys to users. For production, route calls through a backend proxy with proper authentication.

## Tech
- React 18, react-router-dom 6, framer-motion, mapbox-gl
- No heavy UI framework; clean pastel design with rounded cards.

## Development
- Home page: Search, recommendations, map, local events
- My Trips: Saved trips management

## Testing
- Unit test checks that the main title renders.

## License
MIT
