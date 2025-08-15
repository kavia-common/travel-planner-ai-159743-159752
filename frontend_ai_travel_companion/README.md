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

## Setup
1. Install dependencies
   ```bash
   npm install
   ```
2. Copy .env example and fill your keys
   ```bash
   cp .env.example .env
   # Open .env and set:
   # REACT_APP_OPENAI_API_KEY=...
   # REACT_APP_MAPBOX_TOKEN=...
   # REACT_APP_WEATHER_API_KEY=...
   # REACT_APP_TICKETMASTER_API_KEY=...
   # REACT_APP_EVENTBRITE_TOKEN=...
   ```
3. Start the app
   ```bash
   npm start
   ```

## Environment Variables
See .env.example for all required keys. All keys are read via process.env.

Important: Calling third-party APIs directly from the frontend exposes keys to users. For production, you should route these calls through a backend proxy with proper authentication.

## Tech
- React 18, react-router-dom 6, framer-motion, mapbox-gl, axios/dayjs
- No heavy UI framework; clean pastel design with rounded cards.

## Development
- Home page: Search, recommendations, map, local events
- My Trips: Saved trips management

## Testing
- Unit test checks that the main title renders.

## License
MIT
