import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const SkeletonCard = () => (
  <div className="bg-white shadow-md overflow-hidden border border-gray-200 animate-pulse">
    <div className="h-60 w-full bg-gray-200" />

    <div className="p-4">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-3" />
      <div className="h-3 bg-gray-200 rounded w-full mb-1" />
      <div className="h-3 bg-gray-200 rounded w-5/6 mb-3" />
      <div className="flex gap-2 mb-3">
        <div className="h-6 w-10 bg-gray-200 rounded-full" />
        <div className="h-6 w-10 bg-gray-200 rounded-full" />
        <div className="h-6 w-10 bg-gray-200 rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-5 bg-gray-200 rounded w-16" />
        <div className="h-5 bg-gray-200 rounded w-8" />
      </div>
    </div>
  </div>
);

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const fetchData = async () => {
    setLoading(true);
    try {
      let res = await axios.get(`${API_BASE_URL}/products`);
      setProducts(res.data.product);
      setFilteredProducts(res.data.product);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value),
    );
  };

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    setSelectedTypes((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value),
    );
  };

  useEffect(() => {
    let updatedList = [...products];

    if (selectedCategories.length > 0) {
      updatedList = updatedList.filter((product) =>
        selectedCategories.includes(product.productCategory.toLowerCase()),
      );
    }

    if (selectedTypes.length > 0) {
      updatedList = updatedList.filter((product) =>
        selectedTypes.includes(product.productType.toLowerCase()),
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
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    setFilteredProducts(updatedList);
  }, [products, searchQuery]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-screen flex items-center justify-center min-h-screen mb-20">
      <div className="w-11/12 min-h-screen flex flex-col sm:flex-row gap-1 sm:gap-10 pt-28 border-top">
        <div className="min-w-60">
          <p
            onClick={() => setShowFilter(!showFilter)}
            className="my-2 text-xl flex items-center cursor-pointer gap-2 select-none"
          >
            FILTERS
            <span
              className={`sm:hidden text-lg transition-transform ${showFilter ? "rotate-90" : ""}`}
            >
              &#10095;
            </span>
          </p>

          <div
            className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}
          >
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

          <div
            className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}
          >
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

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                No products found.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={index} product={product} />
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
