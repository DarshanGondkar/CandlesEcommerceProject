import express from "express";
import Cart from "../models/cart.model.js";
//import protect from "../middleware/auth.middleware.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();


/**
 * @route   GET /api/cart
 * @desc    Get user's cart
 */
router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.user.id })
      .populate("product");

    res.json(cart);
  } catch {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

/**
 * @route   POST /api/cart/add
 * @desc    Add product to cart
 */
router.post("/add", protect, async (req, res) => {


const { productId, quantity = 1 } = req.body;
const qty = Number(quantity);
  if (!productId)
    return res.status(400).json({ message: "Product ID required" });

  try {
    const existing = await Cart.findOne({
      user: req.user.id,
      product: productId
    });

    if (existing) {
      existing.qty += qty;
      await existing.save();
      return res.json(existing);
    }

    const item = await Cart.create({
      user: req.user.id,
      product: productId,
      qty
    });

    res.json(item);
  } catch {
    res.status(500).json({ message: "Add to cart failed" });
  }
});

/**
 * @route   PUT /api/cart/update
 * @desc    Update quantity
 */
router.put("/update", protect, async (req, res) => {
  const { productId, qty } = req.body;

  try {
    const item = await Cart.findOne({
      user: req.user.id,
      product: productId
    });

    if (!item)
      return res.status(404).json({ message: "Item not found" });

    item.qty = qty;
    await item.save();

    res.json(item);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
});

/**
 * @route   DELETE /api/cart/:productId
 * @desc    Remove product
 */
router.delete("/:productId", protect, async (req, res) => {
  try {
    await Cart.findOneAndDelete({
      user: req.user.id,
      product: req.params.productId
    });

    res.json({ message: "Removed from cart" });
  } catch {
    res.status(500).json({ message: "Remove failed" });
  }
});

/**
 * @route   DELETE /api/cart/clear
 * @desc    Clear cart
 */
router.delete("/clear", protect, async (req, res) => {
  try {
    await Cart.deleteMany({ user: req.user.id });
    res.json({ message: "Cart cleared" });
  } catch {
    res.status(500).json({ message: "Clear failed" });
  }
});

export default router;
