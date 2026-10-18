import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents } from '../services/eventService';
import {
  registerForEvent,
  clearRegistrationMessage,
} from '../store/registrationSlice';
import './EventDetails.css';


function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.auth.currentUser);
  const message = useSelector(state => state.registration.message);
  const registrations = useSelector(
    state => state.registration.registrations
  );

  const alreadyRegistered = currentUser && registrations.some(
    item => item.userEmail === currentUser.email && item.event.id === id
  );

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        setError('');

        const events = await getEvents();
        const foundEvent = events.find(item => item.id === id);

        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError('Event not found. Please return to Explore Events.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  function handleRegister() {
    if (!currentUser) {
      alert('Please log in to register for an event.');
      return;
    }

    dispatch(clearRegistrationMessage());
    dispatch(
      registerForEvent({
        userEmail: currentUser.email,
        event,
      })
    );
  }

  if (loading) {
    return <div className="details-status">Loading event details...</div>;
  }

  if (error || !event) {
    return (
      <div className="details-status">
        <h2>Oops! Event not found</h2>
        <p>{error || 'This event is unavailable.'}</p>
        <Link to="/events" className="details-back-button">
          Back to Events
        </Link>
      </div>
    );
  }

  const venue = event._embedded?.venues?.[0];
  const eventDate = event.dates?.start?.localDate;
  const eventTime = event.dates?.start?.localTime;

  return (
    <main className="event-details-page">
      <Link to="/events" className="details-back-link">
        ← Back to Events
      </Link>

      <section className="event-details-card">
        <div className="details-image-container">
          {event.images?.[0]?.url ? (
            <img
              className="details-event-image"
              src={event.images[0].url}
              alt={event.name}
            />
          ) : (
            <div className="details-image-placeholder">Event</div>
          )}
        </div>

        <div className="details-content">
          <span className="details-label">EVENT DETAILS</span>
          <h1>{event.name}</h1>

          <div className="details-info-grid">
            <div className="details-info-item">
              <span className="details-icon">📅</span>
              <div>
                <h3>Date</h3>
                <p>{eventDate || 'Date unavailable'}</p>
              </div>
            </div>

            <div className="details-info-item">
              <span className="details-icon">🕒</span>
              <div>
                <h3>Time</h3>
                <p>{eventTime || 'Time unavailable'}</p>
              </div>
            </div>

            <div className="details-info-item">
              <span className="details-icon">📍</span>
              <div>
                <h3>Venue</h3>
                <p>{venue?.name || 'Venue unavailable'}</p>
                <p>{venue?.city?.name || ''}</p>
              </div>
            </div>

            <div className="details-info-item">
              <span className="details-icon">🎟️</span>
              <div>
                <h3>Admission</h3>
                <p>View ticket information on Ticketmaster</p>
              </div>
            </div>
          </div>

          <div className="details-description">
            <h2>About this event</h2>
            <p>
              {event.info ||
                event.pleaseNote ||
                'More information about this event may be available on Ticketmaster.'}
            </p>
          </div>

          <div className="details-actions">
            {currentUser ? (
              <button
                className="details-register-button"
                onClick={handleRegister}
                disabled={alreadyRegistered}
              >
                {alreadyRegistered ? '✓ Already Registered' : 'Register for Event'}
              </button>
            ) : (
              <Link to="/login" className="details-register-button">
                Log in to Register
              </Link>
            )}

            {event.url && (
              <a
                className="details-ticket-button"
                href={event.url}
                target="_blank"
                rel="noreferrer"
              >
                View on Ticketmaster ↗
              </a>
            )}
          </div>

          {message && (
            <p className="details-feedback" role="status">
              {message}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default EventDetails;