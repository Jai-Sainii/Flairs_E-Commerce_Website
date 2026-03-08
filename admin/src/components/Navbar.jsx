import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const navLinks = [
  { label: "Products", to: "/" },
  { label: "Add Product", to: "/add-product" },
  { label: "Orders", to: "/orders" },
  { label: "Enquiries", to: "/enquiries" },
];

const Navbar = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logout successful");
    navigate("/adminLogin");
  };

  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="mx-4 mt-3 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-lg shadow-pink-500/5 px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <h1
          className="text-2xl font-serif font-bold bg-gradient-to-r from-flaire-pink to-flaire-orange bg-clip-text text-transparent cursor-pointer select-none"
          onClick={() => navigate("/")}
        >
          Flaire
        </h1>

        {admin ? (
          <>
            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-flaire-pink/10 text-flaire-pink font-semibold"
                        : "text-zinc-600 hover:text-flaire-pink hover:bg-pink-50/50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              {/* Admin badge */}
              <span className="hidden md:inline-flex items-center gap-2 text-sm text-zinc-500 bg-white/50 border border-white/40 rounded-full px-3 py-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {admin.name}
              </span>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-flaire-pink to-flaire-coral text-white px-5 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-pink-500/25 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                Logout
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden text-zinc-600 hover:text-flaire-pink transition-colors p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  {mobileOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  )}
                </svg>
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => navigate("/adminLogin")}
            className="bg-gradient-to-r from-flaire-pink to-flaire-coral text-white px-5 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-pink-500/25 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile sidebar */}
      {admin && mobileOpen && (
        <div className="md:hidden mx-4 mt-2 rounded-xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-lg p-4 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-flaire-pink/10 text-flaire-pink font-semibold"
                    : "text-zinc-600 hover:text-flaire-pink hover:bg-pink-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
