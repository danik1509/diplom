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
        image: "",
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

    const handleDeleteAddress = async (addressId) => {
        try {
            const token = localStorage.getItem("jwt-token");
            if (!token) {
                navigate("/login");
                return;
            }
            
            await axios.delete(`http://localhost:8080/api/addresses/${addressId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Перезагружаем данные пользователя после успешного удаления
            await loadUser();

        } catch (error) {
            console.error("Error deleting address:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    };

    // Фильтруем адреса, исключая первый
    const filteredAddresses = user.addresses.slice(1);

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-3 mt-2 shadow">
                    <h2 className="text-center m-3">Профиль пользователя</h2>

                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <div className="text-center mb-3">
                                <img 
                                    src={user.image || "https://via.placeholder.com/100"} 
                                    alt="User" 
                                    className="rounded-circle"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                            </div>
                            <h5 className="card-title mb-3">Личные данные</h5>
                            <div className="row">
                                <div className="col-md-4 mb-2">
                                    <label className="form-label fw-bold small">Имя:</label>
                                    <p className="form-control-static mb-0">{user.name}</p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label fw-bold small">Email:</label>
                                    <p className="form-control-static mb-0">{user.email}</p>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label fw-bold small">Телефон:</label>
                                    <p className="form-control-static mb-0">{user.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="card-title mb-0">Адреса доставки</h5>
                                <Link className="btn btn-outline-primary btn-sm" to="/addaddress">
                                    Добавить адрес
                                </Link>
                            </div>
                            
                            {filteredAddresses.length === 0 ? (
                                <p className="text-center text-muted mb-0">У вас пока нет сохраненных адресов</p>
                            ) : (
                                <div className="list-group">
                                    {filteredAddresses.map((address) => (
                                        <div key={address.id} className="list-group-item py-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="mb-1 small">{address.city || 'Город не указан'}</h6>
                                                    <p className="mb-1 small">{address.street || 'Улица не указана'}</p>
                                                    <small className="text-muted">
                                                        {address.houseNumber ? `Дом ${address.houseNumber}` : 'Дом не указан'}
                                                        {address.apartmentNumber ? `, Кв. ${address.apartmentNumber}` : ''}
                                                    </small>
                                                    {address.postCode && (
                                                        <small className="text-muted d-block">
                                                            Индекс: {address.postCode}
                                                        </small>
                                                    )}
                                                </div>
                                                <div>
                                                    <button 
                                                        className="btn btn-outline-danger btn-sm" 
                                                        onClick={() => handleDeleteAddress(address.id)}
                                                    >
                                                        Удалить
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-3">
                        <Link className="btn btn-outline-primary" to="/">
                            На главную
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}