import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
    let navigate = useNavigate();
    const { id } = useParams();

    const [product, setProduct] = useState({
        id: "",
        tittle: "",
        description: "",
        weight: "",
        price: "",
        image: ""  // Добавляем поле image
    });

    const { tittle, description, weight, price, image } = product;

    const onInputChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        loadProduct();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("jwt-token");
            if (!token) {
                navigate("/login");
                return;
            }
            await axios.patch(`http://localhost:8080/api/product/${id}`, product, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate("/");
        } catch (error) {
            console.error("Error updating product:", error);
            if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    };

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

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Редактировать товар</h2>

                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label htmlFor="Tittle" className="form-label">
                                Название
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Введите название продукта"
                                name="tittle"
                                value={tittle}
                                onChange={onInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Description" className="form-label">
                                Описание
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Введите описание продукта"
                                name="description"
                                value={description}
                                onChange={onInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Weight" className="form-label">
                                Вес товара
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Введите вес продукта"
                                name="weight"
                                value={weight}
                                onChange={onInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Price" className="form-label">
                                Цена
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Введите цену продукта"
                                name="price"
                                value={price}
                                onChange={onInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Image" className="form-label">
                                Ссылка на изображение
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Введите ссылку на изображение"
                                name="image"
                                value={image}
                                onChange={onInputChange}
                            />
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-outline-primary mx-2">
                                Подтвердить
                            </button>
                            <Link className="btn btn-outline-danger mx-2" to="/">
                                Отмена
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
