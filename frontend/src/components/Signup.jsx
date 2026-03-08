import React, { useState, useRef, useEffect, memo } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  RotateCw,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

const OTP_LENGTH = 4;
const RESEND_COOLDOWN = 30;

const OtpInput = memo(function OtpInput({ otp, setOtp, onComplete }) {
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== "") && newOtp.length === OTP_LENGTH) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (pasted.length === OTP_LENGTH) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      inputRefs.current[OTP_LENGTH - 1]?.focus();
      onComplete(pasted);
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-14 h-16 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-flaire-pink/50 focus:border-flaire-pink/50 transition-all"
        />
      ))}
    </div>
  );
});

const Signup = () => {
  const { signup, login, googleLogin, verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

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
      const result = await signup(data.name, data.email, data.password);
      if (result?.otpSent) {
        setPendingEmail(data.email);
        setOtpStep(true);
        setResendTimer(RESEND_COOLDOWN);
        toast.success("OTP sent to your email!");
      } else {
        toast.error(result?.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
    }
  };

  const handleOtpComplete = async (otpCode) => {
    setIsVerifying(true);
    try {
      const result = await verifyOtp(pendingEmail, otpCode);
      if (result?.success) {
        toast.success("Email verified! Welcome to Flaire ✨");
        navigate("/");
      } else {
        toast.error(result?.message || "Invalid OTP");
        setOtp(Array(OTP_LENGTH).fill(""));
      }
    } catch (error) {
      console.error("OTP error:", error);
      toast.error("Verification failed. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const result = await resendOtp(pendingEmail);
      if (result?.success) {
        toast.success("OTP resent to your email!");
        setResendTimer(RESEND_COOLDOWN);
        setOtp(Array(OTP_LENGTH).fill(""));
      } else {
        toast.error(result?.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  const onSubmitLogin = async (data) => {
    try {
      const result = await login(data.email, data.password);
      if (result?.success) {
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(result?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const success = await googleLogin(credentialResponse.credential);
      if (success) {
        toast.success("Google login successful!");
        navigate("/");
      } else {
        toast.error("Google login failed. Please try again.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={otpStep ? "otp" : isLogin ? "login" : "signup"}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-lg p-10 rounded-3xl glass-card shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-flaire-pink/20 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-flaire-orange/20 blur-3xl rounded-full"></div>

        <div className="relative z-10">
          {/* OTP Verification Step */}
          {otpStep && (
            <>
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.1,
                  }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-flaire-pink to-flaire-orange flex items-center justify-center"
                >
                  <ShieldCheck size={28} className="text-white" />
                </motion.div>
                <h2 className="text-3xl font-serif font-bold text-white mb-2">
                  Verify Your Email
                </h2>
                <p className="text-zinc-400 text-sm">
                  We sent a 4-digit code to{" "}
                  <span className="text-flaire-pink font-medium">
                    {pendingEmail}
                  </span>
                </p>
              </div>

              <div className="space-y-6">
                <OtpInput
                  otp={otp}
                  setOtp={setOtp}
                  onComplete={handleOtpComplete}
                />

                {isVerifying && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-zinc-400 text-sm"
                  >
                    Verifying...
                  </motion.p>
                )}

                <div className="text-center">
                  <p className="text-zinc-500 text-sm mb-2">
                    Didn't receive the code?
                  </p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0}
                    className="inline-flex items-center gap-2 text-sm font-medium text-flaire-pink hover:text-flaire-orange transition-colors disabled:text-zinc-600 disabled:cursor-not-allowed"
                  >
                    <RotateCw
                      size={14}
                      className={resendTimer > 0 ? "" : "animate-none"}
                    />
                    {resendTimer > 0
                      ? `Resend in ${resendTimer}s`
                      : "Resend OTP"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOtpStep(false);
                    setOtp(Array(OTP_LENGTH).fill(""));
                    setPendingEmail("");
                  }}
                  className="w-full text-center text-zinc-500 text-sm hover:text-white transition-colors"
                >
                  ← Back to Sign Up
                </button>
              </div>
            </>
          )}

          {/* Signup Form */}
          {!otpStep && !isLogin && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-white mb-2">
                  Create Account
                </h2>
                <p className="text-zinc-400 text-sm">
                  Join the Flaire community today
                </p>
              </div>

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
                  <span>
                    {isSignupSubmitting ? "Signing Up..." : "Sign Up"}
                  </span>
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>

                <div className="flex items-center my-5">
                  <div className="flex-grow h-px bg-white/10"></div>
                  <span className="px-4 text-xs text-zinc-500 uppercase tracking-widest">
                    or
                  </span>
                  <div className="flex-grow h-px bg-white/10"></div>
                </div>

                <div className="flex justify-center [&_iframe]:rounded-2xl">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google login failed")}
                    theme="filled_black"
                    shape="pill"
                    size="large"
                    width="100%"
                    text="continue_with"
                  />
                </div>
              </form>
            </>
          )}

          {/* Login Form */}
          {!otpStep && isLogin && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-zinc-400 text-sm">
                  Enter your credentials to access your account
                </p>
              </div>

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

                <div className="flex items-center my-5">
                  <div className="flex-grow h-px bg-white/10"></div>
                  <span className="px-4 text-xs text-zinc-500 uppercase tracking-widest">
                    or
                  </span>
                  <div className="flex-grow h-px bg-white/10"></div>
                </div>

                <div className="flex justify-center [&_iframe]:rounded-2xl">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google login failed")}
                    theme="filled_black"
                    shape="pill"
                    size="large"
                    width="100%"
                    text="continue_with"
                  />
                </div>
              </form>
            </>
          )}

          {!otpStep && (
            <p className="mt-8 text-center text-zinc-500 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white font-semibold hover:text-flaire-pink transition-colors"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Signup;
