import express from "express";
import Product from "../models/product.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { recentId } = req.query;

    const recommendations = [];

    // =========================
    // 1️⃣ BEST SELLER (or fallback)
    // =========================
    let bestSeller = await Product.findOne({
      badge: "Best Seller",
      isActive: true
    });

    if (!bestSeller) {
      bestSeller = await Product.findOne({ isActive: true }).sort({ createdAt: -1 });
    }

    if (bestSeller) {
      const product = bestSeller.toObject();
      product.badge = "Best Seller";
      recommendations.push(product);
    }

    // =========================
    // 2️⃣ PERSONALIZED (or fallback)
    // =========================
    let personalized = null;
    if (recentId) {
      const recentProduct = await Product.findById(recentId);
      if (recentProduct) {
        personalized = await Product.findOne({
          scentProfile: recentProduct.scentProfile,
          _id: { $ne: recentId },
          isActive: true
        });
      }
    }

    if (!personalized) {
      personalized = await Product.findOne({
        _id: { $nin: recommendations.map(p => p._id) },
        isActive: true
      }).sort({ createdAt: -1 });
    }

    if (personalized && !recommendations.find(p => p._id.equals(personalized._id))) {
      const product = personalized.toObject();
      product.badge = "Personalized";
      recommendations.push(product);
    }

    // =========================
    // 3️⃣ LATEST
    // =========================
    const latest = await Product.findOne({
      _id: { $nin: recommendations.map(p => p._id) },
      isActive: true
    }).sort({ createdAt: -1 });

    if (latest) {
      const product = latest.toObject();
      product.badge = "Latest";
      recommendations.push(product);
    }

    res.json(recommendations);

  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ message: "Recommendation error" });
  }
});

export default router;