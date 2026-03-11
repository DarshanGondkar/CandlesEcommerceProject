import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header2 from "./Header2";
import Footer2 from "./Footer2";
import { loginUser } from "../services/authService";
import { syncWishlistAfterLogin } from "../services/authService";
import { syncCartAfterLogin } from "../services/authService";
import { FiEye, FiEyeOff } from "react-icons/fi"; // npm i react-icons

import { mergeGuestData } from "../utils/mergeGuestData";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  // 🔥 NEW: Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  
  // 🔥 NEW: Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 NEW: Forgot Password Handler
// 🔥 REAL BACKEND CALL - Replace entire handleForgotPassword function
const handleForgotPassword = async (e) => {
  e.preventDefault();
  setResetLoading(true);
  setResetMessage("");
  
  try {
    // ✅ REAL API CALL to backend /api/auth/forgot-password
    const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: resetEmail })
    });
    
    const data = await res.json();
    setResetMessage(data.message); // "✅ Reset email sent! Check Mailtrap"
    
    // Auto close after 3 seconds
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetEmail("");
      setResetMessage("");
    }, 3000);
    
  } catch (err) {
    setResetMessage("❌ Server error. Try again.");
  } finally {
    setResetLoading(false);
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await loginUser(formData);
    console.log('✅ FULL RESPONSE:', res);
    
    // ✅ Save token FIRST
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    
    
// ✅ Merge guest cart & wishlist
await mergeGuestData(res.data.token);

    const fullName = res.data.user.firstName || res.data.user.email.split('@')[0];
    setUserName(fullName);
    setShowWelcome(true);
    
    // ✅ FIRE & FORGET sync (don't wait - prevents blocking)
    syncWishlistAfterLogin().catch(console.error);
    syncCartAfterLogin().catch(console.error);
    
    // ✅ NAVIGATE IMMEDIATELY
    setTimeout(() => navigate("/"), 1800);
    
  } catch (err) {
    console.error('Login error:', err);  // ✅ DEBUG
    setError(err.response?.data?.message || "Invalid credentials");
  } finally {
    setLoading(false);
  }
};



  return (


    
    <div className="font-display min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header2 />

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-black/5 border border-border/10 rounded-xl p-8 backdrop-blur">
          
          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl text-text">
              {showForgotPassword ? "Reset Password" : "Welcome Back"}
            </h2>
            <p className="text-text/60 text-sm mt-1">
              {showForgotPassword 
                ? "Enter your email to receive reset link" 
                : "Login to continue shopping"
              }
            </p>
          </div>

          {/* Error/Reset Message */}
          {(error || resetMessage) && (
            <div className={`mb-4 text-sm px-4 py-3 rounded-lg text-center ${
              error 
                ? "bg-red-500/10 border border-red-500/30 text-red-400" 
                : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
            }`}>
              {error || resetMessage}
            </div>
          )}

          {/* Forgot Password Form */}
          {showForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="resetEmail"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
className="w-full bg-background/50 text-text placeholder:text-gray-400 
border border-gray-300 rounded-lg px-4 py-3 pr-12
focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"                  placeholder="Enter your registered email id"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail("");
                    setResetMessage("");
                  }}
                  className="flex-1 bg-black/10 hover:bg-black/20 text-text font-semibold py-3 px-4 rounded-lg transition-all"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 bg-background text-primary hover:bg-text/90 font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50"
                >
                  {resetLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="form-label">Email </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
className="w-full bg-background/5 text-text placeholder:text-gray-400 
border border-gray-300 rounded-lg px-4 py-3 
focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"              
    placeholder="Enter your email address"
                />
              </div>

              {/* Password with Eye Toggle 🔥 NEW */}
              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
className="w-full bg-background/5 text-text placeholder:text-gray-400 
border border-gray-300 rounded-lg px-4 py-3 pr-12
focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-text transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-lg text-sm font-semibold tracking-widest uppercase transition-all
                  ${loading
                    ? "bg-background/40 text-primary cursor-not-allowed"
                    : "bg-background text-primary hover:bg-background/90 active:scale-[0.98]"
                  }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* Register */}
              <p className="text-center text-sm text-text/60">
                Don't have an account?
                <a href="/Registration" className="ml-1 text-text underline">
                  Create Account
                </a>
              </p>
            </form>
          )}
        </div>
      </main>

      <Footer2 />

      {/* Welcome Popup - USER NAME DISPLAY 🔥 */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/20 border border-border/10 rounded-xl p-8 text-center max-w-sm animate-fadeIn">
            <h3 className="font-serif text-2xl mb-2 text-white">
             Welcome back, <span className="text-primary uppercase font-bold">{userName}</span>  🕯
            </h3>
            <p className="text-white/80 text-sm">
              Glad to see you again.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
