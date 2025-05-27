import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Registration.css'; // Подключите ваш CSS файл

export default function Registration() {
  let navigate = useNavigate();

  const [registration, setRegistration] = useState({
    name: "",
    email: "",
    username: "",
    password: ""
  });

  const { name, email, username, password } = registration;

  const onInputChange = (e) => {
    setRegistration({ ...registration, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/auth/registration", registration);
      // Обработка успешной регистрации, например, перенаправление пользователя на страницу входа
      navigate("/login");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      // Обработка ошибки регистрации, например, отображение сообщения об ошибке пользователю
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <form style={{ width: "300px", padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }} onSubmit={onSubmit}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Регистрация</h2>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="name">Имя:</label>
          <input
            style={{ width: "100%", padding: "5px", borderRadius: "3px", border: "1px solid #ccc" }}
            type="text"
            id="name"
            name="name"
            required
            value={name}
            onChange={onInputChange}
            placeholder="Введите ваше имя"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="email">Email:</label>
          <input
            style={{ width: "100%", padding: "5px", borderRadius: "3px", border: "1px solid #ccc" }}
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={onInputChange}
            placeholder="Введите ваш email"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="username">Логин:</label>
          <input
            style={{ width: "100%", padding: "5px", borderRadius: "3px", border: "1px solid #ccc" }}
            type="text"
            id="username"
            name="username"
            required
            value={username}
            onChange={onInputChange}
            placeholder="Введите логин"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="password">Пароль:</label>
          <input
            style={{ width: "100%", padding: "5px", borderRadius: "3px", border: "1px solid #ccc" }}
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={onInputChange}
            placeholder="Введите пароль"
          />
        </div>
        <button
          className="custom-button" // Используем класс для кнопки
          type="submit"
        >
          Зарегистрироваться
        </button>
        <p style={{ marginTop: "10px", textAlign: "center" }}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </div>
  );
}