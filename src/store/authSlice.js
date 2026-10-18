
import { createSlice } from '@reduxjs/toolkit';

const loadFromStorage = (key, fallback) => {
  try {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : fallback;
  } catch {
    return fallback;
  }
};

const initialState = {
  users: loadFromStorage('users', []),
  currentUser: loadFromStorage('currentUser', null),
  error: null
};



const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    register: (state, action) => {
      const { name, email, password } = action.payload;

      const existingUser = state.users.find(
        user => user.email === email
      );

      if (existingUser) {
        state.error = 'Email already registered';
      } else {
        state.users.push({ name, email, password });
        state.currentUser = null;
        state.error = null;
      }
    },

    login: (state, action) => {
      const { email, password } = action.payload;

      const user = state.users.find(
        user => user.email === email && user.password === password
      );

      if (user) {
        state.currentUser = {
          name: user.name,
          email: user.email
        };
        state.error = null;
      } else {
        state.error = 'Invalid email or password';
      }
    },

    logout: (state) => {
      state.currentUser = null;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { register, login, logout, clearError } = authSlice.actions;

export default authSlice.reducer;
