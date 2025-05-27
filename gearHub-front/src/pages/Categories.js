import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import './Categories.css';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [editName, setEditName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('jwt-token');
        if (!token) {
            navigate('/login');
            return;
        }

        const decodedToken = jwtDecode(token);
        if (decodedToken.role !== 'ROLE_ADMIN') {
            navigate('/');
            return;
        }

        fetchCategories();
    }, [navigate]);

    const getAuthHeader = () => {
        const token = localStorage.getItem('jwt-token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/categories', getAuthHeader());
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/categories', 
                { name: newCategoryName },
                getAuthHeader()
            );
            setNewCategoryName('');
            fetchCategories();
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    const handleUpdateCategory = async (id) => {
        try {
            await axios.put(
                `http://localhost:8080/api/categories/${id}`,
                { name: editName },
                getAuthHeader()
            );
            setEditingCategory(null);
            setEditName('');
            fetchCategories();
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
            try {
                await axios.delete(
                    `http://localhost:8080/api/categories/${id}`,
                    getAuthHeader()
                );
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    return (
        <div className="categories-container-main">
            <div className="categories-title">Управление категориями</div>

            {/* Форма создания новой категории */}
            <div className="categories-card">
                <div className="categories-section-title">Добавить новую категорию</div>
                <form className="add-category-form" onSubmit={handleCreateCategory}>
                    <input
                        type="text"
                        className="add-category-input"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Название категории"
                        required
                    />
                    <button type="submit" className="add-category-btn">
                        Добавить
                    </button>
                </form>
            </div>

            {/* Список категорий */}
            <div className="categories-card">
                <div className="categories-section-title">Список категорий</div>
                <div className="categories-list">
                    {categories.map((category) => (
                        <div key={category.id} className="category-row">
                            {editingCategory === category.id ? (
                                <div className="category-edit-group">
                                    <input
                                        type="text"
                                        className="edit-category-input"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                    />
                                    <button
                                        className="save-btn"
                                        onClick={() => handleUpdateCategory(category.id)}
                                    >
                                        Сохранить
                                    </button>
                                    <button
                                        className="cancel-btn"
                                        onClick={() => {
                                            setEditingCategory(null);
                                            setEditName('');
                                        }}
                                    >
                                        Отмена
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <span>{category.name}</span>
                                    <div className="category-edit-group">
                                        <button
                                            className="edit-btn"
                                            onClick={() => {
                                                setEditingCategory(category.id);
                                                setEditName(category.name);
                                            }}
                                        >
                                            Изменить
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeleteCategory(category.id)}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 