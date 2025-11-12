import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateUsername = v => /^[A-Za-z][A-Za-z0-9]{3,19}$/.test(v);
  const validateEmail = v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
  const validatePassword = v =>
    v.length >= 6 && /[A-Z]/.test(v) && /\d/.test(v) && /[^A-Za-z0-9]/.test(v);

  const handleRegister = async e => {
    e.preventDefault();
    setError('');
    if (!validateUsername(username)) {
      setError('Логин: латиница/цифры, с буквы, 4-20 символов');
      return;
    }
    if (!validateEmail(email)) {
      setError('Email некорректен');
      return;
    }
    if (!validatePassword(password)) {
      setError('Пароль: не менее 6 символов, 1 заглавная, 1 цифра, 1 спец. символ');
      return;
    }
    try {
      await API.post('users/register/', { username, full_name: fullName, email, password });
      await API.get('users/csrf/');
      alert('Регистрация успешна!');
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.data?.username) {
        setError('Пользователь с таким логином уже существует');
      } else if (err.response?.data?.email) {
        setError('Пользователь с таким email уже существует');
      } else if (typeof err.response?.data === 'object') {
        const firstError = Object.values(err.response.data)[1];
        if (Array.isArray(firstError)) {
          setError(firstError[1]);
        } else {
          setError('Ошибка регистрации');
        }
      } else {
        setError('Ошибка регистрации');
      }
    }
  };

  return (
    <div className="form-container">
      <h3>Регистрация</h3>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
        />
        <input
          type="text"
          placeholder="Полное имя"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          autoComplete="name"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <button type="submit">Создать аккаунт</button>
      </form>
      <div style={{ marginTop: 14 }}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </div>
    </div>
  );
}