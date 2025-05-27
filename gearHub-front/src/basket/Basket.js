import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';

export default function Basket() {
  const [cartItems, setCartItems] = useState([]);
  const [userAddresses, setUserAddress] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
    fetchUserAddress();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("jwt-token");
      if (!token) {
        navigate("/login");
        return;
      }
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      const response = await axios.get(`http://localhost:8080/api/bucket/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Cart items:', response.data.products);
      setCartItems(response.data.products);
    } catch (error) {
      console.error('Ошибка при получении товаров в корзине:', error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const fetchUserAddress = async () => {
    try {
      const token = localStorage.getItem("jwt-token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserAddress(response.data.addresses);
    } catch (error) {
      console.log('Ошибка при получении адреса пользователя:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem("jwt-token");
      const response = await axios.delete(`http://localhost:8080/api/bucket?id=${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        fetchCartItems();
      } else {
        console.log('Ошибка при удалении товара из корзины');
      }
    } catch (error) {
      console.log('Ошибка при удалении товара из корзины:', error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const token = localStorage.getItem("jwt-token");
      if (newQuantity < 1) {
        removeFromCart(itemId);
      } else {
        await axios.put(`http://localhost:8080/api/bucket?id=${itemId}&quantity=${newQuantity}`, null, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchCartItems();
      }
    } catch (error) {
      console.error('Ошибка при обновлении количества:', error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Корзина</h2>
          {cartItems.length === 0 ? (
            <p className="text-center">Корзина пуста</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Цена</th>
                  <th>Количество</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.tittle || item.name} 
                            style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                          />
                        )}
                        <span>{item.tittle || item.name}</span>
                      </div>
                    </td>
                    <td>{item.price} BYN</td>
                    <td>
                      <div className="d-flex align-items-center justify-content-center">
                        <button 
                          className="btn btn-outline-secondary btn-sm me-2"
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity || 1}</span>
                        <button 
                          className="btn btn-outline-secondary btn-sm ms-2"
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {userAddresses.length !== 0 ? (
            <Link className="btn btn-outline-primary mt-3" to="/createOrder">
              Создать заказ
            </Link>
          ) : (
            <p>Пожалуйста, добавьте адрес перед созданием заказа</p>
          )}
        </div>
      </div>
    </div>
  );
}