import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/orders/${id}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setOrder(data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching order");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Order #{order._id}</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping</h2>
            <p className="mb-1">
              <span className="font-medium">Name:</span>{" "}
              {order.shippingAddress.fullName}
            </p>
            <p className="mb-1">
              <span className="font-medium">Address:</span>{" "}
              {order.shippingAddress.address}
            </p>
            <p className="mb-1">
              <span className="font-medium">City:</span>{" "}
              {order.shippingAddress.city}
            </p>
            <p className="mb-1">
              <span className="font-medium">Postal Code:</span>{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p className="mb-1">
              <span className="font-medium">Country:</span>{" "}
              {order.shippingAddress.country}
            </p>
            <p className="mb-1">
              <span className="font-medium">Phone:</span>{" "}
              {order.shippingAddress.phone}
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-4">Payment Method</h2>
            <p className="capitalize">
              {order.paymentMethod === "razorpay"
                ? "Razorpay"
                : order.paymentMethod === "paypal"
                  ? "PayPal"
                  : "Cash on Delivery"}
            </p>
            <div
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                order.isPaid
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.isPaid ? "Paid" : "Not Paid"}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div className="flex items-center">
                    <img
                      src={
                        item.product?.productImages?.[0] || "/placeholder.png"
                      }
                      alt={item.product?.productName || "Product"}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-2">
                      <h3 className="font-medium">
                        {item.product?.productName || "Product"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="font-medium">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span>Items</span>
                  <span>₹{order.itemsPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>₹{order.shippingPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax</span>
                  <span>₹{order.taxPrice}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
                  <span>Total</span>
                  <span>₹{order.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
