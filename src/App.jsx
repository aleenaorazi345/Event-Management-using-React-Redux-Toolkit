
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
function App() {
    const { users, currentUser } = useSelector(state => state.auth);

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
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
