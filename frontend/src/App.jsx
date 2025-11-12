import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import AdminPanel from './pages/AdminPanel';
import StoragePage from './pages/StoragePage';
import Header from './components/Shared/Header';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMe } from './redux/userSlice';
import API from './api';

export default function App() {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMe());
    API.get('users/csrf/');
  }, [dispatch]);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={user?.is_administrator ? <AdminPanel /> : <Navigate to="/" />}
        />
        <Route
          path="/storage"
          element={user ? <StoragePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}