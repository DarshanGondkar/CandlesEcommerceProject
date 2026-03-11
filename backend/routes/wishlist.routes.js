import express from "express";
import Wishlist from "../models/wishlist.model.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/* GET wishlist */
router.get("/", protect, async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [],
    });
  }

  res.json(wishlist.products);
});

/* ADD to wishlist */
router.post("/:productId", protect, async (req, res) => {
  const { productId } = req.params;

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [productId],
    });
  } else {
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }
  }

  await wishlist.save();
  res.json(wishlist.products);
});

/* REMOVE from wishlist */
router.delete("/:productId", protect, async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) return res.json([]);

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId
  );

  await wishlist.save();
  res.json(wishlist.products);
});

export default router;
