import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  returned: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      const obj = action.payload;
      state.returned.push(obj);
    },
    reset: () => initialState,
  },
});

export const { setNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
