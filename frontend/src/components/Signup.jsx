import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ArrowRight, Chrome, Github } from "lucide-react";

const Signup = () => {
  const { signup, login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

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

  const onSubmitLogin = async (data) => {
    try {
      const success = await login(data.email, data.password);
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
    <AnimatePresence mode="wait">
      <motion.div
        key={isLogin ? "login" : "signup"}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg p-10 rounded-3xl glass-card shadow-2xl relative overflow-hidden"
      >

        <div className="absolute -top-24 -right-24 w-48 h-48 bg-flaire-pink/20 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-flaire-orange/20 blur-3xl rounded-full"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-white mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-zinc-400 text-sm">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Join the Flaire community today"}
            </p>
          </div>


          {!isLogin && (
            <form
              className="space-y-4"
              onSubmit={handleSubmitSignup(onSubmitSignup)}
            >
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  {...registerSignup("name", {
                    required: "Name is required",
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-flaire-pink/50 transition-all"
                />
                {signupErrors.name && (
                  <p className="text-red-400 text-xs mt-1 pl-2">
                    {signupErrors.name.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  {...registerSignup("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-flaire-pink/50 transition-all"
                />
                {signupErrors.email && (
                  <p className="text-red-400 text-xs mt-1 pl-2">
                    {signupErrors.email.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="Password"
                  {...registerSignup("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-flaire-pink/50 transition-all"
                />
                {signupErrors.password && (
                  <p className="text-red-400 text-xs mt-1 pl-2">
                    {signupErrors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSignupSubmitting}
                className="w-full bg-white text-zinc-950 font-bold py-3.5 rounded-2xl flex items-center justify-center space-x-2 hover:bg-zinc-200 transition-all group disabled:opacity-50"
              >
                <span>{isSignupSubmitting ? "Signing Up..." : "Sign Up"}</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </form>
          )}


          {isLogin && (
            <form
              className="space-y-4"
              onSubmit={handleSubmitLogin(onSubmitLogin)}
            >
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  {...registerLogin("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-flaire-pink/50 transition-all"
                />
                {loginErrors.email && (
                  <p className="text-red-400 text-xs mt-1 pl-2">
                    {loginErrors.email.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="Password"
                  {...registerLogin("password", {
                    required: "Password is required",
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-flaire-pink/50 transition-all"
                />
                {loginErrors.password && (
                  <p className="text-red-400 text-xs mt-1 pl-2">
                    {loginErrors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-flaire-pink hover:text-flaire-orange transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoginSubmitting}
                className="w-full bg-white text-zinc-950 font-bold py-3.5 rounded-2xl flex items-center justify-center space-x-2 hover:bg-zinc-200 transition-all group disabled:opacity-50"
              >
                <span>{isLoginSubmitting ? "Signing In..." : "Sign In"}</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-zinc-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white font-semibold hover:text-flaire-pink transition-colors"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Signup;
