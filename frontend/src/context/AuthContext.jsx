import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true },
      );
      setUser(res.data.user);
      setLoading(false);
      return res.data;
    } catch (err) {
      console.error("Login failed:", err.response?.data || err);
      return err.response?.data || { success: false, message: "Login failed" };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true },
      );
      return res.data;
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err);
      return err.response?.data || { success: false };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true },
      );
      setUser(res.data.user);
      setLoading(false);
      return res.data;
    } catch (err) {
      console.error("OTP verification failed:", err.response?.data || err);
      return err.response?.data || { success: false };
    }
  };

  const resendOtp = async (email) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/resend-otp`,
        { email },
        { withCredentials: true },
      );
      return res.data;
    } catch (err) {
      console.error("Resend OTP failed:", err.response?.data || err);
      return err.response?.data || { success: false };
    }
  };

  const googleLogin = async (credential) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/google`,
        { credential },
        { withCredentials: true },
      );
      setUser(res.data.user);
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error("Google login failed:", err.response?.data || err);
      return { success: false };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/forgot-password`,
        { email },
        { withCredentials: true },
      );
      return res.data;
    } catch (err) {
      console.error("Forgot password failed:", err.response?.data || err);
      return err.response?.data || { success: false };
    }
  };

  const verifyForgotPasswordOtp = async (email, otp) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/verify-forgot-password-otp`,
        { email, otp },
        { withCredentials: true },
      );
      return res.data;
    } catch (err) {
      console.error(
        "Verify forgot password OTP failed:",
        err.response?.data || err,
      );
      return err.response?.data || { success: false };
    }
  };

  const resetPassword = async (email, password) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/reset-password`,
        { email, password },
        { withCredentials: true },
      );
      return res.data;
    } catch (err) {
      console.error("Reset password failed:", err.response?.data || err);
      return err.response?.data || { success: false };
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true },
      );
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        googleLogin,
        logout,
        verifyOtp,
        resendOtp,
        forgotPassword,
        verifyForgotPasswordOtp,
        resetPassword,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
