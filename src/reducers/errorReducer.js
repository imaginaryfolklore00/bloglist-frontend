import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: '',
  visible: false,
  timer: 0
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    newError(state, action) {
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

export const { newError, clear } = errorSlice.actions;

export const setError = (message, durationInSeconds) => {
  return (dispatch) => {
    const timer = setTimeout(() => dispatch(clear()), durationInSeconds * 1000);
    const error = {
      message: message,
      timer: timer
    };
    dispatch(newError(error));
  };
};

export default errorSlice.reducer;
