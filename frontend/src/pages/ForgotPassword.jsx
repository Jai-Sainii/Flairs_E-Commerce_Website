import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";


const STEP_EMAIL = 1;
const STEP_OTP = 2;
const STEP_RESET = 3;

function ForgotPassword() {
  const { forgotPassword, verifyForgotPasswordOtp, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(STEP_EMAIL);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  const emailForm = useForm();
  const otpForm = useForm();
  const resetForm = useForm();


  const onSendOtp = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await forgotPassword(data.email);
      if (result?.success) {
        setEmail(data.email);
        setStep(STEP_OTP);
        toast.success("OTP sent to your email!");
      } else {
        toast.error(result?.message || "Failed to send OTP");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const onVerifyOtp = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await verifyForgotPasswordOtp(email, data.otp);
      if (result?.success) {
        setStep(STEP_RESET);
        toast.success("OTP verified! Set your new password.");
      } else {
        toast.error(result?.message || "Invalid or expired OTP");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const onResetPassword = async (data) => {
    if (data.password !== data.confirmPassword) {
      resetForm.setError("confirmPassword", {
        message: "Passwords do not match",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await resetPassword(email, data.password);
      if (result?.success) {
        toast.success("Password reset successfully! Please log in.");
        navigate("/signup");
      } else {
        toast.error(result?.message || "Failed to reset password");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const steps = ["Email", "Verify OTP", "New Password"];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-flaire-dark to-flaire-darker">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="bg-black border border-white/10 rounded-3xl p-8 shadow-2xl"
          >

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-flaire-pink/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {step === STEP_EMAIL && (
                  <Mail className="w-8 h-8 text-flaire-pink" />
                )}
                {step === STEP_OTP && (
                  <ShieldCheck className="w-8 h-8 text-flaire-pink" />
                )}
                {step === STEP_RESET && (
                  <KeyRound className="w-8 h-8 text-flaire-pink" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Forgot Password
              </h1>
              <p className="text-gray-400 text-sm">
                {step === STEP_EMAIL &&
                  "Enter your email to receive a reset OTP"}
                {step === STEP_OTP && `Enter the OTP sent to ${email}`}
                {step === STEP_RESET && "Choose a strong new password"}
              </p>
            </div>


            <div className="flex items-center justify-center gap-2 mb-8">
              {steps.map((label, i) => {
                const s = i + 1;
                const active = s === step;
                const done = s < step;
                return (
                  <React.Fragment key={label}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          done
                            ? "bg-flaire-pink text-white"
                            : active
                              ? "bg-flaire-pink/20 border-2 border-flaire-pink text-flaire-pink"
                              : "bg-white/5 border border-white/10 text-gray-500"
                        }`}
                      >
                        {done ? "✓" : s}
                      </div>
                      <span
                        className={`text-xs mt-1 ${active ? "text-flaire-pink" : done ? "text-gray-300" : "text-gray-600"}`}
                      >
                        {label}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={`h-px flex-1 mb-4 transition-all duration-500 ${done ? "bg-flaire-pink" : "bg-white/10"}`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

    
            {step === STEP_EMAIL && (
              <form
                onSubmit={emailForm.handleSubmit(onSendOtp)}
                className="space-y-5"
              >
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    {...emailForm.register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-flaire-pink/50 focus:border-flaire-pink/50 transition-all"
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-red-400 text-sm mt-2">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-flaire-pink to-flaire-orange hover:from-flaire-orange hover:to-flaire-pink text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCw className="w-5 h-5 animate-spin" /> Sending
                      OTP...
                    </>
                  ) : (
                    <>
                      Send OTP <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}


            {step === STEP_OTP && (
              <form
                onSubmit={otpForm.handleSubmit(onVerifyOtp)}
                className="space-y-5"
              >
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Enter 4-digit OTP"
                    {...otpForm.register("otp", {
                      required: "OTP is required",
                      pattern: {
                        value: /^\d{4}$/,
                        message: "OTP must be 4 digits",
                      },
                    })}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-flaire-pink/50 focus:border-flaire-pink/50 transition-all tracking-[0.4em] text-center text-xl"
                  />
                  {otpForm.formState.errors.otp && (
                    <p className="text-red-400 text-sm mt-2">
                      {otpForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-flaire-pink to-flaire-orange hover:from-flaire-orange hover:to-flaire-pink text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCw className="w-5 h-5 animate-spin" /> Verifying...
                    </>
                  ) : (
                    <>
                      Verify OTP <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <p className="text-center text-sm text-gray-500">
                  Didn't receive it?{" "}
                  <button
                    type="button"
                    onClick={() => setStep(STEP_EMAIL)}
                    className="text-flaire-pink hover:underline"
                  >
                    Resend OTP
                  </button>
                </p>
              </form>
            )}

     
            {step === STEP_RESET && (
              <form
                onSubmit={resetForm.handleSubmit(onResetPassword)}
                className="space-y-5"
              >
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    {...resetForm.register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className="w-full pl-12 pr-12 py-4 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-flaire-pink/50 focus:border-flaire-pink/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  {resetForm.formState.errors.password && (
                    <p className="text-red-400 text-sm mt-2">
                      {resetForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm New Password"
                    {...resetForm.register("confirmPassword", {
                      required: "Please confirm your password",
                    })}
                    className="w-full pl-12 pr-12 py-4 bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-flaire-pink/50 focus:border-flaire-pink/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  {resetForm.formState.errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-2">
                      {resetForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-flaire-pink to-flaire-orange hover:from-flaire-orange hover:to-flaire-pink text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCw className="w-5 h-5 animate-spin" /> Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}

      
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/signup")}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ForgotPassword;
