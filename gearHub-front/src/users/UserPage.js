import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import './UserPage.css';

export default function UserPage() {
    const [user, setUser] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        addresses: [],
        profilePhotoUrl: ""
    });
    const [photoUrl, setPhotoUrl] = useState("");
    const [showModal, setShowModal] = useState(false);

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
            setPhotoUrl(result.data.profilePhotoUrl || "");
        } catch (error) {
            console.error("Error loading user:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    };

    const handleUpdatePhoto = async () => {
        try {
            const token = localStorage.getItem("jwt-token");
            await axios.patch(
                `http://localhost:8080/api/users/${user.id}/photo?photoUrl=${encodeURIComponent(photoUrl)}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setUser({ ...user, profilePhotoUrl: photoUrl });
            setShowModal(false);
        } catch (error) {
            console.error("Error updating photo:", error);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Профиль пользователя</h2>
                
                <div className="profile-photo-wrapper" onClick={() => setShowModal(true)}>
                    {user.profilePhotoUrl ? (
                        <img 
                            src={user.profilePhotoUrl} 
                            alt="Profile" 
                            className="profile-photo"
                        />
                    ) : (
                        <div className="profile-photo-placeholder">
                            <span>Нет фото</span>
                        </div>
                    )}
                    <div className="photo-overlay">
                        <i className="fas fa-camera"></i>
                    </div>
                </div>
                <button 
                    className="btn btn-outline-primary mt-3 change-photo-btn"
                    onClick={() => setShowModal(true)}
                >
                    <i className="fas fa-camera me-2"></i>
                    Изменить фото
                </button>
            </div>

            <div className="profile-info">
                <div className="info-item">
                    <div className="info-label">Имя</div>
                    <div className="info-value">{user.name}</div>
                </div>
                <div className="info-item">
                    <div className="info-label">Email</div>
                    <div className="info-value">{user.email}</div>
                </div>
                <div className="info-item">
                    <div className="info-label">Телефон</div>
                    <div className="info-value">{user.phone}</div>
                </div>
            </div>

            <div className="addresses-section">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Адреса доставки</h5>
                    <Link className="btn btn-primary" to="/addaddress">
                        Добавить адрес
                    </Link>
                </div>
                
                <div className="address-list">
                    {user.addresses.length === 0 ? (
                        <p className="text-center text-muted">У вас пока нет сохраненных адресов</p>
                    ) : (
                        user.addresses.map((address) => (
                            <div key={address.id} className="address-item">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-1">{address.city}</h6>
                                        <p className="mb-1">{address.street}</p>
                                        <small className="text-muted">{address.house}</small>
                                    </div>
                                    <Link 
                                        className="btn btn-outline-danger btn-sm" 
                                        to={`/deleteaddress/${address.id}`}
                                    >
                                        Удалить
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

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
        </div>
    );
} 