// src/utils/auth.js

// Check if user is logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Get logged-in user
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Get token
export const getToken = () => localStorage.getItem("token");

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.setItem("cart", JSON.stringify([]));
  localStorage.setItem("wishlist", JSON.stringify([]));
  window.location.href = "/Login";
};

// Sync guest cart/wishlist to server after login
export const syncGuestDataToServer = async () => {
  const token = getToken();
  if (!token) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  try {
    await fetch("http://localhost:5000/api/user/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cart, wishlist }),
    });

    // Clear guest storage after sync
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
  } catch (err) {
    console.error("Sync failed", err);
  }
};
