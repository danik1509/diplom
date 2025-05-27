import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';

export default function CreateOrder() {
    const [cartItems, setCartItems] = useState([]);
    const [userAddresses, setUserAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartItems();
        fetchUserAddresses();
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
            setCartItems(response.data.products);
        } catch (error) {
            console.error('Ошибка при получении товаров в корзине:', error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    };

    const fetchUserAddresses = async () => {
        try {
            const token = localStorage.getItem("jwt-token");
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserAddresses(response.data.addresses);
            if (response.data.addresses.length > 0) {
                setSelectedAddress(response.data.addresses[0].id);
            }
        } catch (error) {
            console.error('Ошибка при получении адресов:', error);
        }
    };

    const createOrder = async () => {
        try {
            const token = localStorage.getItem("jwt-token");
            if (!token) {
                navigate("/login");
                return;
            }

            const orderData = {
                addressId: selectedAddress,
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            };

            const response = await axios.post('http://localhost:8080/api/orders', orderData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                // Очищаем корзину после создания заказа
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;
                await axios.delete(`http://localhost:8080/api/bucket/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Перенаправляем на страницу заказов
                navigate('/orders');
            }
        } catch (error) {
            console.error('Ошибка при создании заказа:', error);
            if (error.response) {
                alert(`Ошибка при создании заказа: ${error.response.data.message || 'Неизвестная ошибка'}`);
            } else {
                alert('Произошла ошибка при создании заказа. Пожалуйста, попробуйте снова.');
            }
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-3 mt-2 shadow">
                    <h2 className="text-center m-3">Создание заказа</h2>

                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <h5 className="card-title mb-3">Товары в заказе</h5>
                            {cartItems.length === 0 ? (
                                <p className="text-center text-muted mb-0">Корзина пуста</p>
                            ) : (
                                <div className="list-group">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="list-group-item py-2">
                                            <div className="d-flex align-items-center">
                                                <div className="me-3" style={{ width: '60px', height: '60px' }}>
                                                    <img 
                                                        src={item.image || 'https://via.placeholder.com/60'} 
                                                        alt={item.tittle || item.name}
                                                        className="img-fluid rounded"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h6 className="mb-1">{item.tittle || item.name}</h6>
                                                    <p className="mb-1 small">Количество: {item.quantity}</p>
                                                    <small className="text-muted">
                                                        Цена: {item.price} ₽
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <h5 className="card-title mb-3">Выберите адрес доставки</h5>
                            <div className="list-group">
                                {userAddresses.map((address) => (
                                    <div key={address.id} className="list-group-item py-2">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="address"
                                                id={`address-${address.id}`}
                                                value={address.id}
                                                checked={selectedAddress === address.id}
                                                onChange={(e) => setSelectedAddress(e.target.value)}
                                            />
                                            <label className="form-check-label" htmlFor={`address-${address.id}`}>
                                                <div>
                                                    <h6 className="mb-1 small">{address.city || 'Город не указан'}</h6>
                                                    <p className="mb-1 small">{address.street || 'Улица не указана'}</p>
                                                    <small className="text-muted">
                                                        {address.houseNumber ? `Дом ${address.houseNumber}` : 'Дом не указан'}
                                                        {address.apartmentNumber ? `, Кв. ${address.apartmentNumber}` : ''}
                                                    </small>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                        <Link className="btn btn-outline-secondary" to="/basket">
                            Назад
                        </Link>
                        <button 
                            className="btn btn-primary"
                            onClick={createOrder}
                            disabled={!selectedAddress || cartItems.length === 0}
                        >
                            Создать заказ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 