import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/admin/me`, {
          withCredentials: true,
        });
        setAdmin(res.data.admin);
      } catch (err) {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/admin/adminLogin`,
        { email, password },
        { withCredentials: true },
      );
      setAdmin(res.data.admin);
      setLoading(false);
      return true;
    } catch (err) {
      toast.error("Login failed:", err.response?.data || err);
      return false;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/admin/adminRegister`,
        { name, email, password },
        { withCredentials: true },
      );
      setAdmin(res.data.admin);
      setLoading(false);
      return true;
    } catch (err) {
      toast.error("Signup failed:", err.response?.data || err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/admin/adminLogout`,
        {},
        { withCredentials: true },
      );
      setAdmin(null);
    } catch (err) {
      toast.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};