import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true,
    },
    description: String,

    price: {type: Number,required: true,
    },

    size: {
      type: String, // 8oz, 12oz, 16oz
    },

    scentProfile: {
      type: String, // Woody, Floral, Fresh, Citrus
    },

    category: {
      type: String,
      default: "Candle",
    },

    isMosquitoRepellent: {
      type: Boolean,
      default: false,
    },

    badge: {
      type: String, // New, Best Seller
    },

    images: [
      {
        type: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
