import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    productCategory: {
      type: String,
      enum: ["men", "women", "kids"],
      required: [true, "Product category is required"],
    },

    productType: {
      type: String,
      enum: ["topwear", "bottomwear", "winterwear"],
      required: [true, "Product type is required"],
    },

    productPrice: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    productSize: {
      type: [String],
      enum: ["S", "M", "L", "XL", "XXL"],
      required: [true, "At least one size must be selected"],
    },

    productDescription: {
      type: String,
      trim: true,
      required: [true, "Product description is required"],
      maxlength: [500, "Description can't exceed 500 characters"],
    },

    stockQuantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock quantity cannot be negative"],
      default: 0,
    },

    productImages: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "At least one product image is required",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
