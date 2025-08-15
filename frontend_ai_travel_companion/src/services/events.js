const TM_API_KEY = process.env.REACT_APP_TICKETMASTER_API_KEY;
const EB_TOKEN = process.env.REACT_APP_EVENTBRITE_TOKEN;

// PUBLIC_INTERFACE
export async function fetchEvents({ city, startDate, endDate }) {
  /** Fetch events from Ticketmaster and Eventbrite. Returns normalized list. */
  const out = [];
  const tasks = [];

  if (TM_API_KEY) {
    tasks.push(fetchTicketmaster({ city, startDate, endDate }).then(list => out.push(...list)).catch(()=>{}));
  }
  if (EB_TOKEN) {
    tasks.push(fetchEventbrite({ city, startDate, endDate }).then(list => out.push(...list)).catch(()=>{}));
  }

  if (!TM_API_KEY && !EB_TOKEN) {
    // Demo fallback
    return [
      { name: 'Street Food Festival', venue: 'Main Square', date: startDate, url: '#' },
      { name: 'Live Jazz Night', venue: 'Blue Note Club', date: endDate, url: '#' }
    ];
  }

  await Promise.all(tasks);
  return out;
}

async function fetchTicketmaster({ city, startDate, endDate }) {
  const params = new URLSearchParams({
    apikey: TM_API_KEY,
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
  const resp = await fetch(url, { headers: { 'Authorization': `Bearer ${EB_TOKEN}` }});
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
