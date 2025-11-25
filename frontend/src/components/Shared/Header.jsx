import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/userSlice';

export default function Header() {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="header-nav">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <span style={{ color: '#1976d2', fontWeight: 600, fontSize: 22, letterSpacing: 1 }}>
            My Cloud
          </span>
        </Link>
        <nav className="header-links">
          {!user ? (
            <>
              {location.pathname !== "/login" && (
                <Link to="/login" className="nav-btn">Вход</Link>
              )}
              {location.pathname !== "/register" && (
                <Link to="/register" className="nav-btn">Регистрация</Link>
              )}
            </>
          ) : (
            <>
              <span className="header-user">Вы: <b>{user.username}</b></span>
              <Link to="/storage" className="nav-btn">Моё хранилище</Link>
              {user.is_administrator && (
                <Link to="/adminpanel" className="nav-btn">Админ-панель</Link>
              )}
              <button className="nav-btn" onClick={handleLogout}>Выйти</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}