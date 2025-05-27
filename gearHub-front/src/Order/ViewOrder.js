import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function ViewOrder() {
    const [order, setOrder] = useState({
        id: "",
        orderDate: "",
        status: "",
        totalAmount: 0,
        items: [],
        address: {}
    });

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        loadOrder();
    }, []);

    const loadOrder = async () => {
        try {
            const token = localStorage.getItem("jwt-token");
            if (!token) {
                navigate("/login");
                return;
            }
            const result = await axios.get(`http://localhost:8080/api/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrder(result.data);
        } catch (error) {
            console.error("Error loading order:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-3 mt-2 shadow">
                    <h2 className="text-center m-3">Детали заказа</h2>

                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <h5 className="card-title mb-3">Информация о заказе</h5>
                            <div className="row">
                                <div className="col-md-6 mb-2">
                                    <label className="form-label fw-bold small">Номер заказа:</label>
                                    <p className="form-control-static mb-0">{order.id}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label fw-bold small">Дата заказа:</label>
                                    <p className="form-control-static mb-0">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label fw-bold small">Статус:</label>
                                    <p className="form-control-static mb-0">{order.status}</p>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <label className="form-label fw-bold small">Сумма заказа:</label>
                                    <p className="form-control-static mb-0">{order.totalAmount} ₽</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <h5 className="card-title mb-3">Товары в заказе</h5>
                            {order.items.length === 0 ? (
                                <p className="text-center text-muted mb-0">В заказе нет товаров</p>
                            ) : (
                                <div className="list-group">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="list-group-item py-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="mb-1 small">{item.product.name}</h6>
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

                    <div className="card">
                        <div className="card-body p-3">
                            <h5 className="card-title mb-3">Адрес доставки</h5>
                            <div className="list-group">
                                <div className="list-group-item py-2">
                                    <div>
                                        <h6 className="mb-1 small">{order.address.city || 'Город не указан'}</h6>
                                        <p className="mb-1 small">{order.address.street || 'Улица не указана'}</p>
                                        <small className="text-muted">
                                            {order.address.houseNumber ? `Дом ${order.address.houseNumber}` : 'Дом не указан'}
                                            {order.address.apartmentNumber ? `, Кв. ${order.address.apartmentNumber}` : ''}
                                        </small>
                                        {order.address.postCode && (
                                            <small className="text-muted d-block">
                                                Индекс: {order.address.postCode}
                                            </small>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-3">
                        <Link className="btn btn-outline-primary" to="/orders">
                            К списку заказов
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}