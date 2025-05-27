import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AddProduct() {
    let navigate = useNavigate();

    const [product, setProduct] = useState({
        id: "",
        tittle: "",
        description: "",
        weight: "",
        price: "",
        image: ""
    });

    const { tittle, description, weight, price, image } = product;

    const onInputChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:8080/api/product", product, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt-token")}`
            }
        });
        navigate("/");
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Добавить товар</h2>

                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label htmlFor="Tittle" className="form-label">Название</label>
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
                            <label htmlFor="Description" className="form-label">Описание</label>
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
                            <label htmlFor="Weight" className="form-label">Вес товара</label>
                            <input
                                type="number"
                                className="form-control no-spinner" // добавляем класс для удаления стрелок
                                placeholder="Введите вес продукта"
                                name="weight"
                                value={weight}
                                onChange={onInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Price" className="form-label">Цена</label>
                            <input
                                type="number"
                                className="form-control no-spinner" // добавляем класс для удаления стрелок
                                placeholder="Введите цену продукта"
                                name="price"
                                value={price}
                                onChange={onInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Image" className="form-label">Ссылка на изображение товара</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Вставьте ссылку на изображение продукта"
                                name="image"
                                value={image}
                                onChange={onInputChange}
                            />
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-outline-success mx-2">
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