import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import Address from '../models/Address.js'; // ✅ ES MODULE SYNTAX

const router = express.Router();

router.post("/sync", protect, async (req, res) => {
  const { cart, wishlist } = req.body;

  const user = await User.findById(req.user._id);

  if (cart?.length) {
    user.cart = cart;
  }

  if (wishlist?.length) {
    user.wishlist = wishlist;
  }

  await user.save();
  res.json({ message: "Guest data synced" });
});

// routes/users.js OR wherever your user routes are
router.get('/me', protect, async (req, res) => {
  try {
    // req.user comes from authMiddleware
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});




// ✅ ADD THIS - Update Profile Route
router.put('/me', protect, async (req, res) => {
  try {
    const updates = req.body;
    // Remove password from profile updates (separate endpoint)
    delete updates.currentPassword;
    delete updates.newPassword;
    delete updates.confirmPassword;
    
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // ✅ HASH NEW PASSWORD (12 rounds for security)
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ Backend uses req.user.id from authMiddleware - NO userId param needed!

// GET addresses
router.get('/addresses', protect, async (req, res) => {
  const addresses = await Address.find({ userId: req.user.id });
  res.json(addresses);
});

// POST new address
router.post('/addresses', protect, async (req, res) => {
  const address = new Address({ ...req.body, userId: req.user.id });
  await address.save();
  res.json(address);
});

// PUT update
router.put('/addresses/:id', protect, async (req, res) => {
  const address = await Address.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  if (!address) return res.status(404).json({ error: 'Address not found' });
  res.json(address);
});

// DELETE
router.delete('/addresses/:id', protect, async (req, res) => {
  await Address.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ message: 'Deleted' });
});

// PATCH set default
router.patch('/addresses/:id/default', protect, async (req, res) => {
  const address = await Address.findById(req.params.id);
  if (!address || address.userId.toString() !== req.user.id) {
    return res.status(404).json({ error: 'Address not found' });
  }
  
  // Reset all defaults for this type
  await Address.updateMany(
    { userId: req.user.id, type: address.type }, 
    { isDefault: false }
  );
  
  // Set new default
  address.isDefault = true;
  await address.save();
  
  res.json({ message: 'Default updated' });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔑 LOGIN ATTEMPT:', email);  // ✅ DEBUG
    
    const user = await User.findOne({ email });
    console.log('👤 USER FOUND:', user ? user.email : 'NO USER');  // ✅ DEBUG
    
    if (!user) {
      console.log('❌ NO USER');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔐 PASSWORD MATCH:', isMatch);  // ✅ CRITICAL DEBUG
    
    if (!isMatch) {
      console.log('❌ PASSWORD MISMATCH');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // ... rest token generation
  } catch (error) {
    console.error('❌ LOGIN ERROR:', error.message);
  }
});

export default router;
