import axios from "axios";
import { isAuthenticated } from "../utils/auth";
//import { getToken } from "../utils/auth";

const API_URL = "http://localhost:5000/api";


//RegistrationPage.jsx
export const registerUser = (data) => {
  return axios.post(`${API_URL}/auth/register`, data);
};

//LoginPage.jsx
//export const loginUser = async (data) => {
  //const res = await axios.post(`${API_URL}/auth/login`, data);
  //return res.data;
//};
// ✅ FIXED - Return FULL response
export const loginUser = async (data) => {
  const res = await axios.post(`${API_URL}/auth/login`, data);
  return res;  // Frontend gets res.data.token ✅
};


//UserDashboard.jsx and UpdateProfile.jsx
export const login = async (data) => {
  const res = await axios.post(`${API_URL}/auth/login`, data);
  localStorage.setItem("token", res.data.token);
  return res.data;
};

/*export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

export const updateProfile = async (data) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API_URL}/user/profile`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};*/

 

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getMyProfile = () =>
  axios.get(`${API_URL}/users/me`, authHeader());

export const updateMyProfile = (data) =>
  axios.put(`${API_URL}/users/me`, data, authHeader());

export const changePassword = (data) =>
  axios.put(`${API_URL}/users/change-password`, data, authHeader());


//Product services// Product services
export const fetchProducts = async (params) => {
  const res = await axios.get(`${API_URL}/products`, { params });
  return res.data; // ✅ return ONLY array
};


export const fetchProductById = (id) =>
  axios.get(`${API_URL}/products/${id}`);




// Sync guest wishlist to server after login

//Wishlist service.js

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


// Sync guest wishlist to server after login
export const syncWishlistAfterLogin = async () => {
  const guestWishlist = getGuestWishlist();
  const token = getToken();

  if (!token || guestWishlist.length === 0) return;

  for (const product of guestWishlist) {
    try {
      await axios.post(`${API}/${product._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to sync product:", product._id, err);
    }
  }

  localStorage.removeItem(WISHLIST_KEY);
};


//Cart services
// ================= CART SERVICE =================

const CART_KEY = "cart";


/* ---------- GUEST ---------- */
const getGuestCart = () =>
  JSON.parse(localStorage.getItem(CART_KEY)) || [];

const saveGuestCart = (items) =>
  localStorage.setItem(CART_KEY, JSON.stringify(items));

/* ---------- GET CART ----------
export const getCart = async () => {
  const token = getToken();

  if (!token) return getGuestCart();

  const res = await axios.get(`${API}/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}; */

/* ---------- ADD TO CART ---------- 

export const addToCart = async (product) => {
  const token = getToken();

  // ✅ GUEST
  if (!token) {
    const cart = getGuestCart();
    const exists = cart.find((i) => i._id === product._id);

    let updated;
    if (exists) {
      updated = cart.map((i) =>
        i._id === product._id
          ? { ...i, quantity: (i.quantity || 1) + 1 }
          : i
      );
    } else {
      updated = [...cart, { ...product, quantity: 1 }];
    }

    saveGuestCart(updated);
    return updated;
  }

  // ✅ LOGGED IN
  const res = await axios.post(
    `${API}/cart/${product._id}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};
*/



// ✅ Logged-in cart


// ✅ Add item (logged-in) 

// 🔥 THIS IS THE MOST IMPORTANT PART



//cartService.js
// authService.js - Replace addToCart:
export const addToCart = async (product) => {
  const token = localStorage.getItem("token");
  
  // ✅ ALWAYS UPDATE LOCALSTORAGE (for PaymentCustomerInfo)
  const updateLocalCart = (items) => {
    localStorage.setItem("cart", JSON.stringify(items));
    return items;
  };
  
  if (!token) {
    // GUEST - localStorage only
    const cart = getGuestCart();
    const exists = cart.find(i => i._id === product._id);
    
    let updated;
    if (exists) {
      updated = cart.map(i =>
        i._id === product._id
          ? { ...i, quantity: i.quantity + 1, price: parseFloat(product.price) }
          : i
      );
    } else {
      updated = [...cart, { 
        ...product, 
        quantity: 1, 
        price: parseFloat(product.price) || 29.99 
      }];
    }
    return updateLocalCart(updated);
  }
  
  // ✅ LOGGED-IN: Backend + localStorage sync
  try {
    const res = await axios.post(
      `${API_URL}/cart/${product._id}`,  // Backend save
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    // ✅ ALSO UPDATE LOCALSTORAGE for PaymentCustomerInfo
    const localCart = getGuestCart();  // Read current local cart
    const exists = localCart.find(i => i._id === product._id);
    
    let updated;
    if (exists) {
      updated = localCart.map(i =>
        i._id === product._id
          ? { ...i, quantity: i.quantity + 1, price: parseFloat(product.price) }
          : i
      );
    } else {
      updated = [...localCart, { 
        ...product, 
        quantity: 1, 
        price: parseFloat(product.price) || 29.99 
      }];
    }
    
    return updateLocalCart(updated);  // Save to localStorage
  } catch (error) {
    console.error('Backend cart failed - using localStorage');
    // Fallback to guest logic
    const cart = getGuestCart();
    // ... guest logic above
  }
};



export const getCartAuth = async () => {
  const res = await axios.get(API_URL, authHeader());
  return res.data;
};




/* ================= GET CART ================= */
export const getCart = async () => {
  const res = await axios.get(`${API_URL}/cart`, authHeader());
  return res.data || [];
};

/* ================= ADD TO CART ================= */
export const addToCartAuth = async (productId, quantity = 1) => {
  const res = await axios.post(
    `${API_URL}/cart/add`,
    { productId, quantity },
    authHeader()
  );
  return res.data;
};

/* ================= REMOVE ================= 
export const removeFromCartAuth = async (productId) => {
  const res = await axios.delete(
    `${API_URL}/cart/remove/${productId}`,
    authHeader()
  );
  return res.data;
};*/

/* ================= SYNC AFTER LOGIN ================= */
export const syncCartAfterLogin = async () => {
  const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (!localCart.length) return;

  await axios.post(
    `${API_URL}/cart/sync`,
    {
      items: localCart.map((item) => ({
        productId: item._id,
        quantity: item.quantity || 1,
      })),
    },
    authHeader()
  );

  localStorage.removeItem("cart");
};


/*
export const removeFromCartAuth = async (productId) => {
  const res = await axios.delete(
    `${API_URL}/cart/${productId}`,
    authConfig()
  );
  return res.data;
};

export const removeFromCartAuth = async (productId) => {
  const res = await axios.delete(
    `${API_URL}/cart/${productId}`,
    authConfig()
  );
  return res.data;
};*/
export const removeFromCartAuth = async (productId) => {
  const res = await axios.delete(
    `http://localhost:5000/api/cart/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return res.data; // updated cart
};


//forgot password
export const forgotPassword = async (email) => {
  return axios.post('/api/auth/forgot-password', { email });
};


//MyOrder.jsx services
