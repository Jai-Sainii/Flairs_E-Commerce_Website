import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const success = await login(data.email, data.password);
      
      if (success) {
        toast.success("Login successful!");
        navigate("/"); 
      } else {
        toast.error("Invalid email or password");
        setError("root", { message: "Invalid email or password" });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      setError("root", { message: "Login failed. Please try again." });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div>
          <input
            placeholder="Email"
            type="email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("email", {
              required: { value: true, message: "This field is required" },
              minLength: { value: 4, message: "Min length is 4" },
            })}
          />
          {errors.email && (
            <div className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </div>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            placeholder="Password"
            type="password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("password", {
              minLength: { value: 8, message: "Min length of password is 8" },
            })}
          />
          {errors.password && (
            <div className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Login;
