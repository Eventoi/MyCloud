import { createSlice } from '@reduxjs/toolkit';
import API from '../api';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    logoutUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setLoading, setError, logoutUser } = userSlice.actions;

export const fetchMe = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await API.get('users/me/');
    dispatch(setUser(res.data));
  } catch (err) {
    dispatch(setUser(null)); // сбрасываем пользователя при любой ошибке
    dispatch(setError(err.response?.data?.detail || 'Не авторизован'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const loginUser = (username, password) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await API.post('users/login/', { username, password });
    await API.get('users/csrf/');
    dispatch(setUser(res.data));
  } catch (err) {
    dispatch(setError(err.response?.data?.detail || 'Ошибка входа'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const logout = () => async (dispatch) => {
  try {
    await API.post('users/logout/');
    await API.get('users/csrf/');
    dispatch(logoutUser());
  } catch (err) {
    dispatch(setError(err.response?.data?.detail || 'Ошибка выхода'));
  }
};

export default userSlice.reducer;