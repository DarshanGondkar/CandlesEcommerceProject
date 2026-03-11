//used in authService.js before, but moved here for better organization
import axios from "axios";

const API = "http://localhost:5000/api/wishlist";
const WISHLIST_KEY = "wishlist";

const getToken = () => localStorage.getItem("token");

/* ---------- GUEST ---------- */
const getGuestWishlist = () =>
  JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];

const saveGuestWishlist = (items) =>
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));

/* ---------- API ---------- */
export const getWishlist = async () => {
  const token = getToken();

  if (!token) return getGuestWishlist();

  const res = await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const addToWishlist = async (product) => {
  const token = getToken();

  if (!token) {
    const wishlist = getGuestWishlist();
    if (!wishlist.find((p) => p._id === product._id)) {
      wishlist.push(product);
      saveGuestWishlist(wishlist);
    }
    return wishlist;
  }

  const res = await axios.post(
    `${API}/${product._id}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

export const removeFromWishlist = async (productId) => {
  const token = getToken();

  if (!token) {
    const wishlist = getGuestWishlist().filter((p) => p._id !== productId);
    saveGuestWishlist(wishlist);
    return wishlist;
  }

  const res = await axios.delete(`${API}/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
