import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/User.js";
import Subscriber from "../models/Subscriber.js";

const router = express.Router();

router.post("/create-order", async (req, res) => {
  console.log("📥 CREATE ORDER:", req.body);
  
  try {
    // ✅ CREATE Razorpay instance HERE (per request)
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount, receipt, orderId } = req.body;
    
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Paise
      currency: "INR",
      receipt: receipt || `lumina_${Date.now()}`,
      notes: { orderId: orderId || "guest" }
    });

    console.log("✅ ORDER CREATED:", razorpayOrder.id);
    
    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    });

  } catch (error) {
    console.error("💥 ERROR:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

/*router.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    console.log("✅ PAYMENT VERIFIED");
    res.json({ success: true });
  } else {
    console.log("❌ INVALID SIGNATURE");
    res.status(400).json({ success: false, error: "Invalid signature" });
  }
});*/

router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
      discountCode
    } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Invalid signature" });
    }

    console.log("✅ PAYMENT VERIFIED");

    // ✅ MARK DISCOUNT USED IN SUBSCRIBER COLLECTION
  /*if (discountCode === "WELCOME10") {

  await User.updateOne(
    { email },
    { $set: { discountUsed: true } }
  );

  await Subscriber.updateOne(
    { email },
    { $set: { discountUsed: true } }
  );
}*/console.log("Email received in verify-payment:", email);

if (discountCode === "WELCOME10") {

  const emailNormalized = email.trim().toLowerCase();

  const subscriberUpdate = await Subscriber.updateOne(
    { email: emailNormalized },
    { $set: { discountUsed: true } }
  );

  console.log("Subscriber update result:", subscriberUpdate);
}



    res.json({ success: true });

  } catch (error) {
    console.error("💥 VERIFY ERROR:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});


export default router;
