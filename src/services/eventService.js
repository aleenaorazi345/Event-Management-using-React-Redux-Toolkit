
const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;

const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

export async function getEvents(keyword = '') {
  const url = new URL(`${BASE_URL}/events.json`);

  url.searchParams.set('apikey', API_KEY);
  url.searchParams.set('countryCode', 'US');
  url.searchParams.set('size', '20');

  if (keyword.trim()) {
    url.searchParams.set('keyword', keyword.trim());
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Unable to fetch events from Ticketmaster.');
  }

  const data = await response.json();

  return data._embedded?.events || [];
}
