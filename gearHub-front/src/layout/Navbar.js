import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import './Navbar.css';
import './buttons.css';
import logo from '../assets/1.png';
import '../styles.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwt-token");
    if (jwtToken) {
      try {
        const token = jwtDecode(jwtToken);
        setDecodedToken(token);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token decoding error:", error);
        setIsAuthenticated(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
    setIsAuthenticated(false);
    setDecodedToken(null);
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <strong style={{ fontSize: '48px' }}>Tokyo</strong>
          <strong style={{color:'#E42727', fontSize: '48px'}}>Motors</strong>
          <img src={logo} alt="Logo" style={{width: '75px', height: 'auto', marginLeft: '10px', marginTop: '-20px'}} />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
          <ul className="navbar-nav">
            {isAuthenticated && decodedToken?.role === "ROLE_ADMIN" && (
              <>
                <li className="nav-item me-2">
                  <Link className="button" to="/orders">Заказы</Link>
                </li>
                <li className="nav-item me-2">
                  <Link className="button" to="/addproduct">Добавить продукт</Link>
                </li>
                <li className="nav-item me-2">
                  <Link className="button" to="/categories">Категории</Link>
                </li>
              </>
            )}
            <li className="nav-item me-2">
              <Link className="button" to="/profile">Профиль</Link>
            </li>
            <li className="nav-item me-2">
              <Link className="button" to="/basket">Корзина</Link>
            </li>
            {!isAuthenticated && (
              <>
                <li className="nav-item me-2">
                  <Link className="button" to="/login">Войти</Link>
                </li>
                <li className="nav-item me-2">
                  <Link className="button" to="/registration">Зарегистрироваться</Link>
                </li>
              </>
            )}
            {isAuthenticated && (
              <li className="nav-item me-2" style={{ marginLeft: '20px' }}>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-danger nav-link rounded-pill"
                  style={{fontSize:'15px', padding: '15px 30px'}}
                >
                  Выйти
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}