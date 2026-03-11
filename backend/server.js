import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import paymentRoutes from "./routes/payment.routes.js"; // ✅ NEW
import subscriberRoutes from "./routes/subscriberRoutes.js";
import supportChat from "./routes/supportChat.js";
import recommendationRoutes from "./routes/recommendation.js";

dotenv.config();
connectDB();

const app = express();

//app.use(cors());

app.use(cors({
  origin: "https://candlesecommerceproject.onrender.com/"
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes); // ✅ NEW PAYMENT ROUTES
app.use("/api", subscriberRoutes);
app.use("/api/support-chat", supportChat);
app.use("/api/recommendations", recommendationRoutes);
//app.get("/", (req, res) => {
  //res.send("Lumina Candles API is running...");
//});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
