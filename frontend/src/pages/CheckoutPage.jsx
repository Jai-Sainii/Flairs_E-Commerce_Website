import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/cart`, {
        withCredentials: true,
      });
      setCartItems(data.items || []);
    } catch (error) {
      toast.error("Failed to load cart items");
      console.error("Error fetching cart items:", error);
    }
  };

  const fetchShippingAddress = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/users/profile`, {
        withCredentials: true,
      });
      setUser({name: data.user.name, email: data.user.email});
      setShippingAddress(data.user.shippingAddress || {});
    } catch (error) {
      toast.error("Failed to load shipping address");
      console.error("Error fetching shipping address:", error);
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    fetchCartItems();
    fetchShippingAddress();
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  const calculatePrice = () => {
    const itemsPrice = cartItems.reduce(
      (acc, item) => acc + item.product.productPrice * item.quantity,
      0,
    );
    const shippingPrice = itemsPrice > 500 ? 0 : 40;
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

    if (loading) return;

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

    setLoading(true);

    try {
      const orderItems = cartItems.map((item) => ({
        product: item.product._id,
        name: item.product.productName,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
        price: item.product.productPrice,
        image: item.product.productImages[0],
      }));

      const { data } = await axios.post(
        `${API_BASE_URL}/orders`,
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
          headers: { "Content-Type": "application/json" },
        },
      );

      if (paymentMethod === "razorpay") {
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

        const paymentObject = new window.Razorpay({
          key: razorpayKey,
          amount: data.amount,
          currency: "INR",
          name: "Order Payment",
          description: `Payment by ${user.name} | email: ${user.email}`,
          order_id: data.razorpayOrderId,

          handler: async (response) => {
            try {
              
              await axios.post(
                `${API_BASE_URL}/orders/verifyPayment`,
                {
                  orderItems,
                  shippingAddress,
                  paymentMethod,
                  itemsPrice: Number(itemsPrice),
                  shippingPrice: Number(shippingPrice),
                  taxPrice: Number(taxPrice),
                  totalPrice: Number(totalPrice),
                  razorpay_order_id: data.razorpayOrderId,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
                {
                  withCredentials: true,
                  headers: { "Content-Type": "application/json" },
                },
              );

              await axios.delete(`${API_BASE_URL}/cart/clear`, {
                withCredentials: true,
              });

              toast.success("Payment successful. Order placed!");
              navigate("/orders");
            } catch (err) {
              const msg =
                err.response?.data?.message || "Payment verification failed";
              toast.error(msg);
            } finally {
              setLoading(false);
            }
          },

          modal: {
            ondismiss: () => {
              toast.error("Payment cancelled");
              setLoading(false);
            },
          },
        });

        paymentObject.open();
        return; 
      }

      if (paymentMethod === "cash_on_delivery" || paymentMethod === "paypal") {
        await axios.delete(`${API_BASE_URL}/cart/clear`, {
          withCredentials: true,
        });

        toast.success("Order placed successfully!");
        navigate("/orders");
        return;
      }

      toast.error("Invalid payment method");
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Error placing order";
      toast.error(message);
    } finally {
      if (paymentMethod !== "razorpay") {
        setLoading(false);
      }
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
                      id="razorpay"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="razorpay" className="ml-2">
                      Razorpay
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
                    ₹{(item.product.productPrice * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span>Items</span>
                  <span>₹{itemsPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>₹{shippingPrice}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax (15%)</span>
                  <span>₹{taxPrice}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
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
