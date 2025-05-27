import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './AddAddress.css';

export default function AddAddress() {
  let navigate = useNavigate();

  const [address, setAddress] = useState({
    street: "",
    houseNumber: "",
    apartmentNumber: "",
    postCode: ""
  });

  const { street, houseNumber, apartmentNumber, postCode } = address;

  const onInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      "http://localhost:8080/api/address",
      address,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt-token")}`
        }
      }
    );
    navigate("/profile"); // Переход на страницу профиля после успешного добавления адреса
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Добавить адрес</h2>

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="street" className="form-label">
                Улица
              </label>
              <input
                type="text"
                className="form-control custom-input"
                placeholder="Введите улицу"
                name="street"
                value={street}
                onChange={onInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="houseNumber" className="form-label">
                Номер дома
              </label>
              <input
                type="text"
                className="form-control custom-input"
                placeholder="Введите номер дома"
                name="houseNumber"
                value={houseNumber}
                onChange={onInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="apartmentNumber" className="form-label">
                Номер квартиры
              </label>
              <input
                type="text"
                className="form-control custom-input"
                placeholder="Введите номер квартиры"
                name="apartmentNumber"
                value={apartmentNumber}
                onChange={onInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="postCode" className="form-label">
                Почтовый индекс
              </label>
              <input
                type="text"
                className="form-control custom-input"
                placeholder="Введите почтовый индекс"
                name="postCode"
                value={postCode}
                onChange={onInputChange}
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