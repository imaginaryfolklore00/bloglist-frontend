import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: '',
  visible: false,
  timer: 0
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    newNotification(state, action) {
      if (state.timer) clearTimeout(state.timer);
      state.message = action.payload.message;
      state.visible = true;
      state.timer = action.payload.timer;
    },
    // eslint-disable-next-line no-unused-vars
    clear(state, action) {
      return initialState;
    }
  }
});

export const { newNotification, clear } = notificationSlice.actions;

export const setNotification = (message, durationInSeconds) => {
  return (dispatch) => {
    const timer = setTimeout(() => dispatch(clear()), durationInSeconds * 1000);
    const notification = {
      message: message,
      timer: timer
    };
    dispatch(newNotification(notification));
  };
};

export default notificationSlice.reducer;
