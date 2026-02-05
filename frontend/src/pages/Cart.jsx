import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const loadCart = async () => {
    const res = await axios.get(`${API_BASE_URL}/cart`, {
      withCredentials: true,
    });
    // console.log(res.data);
    setCart(res.data);
  };

  const increaseQuantity = async (id) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/cart/update/${id}`,
        { action: "increase" },
        { withCredentials: true },
      );
      setCart(res.data);
      loadCart();
    } catch (error) {
      console.error(error);
      toast.error("Failed to increase quantity");
    }
  };

  const decreaseQuantity = async (id) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/cart/update/${id}`,
        { action: "decrease" },
        { withCredentials: true },
      );
      setCart(res.data);
      loadCart();
    } catch (error) {
      console.error(error);
      toast.error("Failed to decrease quantity");
    }
  };

  const removeItem = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/cart/remove/${id}`, {
        withCredentials: true,
      });
      setCart(res.data);
      loadCart();
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item");
    }
  };

  const placeOrder = () => {
    navigate("/checkout");
    // console.log(cart);
    setCart([]);
    loadCart();
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl mt-20 font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div
              key={item.product._id}
              className="flex items-center justify-between bg-white p-4 mb-4 shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product.productImages?.[0] || "/placeholder.png"}
                  alt={item.product.productName}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{item.product.productName}</h3>
                  <p>Size: {item.selectedSize}</p>
                  <p>₹{item.product.productPrice}</p>
                  <p className="text-gray-500 text-sm">
                    {item.product.productDescription}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQuantity(item.product._id)}
                  className="px-2 border rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.product._id)}
                  className="px-2 border rounded"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.product._id)}
                  className="text-red-500 cursor-pointer"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
          <div className="mt-6 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Total: ₹{cart.totalPrice}</h3>
            <button
              onClick={placeOrder}
              className="text-black px-6 py-2 border-[1px] border-gray-500 cursor-pointer"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
