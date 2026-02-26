import axios from "axios";
import { API_BASE_URL } from "../api";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { FiShoppingCart, FiLoader } from "react-icons/fi";

const ProductView = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("L");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/products/${id}`);
      setProduct(res.data.product);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setIsAddingToCart(true);
      await axios.post(
        `${API_BASE_URL}/cart/add`,
        {
          productId: product._id,
          productSize: selectedSize,
          quantity: 1,
        },
        {
          withCredentials: true,
        },
      );
      toast.success(`${product.productName} added to cart!`, {
        position: "top-right",
      });
    } catch (err) {
      console.error("Error adding product to cart:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to add product to cart";
      toast.error(errorMessage, {
        position: "top-right",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-semibold text-gray-700">
          Product not found
        </h2>
        <p className="text-gray-500 mt-2">
          The product you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-12 flex items-center justify-center">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 mt-16">
          {/* Product Images */}
          <div className="md:w-1/2">
            <div className="bg-gray-50 rounded-lg overflow-hidden mb-4 border border-gray-200">
              {product.productImages?.length > 0 ? (
                <img
                  src={product.productImages[selectedImage]}
                  alt={product.productName}
                  className="w-full h-96 object-contain p-4"
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            {product.productImages?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.productName} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">
              {product.productName}
            </h1>
            <p className="text-2xl font-semibold text-gray-800 mb-4">
              ₹{product.productPrice?.toFixed(2)}
            </p>

            <p className="text-gray-600 mt-2 leading-relaxed">
              {product.productDescription}
            </p>

            <div className="mt-4">
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Select Size
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.productSize.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors duration-200 ${
                      selectedSize === size
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-6 w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 shadow-md"
            >
              {isAddingToCart? "ADDING": "ADD TO CART"}
            </button>

            {/* Product Details/Guarantees */}
            {/* <div className="mt-6 border-t pt-4">
              <ul className="space-y-2 text-sm text-gray-600">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    {detail}
                  </li>
                ))}
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
