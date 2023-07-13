import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  returned: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification(state, action) {
      const obj = action.payload;
      state.returned.push(obj);
    },
    reset: () => initialState,
  },
});

export const setNotification = (obj, time) => {
  return async (dispatch) => {
    dispatch(addNotification(obj));
    setTimeout(() => {
      dispatch(notificationSlice.actions.reset());
    }, time * 1000);
  };
};

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;