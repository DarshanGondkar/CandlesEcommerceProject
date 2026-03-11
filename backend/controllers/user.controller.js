import User from "../models/User.js";
import bcrypt from "bcryptjs";

/**
 * GET logged-in user
 * GET /api/users/me
 */
export const getMe = async (req, res) => {
  res.json(req.user);
};

/**
 * UPDATE profile
 * PUT /api/users/me
 */
export const updateMe = async (req, res) => {
  const { firstName, lastName, mobile, newsletter, address } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.firstName = firstName ?? user.firstName;
  user.lastName = lastName ?? user.lastName;
  user.mobile = mobile ?? user.mobile;
  user.newsletter = newsletter ?? user.newsletter;
user.address = address ?? user.address;
  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    mobile: updatedUser.mobile,
    newsletter: updatedUser.newsletter,
    
  });
};

/**
 * CHANGE password
 * PUT /api/users/change-password
 */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated successfully" });
};
