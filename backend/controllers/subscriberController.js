import Subscriber from "../models/Subscriber.js";
import nodemailer from "nodemailer";
import User from "../models/User.js";

// Use SAME transporter you already use
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "0af22d33ee0490",
    pass: "c7bed5bd66abd6"
  }
});

export const subscribeUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existing = await Subscriber.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    const newSubscriber = await Subscriber.create({ email });


     // ✅ TEMPORARY: FREE Log instead of sending email
    /*console.log("📧 ============ EMAIL PREVIEW ============");
    console.log("To:", email);
    console.log("Subject: Welcome! Get 10% off");
    console.log("Message: Use code WELCOME10 for 10% discount");
    console.log("========================================"); */
    
    // ✅ Comment out actual email sending
    // Send welcome email
    await transporter.sendMail({
      to: email,
      from: "noreply@lumina-candles.com",
      subject: "🕯️ Welcome to Lumina Candles",
      html: `
        <h2>Welcome 🎉</h2>
        <p>Thanks for subscribing to Lumina Candles.</p>
        <p>You will now receive exclusive offers!</p>
      `
    });

    res.status(201).json({ message: "Subscribed successfully!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//discount
/*export const verifyDiscount = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (code !== "WELCOME10") {
      return res.status(400).json({ message: "Invalid code" });
    }

    const user = await User.findOne({ email });
    const subscriber = await Subscriber.findOne({ email });

    const isSubscribed =
      (user && user.newsletter) || subscriber;

    if (!isSubscribed) {
      return res.status(400).json({
        message: "Only newsletter subscribers can use this code"
      });
    }

    if (user && user.discountUsed) {
      return res.status(400).json({
        message: "Discount already used"
      });
    }

    res.json({ valid: true });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};*/

//discount
export const verifyDiscount = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (code !== "WELCOME10") {
      return res.status(400).json({ message: "Invalid code" });
    }

    const user = await User.findOne({ email });
    const subscriber = await Subscriber.findOne({ email });

    // ❌ Not subscribed anywhere
    if (!user && !subscriber) {
      return res.status(400).json({
        message: "Only newsletter subscribers can use this code"
      });
    }

    // ❌ Already used (check BOTH collections safely)
    const alreadyUsed =
      user?.discountUsed === true ||
      subscriber?.discountUsed === true;

    if (alreadyUsed) {
      return res.status(400).json({
        message: "Discount already used"
      });
    }

    res.json({ valid: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


