import axios from "axios";
import { isAuthenticated, getUser } from "./auth";

export const getWishlist = async () => {
  if (isAuthenticated()) {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.wishlist; // array of product IDs
    } catch (err) {
      console.error("Failed to fetch wishlist from server", err);
      return [];
    }
  } else {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
  }
};

export const toggleWishlist = async (productId) => {
  if (isAuthenticated()) {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `/api/wishlist/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.wishlist; // updated wishlist
    } catch (err) {
      console.error("Failed to update wishlist on server", err);
      return [];
    }
  } else {
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter((id) => id !== productId);
    } else {
      wishlist.push(productId);
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    return wishlist;
  }
};
