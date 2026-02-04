import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/orders`, {
          withCredentials: true,
        });
        setOrders(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      case "Accepted":
        return "text-blue-600 bg-blue-100";
      case "Shipped":
        return "text-indigo-600 bg-indigo-100";
      case "Out for Delivery":
        return "text-orange-600 bg-orange-100";
      case "Delivered":
        return "text-green-600 bg-green-100";
      case "Cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading orders...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl pt-28">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-xl text-gray-600 mb-4">
            You haven't placed any orders yet.
          </p>
          <Link to="/collection" className="text-pink-600 hover:underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID:{" "}
                    <span className="font-mono text-gray-800">{order._id}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div
                  className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status,
                  )}`}
                >
                  Status: {order.status}
                </div>
              </div>

              <div className="border-t border-b py-4 my-4">
                <div className="flex flex-col sm:flex-row gap-4 overflow-x-auto pb-2">
                  {order.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center min-w-[200px]"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={
                            item.product?.productImages?.[0] ||
                            "/placeholder.png"
                          }
                          alt={item.product?.productName || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium truncate w-32">
                          {item.product?.productName || "Product"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="font-bold text-lg">
                  Total: ₹{order.totalPrice.toFixed(2)}
                </p>
                <Link
                  to={`/order/${order._id}`}
                  className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
