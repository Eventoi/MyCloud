// Redux хранилище для управления состоянием пользователя
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

// Создаём хранилище Redux
const store = configureStore({
  reducer: {
    user: userReducer, // хранит данные о текущем пользователе
  },
});

export default store;