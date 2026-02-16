import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProductCard({ product, fetchProducts }) {

  const navigate = useNavigate();

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/deleteProduct/${id}`, {
        withCredentials: true,
      });
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white shadow-md hover:shadow-xl transition overflow-hidden border border-pink-100">

      <div className="h-56 w-full bg-pink-50 overflow-hidden">
        <img
          src={product.productImages[0]}
          alt={product.productName}
          className="h-full w-full object-cover hover:scale-105 transition"
        />
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-black truncate">
            {product.productName}
          </h2>
          <span
            className={`text-xs px-2 py-1 rounded-full font-semibold
              ${
                product.isActive
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
          >
            {product.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <p className="text-sm text-black capitalize">
          {product.productCategory} • {product.productType}
        </p>

        <p className="text-sm text-gray-600 line-clamp-2">
          {product.productDescription}
        </p>


        <div className="flex flex-wrap gap-2">
          {product.productSize.map((size) => (
            <span
              key={size}
              className="text-xs px-2 py-1 rounded-md border border-black text-black"
            >
              {size}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-extrabold text-black">
            ₹{product.productPrice}
          </span>

          <span
            className={`text-sm font-medium ${
              product.stockQuantity > 0
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {product.stockQuantity > 0
              ? `In stock (${product.stockQuantity})`
              : "Out of stock"}
          </span>
        </div>


        <div className="flex gap-3 pt-3">
          <button onClick={() => navigate(`/editProduct/${product._id}`)} className="flex-1 bg-black text-white py-2 text-sm font-semibold hover:bg-pink-500 transition">
            Edit
          </button>
          <button onClick={() => deleteProduct(product._id)} className="flex-1 border border-red-600 text-red-600 py-2 text-sm font-semibold hover:bg-red-500 hover:text-white transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
