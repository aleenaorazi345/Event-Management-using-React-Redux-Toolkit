
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import MyEvents from './pages/MyEvents';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
function App() {
    const { users, currentUser } = useSelector(state => state.auth);
const registrations = useSelector(
  state => state.registration.registrations
);

useEffect(() => {
  localStorage.setItem('registrations', JSON.stringify(registrations));
}, [registrations]);
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [users, currentUser]);
  return (
    <BrowserRouter>
      <nav>
        <Link to="/register">Register</Link>
        {' | '}
        <Link to="/login">Login</Link>
        {' | '}
<Link to="/my-events">My Events</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<Events />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/events/:id" element={<EventDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
