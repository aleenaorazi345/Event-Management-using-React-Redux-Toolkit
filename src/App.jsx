import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Register from './pages/Register';
import Login from './pages/Login';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import MyEvents from './pages/MyEvents';

import { logout } from './store/authSlice';
import './App.css';

function AppContent() {
  const { users, currentUser } = useSelector(state => state.auth);
  const registrations = useSelector(state => state.registration.registrations);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('registrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [users, currentUser]);

  function handleLogout() {
    dispatch(logout());
    navigate('/login');
  }

  return (
    <>
      <nav>
        <Link to="/events">Explore Events</Link>
        {' | '}

        {currentUser ? (
          <>
            <Link to="/my-events">My Events</Link>
            {' | '}
            <span>Hi, {currentUser.name}</span>
            {' | '}
            <button onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>
            {' | '}
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />

        <Route
          path="/my-events"
          element={currentUser ? <MyEvents /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;