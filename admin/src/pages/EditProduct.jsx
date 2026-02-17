import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

function EditProduct() {
  const [product, setProduct] = useState({
    productName: "",
    productCategory: "",
    productType: "",
    productPrice: "",
    productSize: [],
    stockQuantity: "",
    productDescription: "",
    productImages: [],
    isActive: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products/${id}`);
      setProduct(res.data.product);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    if (!product) return;

    reset({
      productName: product.productName,
      productCategory: product.productCategory,
      productType: product.productType,
      productPrice: product.productPrice,
      productSize: product.productSize,
      stockQuantity: product.stockQuantity,
      productDescription: product.productDescription,
      productImages: product.productImages?.join(", "),
      isActive: product.isActive,
    });
  }, [product, reset]);

  const onSubmit = async (data) => {
    data.productImages = data.productImages
      .split(",")
      .map((img) => img.trim())
      .filter(Boolean);
    try {
      const res = await axios.put(
        `${API_BASE_URL}/admin/editProduct/${id}`,
        data,
        {
          withCredentials: true,
        },
      );
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg p-8 space-y-6 mt-10 mb-10">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-black">Edit Product</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-black">
              Product Name
            </label>
            <input
              {...register("productName")}
              type="text"
              defaultValue={product?.productName}
              className="border border-black px-4 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-black">
                Category
              </label>
              <select
                {...register("productCategory")}
                defaultValue={product?.productCategory}
                className="border border-black px-4 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-black">
                Product Type
              </label>
              <select
                {...register("productType")}
                defaultValue={product?.productType}
                className="border border-black px-4 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none"
              >
                <option value="topwear">Topwear</option>
                <option value="bottomwear">Bottomwear</option>
                <option value="winterwear">Winterwear</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-black">Price</label>
              <input
                {...register("productPrice")}
                type="number"
                defaultValue={product?.productPrice}
                className="border border-black px-4 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-black">
                Stock Quantity
              </label>
              <input
                {...register("stockQuantity")}
                type="number"
                defaultValue={product?.stockQuantity}
                className="border border-black px-4 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-black">
              Product Sizes
            </label>

            <div className="flex gap-3 flex-wrap">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <label
                  key={size}
                  className="flex items-center gap-2 border border-black px-3 py-1 text-sm cursor-pointer hover:bg-pink-50"
                >
                  <input
                    type="checkbox"
                    value={size}
                    {...register("productSize")}
                    className="accent-pink-600"
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-black">
              Description
            </label>
            <textarea
              {...register("productDescription")}
              rows={3}
              defaultValue={product?.productDescription}
              className="border border-black px-4 py-2 text-sm resize-none focus:ring-2 focus:ring-pink-300 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-black">
              Product Images
            </label>
            <input
              {...register("productImages")}
              type="text"
              defaultValue={product?.productImages?.join(", ")}
              className="border border-black px-4 py-2 text-sm focus:ring-2 focus:ring-pink-300 outline-none"
              placeholder="Comma separated URLs"
            />
          </div>

          <div className="flex items-center gap-3 border border-black px-4 py-2">
            <input
              type="checkbox"
              {...register("isActive")}
              className="h-4 w-4 accent-pink-600"
            />
            <span className="text-sm font-semibold text-black">
              Product is Active
            </span>
          </div>

          <div className="flex gap-3 items-center justify-center">
            <button
              type="submit"
              className="w-1/3 bg-pink-600 hover:bg-pink-700 text-white py-3 font-semibold tracking-wide transition"
            >
              Update Product
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-1/3 bg-gray-600 hover:bg-gray-700 text-white py-3  font-semibold tracking-wide transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
