import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

const AddProduct = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/addProduct`, data, {
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl bg-white shadow-xl p-8 space-y-6 mt-10 mb-10"
      >
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-black">
            Add New Product
          </h1>
          <p className="text-sm text-black mt-1">
            Fill all required product details
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-black">
            Product Name
          </label>
          <input
            type="text"
            {...register("productName", {
              required: "Product name is required",
            })}
            className="border border-black px-4 py-2 text-sm
              focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none"
          />
          {errors.productName && (
            <span className="text-xs text-red-500">
              {errors.productName.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-black">Category</label>
            <select
              {...register("productCategory", {
                required: "Category is required",
              })}
              className="border border-black px-4 py-2 text-sm
                focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none"
            >
              <option value="">Select</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
            {errors.productCategory && (
              <span className="text-xs text-red-500">
                {errors.productCategory.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-black">
              Product Type
            </label>
            <select
              {...register("productType", {
                required: "Product type is required",
              })}
              className="border border-black px-4 py-2 text-sm
                focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none"
            >
              <option value="">Select</option>
              <option value="topwear">Topwear</option>
              <option value="bottomwear">Bottomwear</option>
              <option value="winterwear">Winterwear</option>
            </select>
            {errors.productType && (
              <span className="text-xs text-red-500">
                {errors.productType.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-black">Price</label>
            <input
              type="number"
              {...register("productPrice", {
                required: "Price is required",
                min: { value: 0, message: "Price cannot be negative" },
              })}
              className="border border-black px-4 py-2 text-sm
                focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none"
            />
            {errors.productPrice && (
              <span className="text-xs text-red-500">
                {errors.productPrice.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-black">
              Stock Quantity
            </label>
            <input
              type="number"
              {...register("stockQuantity", {
                required: "Stock quantity is required",
                min: { value: 0, message: "Cannot be negative" },
              })}
              className="border border-black px-4 py-2 text-sm
                focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none"
            />
            {errors.stockQuantity && (
              <span className="text-xs text-red-500">
                {errors.stockQuantity.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-black">
            Available Sizes
          </label>
          <div className="flex flex-wrap gap-4">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <label
                key={size}
                className="flex items-center gap-2 px-3 py-1
                  border border-black text-sm text-black cursor-pointer
                  hover:bg-pink-50"
              >
                <input
                  type="checkbox"
                  value={size}
                  {...register("productSize", {
                    required: "Select at least one size",
                  })}
                  className="accent-pink-500"
                />
                {size}
              </label>
            ))}
          </div>
          {errors.productSize && (
            <span className="text-xs text-red-500">
              {errors.productSize.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-black">
            Description
          </label>
          <textarea
            rows={4}
            {...register("productDescription", {
              required: "Description is required",
              maxLength: { value: 500, message: "Max 500 characters" },
            })}
            className="border border-black px-4 py-2 text-sm
              focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none resize-none"
          />
          {errors.productDescription && (
            <span className="text-xs text-red-500">
              {errors.productDescription.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-black">
            Product Images (URLs)
          </label>
          <input
            type="text"
            placeholder="img1.jpg, img2.jpg"
            {...register("productImages", {
              required: "At least one image is required",
            })}
            className="border border-black px-4 py-2 text-sm
              focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none"
          />
          {errors.productImages && (
            <span className="text-xs text-red-500">
              {errors.productImages.message}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            defaultChecked
            {...register("isActive")}
            className="h-4 w-4 accent-pink-500"
          />
          <span className="text-sm text-pink-700 font-medium">
            Product is Active
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-pink-600 text-white
            font-semibold tracking-wide hover:bg-pink-700
            focus:ring-2 focus:ring-pink-400 transition"
        >
          Save Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
