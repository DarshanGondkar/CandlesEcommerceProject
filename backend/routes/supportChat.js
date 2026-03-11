import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ reply: "Please type your message." });
  }

  const lower = message.toLowerCase();

  // 🟢 Greeting
  if (/\b(hi|hello|hey)\b/.test(lower)) {
    return res.json({
      reply:
        "Hello ✨ Welcome to our Luxury Candle Store.\nHow may I assist you today?"
    });
  }

  // 📦 Order / Not Received / Late
  if (
    /\b(order|not received|late|delay|delayed|where is my order)\b/.test(lower)
  ) {
    return res.json({
      reply:
        "📦 I'm sorry your order hasn't arrived yet.\nPlease visit 'My Orders' section to track it.\nIf the issue continues, share your Order ID and we'll help immediately."
    });
  }

  // 🚚 Shipping
  if (/\b(shipping|delivery|dispatch|courier)\b/.test(lower)) {
    return res.json({
      reply:
        "🚚 We offer free shipping on orders above ₹999.\nDelivery takes 3–5 business days across India."
    });
  }

  // 🔄 Returns
  if (/\b(return|refund|replace|replacement)\b/.test(lower)) {
    return res.json({
      reply:
        "🔄 You can return unused candles within 7 days of delivery.\nRefunds are processed within 5–7 working days."
    });
  }

  // 🎁 Recommendation
  if (/\b(recommend|suggest|gift|romantic|relax)\b/.test(lower)) {
    return res.json({
      reply:
        "✨ Here are some favorites:\n• Relaxation → Lavender Bliss\n• Romantic → Amber & Teakwood\n• Gift → Golden Hour Collection\n\nTell me your preference!"
    });
  }

  // ❓ Fallback
  return res.json({
    reply:
      "I'm here to help ✨\nYou can ask about orders, shipping, returns, or product recommendations."
  });
});

export default router;