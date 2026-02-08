import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Menu, X, User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(false);

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

  const handleProfile = () => {
    if (user) {
      navigate("/profile");
    } else {
      toast.info("Please login to view your profile");
      navigate("/signup");
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="w-full flex fixed z-50 bg-gray-100 items-center justify-center border-b border-gray-200">
      <div className="w-11/12 flex items-center justify-between py-4 font-medium">
        {/* Logo */}
        <div>
          <h2
            className="text-2xl font-bold text-gray-800 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Flaire<span className="text-pink-500">.</span>
          </h2>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex gap-8 text-sm text-gray-700">
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

        {/* Icons Section */}
        <div className="flex items-center gap-4">
          {/* Search Icon / Input */}
          <div className="relative flex items-center">
            {showSearch ? (
              <div className="flex items-center border border-gray-300 rounded-full px-3 py-1 bg-white">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search..."
                  className="w-24 sm:w-40 outline-none text-sm"
                />
                <button
                  onClick={clearSearch}
                  className="ml-2 text-gray-500 hover:text-gray-800"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <i
                onClick={handleShowSearch}
                className="fa-solid text-[20px] fa-magnifying-glass cursor-pointer text-gray-700"
              ></i>
            )}
          </div>

          <i
            onClick={handleCart}
            className="fa-solid text-[20px] fa-cart-shopping cursor-pointer text-gray-700"
          ></i>

          {/* Profile Dropdown (Desktop) */}
          <div className="group relative hidden sm:block">
            <div className="py-2 px-4 border border-gray-500 rounded-[20px] cursor-pointer flex items-center gap-2 hover:bg-gray-200 transition">
              <i className="fa-solid fa-user"></i>
              <span className="text-sm">{user ? user.name : "Profile"}</span>
            </div>
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-white text-gray-500 rounded shadow-lg border border-gray-100">
                {user ? (
                  <>
                    <p
                      onClick={handleProfile}
                      className="cursor-pointer hover:text-pink-500"
                    >
                      My Profile
                    </p>
                    <p
                      onClick={() => navigate("/orders")}
                      className="cursor-pointer hover:text-pink-500"
                    >
                      Orders
                    </p>
                    <p
                      onClick={handleLogout}
                      className="cursor-pointer hover:text-pink-500"
                    >
                      Logout
                    </p>
                  </>
                ) : (
                  <p
                    onClick={() => navigate("/signup")}
                    className="cursor-pointer hover:text-pink-500"
                  >
                    SignUp/Login
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setVisible(true)}
            className="sm:hidden text-gray-700"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Sidebar Menu */}
        <div
          className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white transition-all duration-300 z-[100] ${visible ? "w-full" : "w-0"}`}
        >
          <div className="flex flex-col text-gray-600">
            <div
              onClick={() => setVisible(false)}
              className="flex items-center gap-4 p-4 cursor-pointer border-b border-gray-200"
            >
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                <X size={20} />
              </div>
              <p className="font-semibold">Back</p>
            </div>
            <NavLink
              onClick={() => setVisible(false)}
              className="py-4 pl-6 border-b border-gray-100 hover:text-pink-500"
              to="/"
            >
              HOME
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="py-4 pl-6 border-b border-gray-100 hover:text-pink-500"
              to="/collection"
            >
              COLLECTION
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="py-4 pl-6 border-b border-gray-100 hover:text-pink-500"
              to="/about"
            >
              ABOUT
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="py-4 pl-6 border-b border-gray-100 hover:text-pink-500"
              to="/contact"
            >
              CONTACT
            </NavLink>

            {/* Mobile Profile Actions */}
            <div className="mt-4 px-6">
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-100 p-2 rounded-full text-pink-500">
                      <User size={20} />
                    </div>
                    <p className="font-medium text-gray-800">{user.name}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleProfile();
                      setVisible(false);
                    }}
                    className="text-left text-gray-600 hover:text-pink-500"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/orders");
                      setVisible(false);
                    }}
                    className="text-left text-gray-600 hover:text-pink-500"
                  >
                    Orders
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setVisible(false);
                    }}
                    className="text-left text-red-500"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    navigate("/signup");
                    setVisible(false);
                  }}
                  className="w-full bg-pink-500 text-white py-2 rounded-full mt-4"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
