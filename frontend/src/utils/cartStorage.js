const CART_KEY = "cart";
const API = "http://localhost:5000/api/cart";
const getToken = () => localStorage.getItem("token");

// Guest cart
export const getGuestCart = () => JSON.parse(localStorage.getItem(CART_KEY)) || [];
export const saveGuestCart = (items) => localStorage.setItem(CART_KEY, JSON.stringify(items));

// Fetch cart (guest or logged-in)
export const getCart = async () => {
  const token = getToken();
  if (!token) return getGuestCart();

  try {
    const res = await fetch(API, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    return data.cart || []; // <-- ensure your API returns { cart: [...] }
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    return [];
  }
};

// Save cart
export const saveCart = async (items) => {
  const token = getToken();
  if (!token) {
    saveGuestCart(items);
    return items;
  }

  try {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(items),
    });
    return getCart();
  } catch (error) {
    console.error("Failed to save cart:", error);
    return items;
  }
};

export const removeFromCart = (productId) => {
  const cart = getCart().filter(
    (item) => item._id !== productId
  );
  saveCart(cart);
  return cart;
};


// Sync guest cart to logged-in user
export const syncCartAfterLogin = async () => {
  const token = getToken();
  const guestCart = getGuestCart();
  if (!token || guestCart.length === 0) return;

  try {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(guestCart),
    });
    localStorage.removeItem(CART_KEY);
  } catch (error) {
    console.error("Failed to sync cart:", error);
  }
};
