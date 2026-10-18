import { useEffect, useState } from 'react';
import { getEvents } from '../services/eventService';
import { Link } from 'react-router-dom';
import './Events.css';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [upcomingOnly, setUpcomingOnly] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError('');
        const eventList = await getEvents();
        setEvents(eventList);
      } catch (err) {
        setError(err.message || 'Unable to load events.');
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const categories = [
    'All',
    ...new Set(
      events
        .map(event => event.classifications?.[0]?.segment?.name)
        .filter(Boolean)
    ),
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(search.toLowerCase().trim());

    const eventCategory =
      event.classifications?.[0]?.segment?.name || '';

    const matchesCategory =
      category === 'All' || eventCategory === category;

    const eventDate = event.dates?.start?.dateTime ||
      event.dates?.start?.localDate;

    const matchesUpcoming =
      !upcomingOnly ||
      (eventDate && new Date(eventDate) >= new Date());

    return matchesSearch && matchesCategory && matchesUpcoming;
  });

  if (loading) {
    return (
      <main className="events-page">
        <div className="events-status">Loading events...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="events-page">
        <div className="events-error">
          <h2>Unable to load events</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="events-page">
      <header className="events-header">
        <h1>Explore Events</h1>
        <p>Discover events and find your next experience.</p>
      </header>

      <div className="events-toolbar">
        <input
          className="events-search"
          type="text"
          placeholder="Search events by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="events-filter"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {categories.map(item => (
            <option key={item} value={item}>
              {item === 'All' ? 'All Categories' : item}
            </option>
          ))}
        </select>

        <label className="events-upcoming-filter">
          <input
            type="checkbox"
            checked={upcomingOnly}
            onChange={e => setUpcomingOnly(e.target.checked)}
          />
          Upcoming only
        </label>
      </div>

      <div className="events-section-heading">
        <h2>Discover Events</h2>
        <span className="events-count">
          {filteredEvents.length} Events
        </span>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="events-empty">
          <h3>No matching events</h3>
          <p>Try another search or category.</p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setUpcomingOnly(false);
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map(event => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="event-card"
            >
              {event.images?.[0]?.url ? (
                <img
                  className="event-card-image"
                  src={event.images[0].url}
                  alt={event.name}
                />
              ) : (
                <div className="event-card-image" />
              )}

              <div className="event-card-content">
                <span className="event-card-category">
                  {event.classifications?.[0]?.segment?.name ||
                    'Live Event'}
                </span>

                <h3>{event.name}</h3>

                <p className="event-card-date">
                  📅 {event.dates?.start?.localDate ||
                    'Date unavailable'}
                </p>

                <p className="event-card-venue">
                  📍 {event._embedded?.venues?.[0]?.name ||
                    'Venue unavailable'}
                </p>

                <span className="event-card-link">
                  View Details →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

export default Events;