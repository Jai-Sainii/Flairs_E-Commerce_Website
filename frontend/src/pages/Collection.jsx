import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();

  const fetchData = async () => {
    try {
      let res = await axios.get("http://localhost:5000/products");
      setProducts(res.data.product);
      setFilteredProducts(res.data.product);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleAddToCart = async (product) => {
    try{
      const res = await axios.post("http://localhost:5000/cart/add", {
        productId: product._id,
        quantity: 1,
      }, {
        withCredentials: true,
      });
      toast.success("Product added to cart!", {
        position: "top-right",
      });
    }
    catch(err){
      console.error("Error adding product to cart:", err);
      toast.error("Failed to add product to cart", {
        position: "top-right",
      });
    }
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    setSelectedTypes((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  useEffect(() => {
    let updatedList = [...products];

    if (selectedCategories.length > 0) {
      updatedList = updatedList.filter((product) =>
        selectedCategories.includes(product.productCategory.toLowerCase())
      );
    }

    if (selectedTypes.length > 0) {
      updatedList = updatedList.filter((product) =>
        selectedTypes.includes(product.productType.toLowerCase())
      );
    }

    setFilteredProducts(updatedList);

    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";
    setSearchQuery(query);
  }, [selectedCategories, selectedTypes, products, location.search]);

  useEffect(() => {
    let updatedList = [...products];
    if (searchQuery.trim() !== "") {
      updatedList = updatedList.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(updatedList);
  }, [products, searchQuery]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-screen flex items-center justify-center min-h-screen">
      <div className="w-11/12 min-h-[85vh] flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-top">
        <div className="min-w-60">
          <p className="my-2 text-xl flex items-center cursor-pointer gap-2">
            Filters
          </p>

          <div className="border border-gray-300 pl-5 py-3 mt-6 hidden sm:block">
            <p className="mb-3 text-sm font-medium">CATEGORIES</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {["men", "women", "kids"].map((category) => (
                <label key={category} className="flex gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={category}
                    onChange={handleCategoryChange}
                    checked={selectedCategories.includes(category)}
                    className="w-3"
                  />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="border border-gray-300 pl-5 py-3 mt-6 hidden sm:block">
            <p className="mb-3 text-sm font-medium">TYPE</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {["topwear", "bottomwear", "winterwear"].map((type) => (
                <label key={type} className="flex gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={type}
                    onChange={handleTypeChange}
                    checked={selectedTypes.includes(type)}
                    className="w-3"
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="w-full flex flex-col">
            <div className="h-[5rem] flex flex-row items-center gap-2">
              <hr className="w-[60px] border-none h-[1.5px] bg-gray-700" />
              <h1 className="text-3xl">All the Products</h1>
            </div>

            {filteredProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                No products found.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
