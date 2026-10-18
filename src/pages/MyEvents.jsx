
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { cancelRegistration } from '../store/registrationSlice';

function MyEvents() {
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.auth.currentUser);
  const registrations = useSelector(
    state => state.registration.registrations
  );

  if (!currentUser) {
    return (
      <div>
        <h1>My Events</h1>
        <p>Please log in to view your registered events.</p>
        <Link to="/login">Go to Login</Link>
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
    const confirmed = window.confirm(
      'Are you sure you want to cancel this registration?'
    );

    if (confirmed) {
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

    return (
      <div key={event.id}>
        <h3>{event.name}</h3>

        <p>
          Date: {event.dates?.start?.localDate || 'Date unavailable'}
        </p>

        <p>
          Venue: {
            event._embedded?.venues?.[0]?.name || 'Venue unavailable'
          }
        </p>

        <Link to={`/events/${event.id}`}>View Details</Link>

        <button onClick={() => handleCancel(event.id)}>
          Cancel Registration
        </button>

        <hr />
      </div>
    );
  }

  return (
    <div>
      <h1>My Events</h1>

      <h2>Upcoming Events</h2>

      {upcomingEvents.length === 0 ? (
        <p>You have no upcoming registered events.</p>
      ) : (
        upcomingEvents.map(renderEvent)
      )}

      <h2>Completed Events</h2>

      {completedEvents.length === 0 ? (
        <p>You have no completed events.</p>
      ) : (
        completedEvents.map(renderEvent)
      )}

      <Link to="/events">Explore More Events</Link>
    </div>
  );
}

export default MyEvents;
