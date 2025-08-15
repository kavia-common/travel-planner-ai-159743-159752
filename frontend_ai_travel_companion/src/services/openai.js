const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.REACT_APP_OPENAI_BASE_URL || 'https://api.openai.com/v1';
const OPENAI_MODEL = process.env.REACT_APP_OPENAI_MODEL || 'gpt-4o-mini';

// PUBLIC_INTERFACE
export async function generateItinerary({ destination, dates, preferences, weather, events }) {
  /** Generate a JSON itinerary using OpenAI based on inputs. */
  if (!OPENAI_API_KEY) {
    // Demo fallback
    return demoItinerary(destination);
  }

  const system = `You are a helpful AI travel planner. Output ONLY strict JSON matching this schema:
{
  "summary": "string",
  "days": [
    { "day": 1, "items": [ { "time": "Morning|Afternoon|Evening", "title": "string", "description": "string", "location": "string" } ] }
  ],
  "highlights": ["string"]
}`;

  const user = `Destination: ${destination}
Dates: ${dates.start} to ${dates.end}
Preferences: ${JSON.stringify(preferences)}
Weather summary: ${weather?.summary || 'unknown'}
Upcoming events (sample): ${(events || []).slice(0,3).map(e=>`${e.name} on ${e.date}`).join('; ')}`;

  const resp = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      temperature: 0.7
    })
  });

  if (!resp.ok) {
    return demoItinerary(destination);
  }

  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content || '';
  try {
    const parsed = JSON.parse(content);
    return parsed;
  } catch {
    // Try to extract JSON substring
    const match = content.match(/\{[\s\S]*\}$/m);
    if (match) {
      try { return JSON.parse(match[0]); } catch {}
    }
    return demoItinerary(destination);
  }
}

function demoItinerary(destination) {
  return {
    summary: `Sample itinerary for ${destination}.`,
    days: [
      { day: 1, items: [
        { time:'Morning', title:'Old Town Walk', description:'Stroll through historic center and cafes.', location:`${destination} Old Town` },
        { time:'Afternoon', title:'Local Market', description:'Taste regional snacks and fruits.', location:`${destination} Market` },
        { time:'Evening', title:'Riverside Dinner', description:'Dinner with a view.', location:`${destination} Riverside` }
      ]},
      { day: 2, items: [
        { time:'Morning', title:'Museum Visit', description:'Explore art and culture.', location:`${destination} Museum` },
        { time:'Afternoon', title:'Park Relax', description:'Picnic at the city park.', location:`${destination} Central Park` },
        { time:'Evening', title:'Nightlife', description:'Try a local bar district.', location:`${destination} Nightlife` }
      ]}
    ],
    highlights: ['Historic streets', 'Local food', 'Scenic views']
  };
}
