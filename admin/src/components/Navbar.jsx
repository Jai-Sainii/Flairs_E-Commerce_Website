import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logout successful");
    navigate("/adminLogin");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white-200">
      <h1 className="text-2xl font-bold">Flaire</h1>

      {admin ? (
        <>
          <ul className="flex gap-4">
            <NavLink to="/">
              <li className="hover:text-pink-500 cursor-pointer">Products</li>
            </NavLink>
            <NavLink to="/add-product">
              <li className="hover:text-pink-500 cursor-pointer">
                Add Product
              </li>
            </NavLink>
            <NavLink to="/orders">
              <li className="hover:text-pink-500 cursor-pointer">Orders</li>
            </NavLink>
            <NavLink to="/enquiries">
              <li className="hover:text-pink-500 cursor-pointer">Enquiries</li>
            </NavLink>
          </ul>
          <button
            onClick={handleLogout}
            className="bg-pink-500 text-white px-4 py-2 hover:rounded-full transition-all ease-in-out cursor-pointer"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => navigate("/adminLogin")}
          className="bg-pink-500 text-white px-4 py-2 hover:rounded-full transition-all ease-in-out cursor-pointer"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;
