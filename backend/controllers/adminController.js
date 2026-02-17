import Admin from "../models/Admin.js";
import Product from "../models/Product.js";
import Order from "../models/orderModel.js";
import Contact from "../models/Contact.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET;

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Email is already registered. Login instead' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newAdmin = await Admin.create({ name, email, password: hashedPassword });

    
    const token = jwt.sign({ id: newAdmin._id, email: newAdmin.email }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, 
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      admin: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email },
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

   
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    
    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, 
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.json({ success: true, message: "Login successful", admin });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: `Server error ${JWT_SECRET}` });
  }
};

export const logoutAdmin = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const getAllProducts = async (req, res) => {
    const product = await Product.find()
    res.send({product})
}


export const addProduct = async (req, res) => {
    try {
        const { productName, productCategory, productType, productPrice, productSize, productDescription, stockQuantity, productImages } = req.body;
        const product = await Product.create({ productName, productCategory, productType, productPrice, productSize, productDescription, stockQuantity, productImages });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  }

export const editProduct = async (req, res) => {
    try {
        const { productName, productCategory, productType, productPrice, productSize, productDescription, stockQuantity, productImages, isActive } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        product.productName = productName;
        product.productCategory = productCategory;
        product.productType = productType;
        product.productPrice = productPrice;
        product.productSize = productSize;
        product.productDescription = productDescription;
        product.stockQuantity = stockQuantity;
        product.productImages = productImages;
        product.isActive = isActive;
        await product.save();
        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.orderStatus = req.body.orderStatus;
        await order.save();
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllContactInfo = async (req, res) => {
    try {
        const contact = await Contact.find();
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const protectAdmin = async(req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    // No token provided!
    return res.status(401).json({ success: false, message: 'No Signup / Login detected' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    // For invalid or experied token!
    res.status(401).json({ success: false, message: 'Signup / Login Expired' });
  }
};


export const me = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");
    
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    res.json({ success: true, admin });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
