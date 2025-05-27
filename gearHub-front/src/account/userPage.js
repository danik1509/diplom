import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import './userPage.css';

export default function UserPage() {
    const [user, setUser] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        image: "",
        addresses: []
    });
    const [showModal, setShowModal] = useState(false);
    const [photoUrl, setPhotoUrl] = useState("");
    const [userId, setUserId] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editAddress, setEditAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwt-token");
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.id);
            loadUser(decodedToken.id);
        } else {
            navigate("/login");
        }
    }, []);

    const loadUser = async (id) => {
        try {
            const token = localStorage.getItem("jwt-token");
            const result = await axios.get(`http://localhost:8080/api/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(result.data);
            setPhotoUrl(result.data.image || "");
        } catch (error) {
            console.error("Error loading user:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    };

    const handleUpdatePhoto = async () => {
        if (!userId) {
            console.error("User ID is not available");
            return;
        }

        try {
            const token = localStorage.getItem("jwt-token");
            await axios.patch(
                `http://localhost:8080/api/users/${userId}/photo?photoUrl=${encodeURIComponent(photoUrl)}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setUser({ ...user, image: photoUrl });
            setShowModal(false);
        } catch (error) {
            console.error("Error updating photo:", error);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        console.log("handleDeleteAddress вызван с ID:", addressId);
        if (!addressId) {
            console.error("Address ID is undefined");
            return;
        }

        try {
            const token = localStorage.getItem("jwt-token");
            if (!token) {
                navigate("/login");
                return;
            }
            
            console.log("Deleting address with ID:", addressId);
            
            await axios.delete(`http://localhost:8080/api/address/${addressId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            await loadUser(userId);

        } catch (error) {
            console.error("Error deleting address:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    };

    const handleEditAddress = (address) => {
        setEditAddress(address);
        setEditModalOpen(true);
    };

    const handleUpdateAddress = async () => {
        if (!editAddress || !editAddress.id) return;
        
        // Валидация полей
        if (!editAddress.street || !editAddress.houseNumber) {
            setError("Пожалуйста, заполните обязательные поля (улица и дом)");
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem("jwt-token");
            await axios.patch(
                `http://localhost:8080/api/address/${editAddress.id}`,
                editAddress,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setEditModalOpen(false);
            await loadUser(userId);
            // Показываем уведомление об успехе
            alert("Адрес успешно обновлен");
        } catch (error) {
            console.error("Ошибка при обновлении адреса:", error);
            setError(error.response?.data?.message || "Произошла ошибка при обновлении адреса");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredAddresses = user.addresses;

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-3 mt-2 shadow">
                    <h2 className="text-center m-3">Профиль пользователя</h2>

                    <div className="card mb-3">
                        <div className="card-body p-3">
                            <div className="text-center mb-3">
                                <div className="profile-photo-wrapper" onClick={() => setShowModal(true)}>
                                    <img 
                                        src={user.image || "https://via.placeholder.com/100"} 
                                        alt="User" 
                                        className="profile-photo"
                                    />
                                    <div className="photo-overlay">
                                        <i className="fas fa-camera"></i>
                                    </div>
                                </div>
                                <button 
                                    className="btn btn-outline-primary btn-sm mt-2 change-photo-btn"
                                    onClick={() => setShowModal(true)}
                                >
                                    <i className="fas fa-camera me-2"></i>
                                    Изменить фото
                                </button>
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
                                                        className="btn btn-outline-primary btn-sm me-2"
                                                        onClick={() => handleEditAddress(address)}
                                                    >
                                                        Редактировать
                                                    </button>
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

            {/* Модальное окно */}
            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Изменить фото профиля</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">URL фотографии</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={photoUrl}
                                        onChange={(e) => setPhotoUrl(e.target.value)}
                                        placeholder="Введите URL фотографии"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Отмена
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleUpdatePhoto}>
                                    Сохранить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно редактирования адреса */}
            {editModalOpen && editAddress && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Редактировать адрес</h5>
                                <button type="button" className="btn-close" onClick={() => setEditModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    value={editAddress.street || ''}
                                    onChange={e => setEditAddress({ ...editAddress, street: e.target.value })}
                                    placeholder="Улица *"
                                    required
                                />
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    value={editAddress.houseNumber || ''}
                                    onChange={e => setEditAddress({ ...editAddress, houseNumber: e.target.value })}
                                    placeholder="Дом *"
                                    required
                                />
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    value={editAddress.apartmentNumber || ''}
                                    onChange={e => setEditAddress({ ...editAddress, apartmentNumber: e.target.value })}
                                    placeholder="Квартира"
                                />
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    value={editAddress.postCode || ''}
                                    onChange={e => setEditAddress({ ...editAddress, postCode: e.target.value })}
                                    placeholder="Индекс"
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>
                                    Отмена
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-primary" 
                                    onClick={handleUpdateAddress}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Сохранение...
                                        </>
                                    ) : (
                                        'Сохранить'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}