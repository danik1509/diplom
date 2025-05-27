import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Login.css'; // Подключите ваш CSS файл

export default function Login() {
  let navigate = useNavigate();

  const [login, setLogin] = useState({
    username: "",
    password: ""
  });

  const { username, password } = login;

  const onInputChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/auth/login", login);
      const token = response.data["jwt-token"]; // Получаем токен из ответа сервера
      // Сохраняем токен в локальном хранилище
      localStorage.setItem("jwt-token", token);
      // Перенаправляем пользователя на главную страницу
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Ошибка входа:", error);
      // Обработка ошибки входа, например, отображение сообщения об ошибке пользователю
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <form style={{ width: "300px", padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }} onSubmit={onSubmit}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Вход</h2>
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
            placeholder="Введите ваш логин"
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
          className="custom-button" // Используем класс для стилизации кнопки
          type="submit"
        >
          Войти
        </button>
        <p style={{ marginTop: "10px", textAlign: "center" }}>
          Нет аккаунта? <Link to="/registration">Зарегистрироваться</Link>
        </p>
      </form>
    </div>
  );
}