import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import '../layout/buttons.css';

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
            navigate("/basket");
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
        <div className="container py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={7}>
                    <Card className="shadow-lg border-0 rounded-4">
                        <Row className="g-0 align-items-center">
                            <Col md={6} className="text-center p-4">
                                <div style={{background: '#f8f9fa', borderRadius: '20px', padding: '10px'}}>
                                    <Card.Img 
                                        variant="top" 
                                        src={product.image || 'https://via.placeholder.com/400x500?text=Нет+фото'} 
                                        alt={product.tittle} 
                                        style={{maxHeight: 350, objectFit: 'contain', borderRadius: '15px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)'}} 
                                    />
                                </div>
                            </Col>
                            <Col md={6} className="p-4">
                                <Card.Body>
                                    <Card.Title as="h2" className="mb-3 fw-bold text-primary" style={{fontSize: '2rem'}}>
                                        {product.tittle}
                                    </Card.Title>
                                    <Card.Text className="mb-2 text-muted" style={{minHeight: 60}}>
                                        {product.description}
                                    </Card.Text>
                                    <div className="mb-3">
                                        <Badge bg="info" className="me-2" style={{fontSize: '1rem'}}>Вес: {product.weight} г</Badge>
                                        <Badge bg="success" style={{fontSize: '1.1rem'}}>Цена: {product.price} BYN</Badge>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2 mt-4">
                                        {decodedToken !== null && decodedToken.role === "ROLE_ADMIN" && (
                                            <>
                                                <Link className="btn btn-outline-success" to={`/editproduct/${id}`}>
                                                    <i className="fas fa-edit me-1"></i> Редактировать
                                                </Link>
                                                <Button variant="outline-danger" onClick={deleteProduct}>
                                                    <i className="fas fa-trash-alt me-1"></i> Удалить
                                                </Button>
                                            </>
                                        )}
                                        <Button variant="primary" onClick={addToBasket}>
                                            <i className="fas fa-shopping-cart me-2"></i>В корзину
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>
                    <div className="d-flex justify-content-center mt-4">
                        <Link className="btn btn-outline-primary" to={'/'}>
                            На главную
                        </Link>
                    </div>
                </Col>
            </Row>
        </div>
    );
}