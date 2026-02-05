import React from "react";
import { useNavigate } from "react-router";

export default function ProductCard({ product }) {

  const navigate = useNavigate()

  const {
    productName,
    productCategory,
    productPrice,
    productSize,
    productDescription,
    stockQuantity,
    productImages,
  } = product;

  const productView = () => {
    navigate(`/Product/${product._id}`)
  }

  return (
    <div onClick={productView} className="bg-white shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
      <div className="h-60 w-full overflow-hidden">
        <img
          src={productImages?.[0] || "/placeholder.png"}
          alt={productName}
          className="h-full w-full object-cover"
        />
      </div>


      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{productName}</h3>
        <p className="text-sm text-gray-500 mb-2">{productCategory}</p>
        
        <p className="text-gray-700 text-sm mb-2 line-clamp-2">
          {productDescription}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {productSize.map((size, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs border rounded-full border-gray-300 text-gray-600"
            >
              {size}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-black">₹{productPrice}</span>
          
          <p
            disabled={stockQuantity <= 0}
            className={`px-6 py-2 text-sm font-medium text-black${
              stockQuantity <= 0
                ? "text-gray-400"
                : "text-black"
            }`}
          >
            {stockQuantity > 0 ? "A" : "Out of Stock"}
          </p>
        </div>
      </div>
    </div>
  );
}
