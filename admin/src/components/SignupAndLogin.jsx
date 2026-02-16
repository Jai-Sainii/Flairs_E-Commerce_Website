import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignupAndLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm();


  const onSubmitLogin = async (Logindata) => {
    try {
      const success = await login(Logindata.email, Logindata.password);

      if (success) {
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <>
        <div className="w-full max-w-md flex flex-col items-center justify-center mx-auto mt-28 mb-14 p-6">
          <form
            className="w-full space-y-4"
            onSubmit={handleSubmitLogin(onSubmitLogin)}
          >
            <div className="text-center mb-4 md:mb-8">
              <div className="flex items-center justify-center">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                  Admin Login
                </h2>
                <span className="block w-12 h-0.5 bg-gray-700 ml-4"></span>
              </div>
            </div>

            <div>
              <input
                placeholder="Email"
                type="email"
                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-pink-400"
                {...registerLogin("email", {
                  required: { value: true, message: "This field is required" },
                  minLength: { value: 4, message: "Min length is 4" },
                })}
              />
              {loginErrors.email && (
                <div className="text-red-500 text-sm mt-1">
                  {loginErrors.email.message}
                </div>
              )}
            </div>

            <div>
              <input
                placeholder="Password"
                type="password"
                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-pink-400"
                {...registerLogin("password", {
                  minLength: {
                    value: 8,
                    message: "Min length of password is 8",
                  },
                })}
              />
              {loginErrors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {loginErrors.password.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoginSubmitting}
              className="w-full py-2 bg-pink-500 text-white font-medium hover:bg-pink-600 disabled:bg-pink-300 transition"
            >
              {isLoginSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
    </>
  );
};

export default SignupAndLogin;
