import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { getUser, isAuthenticated, logout } from "../utils/auth";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
const [searchOpen, setSearchOpen] = useState(false);

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

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange(); // Check immediately

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
          const cartRes = await fetch("https://candlesecommerceproject.onrender.com/api/cart", {
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
          const wishlistRes = await fetch("https://candlesecommerceproject.onrender.com/api/wishlist", {
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
    <div className="sticky top-0 z-100 w-full backdrop-blur-md bg-background ">
      
      <div className="flex justify-center">
        <div className="max-w-[1200px] w-full">
          {/* HEADER */}
          <header className="flex items-center justify-between py-4 px-1">
            
            {/* LEFT */}
            <div className="flex items-center gap-1">
              <button
                className="md:hidden h-10 w-10 rounded-full bg-background md:hover:bg-primary/50  flex items-center justify-center transition-all duration-200"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className="material-symbols-outlined">
                  {menuOpen ? "close" : "menu"}
                </span>
              </button>


              <Link to="/" className="flex items-center gap-1 group">
              
<span className="material-symbols-outlined text-primary text-3xl transition-transform duration-300 group-hover:animate-pulse">
                    local_fire_department
                </span>
                <h2 className="text-xl right-1 font-extrabold tracking-wide relative group">
                  LUMINA
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary transition-all duration-500 group-hover:w-full" />
                </h2>
              </Link>
            </div>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex gap-10 text-sm font-semibold text-text">
              <Link 
                to="/ProductListing" 
                className={`transition-all duration-300 hover:text-primary pb-1 relative group ${
                  location.pathname === "/ProductListing" 
                    ? "text-primary font-bold" 
                    : ""
                }`}
              >
                Collections
                <span className={`absolute left-0 bottom-0 h-[2px] bg-primary transition-all duration-300 ${
                  location.pathname === "/ProductListing" ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
              
              <Link 
                to="/Journal" 
                className={`transition-all duration-300 hover:text-primary pb-1 relative group ${
                  location.pathname === "/Journal" 
                    ? "text-primary font-bold" 
                    : ""
                }`}
              >
                Journal
                <span className={`absolute left-0 bottom-0 h-[2px] bg-primary transition-all duration-300 ${
                  location.pathname === "/Journal" ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
              
              <Link 
                to="/AboutUs" 
                className={`transition-all duration-300 hover:text-primary pb-1 relative group ${
                  location.pathname === "/AboutUs" 
                    ? "text-primary font-bold" 
                    : ""
                }`}
              >
                About
                <span className={`absolute left-0 bottom-0 h-[2px] bg-primary transition-all duration-300 ${
                  location.pathname === "/AboutUs" ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
              
              <Link 
                to="/Contact" 
                className={`transition-all duration-300 hover:text-primary pb-1 relative group ${
                  location.pathname === "/Contact" 
                    ? "text-primary font-bold" 
                    : ""
                }`}
              >
                Contact
                <span className={`absolute left-0 bottom-0 h-[2px] bg-primary transition-all duration-300 ${
                  location.pathname === "/Contact" ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
            </nav>

            {/* RIGHT */}
            <div className="flex gap-1 items-center">
             {["search", "favorite", "shopping_cart"].map(icon => {
  const links = {
    search: "#",
    favorite: "/Wishlist",
    shopping_cart: "/Cart",
  };

  return (
    <Link
      key={icon}
      to={links[icon]}
      id={icon === "search" ? "search-trigger" : undefined}
      className="h-10 w-10 rounded-full bg-[#2c4724]/10 hover:bg-primary/50 flex items-center justify-center transition-all duration-200 hover:scale-105 relative"
    >
      <span className="material-symbols-outlined text-lg">{icon}</span>
      
      {/* Badge for wishlist */}
      {icon === "favorite" && wishlistCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {wishlistCount > 9 ? '9+' : wishlistCount}
        </span>
      )}
      
      {/* Badge for cart */}
      {icon === "shopping_cart" && cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {cartCount > 9 ? '9+' : cartCount}
        </span>
      )}
    </Link>
  );
})}

              {/* 🔥 ACCOUNT - IMPROVED */}
              <div className="relative account-dropdown-container">
                <button
                  onClick={() => setAccountDropdown(!accountDropdown)}
                  className="h-10 w-10 rounded-full bg-[#2c4724]/10 hover:bg-primary/50 flex items-center justify-center transition-all duration-200 hover:scale-105"
                >
                  <span className="material-symbols-outlined text-lg">
                    account_circle
                  </span>
                </button>

               {accountDropdown && (
  <div className="absolute right-0 mt-2 w-48 bg-background border border-[#2c4724] shadow-lg py-2 rounded-2xl backdrop-blur-md">
    
    {isAuthenticated() ? (
      <>
        {/* User Info */}
        <div className="px-4 py-3 text-sm text-text/90 font-medium border-b border-[#2c4724]/50">
          Hi, {user?.firstName || user?.name || user?.email?.split('@')[0] || 'User'}
        </div>

        {/* My Account */}
        <Link 
          to="/UserDashboard" 
          className="block px-4 py-3 text-sm hover:bg-white/10 rounded-lg transition-all"
          onClick={() => setAccountDropdown(false)}
        >
          My Account
        </Link>

        {/* My Orders (above logout) */}
        <Link 
          to="/MyOrders" 
          className="block px-4 py-3 text-sm hover:bg-white/10 rounded-lg transition-all"
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
          className="w-full text-left px-4 py-3 text-sm hover:bg-white/10 rounded-lg transition-all"
        >
          Logout
        </button>
      </>
    ) : (
      <>
        {/* Login */}
        <Link 
          to="/Login" 
          className="block px-4 py-3 text-sm hover:bg-white/10 rounded-lg transition-all"
          onClick={() => setAccountDropdown(false)}
        >
          Login
        </Link>

        {/* My Orders (below login) */}
        <Link 
          to="/MyOrders" 
          className="block px-4 py-3 text-sm hover:bg-white/10 rounded-lg transition-all"
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

          {/* MOBILE MENU */}
       <div
  className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
    menuOpen
      ? "max-h-[400px] opacity-100 scale-100 rounded-b-3xl border-t border-border"
      : "max-h-0 opacity-0 scale-95"
  } bg-background px-6 space-y-4`}
>
  <div className="py-6"> <Link 
                to="/ProductListing" 
                className={`block py-2 font-semibold transition-all ${
                  location.pathname === "/ProductListing" 
                    ? "text-primary border-l-4 border-primary pl-4" 
                    : "hover:text-primary"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Collections
              </Link>
              <Link 
                to="/Journal" 
                className={`block py-2 font-semibold transition-all ${
                  location.pathname === "/Journal" 
                    ? "text-primary border-l-4 border-primary pl-4" 
                    : "hover:text-primary"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Journal
              </Link>
              <Link 
                to="/AboutUs" 
                className={`block py-2 font-semibold transition-all ${
                  location.pathname === "/AboutUs" 
                    ? "text-primary border-l-4 border-primary pl-4" 
                    : "hover:text-primary"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/Contact" 
                className={`block py-2 font-semibold transition-all ${
                  location.pathname === "/Contact" 
                    ? "text-primary border-l-4 border-primary pl-4" 
                    : "hover:text-primary"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
