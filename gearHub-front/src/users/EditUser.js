import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import './EditUser.css'; // Импортируйте ваши стили

export default function EditUser() {
  let navigate = useNavigate();

  const [user, setUser] = useState({
    id: null, // Изначально id будет null
    name: "",
    email: "",
    username: "",
    image: null
  });

  const { name, email, username, image } = user;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwt-token");
        if (!token) {
          console.error("Токен не найден");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const userData = response.data;
        setUser({ ...userData, id: userId }); // Добавляем id
      } catch (error) {
        console.error("Ошибка получения данных пользователя:", error);
      }
    };

    fetchUser();
  }, []);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const onFileChange = (e) => {
    setUser({ ...user, image: e.target.files[0] });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in user) {
      if (key === 'image' && user.image === null) continue; // Не добавлять пустое изображение
      formData.append(key, user[key]);
    }

    try {
      const token = localStorage.getItem("jwt-token");
      const response = await axios.put(`http://localhost:8080/api/users/${user.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Проверка успешного ответа
      if (response.status === 200 || response.status === 204) {
        navigate("/profile"); // Переход на страницу профиля после успешного редактирования
      } else {
        console.error("Ошибка: Некорректный ответ от сервера");
      }
    } catch (error) {
      console.error("Ошибка обновления данных пользователя:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Редактировать профиль</h2>

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Имя</label>
              <input
                type="text"
                className="form-control"
                placeholder="Введите имя"
                name="name"
                value={name}
                onChange={onInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Введите email"
                name="email"
                value={email}
                onChange={onInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Никнейм</label>
              <input
                type="text"
                className="form-control"
                placeholder="Введите никнейм"
                name="username"
                value={username}
                onChange={onInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Фото профиля</label>
              <input
                type="file"
                className="form-control"
                name="image"
                onChange={onFileChange}
              />
            </div>
            <button type="submit" className="btn btn-success custom-button">
              Подтвердить
            </button>
            <Link className="btn btn-danger mx-2 custom-button" to="/profile">
              Отмена
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}