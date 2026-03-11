import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { isAuthenticated } from "../utils/auth"; // 
//import { getWishlist, toggleWishlist } from "../utils/wishlistStorage";
import { fetchProducts } from "../services/authService";
import { getWishlist, removeFromWishlist } from "../services/authService";
import { addToCart } from "../services/authService";
import { addToCartAuth } from "../services/authService";
import Footer2 from "./Footer2";
import Header2 from "./Header2";

export default function WishlistPage() {
  const navigate = useNavigate();
  const [wishlistProducts, setWishlistProducts] = useState([]); // 
  const [loading, setLoading] = useState(true);
  const [showCartPopup, setShowCartPopup] = useState({});
  const [wishlistIds, setWishlistIds] = useState([]);  // ✅ ADD THIS

  

  // ✅ Single useEffect - clean!
  useEffect(() => {
    loadWishlist();
  }, []);

  // ✅ UNIFIED toggle - works for BOTH guest & logged-in
  
// ✅ ADD THIS - Fetch products using your wishlist IDs
useEffect(() => {
  if (wishlistIds.length === 0) {
    setWishlistProducts([]);
    setLoading(false);
  }
}, [wishlistIds]);

useEffect(() => {
  if (wishlistIds.length > 0) {
    console.log('🔄 Fetching products for:', wishlistIds);
    
    fetchProducts({})
      .then(res => {
        const allProducts = res.data || res;
       const orderedProducts = wishlistIds
  .map(id => allProducts.find(p => p._id === id))
  .filter(Boolean);

setWishlistProducts(orderedProducts);
        console.log('✅ Found', orderedProducts.length, 'wishlist products');
        setWishlistProducts(orderedProducts);
        
        // 🔥 ADD THIS LINE:
        setLoading(false);  // Exit loading!
      })
      .catch(() => {
        // 🔥 AND THIS:
        setLoading(false);
      });
  }
}, [wishlistIds]);

 // ✅ HYBRID loadWishlist - Backend OR localStorage
 // ✅ FIXED:
const loadWishlist = async () => {
  try {
    console.log('🔍 Loading wishlist...');
    
    if (isAuthenticated()) {
      const wishlist = await getWishlist();
      console.log('✅ RAW wishlist response:', wishlist);
      
      const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
      console.log('✅ Safe wishlist:', safeWishlist);
      
      const ids = safeWishlist.map(p => p._id || p).filter(Boolean);
      setWishlistIds(ids);  // ✅ NOW WORKS!
      console.log('✅ Wishlist IDs:', ids);
    } else {
      const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistIds(saved);
    }
  } catch (err) {
    console.error('💥 Load wishlist FAILED:', err);
    setWishlistIds([]);
  }  
  
};

   /* ✅ Wait for BOTH to load before empty state
if (wishlistIds.length === 0 && !loading) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
      <span className="material-symbols-outlined text-6xl text-white/30 mb-6">favorite</span>
      <h2 className="text-3xl font-bold text-white mb-4">Your wishlist is empty</h2>
      <p className="text-xl text-white/60 mb-8">Save your favorite candles for later ❤️</p>
      <a href="/ProductListing" className="px-12 py-4 rounded-full border-2 border-[#2c4724] hover:bg-[#2c4724]/50 text-white font-bold text-lg">
        Start Shopping
      </a>
    </div>
  );
}
*/


  // ✅ Backend OR localStorage remove
  const handleToggleWishlist = async (productId) => {
    try {
      if (isAuthenticated()) {
        await removeFromWishlist(productId);
      } else {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const updated = wishlist.filter(id => id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(updated));
      }
      await loadWishlist(); // Refresh
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
    }
  };



  // ✅ UNIFIED loadWishlist - works for BOTH guest & logged-in
 



  // ✅ Product Details cart popup (works for both)
// ✅ NEW (Hybrid - Backend + localStorage):
const handleAddToCart = async (product) => {
  try {
    if (isAuthenticated()) {
      // ✅ Logged-in → backend
      await addToCartAuth(product._id);
    } else {
      // ✅ Guest → localStorage (FIXED)
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find(item => item._id === product._id);

      let updated;
      if (existing) {
        updated = cart.map(item =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }  // ✅ FIXED
            : item
        );
      } else {
        updated = [...cart, { ...product, quantity: 1 }];  // ✅ FIXED
      }

      localStorage.setItem("cart", JSON.stringify(updated));
    }


// ✅ Trigger cart update
window.dispatchEvent(new Event('cartUpdated'));
    // UI popup
    setShowCartPopup(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setShowCartPopup(prev => ({ ...prev, [product._id]: false }));
    }, 2500);

  } catch (err) {
    console.error("Add to cart failed:", err);
  }
};




/*
useEffect(() => {
  if (wishlistIds.length === 0) {
    setWishlistProducts([]);
    setLoading(false);
    return;
  }

  fetchProducts({})
    .then(res => {
      const allProducts = res.data || res;
      setWishlistProducts(
        allProducts.filter(p => wishlistIds.includes(p._id))
      );
    })
    .finally(() => setLoading(false));
}, [wishlistIds]);*/


// ✅ SIMPLE - Exit loading + show empty immediately
/*if (wishlistIds.length === 0) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
      <span className="material-symbols-outlined text-6xl text-white/30 mb-6">favorite</span>
      <h2 className="text-3xl font-bold text-white mb-4">Your wishlist is empty</h2>
      <p className="text-xl text-white/60 mb-8">Save your favorite candles for later ❤️</p>
      <a href="/ProductListing" className="px-12 py-4 rounded-full border-2 border-[#2c4724] hover:bg-[#2c4724]/50 text-white font-bold text-lg">
        Start Shopping
      </a>
    </div>
  );
}*/


// ✅ HELPER - Same logic as ProductListing
const localStorageAddToCart = (product) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find(item => item._id === product._id);
  
  let updatedCart;
  if (existing) {
    updatedCart = cart.map(item => 
      item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
    );
  } else {
    updatedCart = [...cart, { ...product, quantity: 1 }];
  }
  
  localStorage.setItem('cart', JSON.stringify(updatedCart));
  console.log('✅ Added to localStorage cart');
};


// Move ALL your functions FIRST (loadWishlist, handleToggleWishlist, handleAddToCart)
// THEN add empty check:
// ✅ PROPER empty check - AFTER all functions
if (!loading && wishlistProducts.length === 0) {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">

      <Header2 />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <span className="material-symbols-outlined text-6xl text-text/30 mb-6">
          favorite
        </span>

        <h2 className="text-3xl font-bold text-text mb-4">
          Your wishlist is empty
        </h2>

        <p className="text-xl text-text/60 mb-8">
          Save your favorite candles for later ❤️
        </p>

        <button
          onClick={() => navigate("/ProductListing")}
          className="px-12 py-4 text-text rounded-full border-2 border-[#2c4724] hover:bg-[#2c4724]/30  font-bold text-lg"
        >
          Start Shopping
        </button>
      </div>

      <Footer2 />
    </div>
  );
}


// Your main return with header + products grid...




  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white antialiased">
      {/* HEADER */}
              <Header2/>


      {/* MAIN */}
      <main className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 md:px-10 py-16">
        <h1 className="text-4xl md:text-5xl font-black mb-16 text-center bg-gradient-to-r from-primary to-white/20 bg-clip-text text-transparent">
          My Wishlist ({wishlistProducts.length})
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistProducts.map((product) => (
            <div
              key={product._id}
              className="relative group cursor-pointer bg-surface-dark/50 rounded-2xl p-6 hover:shadow-2xl hover:bg-surface-dark/70 transition-all duration-300 border border-[#2c4724]/30"
              onClick={() => navigate(`/ProductDetails/${product._id}`)}
            >
              {/* Remove Heart */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleWishlist(product._id);
                }}
                className="absolute top-8 right-7 z-20 size-10 rounded-full bg-black/70 hover:bg-red-500/80 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
              >
                <span className=" material-symbols-outlined text-xl text-red-400">
                  favorite
                </span>
              </button>

              {/* Image */}
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-surface-dark mb-6">
                <img
                  src={
                    product.images?.[0] ||
                    "https://via.placeholder.com/300x400/2c4724/ffffff?text=No+Image"
                  }
                  alt={product.title || "Product Image"}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="font-bold text-xl line-clamp-2 leading-tight">
                  {product.title}
                </h3>
                <p className="text-white/60 text-sm">
                  {product.scentProfile || product.category}
                </p>

                <div className="flex items-end justify-between pt-4 border-t border-[#2c4724]/30">
                  <span className="text-3xl font-black text-primary">
                    ${product.price}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="h-14 px-8 rounded-full bg-primary text-black font-bold text-lg hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 group/cart"
                  >
                    <span className="material-symbols-outlined text-lg group-hover/cart:scale-110 transition-all">
                      shopping_cart
                    </span>
                    Add to Cart
                  </button>
                </div>

                {/* ✅ Cart Popup */}
              {/* ✅ Slim Cart Popup */}
{showCartPopup[product._id] && (
  <div className="mt-2 bg-emerald-600 text-white px-3 py-4 rounded-xl shadow-2xl text-xs flex items-center justify-between">

    <span className="text-sm font-semibold whitespace-nowrap">
      🛒 Added to Cart
    </span>

    <button
      onClick={(e) => {
        e.stopPropagation();
        navigate("/Cart");
      }}
      className="px-2 py-1 bg-white/20 rounded-xl 
      hover:bg-white/30 transition text-xs font-semibold"
    >
      View
    </button>
  </div>
)}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer2 />
    </div>
  );
}

