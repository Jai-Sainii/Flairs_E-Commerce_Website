import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleShowSearch = () => {
    setShowSearch(true)
  }

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    navigate(`/collection?search=${value}`);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowSearch(false)
    navigate("/collection");
  };

  const handleCart = () => {
    navigate("/cart");
  };

  return (
    <div className="w-full flex fixed z-100 bg-gray-100 items-center justify-center">
      <div className="w-11/12 flex items-center justify-between py-5 font-medium">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Flaire<span className="text-pink-500">.</span>
          </h2>
        </div>

        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <NavLink to={"/"} className="flex flex-col items-center gap-1">
            <p className="">HOME</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink
            to={"/collection"}
            className="flex flex-col items-center gap-1"
          >
            <p className="">COLLECTION</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink to={"/about"} className="flex flex-col items-center gap-1">
            <p className="">ABOUT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink to={"/contact"} className="flex flex-col items-center gap-1">
            <p className="">CONTACT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </ul>

        <div className="flex flex-row gap-4 items-center">
          {showSearch ? (
            <div className="relative w-1/3">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search products..."
                className="w-full border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-2 text-gray-500 hover:text-gray-800 font-bold"
                >
                  &#10005;
                </button>

            </div>
          ) : (
            <i onClick={handleShowSearch} className="fa-solid text-[20px] fa-magnifying-glass cursor-pointer"></i>
          )}
          <i
            onClick={handleCart}
            className="fa-solid text-[20px] fa-cart-shopping cursor-pointer"
          ></i>
          <div className="group relative">
            <div className="py-2 px-4 border border-gray-500 rounded-[20px] cursor-pointer">
              <i className="fa-solid fa-user"></i>
              <span>Profile</span>
            </div>
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p className="cursor-pointer hover:text-black">My Profile</p>
                <p className="cursor-pointer hover:text-black">Orders</p>
                <p className="cursor-pointer hover:text-black">Logout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
