import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';
import blogService from '../services/blogs';

const loginSlice = createSlice({
  name: 'login',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    // eslint-disable-next-line no-unused-vars
    logout(state, action) {
      return null;
    },
  },
});

export const setReduxLogin = (username, password) => {
  return async (dispatch) => {
    const loggedUser = await loginService.login({ username, password });
    window.localStorage.setItem('loggedBlogUser', JSON.stringify(loggedUser));
    blogService.setToken(loggedUser.token);
    dispatch(setUser(loggedUser));
  };
};

export const setReduxAuth = (user) => {
  return async (dispatch) => {
    blogService.setToken(user.token);
    dispatch(setUser(user));
  };
};

export const setReduxLogout = () => {
  return async (dispatch) => {
    dispatch(logout());
  };
};

export const { setUser, logout } = loginSlice.actions;
export default loginSlice.reducer;
