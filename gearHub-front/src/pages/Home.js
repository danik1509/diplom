import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import "../layout/buttons.css";

export default function Home() {
    const [products, setProducts] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const result = await axios.get('http://localhost:8080/api/products');
        setProducts(result.data);
    };

    return ( 
        <div className="container">
            <div className="py-4">
                <div className="row">
                    {products.map((product) => (
                        <div className="col-md-4 mb-4" key={product.id}>
                            <div className="card" style={{ background: '#e8e8e8', height: '100%' }}>
                                <div className="card-body d-flex flex-column">
                                    {/* Квадратный контейнер для изображения */}
                                    <div style={{
                                        position: 'relative',
                                        width: '100%',
                                        height: 0,
                                        paddingBottom: '100%' // Установите это значение в 100% для квадратного контейнера
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
                                                objectFit: 'cover' // Сохраняет пропорции изображения
                                            }} 
                                        />
                                    </div>
                                    <h5 className="card-title">{product.tittle}</h5>
                                    <p className="card-text">Цена: {product.price} BYN</p>
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
                                            console.log("haven't jwt")
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}