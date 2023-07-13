import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    addNotification(state, action) {
      return action.payload;
    },
    // eslint-disable-next-line no-unused-vars
    reset(state, action) {
      return null;
    },
  },
});

export const setReduxNotification = (obj, time) => {
  return async (dispatch) => {
    dispatch(addNotification(obj));
    setTimeout(() => {
      dispatch(reset());
    }, time * 1000);
  };
};

export const { addNotification, reset } = notificationSlice.actions;
export default notificationSlice.reducer;
