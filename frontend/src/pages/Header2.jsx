import React, { useState, useEffect } from "react";
import { getUser, isAuthenticated, logout } from "../utils/auth";
import { useLocation, Link } from "react-router-dom";

const Header2 = () => {
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [user, setUser] = useState(null);

  const [cartCount, setCartCount] = useState(0);
const [wishlistCount, setWishlistCount] = useState(0);
  // 🔥 FIXED: Listen for auth changes + get user on mount
  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  // 🔥 NEW: Listen for localStorage changes (register/login)
  useEffect(() => {
    const handleStorageChange = () => {
      const currentUser = getUser();
      setUser(currentUser);
    };

    // Listen for storage events (login/register)
    window.addEventListener('storage', handleStorageChange);
    
    // Also check immediately
    handleStorageChange();

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountDropdown &&
        !event.target.closest(".account-dropdown-container")
      ) {
        setAccountDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [accountDropdown]);

// Update cart and wishlist counts
// Update cart and wishlist counts
useEffect(() => {
  const updateCounts = async () => {
    try {
      if (isAuthenticated()) {
        // 🔐 LOGGED-IN USER → Fetch from backend
        const token = localStorage.getItem("token");
        
        // Fetch cart count from backend
        try {
          const cartRes = await fetch("http://localhost:5000/api/cart", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const cartData = await cartRes.json();
          setCartCount(cartData?.length || 0);
        } catch (err) {
          console.error("Cart count failed:", err);
          setCartCount(0);
        }

        // Fetch wishlist count from backend
        try {
          const wishlistRes = await fetch("http://localhost:5000/api/wishlist", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const wishlistData = await wishlistRes.json();
          setWishlistCount(wishlistData?.length || 0);
        } catch (err) {
          console.error("Wishlist count failed:", err);
          setWishlistCount(0);
        }

      } else {
        // 👤 GUEST USER → Get from localStorage
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartCount(cart.length);

        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlistCount(wishlist.length);
      }
    } catch (err) {
      console.error("Update counts failed:", err);
    }
  };

  // Initial load
  updateCounts();

  // Listen for storage changes (guest users)
  window.addEventListener('storage', updateCounts);
  
  // Custom events for both guest & logged-in
  window.addEventListener('cartUpdated', updateCounts);
  window.addEventListener('wishlistUpdated', updateCounts);

  return () => {
    window.removeEventListener('storage', updateCounts);
    window.removeEventListener('cartUpdated', updateCounts);
    window.removeEventListener('wishlistUpdated', updateCounts);
  };
}, [user]); // ✅ Re-run when user changes (login/logout)

  return (

    
    
<div className="sticky {/*top-0*/} z-[1000] w-full backdrop-blur-md bg-background/95 border-b border-border">
      <div className="px-5 md:px-10 lg:px-40 flex justify-center">
        <div className="max-w-[1200px] w-full">
          <header className="flex items-center justify-between py-4 ">

            {/* LOGO */}
            <a href="/" className="flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-3xl">
                local_fire_department
              </span>
              <h2 className="text-xl font-extrabold">LUMINA</h2>
            </a>

            {/* RIGHT */}
            <div className="flex gap-2 items-center">

              {/* Cart */}
             {/* Cart */}
<a
  href="/Cart"
  className="h-10 w-10 rounded-full bg-black/5 hover:bg-primary/20 flex items-center justify-center relative"
>
  <span className="material-symbols-outlined">shopping_cart</span>
  {cartCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {cartCount > 9 ? '9+' : cartCount}
    </span>
  )}
</a>

              {/* Account */}
              <div className="relative account-dropdown-container">
                <button
                  onClick={() => setAccountDropdown(!accountDropdown)}
                  className="h-10 w-10 rounded-full bg-black/5 hover:bg-primary/20 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined">
                    account_circle
                  </span>
                </button>

               {accountDropdown && (
  <div className="absolute right-0 mt-2 w-48 bg-background border border-border shadow-lg py-2 rounded-2xl backdrop-blur-md ">
    
    {isAuthenticated() ? (
      <>
        {/* User Info */}
        <div className="px-4 py-3 text-sm text-text/90 font-medium border-b border-border/50">
          Hi, {user?.firstName || user?.name || user?.email?.split('@')[0] || 'User'}
        </div>

        {/* My Account */}
        <Link 
          to="/UserDashboard" 
          className="block px-4 py-3 text-sm hover:bg-background/10 rounded-lg transition-all"
          onClick={() => setAccountDropdown(false)}
        >
          My Account
        </Link>

        {/* My Orders (above logout) */}
        <Link 
          to="/MyOrders" 
          className="block px-4 py-3 text-sm hover:bg-background/10 rounded-lg transition-all"
          onClick={() => setAccountDropdown(false)}
        >
          My Orders
        </Link>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            setAccountDropdown(false);
          }}
          className="w-full text-left px-4 py-3 text-sm hover:bg-background/10 rounded-lg transition-all"
        >
          Logout
        </button>
      </>
    ) : (
      <>
        {/* Login */}
        <Link 
          to="/Login" 
          className="block px-4 py-3 text-sm hover:bg-background/10 rounded-lg transition-all"
          onClick={() => setAccountDropdown(false)}
        >
          Login
        </Link>

        {/* My Orders (below login) */}
        <Link 
          to="/MyOrders" 
          className="block px-4 py-3 text-sm hover:bg-background/10  rounded-lg transition-all"
          onClick={() => setAccountDropdown(false)}
        >
          My Orders
        </Link>
      </>
    )}

  </div>
)}

              </div>
            </div>
          </header>
        </div>
      </div>
    </div>
  );
};

export default Header2;
