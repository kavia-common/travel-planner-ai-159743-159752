import { env, getDemoMode } from '../config/env';

// PUBLIC_INTERFACE
export async function fetchEvents({ city, startDate, endDate }) {
  /** Fetch events from Ticketmaster and Eventbrite. Returns normalized list. Falls back to demo events if demo mode is active or both provider keys are missing. */
  const out = [];
  const tasks = [];

  const demo = getDemoMode();
  const hasTM = !!env.TICKETMASTER_API_KEY;
  const hasEB = !!env.EVENTBRITE_TOKEN;

  if (demo || (!hasTM && !hasEB)) {
    return [
      { name: 'Street Food Festival', venue: 'Main Square', date: startDate, url: '#' },
      { name: 'Live Jazz Night', venue: 'Blue Note Club', date: endDate, url: '#' },
      { name: 'Open-Air Cinema', venue: 'Riverside Park', date: startDate, url: '#' },
    ];
  }

  if (hasTM) {
    tasks.push(fetchTicketmaster({ city, startDate, endDate }).then(list => out.push(...list)).catch(()=>{}));
  }
  if (hasEB) {
    tasks.push(fetchEventbrite({ city, startDate, endDate }).then(list => out.push(...list)).catch(()=>{}));
  }

  await Promise.all(tasks);
  return out;
}

async function fetchTicketmaster({ city, startDate, endDate }) {
  const params = new URLSearchParams({
    apikey: env.TICKETMASTER_API_KEY,
    size: '5',
    sort: 'date,asc',
    city: city || '',
    startDateTime: startDate ? new Date(startDate).toISOString() : '',
    endDateTime: endDate ? new Date(endDate).toISOString() : ''
  });
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`;
  const resp = await fetch(url);
  if (!resp.ok) return [];
  const data = await resp.json();
  const events = data?._embedded?.events || [];
  return events.map(e => ({
    name: e.name,
    venue: e._embedded?.venues?.[0]?.name,
    date: e.dates?.start?.localDate,
    url: e.url
  }));
}

async function fetchEventbrite({ city, startDate, endDate }) {
  const params = new URLSearchParams({
    'location.address': city || '',
    'start_date.range_start': startDate ? new Date(startDate).toISOString() : '',
    'start_date.range_end': endDate ? new Date(endDate).toISOString() : '',
    'page_size': '5'
  });
  const url = `https://www.eventbriteapi.com/v3/events/search/?${params.toString()}`;
  const resp = await fetch(url, { headers: { 'Authorization': `Bearer ${env.EVENTBRITE_TOKEN}` }});
  if (!resp.ok) return [];
  const data = await resp.json();
  const events = data?.events || [];
  return events.map(e => ({
    name: e.name?.text,
    venue: e.venue_id || 'Eventbrite Venue',
    date: e.start?.local?.split('T')[0],
    url: e.url
  }));
}
