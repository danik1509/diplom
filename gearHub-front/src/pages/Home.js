import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../layout/buttons.css";
import './Home.css';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchTerm, selectedCategory, products]);

    const getAuthHeader = () => {
        const token = localStorage.getItem('jwt-token');
        return token ? {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        } : {};
    };

    const loadProducts = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/products');
            setProducts(result.data);
        } catch (error) {
            console.error('Error loading products:', error);
            setError('Ошибка при загрузке товаров');
        }
    };

    const loadCategories = async () => {
        try {
            console.log('Загрузка категорий...');
            const result = await axios.get('http://localhost:8080/api/categories', getAuthHeader());
            console.log('Полученные категории:', result.data);
            setCategories(result.data);
        } catch (error) {
            console.error('Error loading categories:', error);
            setError('Ошибка при загрузке категорий');
        }
    };

    const filterProducts = () => {
        let filtered = [...products];

        // Фильтрация по поисковому запросу
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.tittle.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Фильтрация по категории
        if (selectedCategory) {
            filtered = filtered.filter(product =>
                product.category && product.category.id === selectedCategory.id
            );
        }

        setFilteredProducts(filtered);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(selectedCategory?.id === category.id ? null : category);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory(null);
    };

    const hasActiveFilters = searchTerm || selectedCategory;

    return (
        <div className="container">
            {/* Поиск и фильтры */}
            <div className="row mb-4 mt-4">
                <div className="col-md-6">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Поиск по названию..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => setSearchTerm('')}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
                {hasActiveFilters && (
                    <div className="col-md-6 d-flex justify-content-end align-items-center">
                        <button
                            className="btn btn-outline-secondary clear-filters-btn"
                            onClick={clearFilters}
                        >
                            Очистить фильтры
                        </button>
                    </div>
                )}
            </div>

            {/* Категории */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="categories-container">
                        {error ? (
                            <div className="text-danger">{error}</div>
                        ) : categories.length > 0 ? (
                            categories.map((category) => (
                                <button
                                    key={category.id}
                                    className={`category-button ${selectedCategory?.id === category.id ? 'active' : ''}`}
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    {category.name}
                                </button>
                            ))
                        ) : (
                            <div className="text-muted">Категории не найдены</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Список товаров */}
            <div className="row">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div className="col-md-4 mb-4" key={product.id}>
                            <div className="card" style={{ background: '#e8e8e8', height: '100%' }}>
                                <div className="card-body d-flex flex-column">
                                    <div style={{
                                        position: 'relative',
                                        width: '100%',
                                        height: 0,
                                        paddingBottom: '100%'
                                    }}>
                                        <img 
                                            src={product.image} 
                                            alt={product.tittle} 
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '2px',
                                                border: '1px solid #000',
                                                objectFit: 'cover'
                                            }} 
                                        />
                                    </div>
                                    <h5 className="card-title">{product.tittle}</h5>
                                    <p className="card-text">Цена: {product.price} BYN</p>
                                    {product.category && (
                                        <p className="card-text">
                                            <small className="text-muted">Категория: {product.category.name}</small>
                                        </p>
                                    )}
                                    <div className="mt-auto">
                                        {localStorage.getItem("jwt-token") ? (
                                            <Link
                                                to={`/viewproduct/${product.id}`}
                                                className="button"
                                                style={{ borderRadius: '10px', fontSize: '15px' }}
                                            >
                                                Подробнее
                                            </Link>
                                        ) : (
                                            <Link
                                                to="/login"
                                                className="button"
                                                style={{ borderRadius: '10px', fontSize: '15px' }}
                                            >
                                                Войти для просмотра
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <p>Товары не найдены</p>
                    </div>
                )}
            </div>
        </div>
    );
}