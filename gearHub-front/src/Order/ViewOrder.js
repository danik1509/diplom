import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function ViewOrder() {
    const [order, setOrder] = useState({
        id: "",
        dateOfDelivery: "",
        status: "",
        sum: 0,
        user: {},
        address: {},
        productList: []
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
            const result = await axios.get(`http://localhost:8080/api/order/${id}`, {
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
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-7 border rounded p-4 mt-4 shadow bg-white">
                    <h2 className="text-center m-4">Детали заказа</h2>

                    <div className="card mb-4 shadow-sm">
                        <div className="card-body p-4">
                            <h5 className="card-title mb-4 text-center">Информация о заказе</h5>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small">Номер заказа:</label>
                                    <div>{order.id}</div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small">Дата доставки:</label>
                                    <div>{order.dateOfDelivery ? new Date(order.dateOfDelivery).toLocaleDateString() : ''}</div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small">Статус:</label>
                                    <div>{order.status}</div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small">Сумма заказа:</label>
                                    <div>{order.sum} BYN</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-4 shadow-sm">
                        <div className="card-body p-4">
                            <h5 className="card-title mb-4 text-center">Товары в заказе</h5>
                            {order.productList.length === 0 ? (
                                <p className="text-center text-muted mb-0">В заказе нет товаров</p>
                            ) : (
                                <div className="row g-3">
                                    {order.productList.map((item) => (
                                        <div key={item.id} className="col-12">
                                            <div className="d-flex align-items-center border rounded p-3 bg-light shadow-sm">
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
                                                    <div className="mb-1 small">Количество: {item.quantity || 1}</div>
                                                    <div className="text-muted small">Цена: {item.price} BYN</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card mb-4 shadow-sm">
                        <div className="card-body p-4">
                            <h5 className="card-title mb-4 text-center">Адрес доставки</h5>
                            <div className="list-group">
                                <div className="list-group-item py-2 border-0 bg-transparent">
                                    <div>
                                        {order.address.city && <h6 className="mb-1 small">{order.address.city}</h6>}
                                        {order.address.street && <p className="mb-1 small">{order.address.street}</p>}
                                        <small className="text-muted">
                                            {order.address.houseNumber ? `Дом ${order.address.houseNumber}` : ''}
                                            {order.address.apartmentNumber ? `, Кв. ${order.address.apartmentNumber}` : ''}
                                            {order.address.postCode ? `, Индекс: ${order.address.postCode}` : ''}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-3">
                        <Link className="btn btn-outline-primary px-4 py-2" to="/orders">
                            К списку заказов
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}