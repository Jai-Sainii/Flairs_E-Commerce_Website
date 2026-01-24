import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import { API_BASE_URL } from "../api";
import Hero from "../components/Hero";
import { toast } from "react-toastify";

const Home = () => {
  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    let res = await axios.get(`${API_BASE_URL}/products`);
    setProducts(res.data.product);
  };

  const handleAddToCart = async (product) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/cart/add`,
        {
          productId: product._id,
          quantity: 1,
        },
        {
          withCredentials: true,
        },
      );
      toast.success("Product added to cart!", {
        position: "top-right",
      });
    } catch (err) {
      console.error("Error adding product to cart:", err);
      toast.error("Failed to add product to cart / Login Required", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Hero />
      <div className="w-full flex flex-col items-center">
        <div className="w-11/12">
          <div className="h-[5rem] flex flex-row items-center gap-2">
            <hr className="w-[60px] border-none h-[1.5px] bg-gray-700" />
            <h1 className="text-3xl">All the Products</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
