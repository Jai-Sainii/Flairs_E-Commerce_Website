import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { toast } from "react-toastify";

const statusConfig = {
  Pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
  },
  Accepted: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-400",
  },
  Shipped: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    dot: "bg-indigo-400",
  },
  "Out for Delivery": {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-400",
  },
  Delivered: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-400",
  },
  Cancelled: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-400",
  },
};

const allStatuses = [
  "Pending",
  "Accepted",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

function OrderCard({ order, fetchOrders }) {
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [updating, setUpdating] = useState(false);

  const config = statusConfig[order.status] || statusConfig.Pending;

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) return;
    setUpdating(true);
    try {
      await axios.put(
        `${API_BASE_URL}/admin/updateOrderStatus/${order._id}`,
        { status: selectedStatus },
        { withCredentials: true },
      );
      toast.success("Order status updated!");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-6 space-y-5 shadow-lg shadow-pink-500/5 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase">
            Order ID
          </p>
          <p className="text-sm font-semibold text-zinc-700 font-mono">
            {order._id}
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          {order.status}
        </span>
      </div>

      {/* Customer info */}
      <div className="bg-zinc-50/50 rounded-xl px-4 py-3 space-y-1">
        <p className="text-sm text-zinc-700">
          <span className="font-semibold">Customer:</span>{" "}
          {order.user?.name || order.shippingAddress.fullName}
        </p>
        <p className="text-sm text-zinc-500">
          <span className="font-semibold text-zinc-700">Phone:</span>{" "}
          {order.shippingAddress.phone}
        </p>
      </div>

      {/* Order items */}
      <div className="space-y-2">
        <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase">
          Items
        </p>
        {order.orderItems.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center px-4 py-3 bg-white/70 rounded-xl border border-zinc-100"
          >
            <div>
              <p className="text-sm font-semibold text-zinc-800">
                {item.product?.productName || "Product"}
              </p>
              <p className="text-xs text-zinc-400">
                Size: {item.selectedSize} &bull; Qty: {item.quantity}
              </p>
            </div>
            <p className="text-sm font-bold text-zinc-800">
              ₹{item.price * item.quantity}
            </p>
          </div>
        ))}
      </div>

      {/* Shipping address */}
      <div className="bg-zinc-50/50 rounded-xl px-4 py-3">
        <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase mb-1">
          Shipping Address
        </p>
        <p className="text-sm text-zinc-600">
          {order.shippingAddress.fullName}, {order.shippingAddress.address},{" "}
          {order.shippingAddress.city}, {order.shippingAddress.postalCode},{" "}
          {order.shippingAddress.country}
        </p>
      </div>

      {/* Payment & Price summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Payment:</span>
          <span className="font-medium text-zinc-700 capitalize">
            {order.paymentMethod.replace(/_/g, " ")}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${order.isPaid ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
          >
            {order.isPaid ? "Paid" : "Not Paid"}
          </span>
        </div>
      </div>

      <div className="border-t border-zinc-100 pt-4 space-y-1.5 text-sm">
        <div className="flex justify-between text-zinc-500">
          <span>Items</span>
          <span>₹{order.itemsPrice}</span>
        </div>
        <div className="flex justify-between text-zinc-500">
          <span>Shipping</span>
          <span>₹{order.shippingPrice}</span>
        </div>
        <div className="flex justify-between text-zinc-500">
          <span>Tax</span>
          <span>₹{order.taxPrice}</span>
        </div>
        <div className="flex justify-between font-bold text-base text-zinc-800 pt-1">
          <span>Total</span>
          <span>₹{order.totalPrice}</span>
        </div>
      </div>

      {/* Status update controls */}
      <div className="border-t border-zinc-100 pt-4">
        <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase mb-2">
          Update Status
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="flex-1 bg-white/80 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-flaire-pink/30 focus:border-flaire-pink transition-all cursor-pointer"
          >
            {allStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={updating || selectedStatus === order.status}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              selectedStatus === order.status
                ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                : "bg-gradient-to-r from-flaire-pink to-flaire-coral text-white hover:shadow-lg hover:shadow-pink-500/25 hover:-translate-y-0.5"
            }`}
          >
            {updating ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;
