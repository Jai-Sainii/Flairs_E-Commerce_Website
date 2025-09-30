import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const Signup = () => {

  const [check, setCheck] = useState(true)

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
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        data
      );

      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
      } else {
        console.error("No token received from backend");
      }
    } catch (error) {
      console.error(
        "Error submitting data:",
        error.response?.data || error.message
      );
    }
  };

  const onSubmitLogin = async (Logindata) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", Logindata);

      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
      } else {
        console.error("No token received from backend");
      }
    } catch (error) {
      console.error(
        "Error submitting data:",
        error.response?.data || error.message
      );
    }
  };

  const handleLogin = () => {
    setCheck(false)
  }
  const handleSignup = () => {
    setCheck(true)
  }

  return (
    <>
      {check? 
        <div className="min-w-screen min-h-[80vh] flex flex-col mx-auto mt-10 bg-white rounded-lg shadow-lg p-6 border border-gray-200 items-center justify-center">
          <div className="text-center mb-4 md:mb-8">
            <div className="flex items-center justify-center">
              <h2 className="text-1xl md:text-3xl font-bold tracking-tight text-gray-900">
                SignUp
              </h2>
              <span className="hidden sm:block w-12 h-0.5 bg-gray-700 ml-4"></span>
            </div>
          </div>

          <form className="w-1/3 space-y-4" onSubmit={handleSubmitSignup(onSubmitSignup)}>
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
                  minLength: { value: 8, message: "Min length of password is 8" },
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
              <span onClick={handleLogin} className="text-sm cursor-pointer font-medium">Login ?</span>
            </div>

            <button
              type="submit"
              disabled={isSignupSubmitting}
              className="w-full py-2 bg-pink-500 text-white font-medium hover:bg-pink-600 disabled:bg-pink-300 transition"
              >
              {isSignupSubmitting ? "Submitting..." : "Submit"}
            </button>

          </form>
        </div>
      : 
        <div className="min-w-screen min-h-[80vh] flex flex-col items-center justify-center mx-auto mt-10 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <form className="w-1/3 space-y-4" onSubmit={handleSubmitLogin(onSubmitLogin)}>

            <div className="text-center mb-4 md:mb-8">
              <div className="flex items-center justify-center">
                <h2 className="text-1xl md:text-3xl font-bold tracking-tight text-gray-900">
                  Login
                </h2>
                <span className="hidden sm:block w-12 h-0.5 bg-gray-700 ml-4"></span>
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
                  minLength: { value: 8, message: "Min length of password is 8" },
                })}
              />
              {loginErrors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {loginErrors.password.message}
                </div>
              )}
            </div>

            <div className="flex flex-row items-center justify-between">
              <span className="text-sm cursor-pointer font-medium">Forgot Password ?</span>
              <span onClick={handleSignup} className="text-sm cursor-pointer font-medium">Create account</span>
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
      }
    </>
  );
};

export default Signup;
