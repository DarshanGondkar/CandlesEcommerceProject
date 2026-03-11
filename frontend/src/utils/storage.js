// Wishlist
export const getWishlist = () =>
  JSON.parse(localStorage.getItem("wishlist")) || [];

export const saveWishlist = (wishlist) =>
  localStorage.setItem("wishlist", JSON.stringify(wishlist));

// Cart
export const getCart = () =>
  JSON.parse(localStorage.getItem("cart")) || [];

export const saveCart = (cart) =>
  localStorage.setItem("cart", JSON.stringify(cart));






