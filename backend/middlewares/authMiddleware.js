import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

let transporter = null;
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }
  return transporter;
};

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const sendOtpEmail = async (email, otp) => {
  const mailTransporter = getTransporter();
  await mailTransporter.sendMail({
    from: `"Flaire" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Flaire Account",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #18181b; border-radius: 16px; color: #fff;">
        <h2 style="text-align: center; margin-bottom: 8px;">Welcome to Flaire ✨</h2>
        <p style="text-align: center; color: #a1a1aa; font-size: 14px;">Use the code below to verify your email address</p>
        <div style="text-align: center; margin: 32px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; background: linear-gradient(135deg, #ec4899, #f97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent; padding: 16px 24px;">${otp}</span>
        </div>
        <p style="text-align: center; color: #71717a; font-size: 12px;">This code expires in 10 minutes. Do not share it with anyone.</p>
      </div>
    `,
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists but is not verified, resend OTP
      if (!existingUser.isVerified) {
        const otp = generateOtp();
        existingUser.otp = otp;
        existingUser.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await existingUser.save();

        await sendOtpEmail(email, otp);

        return res.status(200).json({
          success: true,
          message: "OTP resent to your email",
          otpSent: true,
          email,
        });
      }
      return res.status(400).json({
        success: false,
        message: "Email is already registered. Login instead",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      isVerified: false,
    });

    await sendOtpEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "OTP sent to your email",
      otpSent: true,
      email,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: "Login successful", user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.json({ success: true, message: "Logged out successfully" });
};

export const me = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No Signup / Login detected" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Signup / Login Expired" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res
        .status(400)
        .json({ success: false, message: "Google credential is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = googleId;
        await user.save();
      } else {
        user = await User.create({ name, email, googleId });
      }
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: "Google login successful", user });
  } catch (error) {
    console.error("Google Login Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Google authentication failed" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res
        .status(401)
        .json({ success: false, message: "OTP has expired. Please resend." });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already verified" });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP resent to your email",
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
