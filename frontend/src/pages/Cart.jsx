import React, { useEffect, useState } from "react";

const Cart = () => {
  const [cart, setCart] = useState([]);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  };

  const saveCart = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const increaseQuantity = (id) => {
    const updated = cart.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    saveCart(updated);
  };

  const decreaseQuantity = (id) => {
    const updated = cart
      .map((item) =>
        item._id === id ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
      )
      .filter((item) => item.quantity > 0);
    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    saveCart(updated);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
  };

  const placeOrder = () => {
    alert("Order placed successfully!");
    console.log(cart);
    localStorage.removeItem("cart");
    setCart([]);
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
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white p-4 mb-4 shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.productImages?.[0] || "/placeholder.png"}
                  alt={item.productName}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{item.productName}</h3>
                  <p>₹{item.productPrice}</p>
                  <p className="text-gray-500 text-sm">{item.productDescription}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => decreaseQuantity(item._id)} className="px-2 border rounded">
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQuantity(item._id)} className="px-2 border rounded">
                  +
                </button>
                <button onClick={() => removeItem(item._id)} className="text-red-500">
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Total: ₹{getTotalPrice()}</h3>
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
