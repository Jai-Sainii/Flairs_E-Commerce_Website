import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { useLocation } from "react-router";
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

const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹1000", min: 500, max: 1000 },
  { label: "₹1000 – ₹2000", min: 1000, max: 2000 },
  { label: "₹2000 – ₹5000", min: 2000, max: 5000 },
  { label: "Over ₹5000", min: 5000, max: Infinity },
];

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [sortBy, setSortBy] = useState("default");
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

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setSelectedSizes((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value),
    );
  };

  const handlePriceRangeChange = (index) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";
    setSearchQuery(query);

    const categoryTerms = ["men", "women", "kids"];
    if (categoryTerms.includes(query.toLowerCase())) {
      setSelectedCategories([query.toLowerCase()]);
    }
  }, [location.search]);

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

    // Size filter — show products that have at least one matching size
    if (selectedSizes.length > 0) {
      updatedList = updatedList.filter((product) =>
        product.productSize.some((size) => selectedSizes.includes(size)),
      );
    }

    // Price range filter
    if (selectedPriceRanges.length > 0) {
      updatedList = updatedList.filter((product) =>
        selectedPriceRanges.some((rangeIndex) => {
          const range = PRICE_RANGES[rangeIndex];
          return (
            product.productPrice >= range.min &&
            product.productPrice < range.max
          );
        }),
      );
    }

    // Text search for non-category queries
    const categoryTerms = ["men", "women", "kids"];
    if (
      searchQuery.trim() !== "" &&
      !categoryTerms.includes(searchQuery.toLowerCase())
    ) {
      updatedList = updatedList.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sorting
    if (sortBy === "low-high") {
      updatedList.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortBy === "high-low") {
      updatedList.sort((a, b) => b.productPrice - a.productPrice);
    }

    setFilteredProducts(updatedList);
  }, [
    selectedCategories,
    selectedTypes,
    selectedSizes,
    selectedPriceRanges,
    sortBy,
    products,
    searchQuery,
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const activeFilterCount =
    selectedCategories.length +
    selectedTypes.length +
    selectedSizes.length +
    selectedPriceRanges.length;

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSelectedSizes([]);
    setSelectedPriceRanges([]);
    setSortBy("default");
  };

  return (
    <div className="max-w-screen flex items-center justify-center min-h-screen mb-10 sm:mb-20">
      <div className="w-[95%] sm:w-11/12 min-h-screen flex flex-col sm:flex-row gap-4 sm:gap-10 pt-24 sm:pt-28 border-top">
        <div className="w-full sm:min-w-60 sm:max-w-60">
          <div className="flex items-center justify-between">
            <p
              onClick={() => setShowFilter(!showFilter)}
              className="my-2 text-lg sm:text-xl flex items-center cursor-pointer gap-2 select-none font-medium"
            >
              FILTERS
              {activeFilterCount > 0 && (
                <span className="text-xs bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
              <span
                className={`sm:hidden text-lg transition-transform duration-200 ${showFilter ? "rotate-90" : ""}`}
              >
                &#10095;
              </span>
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-pink-500 hover:text-pink-600 transition-colors underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div
            className={`border border-gray-300 rounded-lg pl-5 py-3 mt-4 sm:mt-6 ${showFilter ? "" : "hidden"} sm:block`}
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
                    className="w-3 accent-pink-500"
                  />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div
            className={`border border-gray-300 rounded-lg pl-5 py-3 mt-4 sm:mt-6 ${showFilter ? "" : "hidden"} sm:block`}
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
                    className="w-3 accent-pink-500"
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div
            className={`border border-gray-300 rounded-lg pl-5 py-3 mt-4 sm:mt-6 ${showFilter ? "" : "hidden"} sm:block`}
          >
            <p className="mb-3 text-sm font-medium">SIZE</p>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((size) => (
                <label
                  key={size}
                  className={`px-3 py-1.5 text-xs border rounded-full cursor-pointer transition-all ${
                    selectedSizes.includes(size)
                      ? "bg-pink-500 text-white border-pink-500"
                      : "border-gray-300 text-gray-600 hover:border-pink-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={size}
                    onChange={handleSizeChange}
                    checked={selectedSizes.includes(size)}
                    className="hidden"
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>

          <div
            className={`border border-gray-300 rounded-lg pl-5 py-3 pr-4 mt-4 sm:mt-6 ${showFilter ? "" : "hidden"} sm:block`}
          >
            <p className="mb-3 text-sm font-medium">PRICE</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {PRICE_RANGES.map((range, index) => (
                <label key={index} className="flex gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPriceRanges.includes(index)}
                    onChange={() => handlePriceRangeChange(index)}
                    className="w-3 accent-pink-500"
                  />
                  {range.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="w-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 sm:h-[5rem]">
              <div className="flex items-center gap-2">
                <hr className="w-8 sm:w-[60px] border-none h-[1.5px] bg-gray-700" />
                <h1 className="text-2xl sm:text-3xl">All the Products</h1>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none cursor-pointer bg-white w-full sm:w-auto"
              >
                <option value="default">Sort by: Default</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                No products found.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
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
