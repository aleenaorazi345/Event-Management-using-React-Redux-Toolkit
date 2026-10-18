
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents } from '../services/eventService';
import {
  registerForEvent,
  clearRegistrationMessage,
} from '../store/registrationSlice';

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
        event: event,
      })
    );
  }

  if (loading) return <p>Loading event details...</p>;

  if (error) {
    return (
      <p>
        {error} <Link to="/events">Back to events</Link>
      </p>
    );
  }

  if (!event) return <p>Event not found.</p>;

  const venue = event._embedded?.venues?.[0];

  return (
    <div>
      <Link to="/events">← Back to Events</Link>

      <h1>{event.name}</h1>

      {event.images?.[0]?.url && (
        <img src={event.images[0].url} alt={event.name} width="350" />
      )}

      <h3>Date and Time</h3>
      <p>{event.dates?.start?.localDate || 'Date unavailable'}</p>
      <p>{event.dates?.start?.localTime || 'Time unavailable'}</p>

      <h3>Venue</h3>
      <p>{venue?.name || 'Venue unavailable'}</p>
      <p>{venue?.city?.name || ''}</p>

      <h3>Event Information</h3>
      <p>
        {event.info || event.pleaseNote || 'No additional information available.'}
      </p>

      <h3>Registration</h3>

      {currentUser ? (
        <button onClick={handleRegister} disabled={alreadyRegistered}>
          {alreadyRegistered ? 'Already Registered' : 'Register for Event'}
        </button>
      ) : (
        <p>
          <Link to="/login">Log in</Link> to register for this event.
        </p>
      )}

      {message && <p>{message}</p>}

      {event.url && (
        <p>
          <a href={event.url} target="_blank" rel="noreferrer">
            View on Ticketmaster
          </a>
        </p>
      )}
    </div>
  );
}

export default EventDetails;
