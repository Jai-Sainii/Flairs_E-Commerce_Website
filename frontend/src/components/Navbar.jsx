import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleShowSearch = () => {
    setShowSearch(true);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    navigate(`/collection?search=${value}`);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowSearch(false);
    const path = location.pathname;
    navigate(path, { replace: true });
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

        <ul className="hidden sm:flex ml-50 gap-5 text-sm text-gray-700">
          <NavLink to={"/"} className="flex flex-col items-center gap-1">
            <p>HOME</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-pink-500 hidden" />
          </NavLink>
          <NavLink
            to={"/collection"}
            className="flex flex-col items-center gap-1"
          >
            <p>COLLECTION</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-pink-500 hidden" />
          </NavLink>
          <NavLink to={"/about"} className="flex flex-col items-center gap-1">
            <p>ABOUT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-pink-500 hidden" />
          </NavLink>
          <NavLink to={"/contact"} className="flex flex-col items-center gap-1">
            <p>CONTACT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-pink-500 hidden" />
          </NavLink>
        </ul>

        <div className="flex flex-row gap-4 items-center">
    
          <div className="relative w-64 flex items-center">
            {showSearch ? (
              <>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search products..."
                  className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-8 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
        
                <i className="fa-solid fa-magnifying-glass absolute left-3 text-gray-500"></i>
               
                <button
                  onClick={clearSearch}
                  className="absolute right-3 text-gray-500 hover:text-gray-800 font-bold"
                >
                  &#10005;
                </button>
              </>
            ) : (
              <i
                onClick={handleShowSearch}
                className="fa-solid text-[20px] fa-magnifying-glass cursor-pointer ml-auto"
              ></i>
            )}
          </div>

          <i
            onClick={handleCart}
            className="fa-solid text-[20px] fa-cart-shopping cursor-pointer"
          ></i>

          <div className="group relative">
            <div className="py-2 px-4 border border-gray-500 rounded-[20px] cursor-pointer flex items-center gap-2">
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
