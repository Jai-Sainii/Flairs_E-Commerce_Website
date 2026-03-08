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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-flaire-pink/20 border-t-flaire-pink rounded-full animate-spin-slow" />
          <p className="text-zinc-500 font-medium text-sm">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-800 text-center">
          All Products
        </h1>
        <p className="text-center text-zinc-400 text-sm mt-1">
          Manage your product catalog
        </p>
      </div>

      {products.length === 0 ? (
        <div className="max-w-7xl mx-auto text-center py-20">
          <p className="text-zinc-400 text-lg">No products found</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
