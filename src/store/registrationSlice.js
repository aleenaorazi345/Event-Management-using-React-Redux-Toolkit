
import { createSlice } from '@reduxjs/toolkit';

const loadRegistrations = () => {
  try {
    return JSON.parse(localStorage.getItem('registrations')) || [];
  } catch {
    return [];
  }
};

const initialState = {
  registrations: loadRegistrations(),
  message: '',
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState,

  reducers: {
    registerForEvent: (state, action) => {
      const { userEmail, event } = action.payload;

      const alreadyRegistered = state.registrations.some(
        item => item.userEmail === userEmail && item.event.id === event.id
      );

      if (alreadyRegistered) {
        state.message = 'You are already registered for this event.';
      } else {
        state.registrations.push({ userEmail, event });
        state.message = 'Successfully registered for this event!';
      }
    },

    cancelRegistration: (state, action) => {
      const { userEmail, eventId } = action.payload;

      state.registrations = state.registrations.filter(
        item => !(item.userEmail === userEmail && item.event.id === eventId)
      );

      state.message = 'Registration cancelled.';
    },

    clearRegistrationMessage: state => {
      state.message = '';
    },
  },
});

export const {
  registerForEvent,
  cancelRegistration,
  clearRegistrationMessage,
} = registrationSlice.actions;

export default registrationSlice.reducer;
