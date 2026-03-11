import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header2 from "./Header2";
import Footer2 from "./Footer2";
import { registerUser } from "../services/authService";

const emailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function RegistrationPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
const [userName, setUserName] = useState("");
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Only digits for mobile
    if (name === "mobile" && !/^\d*$/.test(value)) return;

    // Email validation
    if (name === "email") {
      if (!emailRegex.test(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!emailRegex.test(formData.email)) {
    return setError("Please enter a valid email address");
  }
  if (formData.mobile.length !== 10) {
    return setError("Mobile number must be exactly 10 digits");
  }
  if (formData.password.length < 6) {
    return setError("Password must be at least 6 characters");
  }

  setLoading(true);
  try {
    const res = await registerUser(formData);
    
    // ✅ AUTO LOGIN after registration
    localStorage.setItem("token", res.data.token);  // 347 chars!
    localStorage.setItem("user", JSON.stringify(res.data.user));
    
// ✅ Set first name for popup
setUserName(res.data.user.firstName);

    setShowWelcome(true);
    setTimeout(() => navigate("/"), 2000);
  } catch (err) {
    setError(err.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};


  // In your register/login success handler:

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background text-text">
      <Header2 />

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-background/5 border border-border/10 rounded-xl p-8 backdrop-blur">

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl tracking-tight">
              Create Your Account
            </h2>
            <p className="text-text/60 text-sm mt-1">
              Experience premium handcrafted candles
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* First Name */}
            <div>
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
className="w-full bg-gray-100 text-text placeholder:text-gray-400 
border border-gray-300 rounded-lg px-4 py-3 pr-12
focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"              />
            </div>

            {/* Last Name */}
            <div>
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
className="w-full bg-gray-100 text-text placeholder:text-gray-400 
border border-gray-300 rounded-lg px-4 py-3 pr-12
focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"              />
            </div>

            {/* Email */}
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                inputMode="email"
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                className={`form-input ${
                  emailError ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {emailError && (
                <p className="mt-1 text-xs text-red-400">
                  {emailError}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                maxLength="10"
                
                placeholder="Enter your mobile number"
                required
               className="w-full bg-gray-100 text-text placeholder:text-gray-400 
border border-gray-300 rounded-lg px-4 py-3 pr-12
focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                 className="w-full bg-gray-100 text-text placeholder:text-gray-400 
border border-gray-300 rounded-lg px-4 py-3 pr-12
focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg text-sm font-semibold tracking-widest uppercase transition-all
                ${
                  loading
                    ? "bg-white/40 text-primary cursor-not-allowed"
                    : "bg-white text-primary hover:bg-white/90 active:scale-[0.98]"
                }`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Login */}
            <p className="text-center text-sm text-text/60">
              Already have an account?
              <a href="/Login" className="ml-1 text-text underline">
                Login
              </a>
            </p>
          </form>
        </div>
      </main>

      <Footer2 />
      {/* Welcome Popup - USER NAME DISPLAY 🔥 */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/20 border border-border/10 rounded-xl p-8 text-center max-w-sm animate-fadeIn">
            <h3 className="font-serif text-2xl mb-2 text-white">
             Welcome to Lumina, <span className="text-primary uppercase font-bold">{userName}</span>  🕯
            </h3>
            <p className="text-white/80 text-sm">
              Your account has been created successfully.
            </p>
          </div>
        </div>
      )}
      {/* Welcome Popup
      {showWelcome && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background-dark border border-border/10 rounded-xl p-8 text-center max-w-sm">
            <h3 className="font-serif text-2xl mb-2">
             Welcome to Lumina, <span className="text-primary uppercase font-bold">{userName}</span>  🕯
            </h3>
            <p className="text-white/60 text-sm">
              Your account has been created successfully.
            </p>
          </div>
        </div>
      )} */}
    </div>
  );
}
