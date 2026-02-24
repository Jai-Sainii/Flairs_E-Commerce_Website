import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Menu, X, User, ShoppingBag } from "lucide-react";
import gsap from "gsap";
import axios from "axios";
import { API_BASE_URL } from "../api";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Collection", to: "/collection" },
  { label: "About", to: "/about" },
  { label: "Support", to: "/contact" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user) {
        setCartCount(0);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE_URL}/cart`, {
          withCredentials: true,
        });
        const items = res.data?.items || [];
        const total = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      } catch {
        setCartCount(0);
      }
    };
    fetchCartCount();
  }, [user, location.pathname]);

  const navRefs = useRef([]);
  const pillRef = useRef(null);
  const navContainerRef = useRef(null);

  const animatePill = () => {
    const currentPath = location.pathname;
    const activeIndex = navLinks.findIndex((link) => {
      if (link.to === "/") return currentPath === "/";
      return currentPath.startsWith(link.to);
    });

    const activeEl = navRefs.current[activeIndex];
    const container = navContainerRef.current;
    const pill = pillRef.current;

    if (activeEl && container && pill) {
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();

      gsap.to(pill, {
        x: activeRect.left - containerRect.left - 12,
        width: activeRect.width + 24,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      });
    } else if (pill) {
      gsap.to(pill, { opacity: 0, duration: 0.2 });
    }
  };

  useLayoutEffect(() => {
    animatePill();
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => animatePill();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location.pathname]);

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
    <div className="w-full flex fixed z-50 items-center justify-center mt-4 px-4">
      <div className="w-[94%] flex items-center justify-between py-3 px-6 font-medium rounded-2xl bg-white/30 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/5">
        <div>
          <h2
            className="text-2xl font-bold text-gray-800 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Flaire
          </h2>
        </div>

        <ul
          ref={navContainerRef}
          className="hidden sm:flex items-center gap-1 text-sm text-gray-600 relative"
        >
          <div
            ref={pillRef}
            className="absolute top-1/2 -translate-y-1/2 h-[36px] bg-pink-500/10 rounded-full pointer-events-none"
            style={{ opacity: 0, left: 0, width: 0 }}
          />

          {navLinks.map((link, index) => (
            <NavLink
              key={link.to}
              to={link.to}
              ref={(el) => (navRefs.current[index] = el)}
              className={({ isActive }) =>
                `relative z-10 px-4 py-2 rounded-full transition-colors duration-200 tracking-wide ${
                  isActive
                    ? "text-pink-600 font-semibold"
                    : "text-gray-600 hover:text-pink-500"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <div className="relative flex items-center">
            {showSearch ? (
              <div className="flex items-center border border-gray-200 rounded-full px-3 py-1.5 bg-white/40 backdrop-blur-md">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search..."
                  className="w-24 sm:w-40 outline-none text-sm bg-transparent placeholder-gray-500"
                />
                <button
                  onClick={clearSearch}
                  className="ml-2 text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <i
                onClick={handleShowSearch}
                className="fa-solid text-[18px] fa-magnifying-glass cursor-pointer text-gray-600 hover:text-pink-500 transition-colors"
              ></i>
            )}
          </div>

          <div onClick={handleCart} className="relative cursor-pointer">
            <ShoppingBag
              size={20}
              className="text-gray-600 hover:text-pink-500 transition-colors"
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          <div className="group relative hidden sm:block border border-gray-200 rounded-full">
            <div className="py-2 px-4 border border-white/30 rounded-full cursor-pointer flex items-center gap-2 bg-white/20 hover:bg-white/40 backdrop-blur-md transition-all duration-200">
              <i className="fa-solid fa-user text-gray-600"></i>
              <span className="text-sm text-gray-700">
                {user ? user.name : "Profile"}
              </span>
            </div>
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-white/70 backdrop-blur-xl text-gray-500 rounded-xl shadow-lg border border-white/30">
                {user ? (
                  <>
                    <p
                      onClick={handleProfile}
                      className="cursor-pointer hover:text-pink-500 transition-colors"
                    >
                      My Profile
                    </p>
                    <p
                      onClick={() => navigate("/orders")}
                      className="cursor-pointer hover:text-pink-500 transition-colors"
                    >
                      Orders
                    </p>
                    <p
                      onClick={handleLogout}
                      className="cursor-pointer hover:text-pink-500 transition-colors"
                    >
                      Logout
                    </p>
                  </>
                ) : (
                  <p
                    onClick={() => navigate("/signup")}
                    className="cursor-pointer hover:text-pink-500 transition-colors"
                  >
                    SignUp/Login
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setVisible(true)}
            className="sm:hidden text-gray-700 hover:text-pink-500 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile sidebar drawer — outside the glass bar so it covers full viewport */}
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 overflow-hidden bg-white/80 backdrop-blur-2xl transition-all duration-300 z-[100] ${visible ? "w-full" : "w-0"}`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-4 cursor-pointer border-b border-gray-200/50"
          >
            <div className="h-8 w-8 bg-pink-50 rounded-full flex items-center justify-center text-pink-500">
              <X size={20} />
            </div>
            <p className="font-semibold text-gray-700">Back</p>
          </div>

          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `py-4 pl-6 border-b border-gray-100/50 transition-colors ${
                  isActive
                    ? "text-pink-500 font-semibold bg-pink-50/50"
                    : "hover:text-pink-500"
                }`
              }
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}

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
                  className="text-left text-gray-600 hover:text-pink-500 transition-colors"
                >
                  My Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/orders");
                    setVisible(false);
                  }}
                  className="text-left text-gray-600 hover:text-pink-500 transition-colors"
                >
                  Orders
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setVisible(false);
                  }}
                  className="text-left text-red-500 hover:text-red-600 transition-colors"
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
                className="w-full bg-pink-500 text-white py-2.5 rounded-full mt-4 font-medium hover:bg-pink-600 transition-colors"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
