import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import "../layout/buttons.css"; 

export default function ViewProduct() {
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        tittle: '',
        description: '',
        weight: '',
        price: '',
        image: ''
    });
    
    const { id } = useParams();

    useEffect(() => {
        loadProduct();
    }, []);

    const loadProduct = async () => {
        try {
            const token = localStorage.getItem("jwt-token");
            if (!token) {
                navigate("/login");
                return;
            }
            const result = await axios.get(`http://localhost:8080/api/product/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProduct(result.data);
        } catch (error) {
            console.error("Error loading product:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    };

    const deleteProduct = async () => {
        try {
            const token = localStorage.getItem("jwt-token");
            if (!token) {
                navigate("/login");
                return;
            }
            await axios.delete(`http://localhost:8080/api/product/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate("/");
        } catch (error) {
            console.error("Error deleting product:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    };

    const addToBasket = async () => {
        try {
            const token = localStorage.getItem("jwt-token");
            if (!token) {
                navigate("/login");
                return;
            }
            await axios.post(`http://localhost:8080/api/bucket?id=${id}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error("Error adding to basket:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    };

    const jwtToken = localStorage.getItem("jwt-token");
    const decodedToken = jwtToken ? jwtDecode(jwtToken) : null;

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Подробнее</h2>

                    <div className="card">
                        <div>
                            <ul className="list-group list-group-flush">
                                {product.image && (
                                    <img height={500} src={product.image} alt={product.tittle} />
                                )}
                                <li className="list-group-item">
                                    <b>Название:</b> {product.tittle}
                                </li>
                                <li className="list-group-item">
                                    <b>Описание:</b> {product.description}
                                </li>
                                <li className="list-group-item">
                                    <b>Вес:</b> {product.weight} г
                                </li>
                                <li className="list-group-item">
                                    <b>Цена:</b> {product.price} BYN
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-4">
                        {decodedToken !== null && decodedToken.role === "ROLE_ADMIN" && (
                            <>
                                <Link className="btn btn-outline-success mx-1" to={`/editproduct/${id}`}>
                                    Редактировать
                                </Link>
                                <button className="btn btn-outline-danger mx-1" onClick={deleteProduct}>
                                    Удалить
                                </button>
                            </>
                        )}
                        <button className="btn btn-outline-primary mx-1" onClick={addToBasket}>
                            В корзину
                        </button>
                    </div>

                    <Link className="btn btn-outline-primary my-2" to={'/'}>
                        На главную
                    </Link>
                </div>
            </div>
        </div>
    );
}