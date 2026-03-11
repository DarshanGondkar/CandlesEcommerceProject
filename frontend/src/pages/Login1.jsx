import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header2 from "./Header2";
import Footer2 from "./Footer2";
import { loginUser } from "../services/authService";

const emailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!emailRegex.test(formData.email)) {
      return setError("Please enter a valid email address");
    }

    if (!formData.password) {
      return setError("Password is required");
    }

    setLoading(true);
    try {
      const data = await loginUser(formData);

      // Save auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-display relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <Header2 />

      <div className="flex flex-1">
        <div className="flex w-full min-h-screen">

          {/* LEFT IMAGE */}
          <div className="hidden md:flex flex-1">
            <div
              className="w-full bg-center bg-cover"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBvOG3CDjiFTBqUGFEBO1vXfOtuHNUCr3U7t8vU0adLNmLIkNfPFBjZcc1ADxiO90_QI8cTWZAgM-FODW6Z1e4y_0wZlH9W50fox7NkM0hXWhcSGON2LGXNUKOP6yQfZjE_9odTwIiPPnkJi27n6yenlWCvzKWYAZ0gOtDUya88K_KrwjSrdMVNvL0-PlplObXMvJdRpgBatJ0DGBMB3Ov9jo9RwZCs0MKgIlEEm8JXvaOdHLnmlrxiirGLH989dD-HpDvQpUnpfCZc")',
              }}
            />
          </div>

          {/* RIGHT FORM */}
          <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
            <div className="w-full max-w-[480px]">

              {/* Tabs */}
              <div className="flex px-4 py-3">
                <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800/50 p-1">
                  <div className="flex h-full grow items-center justify-center rounded-md bg-white dark:bg-[#182133] shadow-sm text-sm font-medium">
                    Login
                  </div>
                  <a
                    href="/Registration"
                    className="flex h-full grow items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Create Account
                  </a>
                </div>
              </div>

              {/* Heading */}
              <h1 className="text-gray-900 dark:text-white text-[32px] font-bold px-4 mb-6">
                Welcome Back
              </h1>

              {/* Error */}
              {error && (
                <div className="mx-4 mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Email */}
                <div className="px-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#182133] px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                    required
                  />
                </div>

                {/* Password */}
                <div className="px-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-2 block">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#182133] px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                    required
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4 px-4 pt-2">
                  <a
                    href="/ForgotPassword"
                    className="text-sm font-medium text-primary hover:underline text-right"
                  >
                    Forgot Password?
                  </a>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`h-12 w-full rounded-lg font-semibold transition
                      ${
                        loading
                          ? "bg-primary/50 cursor-not-allowed"
                          : "bg-primary hover:bg-primary/90"
                      } text-white`}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 px-4 py-6">
                <hr className="flex-1 border-gray-300 dark:border-gray-700" />
                <span className="text-sm text-gray-500">or</span>
                <hr className="flex-1 border-gray-300 dark:border-gray-700" />
              </div>

              {/* Guest */}
              <div className="px-4">
                <a
                  href="/"
                  className="flex items-center justify-center h-12 bg-gray-200 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-800 transition"
                >
                  Continue as Guest
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer2 />
    </div>
  );
}
