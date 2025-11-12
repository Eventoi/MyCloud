import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Home() {
  const user = useSelector(state => state.user.user);

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: 60 }}>
      <h2 style={{ fontSize: 32, marginBottom: 10 }}>Добро пожаловать в <span style={{ color: '#1976d2' }}>My Cloud</span></h2>
      <p style={{ fontSize: 18, marginBottom: 28 }}>
        My Cloud — это безопасное и удобное облачное хранилище для ваших файлов.
        <br />Загружайте, скачивайте, делитесь и управляйте файлами из любой точки мира.
      </p>
      {!user ? (
        <div>
          <Link className="big-btn" to="/login">Войти</Link>
          <span style={{ margin: '0 12px', color: '#888' }}>|</span>
          <Link className="big-btn" to="/register">Регистрация</Link>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: 18 }}>Вы вошли как <b>{user.username}</b></p>
          <Link className="big-btn" to="/storage">Моё хранилище</Link>
          {user.is_administrator && (
            <>
              <span style={{ margin: '0 12px', color: '#888' }}>|</span>
              <Link className="big-btn" to="/admin">Админ-панель</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}