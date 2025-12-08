import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch cart items from backend
  const fetchCartItems = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/cart", {
        withCredentials: true,
      });
      setCartItems(data.items || []);
    } catch (error) {
      toast.error("Failed to load cart items");
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const calculatePrice = () => {
    const itemsPrice = cartItems.reduce(
      (acc, item) => acc + item.product.productPrice * item.quantity,
      0
    );
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    return {
      itemsPrice: itemsPrice.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      taxPrice: taxPrice.toFixed(2),
      totalPrice,
    };
  };

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculatePrice();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country ||
      !shippingAddress.phone
    ) {
      toast.error("Please fill in all shipping details");
      return;
    }

    try {
      setLoading(true);

      const orderItems = cartItems.map((item) => ({
        product: item.product._id,
        name: item.product.productName,
        quantity: item.quantity,
        price: item.product.productPrice,
        image: item.product.productImages[0],
      }));

      const { data } = await axios.post(
        "http://localhost:5000/orders",
        {
          orderItems,
          shippingAddress,
          paymentMethod,
          itemsPrice: Number(itemsPrice),
          shippingPrice: Number(shippingPrice),
          taxPrice: Number(taxPrice),
          totalPrice: Number(totalPrice),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      await axios.delete("http://localhost:5000/cart/clear", {
        withCredentials: true,
      });

      navigate(`/orders`);
      toast.success("Order placed successfully!");
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Error placing order";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate("/collection")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        phone: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      address: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        city: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.postalCode}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        postalCode: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        country: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="credit_card"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentMethod === "credit_card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="credit_card" className="ml-2">
                      Credit Card
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="paypal" className="ml-2">
                      PayPal
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cash_on_delivery"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={paymentMethod === "cash_on_delivery"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="cash_on_delivery" className="ml-2">
                      Cash on Delivery
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-6 py-2 px-4 rounded-md text-white font-medium ${
                  loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div className="flex items-center">
                    <img
                      src={item.product.productImages[0]}
                      alt={item.product.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-2">
                      <h3 className="font-medium">
                        {item.product.productName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="font-medium">
                    ${(item.product.productPrice * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span>Items</span>
                  <span>${itemsPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>${shippingPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax (15%)</span>
                  <span>${taxPrice}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
