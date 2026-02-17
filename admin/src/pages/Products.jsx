import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import { API_BASE_URL } from "../api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products`, {
        withCredentials: true,
      });
      setProducts(res.data.product);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-pink-600 font-semibold">
        Loading products...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 px-6 py-10">
      <h1 className="text-3xl font-extrabold text-black text-center mb-10">
        All Products
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-black">No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              fetchProducts={fetchProducts}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
