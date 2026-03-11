import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { isAuthenticated } from "../utils/auth";
import { getCart } from "../services/authService";
import { removeFromCart } from "../utils/cartStorage";

import { removeFromCartAuth, getCartAuth } from "../services/authService";
import Header2 from "./Header2";
import Footer2 from "./Footer2";

export default function CartPage() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const didLoad = useRef(false); // 🔥 StrictMode fix

 // ✅ ADD THIS useEffect AFTER loadCart function:
useEffect(() => {
  loadCart();
}, []);



const loadCart = async () => {
  try {
    let data = [];

    if (isAuthenticated()) {
      const res = await getCart(); // backend cart

      // 🔥 FIX: normalize cart items
   data = res.map((item) => {
  return {
    ...item.product,
    quantity: item.qty || 1, // 🔥 FIXED HERE
    cartItemId: item._id,
  };
});
    } else {
      data = JSON.parse(localStorage.getItem("cart") || "[]");
    }

    console.log("🛒 Cart normalized:", data);
    setCartItems(data);
  } catch (err) {
    console.error("❌ Failed to load cart", err);
    setCartItems([]);
  } finally {
    setLoading(false);
  }
};


  /* ---------------- CART ACTIONS ---------------- */

const updateQty = async (id, delta) => {
  try {
    const updated = cartItems.map((item) => {
      if (item._id !== id) return item;

      const qty = Math.max(1, (item.quantity || 1) + delta);
      return { ...item, quantity: qty };
    });

    setCartItems(updated);

    const changedItem = updated.find((item) => item._id === id);

    if (isAuthenticated()) {
      await fetch("http://localhost:5000/api/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          productId: id,
          qty: changedItem.quantity, // 🔥 MUST BE qty
        }),
      });
    } else {
      localStorage.setItem("cart", JSON.stringify(updated));
    }
  } catch (err) {
    console.error("Qty update failed", err);
  }
};
  /*const removeItem = (id) => {
    const updated = cartItems.filter((item) => item._id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };*/

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  
  /* ---------------- UI STATES ---------------- /// 🔥 ADD HERE - AFTER loadCart function, BEFORE main return (around line 120)
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-primary">Loading cart...</p>
    </div>
  );
} */





//start-end


  /* ---------------- UI ---------------- */

const removeItem = async (productId) => {
  try {
    if (isAuthenticated()) {
      // 1️⃣ Remove item
      await removeFromCartAuth(productId);

      // 2️⃣ Re-fetch cart from backend
      const res = await getCart();

      const normalized = res.map((item) => ({
        ...item.product,
        quantity: item.qty,
      }));

      setCartItems(normalized);


      // ✅ Trigger cart update for logged-in users
      window.dispatchEvent(new Event('cartUpdated'));
    } else {
      // 👤 Guest
      const updated = cartItems.filter((i) => i._id !== productId);
      setCartItems(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
      

// ✅ Trigger cart update
window.dispatchEvent(new Event('cartUpdated'));
    }
  } catch (err) {
    console.error("Remove failed", err);
  }
};


  return (
    <>

    <div className="min-h-screen bg-background dark:bg-background-dark font-display text-text">
  <Header2 /><main className="px-1 py-6 lg:px-10 max-w-7xl mx-auto ">
 <h1 className="text-3xl md:text-4xl font-black mb-16 text-center bg-gradient-to-r from-primary to-white/20 bg-clip-text text-transparent">
          My Cart ({cartItems.length})
        </h1>
        
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
  {/* CART ITEMS */}
  <div className="lg:col-span-8 space-y-6">
{cartItems.map((item) => (
  <div
    key={item._id || item.cartItemId}
    className="flex  flex-wrap gap-5 items-center bg-surface-dark/50 p-6 rounded-2xl hover:shadow-2xl hover:bg-surface-dark/70 transition-all duration-300 border border-[#2c4724]/30 cursor-pointer group"
    onClick={() => navigate(`/ProductDetails/${item._id}`)} // ✅ Click → Product Details
  >
    {/* Prevent click on buttons */}
    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
      <img
        src={item.images?.[0] || item.image}
        alt={item.title || item.name}
        className="w-full h-full object-cover"
      />
    </div>

    <div className="flex-grow space-y-2 lg:space-y-0 min-w-0">
      <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">
        {item.title || item.name}
      </h3>
      
      {/* Mobile quantity */}
<div className="flex items-center justify-between w-full max-w-[180px] gap-3 mb-2 lg:hidden">
          <button 
          onClick={(e) => { e.stopPropagation(); updateQty(item._id, -1); }}
          className="w-10 h-10 sm:w-5 sm:h-5 aspect-square bg-[#2c4724]/50 md:hover:bg-primary rounded-full flex items-center justify-center font-bold"
        >-</button>
        <span className="font-bold text-lg min-w-[2rem] text-center">{item.quantity || 1}</span>
        <button 
          onClick={(e) => { e.stopPropagation(); updateQty(item._id, 1); }}
          className="w-10 h-10  sm:w-5 sm:h-5 aspect-square bg-[#2c4724]/50 md:hover:bg-primary rounded-full flex items-center justify-center font-bold"
        >+</button>
      </div>
      
      <p className="text-text-sage text-sm">${item.price}</p>
      
      <button
        onClick={(e) => { e.stopPropagation(); removeItem(item.cartItemId || item._id); }}
        className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
      >
        Remove
      </button>
    </div>

    {/* Desktop quantity */}
 <div className="hidden lg:flex items-center justify-center gap-2 px-4">
  <button 
    onClick={(e) => { e.stopPropagation(); updateQty(item._id, -1); }}
    className="w-10 h-10 bg-[#2c4724]/50 hover:bg-primary rounded-full flex items-center justify-center font-bold flex-shrink-0"
  >-</button>
  <span className="font-bold text-lg min-w-[2.5rem] flex items-center justify-center text-center px-2">
    {item.quantity || 1}
  </span>
  <button 
    onClick={(e) => { e.stopPropagation(); updateQty(item._id, 1); }}
    className="w-10 h-10 bg-[#2c4724]/50 hover:bg-primary rounded-full flex items-center justify-center font-bold flex-shrink-0 "
 
 >+</button>
</div>

    <div className="font-bold text-primary text-xl">
      ${(item.price * (item.quantity || 1)).toFixed(2)}
    </div>
  </div>
))}

  </div>


  {/* SUMMARY - UNCHANGED */}
  {/* SUMMARY - Always sticky + perfect mobile */}
   {/* SUMMARY - Tax/Shipping visible everywhere */}
<div className="lg:col-span-4 w-full lg:w-auto px-4 lg:px-0">
  <div className="bg-surface-dark border border-surface-dark/50 rounded-2xl lg:rounded-3xl p-4 lg:p-6 sticky lg:top-28 max-w-md mx-auto lg:mx-0">
    <h2 className="text-lg lg:text-2xl font-bold mb-4 lg:mb-6 flex items-center gap-2">
      <span className="material-symbols-outlined text-primary text-sm lg:text-lg">receipt_long</span>
      Order Summary
    </h2>
    
    {/* Subtotal */}
    <div className="flex justify-between items-center py-3 lg:py-4 border-b border-surface-dark/50 mb-4 lg:mb-6">
      <span className="text-text/70 text-sm lg:font-medium">Subtotal ({cartItems.length} items)</span>
      <span className="text-xl lg:text-2xl font-bold text-primary">${subtotal.toFixed(2)}</span>
    </div>

    {/* Taxes/Shipping - SHOW ON ALL SCREENS
    <div className="space-y-2 lg:space-y-3 mb-6 lg:mb-8 text-xs lg:text-sm">
      <div className="flex justify-between text-white/60">
        <span>Tax (8%)</span>
        <span>${(subtotal * 0.08).toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-white/60">
        <span>Shipping</span>
        <span className="font-medium text-primary">FREE</span>
      </div>
    </div> */}

    {/* Total */}
    <div className="border-t border-surface-dark/50 pt-4 lg:pt-6 mb-6 lg:mb-8">
      <div className="flex justify-between items-center text-lg lg:text-xl">
        <span className="font-bold text-text">Total</span>
        <span className="text-xl lg:text-2xl font-bold text-primary">${(subtotal * 1.00).toFixed(2)}</span>
      </div>
    </div>

    {/* Checkout Button */}
   <button
  onClick={() => {
    localStorage.removeItem("currentOrder"); // 🔥 ADD THIS LINE!
    navigate("/PaymentCustomerInfo");
  }}
  className="w-full h-12 lg:h-14  rounded-xl lg:rounded-2xl bg-gradient-to-r from-primary to-primary/90...   flex items-center justify-center gap-2"
  disabled={cartItems.length === 0}
>
  Checkout  <span className="material-symbols-outlined text-base lg:text-lg ">arrow_forward</span>

</button>

  </div>
</div>

</div>

{cartItems.length === 0 && !loading && (
  <div className="  flex justify-center items-center mt-10 py-10 lg:mt-0 lg:py-0 ">
    <a 
      href="/ProductListing" 
      className="px-12 py-4 rounded-full border-2 border-[#2c4724] hover:bg-[#2c4724]/30 text-text font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
    >
      <span className="material-symbols-outlined text-lg">storefront</span>
      Start Shopping
    </a> 
  </div>
)}
      </main>

    </div>
    <Footer2 />
</>
  );
}
