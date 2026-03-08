import React from "react";
import { Link } from "react-router";
import Signup from "../components/Signup";
import Background from "../components/Background";
import { GoogleOAuthProvider } from "@react-oauth/google";

const LoginandSignup = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <Background />
        <Link
          to="/"
          className="absolute top-8 left-8 text-white/50 hover:text-white transition-colors flex items-center space-x-2 z-20"
        >
          <span className="text-2xl font-serif font-bold tracking-tighter">
            Flaire
          </span>
          <span className="text-sm">← Back to Home</span>
        </Link>
        <div className="relative z-10 w-full flex items-center justify-center">
          <Signup />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginandSignup;
