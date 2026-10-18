
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { cancelRegistration } from '../store/registrationSlice';
import './MyEvents.css';

function MyEvents() {
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.auth.currentUser);
  const registrations = useSelector(
    state => state.registration.registrations
  );

  if (!currentUser) {
    return (
      <div className="my-events-page">
        <div className="my-events-empty">
          <h1>My Events</h1>
          <p>Please log in to view your registered events.</p>
          <Link className="my-events-link" to="/login">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const myEvents = registrations.filter(
    item => item.userEmail === currentUser.email
  );

  const today = new Date().toISOString().split('T')[0];

  const upcomingEvents = myEvents.filter(
    item => (item.event.dates?.start?.localDate || '9999-12-31') >= today
  );

  const completedEvents = myEvents.filter(
    item => item.event.dates?.start?.localDate < today
  );

  function handleCancel(eventId) {
    if (window.confirm('Are you sure you want to cancel this registration?')) {
      dispatch(
        cancelRegistration({
          userEmail: currentUser.email,
          eventId,
        })
      );
    }
  }

  function renderEvent(item) {
    const event = item.event;
    const venue = event._embedded?.venues?.[0];

    return (
      <article className="my-event-card" key={event.id}>
        {event.images?.[0]?.url ? (
          <img
            className="my-event-image"
            src={event.images[0].url}
            alt={event.name}
          />
        ) : (
          <div className="my-event-image-placeholder">Event</div>
        )}

        <div className="my-event-content">
          <h3>{event.name}</h3>

          <p className="my-event-date">
            📅 {event.dates?.start?.localDate || 'Date unavailable'}
          </p>

          <p className="my-event-venue">
            📍 {venue?.name || 'Venue unavailable'}
          </p>

          <div className="my-event-actions">
            <Link
              className="my-event-link"
              to={`/events/${event.id}`}
            >
              View Details
            </Link>

            <button
              className="my-event-cancel"
              onClick={() => handleCancel(event.id)}
            >
              Cancel Registration
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <main className="my-events-page">
      <header className="my-events-header">
        <p className="my-events-eyebrow">YOUR EXPERIENCE</p>
        <h1>My Events</h1>
        <p>Keep track of the events you're excited about.</p>
        <div className="my-events-count">
          {myEvents.length} {myEvents.length === 1 ? 'event' : 'events'} registered
        </div>
      </header>

      <section className="my-events-section">
        <div className="my-events-section-heading">
          <h2>Upcoming Events</h2>
          <span>{upcomingEvents.length}</span>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="my-events-empty">
            <h3>No upcoming events yet</h3>
            <p>Find something interesting and register for it!</p>
            <Link className="my-events-link" to="/events">
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="my-events-grid">
            {upcomingEvents.map(renderEvent)}
          </div>
        )}
      </section>

      <section className="my-events-section">
        <div className="my-events-section-heading">
          <h2>Completed Events</h2>
          <span>{completedEvents.length}</span>
        </div>

        {completedEvents.length === 0 ? (
          <p className="my-events-no-completed">
            Your completed events will appear here.
          </p>
        ) : (
          <div className="my-events-grid">
            {completedEvents.map(renderEvent)}
          </div>
        )}
      </section>

      <div className="my-events-footer">
        <Link className="my-events-link" to="/events">
          + Explore More Events
        </Link>
      </div>
    </main>
  );
}

export default MyEvents;
