import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// ✅ FIXED: transport → transporter (same name everywhere)
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "0af22d33ee0490",     // Your username
    pass: "c7bed5bd66abd6"     // Your password
  }
});

// REGISTER (unchanged)
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName, lastName, email, mobile, password: hashedPassword,
    });
    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN (unchanged)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: "7d" });
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FORGOT PASSWORD - FIXED transporter name
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "✅ Check your email!" });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000;
    await user.save();
    
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    
    // ✅ FIXED: transporter (not transport)
    await transporter.sendMail({
      to: email,
      from: 'noreply@lumina-candles.com',
      subject: '🕯️ Reset Lumina Candles Password',
      html: `
        <h2>Reset Password</h2>
        <p>Click <a href="${resetUrl}">HERE</a> (expires 1hr)</p>
        <p>Copy: ${resetUrl}</p>
      `
    });
    
    res.json({ message: "✅ Reset email sent! Check Mailtrap dashboard." });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// RESET PASSWORD - New function
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();
    
    res.json({ message: "✅ Password reset successful! Login with new password." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
