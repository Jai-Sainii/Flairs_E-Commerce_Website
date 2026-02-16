import { useEffect, useState } from "react";
import OrderCard from "../components/OrderCard";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/getAllOrders", {
          withCredentials: true,
        });
        setOrders(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <p className="text-black font-semibold">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 px-6 py-10">
      <h1 className="text-3xl font-extrabold text-black text-center mb-10">
        Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-black">No orders found</p>
      ) : (
        <div className="max-w-5xl mx-auto space-y-8">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
