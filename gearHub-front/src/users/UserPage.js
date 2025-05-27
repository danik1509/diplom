import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';

export default function UserPage() {
    const [user, setUser] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        addresses: []
    });

    const navigate = useNavigate();

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const token = localStorage.getItem("jwt-token");
            if (!token) {
                navigate("/login");
                return;
            }
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            const result = await axios.get(`http://localhost:8080/api/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(result.data);
        } catch (error) {
            console.error("Error loading user:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Профиль пользователя</h2>

                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Личные данные</h5>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Имя:</label>
                                <p className="form-control-static">{user.name}</p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Email:</label>
                                <p className="form-control-static">{user.email}</p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Телефон:</label>
                                <p className="form-control-static">{user.phone}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="card-title mb-0">Адреса доставки</h5>
                                <Link className="btn btn-outline-primary btn-sm" to="/addaddress">
                                    Добавить адрес
                                </Link>
                            </div>
                            
                            {user.addresses.length === 0 ? (
                                <p className="text-center text-muted">У вас пока нет сохраненных адресов</p>
                            ) : (
                                <div className="list-group">
                                    {user.addresses.map((address) => (
                                        <div key={address.id} className="list-group-item">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="mb-1">{address.city}</h6>
                                                    <p className="mb-1">{address.street}</p>
                                                    <small className="text-muted">{address.house}</small>
                                                </div>
                                                <div>
                                                    <Link 
                                                        className="btn btn-outline-danger btn-sm me-2" 
                                                        to={`/deleteaddress/${address.id}`}
                                                    >
                                                        Удалить
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-4">
                        <Link className="btn btn-outline-primary" to="/">
                            На главную
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 