import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// Login handler function
// authRoutes.js - loginUser function
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // ✅ FIXED: Select ALL fields + password
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({
      token,
      user: { 
        id: user._id, 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName 
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// ✅ PROPER ROUTE - Creates POST /api/auth/login
router.post('/login', loginUser);

// Add to authRoutes.js
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword
    });
    
    // Generate token (auto-login)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({
      token,
      user: { id: user._id, email, firstName, lastName }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;  // ✅ ONLY default export

