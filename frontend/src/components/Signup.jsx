import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const { signup, login } = useAuth();
  const navigate = useNavigate();
  const [check, setCheck] = useState(true);

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors, isSubmitting: isSignupSubmitting },
  } = useForm();

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm();

  const onSubmitSignup = async (data) => {
    try {
      const success = await signup(data.name, data.email, data.password);

      if (success) {
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        toast.error("Signup failed. Email may already be registered.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
    }
  };

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

  const handleLogin = () => {
    setCheck(false);
  };
  const handleSignup = () => {
    setCheck(true);
  };

  return (
    <>
      {check ? (
        <div className="w-full max-w-md flex flex-col mx-auto mt-28 mb-14 p-6 items-center justify-center">
          <div className="text-center mb-4 md:mb-8">
            <div className="flex items-center justify-center">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                SignUp
              </h2>
              <span className="block w-12 h-0.5 bg-gray-700 ml-4"></span>
            </div>
          </div>

          <form
            className="w-full space-y-4"
            onSubmit={handleSubmitSignup(onSubmitSignup)}
          >
            <div>
              <input
                placeholder="Name"
                type="text"
                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-pink-400"
                {...registerSignup("name", {
                  required: { value: true, message: "This field is required" },
                  minLength: { value: 4, message: "Min length is 4" },
                })}
              />
              {signupErrors.name && (
                <div className="text-red-500 text-sm mt-1">
                  {signupErrors.name.message}
                </div>
              )}
            </div>

            <div>
              <input
                placeholder="Email"
                type="email"
                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-pink-400"
                {...registerSignup("email", {
                  required: { value: true, message: "This field is required" },
                  minLength: { value: 4, message: "Min length is 4" },
                })}
              />
              {signupErrors.email && (
                <div className="text-red-500 text-sm mt-1">
                  {signupErrors.email.message}
                </div>
              )}
            </div>

            <div>
              <input
                placeholder="Password"
                type="password"
                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-pink-400"
                {...registerSignup("password", {
                  minLength: {
                    value: 8,
                    message: "Min length of password is 8",
                  },
                })}
              />
              {signupErrors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {signupErrors.password.message}
                </div>
              )}
            </div>

            <div className="flex flex-row items-center justify-between">
              <span className="text-sm cursor-pointer"></span>
              <span
                onClick={handleLogin}
                className="text-sm cursor-pointer font-medium"
              >
                Login ?
              </span>
            </div>

            <button
              type="submit"
              disabled={isSignupSubmitting}
              className="button"
            >
              {isSignupSubmitting ? "Submitting..." : "Get Started"}
            </button>

          </form>
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col items-center justify-center mx-auto mt-28 mb-14 p-6">
          <form
            className="w-full space-y-4"
            onSubmit={handleSubmitLogin(onSubmitLogin)}
          >
            <div className="text-center mb-4 md:mb-8">
              <div className="flex items-center justify-center">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                  Login
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

            <div className="flex flex-row items-center justify-between">
              <span className="text-sm cursor-pointer font-medium">
                Forgot Password ?
              </span>
              <span
                onClick={handleSignup}
                className="text-sm cursor-pointer font-medium"
              >
                Create account
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoginSubmitting}
              className="button"
            >
              {isLoginSubmitting ? "Submitting..." : "Welcome back"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Signup;
