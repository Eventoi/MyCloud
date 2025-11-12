import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import API from '../../api';
import { setUser } from '../../redux/userSlice';
import { useNavigate, Link, Navigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user);

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('users/login/', { username, password });
      await API.get('users/csrf/');
      dispatch(setUser(res.data));
      if (res.data.is_administrator) {
        navigate('/admin');
      } else {
        navigate('/storage');
      }
    } catch (err) {
      setError('Неверный логин или пароль');
    }
  };

  if (user) {
    // Если пользователь уже залогинен, редиректим на нужную страницу
    return <Navigate to={user.is_administrator ? "/admin" : "/storage"} replace />;
  }

  return (
    <div className="form-container">
      <h3>Вход</h3>
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input placeholder="Логин" value={username} onChange={e => setUsername(e.target.value)} /><br />
        <input placeholder="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
        <button type="submit">Войти</button>
      </form>
      <p>Нет аккаунта? <Link to="/register">Регистрация</Link></p>
    </div>
  );
}