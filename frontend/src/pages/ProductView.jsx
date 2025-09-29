import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

const ProductView = () => {

    const { id } = useParams()

  const [product, setProduct] = useState({
    productImages: [],
    productSize: [],
    details: [],
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("L");

  useEffect(() => {
    const fetchData = async () => {
      let res = await axios.get(`http://localhost:5000/products/${id}`);
      setProduct(res.data.product);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (product.productImages.length > 0) {
      setSelectedImage(product.productImages[0]);
    }
  }, [product]);

  return (
    <div className="bg-gray-50 font-sans min-h-screen min-w-screen flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 justify-center md:justify-start">
              {product.productImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-16 h-20 md:w-20 md:h-24 object-cover rounded-md cursor-pointer border-2 ${
                    selectedImage === image
                      ? "border-gray-900"
                      : "border-transparent"
                  } transition-all duration-200`}
                  onClick={() => setSelectedImage(image)}
                  onMouseOver={() => setSelectedImage(image)}
                />
              ))}
            </div>

            <div className="flex-1">
              <img
                src={product.productImages?.[0] || "/placeholder.png"}
                alt="Main Product"
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              {product.productName}
            </h1>

            <p className="text-3xl font-extrabold text-gray-900 mt-2">
              ₹{product.productPrice}
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

            <button className="mt-6 w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 shadow-md">
              ADD TO CART
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
