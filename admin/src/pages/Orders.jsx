import { useEffect, useState } from "react";
import OrderCard from "../components/OrderCard";
import axios from "axios";
import { API_BASE_URL } from "../api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/getAllOrders`, {
        withCredentials: true,
      });
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Stats
  const totalOrders = orders.length;
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const shippedCount = orders.filter((o) =>
    ["Shipped", "Out for Delivery"].includes(o.status),
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-flaire-pink/20 border-t-flaire-pink rounded-full animate-spin-slow" />
          <p className="text-zinc-500 font-medium text-sm">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-800 text-center">
          Orders
        </h1>
        <p className="text-center text-zinc-400 text-sm mt-1">
          Manage and track all customer orders
        </p>
      </div>

      {/* Stats */}
      {totalOrders > 0 && (
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/50 backdrop-blur-md border border-white/40 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-zinc-800">{totalOrders}</p>
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wide">
              Total
            </p>
          </div>
          <div className="bg-amber-50/50 backdrop-blur-md border border-amber-100 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
            <p className="text-xs text-amber-500 font-medium uppercase tracking-wide">
              Pending
            </p>
          </div>
          <div className="bg-indigo-50/50 backdrop-blur-md border border-indigo-100 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-indigo-600">{shippedCount}</p>
            <p className="text-xs text-indigo-500 font-medium uppercase tracking-wide">
              In Transit
            </p>
          </div>
          <div className="bg-emerald-50/50 backdrop-blur-md border border-emerald-100 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-emerald-600">
              {deliveredCount}
            </p>
            <p className="text-xs text-emerald-500 font-medium uppercase tracking-wide">
              Delivered
            </p>
          </div>
        </div>
      )}

      {/* Orders list */}
      {orders.length === 0 ? (
        <div className="max-w-5xl mx-auto text-center py-20">
          <p className="text-zinc-400 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-6">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              fetchOrders={fetchOrders}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
