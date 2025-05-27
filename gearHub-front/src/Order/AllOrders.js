import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch the orders from the server
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Заказы</h2>

          {orders.length === 0 ? (
            <p>Заказов не найдено</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.dateOfDelivery}</td>
                    <td>
                      <Link
                        to={`/order/${order.id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Подробнее
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}