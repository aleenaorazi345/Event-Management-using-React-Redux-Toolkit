
import { useEffect, useState } from 'react';
import { getEvents } from '../services/eventService';
import { Link } from 'react-router-dom';
function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError('');

        const eventList = await getEvents();
        setEvents(eventList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Explore Events</h1>

      {events.length === 0 ? (
        <p>No events found. Try again later.</p>
      ) : (
        events.map(event => (
         <div key={event.id}>
  <Link
    to={`/events/${event.id}`}
    style={{ color: 'inherit', textDecoration: 'none' }}
  >
    <h2>{event.name}</h2>

    <p>
      Date: {event.dates?.start?.localDate || 'Date unavailable'}
    </p>

    <p>
      Venue: {
        event._embedded?.venues?.[0]?.name || 'Venue unavailable'
      }
    </p>

    {event.images?.[0]?.url && (
      <img
        src={event.images[0].url}
        alt={event.name}
        width="250"
      />
    )}

    <p>Click to view details →</p>
  </Link>
</div>
        ))
      )}
    </div>
  );
}

export default Events;
