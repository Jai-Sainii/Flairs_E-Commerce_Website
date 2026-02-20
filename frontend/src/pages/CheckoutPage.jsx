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
      setUser({ name: data.user.name, email: data.user.email });
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
    <div className="container mx-auto mt-20 p-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white p-6 shadow-md mb-6">
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
                    className="w-full p-2 border"
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
                    className="w-full p-2 border"
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
                  className="w-full p-2 border"
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
                    className="w-full p-2 border"
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
                    className="w-full p-2 border"
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
                    className="w-full p-2 border"
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
                  <div className="flex items-center cursor-pointer">
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

              <button className="pay-btn mt-6">
                <span className="btn-text">Place order</span>
                <div className="icon-container">
                  <svg viewBox="0 0 24 24" className="icon card-icon">
                    <path
                      d="M20,8H4V6H20M20,18H4V12H20M20,4H4C2.89,4 2,4.89 2,6V18C2,19.11 2.89,20 4,20H20C21.11,20 22,19.11 22,18V6C22,4.89 21.11,4 20,4Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg viewBox="0 0 24 24" className="icon payment-icon">
                    <path
                      d="M2,17H22V21H2V17M6.25,7H9V6H6V3H18V6H15V7H17.75L19,17H5L6.25,7M9,10H15V8H9V10M9,13H15V11H9V13Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg viewBox="0 0 24 24" className="icon dollar-icon">
                    <path
                      d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg
                    viewBox="0 0 24 24"
                    className="icon wallet-icon default-icon"
                  >
                    <path
                      d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12C10.89,6 10,6.9 10,8V16A2,2 0 0,0 12,18M12,16H22V8H12M16,13.5A1.5,1.5 0 0,1 14.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,12A1.5,1.5 0 0,1 16,13.5Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg viewBox="0 0 24 24" className="icon check-icon">
                    <path
                      d="M9,16.17L4.83,12L3.41,13.41L9,19L21,7L19.59,5.59L9,16.17Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
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
