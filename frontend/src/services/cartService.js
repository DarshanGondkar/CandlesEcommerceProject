//used in authService.js before, but moved here for better organization

// src/services/cartService.js
import axios from "axios";

const API = "http://localhost:5000/api/cart";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// ✅ Logged-in cart
export const getCart = async () => {
  const res = await axios.get(API, authHeader());
  return res.data || [];
};

// ✅ Add item (logged-in)
export const addToCartAuth = async (productId) => {
  await axios.post(`${API}/add`, { productId }, authHeader());
};

// 🔥 THIS IS THE MOST IMPORTANT PART
export const syncCartAfterLogin = async () => {
  const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

  if (!localCart.length) return;

  await axios.post(
    `${API}/sync`,
    {
      items: localCart.map((item) => ({
        productId: item._id,
        quantity: item.quantity || item.qty || 1,
      })),
    },
    authHeader()
  );

  // 🧹 Clear guest cart
  localStorage.removeItem("cart");
};
