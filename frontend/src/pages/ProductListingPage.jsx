
//productlisting
import Footer from "./Footer";
// CHANGE BACK TO:
import { useEffect, useState, useCallback,useRef } from "react";
import { fetchProducts } from "../services/authService";
import { Link, useNavigate, useSearchParams } from "react-router-dom"; 
import { isAuthenticated } from "../utils/auth"; // ✅ Add this
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from "../services/authService";
import {  useMemo } from 'react';
import Header from "./Header"; 
import { useGlobalSearch } from '../context/SearchContext';
import { useLocation } from "react-router-dom";
import ScrollReveal from "../components/ScrollReveal";
import { AnimatePresence,motion } from "framer-motion";

export default function ProductListingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [products, setProducts] = useState([]);

  const [originalProducts, setOriginalProducts] = useState([]);
  const [sort, setSort] = useState("featured");
  const [priceRange, setPriceRange] = useState(150);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedScentProfiles, setSelectedScentProfiles] = useState([]);
const [isMosquitoRepellent, setIsMosquitoRepellent] = useState(false);  // ← ADD THIS LINE

  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
const [showWishlistPopup, setShowWishlistPopup] = useState({});
const [showCartPopup, setShowCartPopup] = useState({});
const [searchParams, setSearchParams] = useSearchParams();
  const [wishlistIds, setWishlistIds] = useState([]); // ✅ NEW STATE

const [searchQuery, setSearchQuery] = useState("");
const [isSearchOpen, setIsSearchOpen] = useState(false);
//const { searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen } = useGlobalSearch();
const [open, setOpen] = useState(false);
const [visibleCount, setVisibleCount] = useState(6);
const [showTopBtn, setShowTopBtn] = useState(false);
const productsRef = useRef(null);

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

  const location = useLocation();

// Add this useEffect after your existing useEffects:
// REPLACE entire filteredProducts block with:
// ✅ KEEP YOUR ORIGINAL - Just add safety:
const filteredProducts = useMemo(() => {
  return (originalProducts || []).filter(product => {
    const priceMatch = !product.price || product.price <= priceRange;
    const sizeMatch = selectedSizes.length === 0 || selectedSizes.includes(product.size);
    const scentMatch = selectedScentProfiles.length === 0 || selectedScentProfiles.includes(product.scentProfile);
    
    // ✅ FIXED MOSQUITO FILTER - More comprehensive
    const mosquitoMatch = !isMosquitoRepellent || 
      product.title?.toLowerCase().includes('mosquito') ||
      product.scentProfile?.toLowerCase().includes('citronella') ||
      product.scentProfile?.toLowerCase().includes('lemongrass') ||
      product.category?.toLowerCase().includes('mosquito') ||
      product.isMosquitoRepellent === true;

    const searchMatch = !searchQuery || 
      product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.scentProfile?.toLowerCase().includes(searchQuery.toLowerCase());

    return priceMatch && sizeMatch && scentMatch && mosquitoMatch && searchMatch;
  });
}, [originalProducts, priceRange, selectedSizes, selectedScentProfiles, isMosquitoRepellent, searchQuery]);


const sortedProducts = useMemo(() => {
  const productsToSort = [...filteredProducts];
  
  switch (sort) {
    case 'newest':
      return productsToSort.sort((a, b) => new Date(b.createdAt || '2026-01-01') - new Date(a.createdAt || '2026-01-01'));
    case 'price_asc':
      return productsToSort.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
    case 'price_desc':
      return productsToSort.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
    default:
      return productsToSort;
  }
}, [filteredProducts, sort]); // ✅ filteredProducts includes searchQuery now

useEffect(() => {
  const container = productsRef.current;
  if (!container) return;

  const handleScroll = () => {
    setShowTopBtn(container.scrollTop > 50); // appear almost immediately
  };

  container.addEventListener("scroll", handleScroll);
  return () => container.removeEventListener("scroll", handleScroll);
}, []);


useEffect(() => {
  const handleSearchClick = () => {
    setIsSearchOpen(true);
    setSearchQuery("");
  };

  document.addEventListener('click', function(e) {
    if (e.target.closest('#search-trigger')) {
      handleSearchClick();
    }
  });

  return () => {
    document.removeEventListener('click', handleSearchClick);
  };
}, []);

  // Fetch products
  // Fetch products + URL FILTER
// ✅ FIXED fetchProducts - Wait for DOM + retry logic
useEffect(() => {
  const fetchData = async () => {
    try {
      console.log('🔄 Fetching products...');
      const res = await fetchProducts();
      const productsData = res.data || res;
      console.log('✅ Products loaded:', productsData?.length);
      
      // ✅ CRITICAL: Set BOTH products arrays
      setProducts(productsData || []);
      setOriginalProducts(productsData || []);
    } catch (err) {
      console.error('💥 fetchProducts FAILED:', err);
      // Retry once after 2 seconds
      setTimeout(fetchData, 2000);
    }
  };
  
  // Wait for DOM + Header to load
  const timer = setTimeout(fetchData, 100);
  return () => clearTimeout(timer);
}, []); // ✅ Empty deps - fetch ONCE on mount
// ✅ Empty dependency array - fetch ONCE

 useEffect(() => {
    // Scroll to hash section if present
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [location]);



// ✅ NEW - Load wishlist IDs on mount
  useEffect(() => {
    loadWishlist();
  }, []);

  //master refresh reset
  
  // Filter products
 // Filter products


// ✅ FIXED - Add try/catch to useEffect
useEffect(() => {
  const loadWishlistData = async () => {
    try {
      if (isAuthenticated()) {
        const wishlist = await getWishlist();
        const ids = wishlist.map(p => p._id ? p._id : p);
        setWishlistIds(ids);
      } else {
        const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlistIds(saved);
      }
    } catch (err) {
      console.error("Load wishlist failed", err);
      setWishlistIds([]);
    }
  };

  loadWishlistData();
}, []);

// ✅ AUTO-CHECK from URL ?mosquito=true
// ✅ SINGLE useEffect - Perfect behavior
// ✅ ONE useEffect controls ALL initial state
useEffect(() => {
  console.log('🎯 INITIALIZING FILTERS...');
  
  const urlParams = new URLSearchParams(window.location.search);
  const hasMosquitoParam = urlParams.get('mosquito') === 'true';
  
  console.log('URL has mosquito?', hasMosquitoParam);
  
  if (hasMosquitoParam) {
    // From homepage - keep mosquito filter
    console.log('✅ Homepage navigation - keeping mosquito filter');
    setIsMosquitoRepellent(true);
    window.history.replaceState({}, document.title, window.location.pathname);
  } else {
    // Direct access/refresh - reset everything
    console.log('✅ Direct access/refresh - full reset');
    setPriceRange(150);
    setSelectedSizes([]);
    setSelectedScentProfiles([]);
    setIsMosquitoRepellent(false);
    setSearchQuery("");
    setSort("featured");
  }
}, []); // ONLY ONCE on mount

useEffect(() => {
    console.log('🔍 URL mosquito param:', searchParams.get('mosquito'));
    
    if (searchParams.get('mosquito') === 'true') {
      console.log('✅ Homepage → Mosquito ON');
      setIsMosquitoRepellent(true);
      // Clear URL after reading
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      console.log('✅ Direct/Refresh → Full reset');
      setPriceRange(150);
      setSelectedSizes([]);
      setSelectedScentProfiles([]);
      setIsMosquitoRepellent(false);
      setSearchQuery("");
      setSort("featured");
    }
  }, [searchParams]); // ✅ Reacts to URL changes

  useEffect(() => {
  const searchFromUrl = searchParams.get('search');
  if (searchFromUrl) {
    setSearchQuery(decodeURIComponent(searchFromUrl));
    // Clear URL after reading
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}, [searchParams]);

useEffect(() => {
  const sortFromUrl = searchParams.get("sort");

  if (sortFromUrl === "newest") {
    setSort("newest");
  }

}, [searchParams]);

// Listen for search icon clicks globally
useEffect(() => {
  const handleSearchTrigger = () => {
    setIsSearchOpen(true);
    setSearchQuery("");
  };

  const searchButton = document.getElementById('search-trigger');
  if (searchButton) {
    searchButton.addEventListener('click', handleSearchTrigger);
  }

  return () => {
    if (searchButton) {
      searchButton.removeEventListener('click', handleSearchTrigger);
    }
  };
}, []);


  // Add to wishlist
// Toggle wishlist (ADD/REMOVE + Popup) ✅ NEW
const toggleWishlist = useCallback(async (productId) => {
  try {
    const product = products.find(p => p._id === productId);
    
    if (isAuthenticated()) {
      // Backend - Logged in user
      let updated;
      if (wishlistIds.includes(productId)) {
        updated = await removeFromWishlist(productId);
      } else {
        updated = await addToWishlist(product);
      }
      const ids = updated.map(p => p._id ? p._id : p);
      setWishlistIds(ids);
    } else {
      // LocalStorage - Guest user
      const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const isInWishlist = saved.includes(productId);
      let newWishlist;
      if (isInWishlist) {
        newWishlist = saved.filter(id => id !== productId);
      } else {
        newWishlist = [...saved, productId];
      }
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      setWishlistIds(newWishlist);
    }

    // ✅ Trigger wishlist update
window.dispatchEvent(new Event('wishlistUpdated'));
    // Your popups
    setShowWishlistPopup(prev => ({
      ...prev,
      [productId]: wishlistIds.includes(productId) ? 'removed' : 'added'
    }));
    setTimeout(() => {
      setShowWishlistPopup(prev => ({ ...prev, [productId]: false }));
    }, 2500);
  } catch (error) {
    console.error("Toggle failed:", error);
  }
}, [wishlistIds, products]);

useEffect(() => {
  setVisibleCount(6);
}, [priceRange, selectedSizes, selectedScentProfiles, isMosquitoRepellent, searchQuery, sort]);




  // Add to cart
  // Add to cart ✅ FIXED
const addToCart = useCallback((productId) => {
  const product = products.find(p => p._id === productId);
  setCart(prev => {
    const existing = prev.find(item => item._id === productId);
    let newCart;
    if (existing) {
      newCart = prev.map(item => 
        item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...prev, { ...product, quantity: 1 }];
    }
    
    localStorage.setItem('cart', JSON.stringify(newCart));
    setShowCartPopup(prev => ({ ...prev, [productId]: true }));
    
    setTimeout(() => {
      setShowCartPopup(prev => ({ ...prev, [productId]: false }));
    }, 2500);
    
    return newCart;
  });
}, [products]);



  // Load from localStorage on mount
useEffect(() => {
  const savedWishlist = localStorage.getItem('wishlist');
  const savedCart = localStorage.getItem('cart');
  if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  if (savedCart) setCart(JSON.parse(savedCart));
}, []);


  // Reset filters
  const resetFilters = () => {
  setPriceRange(150);
  setSelectedSizes([]);
  setSelectedScentProfiles([]);
  setIsMosquitoRepellent(false);
  setSearchQuery("");
  setSort("featured"); // Reset sort too
};



  // View product details
  const viewProductDetails = (productId) => {
    navigate(`/ProductDetails/${productId}`);
  };


  // ✅ NEW FUNCTION - Load wishlist from backend/localStorage
  const loadWishlist = async () => {
    try {
      if (isAuthenticated()) {
        const wishlist = await getWishlist();
        const ids = wishlist.map(p => p._id ? p._id : p);
        setWishlistIds(ids);
      } else {
        const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlistIds(saved);
      }
    } catch (err) {
      console.error("Load wishlist failed", err);
    }
  };

useEffect(() => {
  const scentFromUrl = searchParams.get("scent");

  if (scentFromUrl) {
    const formatted = scentFromUrl.charAt(0).toUpperCase() + scentFromUrl.slice(1);
    setSelectedScentProfiles([formatted]);

    // Clear URL after applying filter
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}, [searchParams]);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white antialiased">




{/* HEADER*/}
      <div className="sticky top-0 z-50 w-full bg-background backdrop-blur-md border-b border-border pb-2 md:pb-0">
         <Header /> 
{/* 🔍 SEARCH OVERLAY */}  


        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#2c4724] bg-[#152211] px-6 py-6 space-y-4">
            <a href="/ProductListing" className="block font-semibold hover:text-primary">Collections</a>
            <a className="block font-semibold hover:text-primary">Journal</a>
            <a href="/AboutUs" className="block font-semibold hover:text-primary">About</a>
            <a className="block font-semibold hover:text-primary">Contact</a>
          </div>
        )}
      </div>

{/* GLOBAL SEARCH OVERLAY - Works everywhere */}
    
 
     {/* HERO (UNCHANGED) */}

 <ScrollReveal direction="zoom"> 

      <div className="px-4 sm:px-6 md:px-10 pt-6">
        <div
          className="min-h-[320px] md:min-h-[420px] rounded-xl bg-cover bg-center flex flex-col items-center justify-center text-center px-6"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 238, 188, 0.95), rgba(41, 41, 40, 0.89)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCQBjSNufFHq_xLsOu4fTnTWnLxqxemgTGnEBYpG9ZUiq6wqDVO-zhNkhaQdKS4dlgumN8S5etaxE3JYfgys1jMPVpOxqq8CLoDwfvyc-o3T1D2J_evf5fRyo4SOb5t4qef51wWbvTWyW1L4Qby5Uiaw5tdN6v3r5Hr81E2TZKmVqbBJynXpJaT1IFcCAkSP6pfZHseWV2AdS1uogva2znsOQChEXoF6vGTyQAemb3mNvfjQkUL-NMeDL_ZyqxNtTEQFhl_641dz6Po')",
          }}
        >
          <span className="text-gray-500 text-xl  tracking-[0.3em] uppercase">Premium Collection</span>
          <h1 className="text-4xl md:text-6xl font-light mt-3 text-white/90">
            Hand-poured Soy & <br />
            <span className="font-bold italic">Coco Wax Candles</span>
          </h1>
          <p className="mt-2 text-white/80 max-w-lg">
            Sustainable scents crafted for the modern home.
          </p>
        </div>
      </div>
</ScrollReveal>

      {/* MOBILE FILTER DRAWER (FULLY FUNCTIONAL) */}
<AnimatePresence>
      {filterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setFilterOpen(false)}
          />


<motion.div
  initial={{ y: "100%" }}
  animate={{ y: 0 }}
  exit={{ y: "100%" }}
  transition={{ duration: 0.35, ease: "easeOut" }}
  className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-background p-6"
>            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Filters</h3>
              <button
                onClick={() => setFilterOpen(false)}
                className="h-10 w-10 rounded-full bg-[#2c4724]/50 flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>


            <div className="space-y-8">
              {/* Price Range */}
              <div>
                <span className="text-sm font-semibold">Price Range</span>
                <input 
                  type="range" 
                  min="20" 
                  max="150" 
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-primary mt-3" 
                />
                <div className="flex justify-between text-xs text-text/60 mt-2">
              <span className=" text-sm">$20</span>
<span className="font-bold text-primary text-sm">${priceRange}</span>
            </div>
              </div>


              <div className="border-b border-[#2c4724]" />


              {/* Size */}
              <div>
                <span className="text-sm font-semibold">Size</span>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {["8oz", "12oz", "16oz"].map(s => (
                    <button
                      key={s}
                      className={`px-3 py-1.5 rounded-full text-xs border-2 transition-all ${
                        selectedSizes.includes(s)
                          ? "border-primary bg-primary text-black font-semibold"
                          : "border-[#2c4724] md:hover:bg-primary md:hover:text-black  "
                      }`}
                      onClick={() => {
                        setSelectedSizes(prev => 
                          prev.includes(s) ? prev.filter(size => size !== s) : [...prev, s]
                        );
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>


              <div className="border-b border-[#2c4724]" />


              {/* Scent Profile */}
              <div>
                <span className="text-sm font-semibold">Scent Profile</span>
                {["Woody", "Floral", "Fresh", "Citrus"].map(s => (
                  <label key={s} className="flex gap-3 mt-2 text-sm items-center">
                    <input 
                      type="checkbox"
                      checked={selectedScentProfiles.includes(s)}
                      onChange={() => {
                        setSelectedScentProfiles(prev => 
                          prev.includes(s) ? prev.filter(scent => scent !== s) : [...prev, s]
                        );
                      }}
                      className="w-4 h-4 accent-primary"
                    />
                    {s}
                  </label>
                ))}
              </div>


              <div className="border-b border-[#2c4724]" />


              {/* Mosquito Repellent */}
              <label className="flex gap-3 text-sm items-center">
             <input 
  type="checkbox"
  checked={isMosquitoRepellent}  // ✅ Controlled
  onChange={(e) => setIsMosquitoRepellent(e.target.checked)}
  className="w-4 h-4 accent-primary"
/>



                Mosquito Repellent
              </label>


              {/* Actions */}
              <div className="flex gap-4 pt-6">
                <button 
                  onClick={resetFilters}
                  className="flex-1 rounded-full border border-[#2c4724] py-3 font-semibold hover:bg-[#2c4724]/50"
                >
                  Reset
                </button>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="flex-1 rounded-full bg-primary py-3 font-semibold text-black"
                >
Apply ({(sortedProducts || []).length})
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
</AnimatePresence>


      {/* MAIN (KEEPING YOUR EXACT DESIGN) */}
      <main className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 md:px-10 py-10 flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setFilterOpen(true)}
          className="md:hidden w-full rounded-full border border-[#2c4724] py-3 font-semibold mb-4"
        >
          Filters
        </button>


        {/* Filters (Desktop - FULLY FUNCTIONAL) */}
        <aside className="hidden md:block w-64 space-y-8 sticky top-24 h-fit">
          <div className="flex justify-between">
            <h3 className="font-bold">Filters</h3>
            <button 
              onClick={resetFilters}
              className="text-primary text-xs font-bold hover:underline"
            >
              Reset All
            </button>
          </div>


          {/* Price Range */}
          <div>
            <span className="text-sm font-semibold">Price Range</span>
            <input 
              type="range" 
              min="20" 
              max="150" 
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-primary mt-3" 
            />
            <div className="flex justify-between text-xs text-text/60 mt-2">
              <span className=" text-sm">$20</span>
<span className="font-bold text-primary text-sm">${priceRange}</span>
            </div>
          </div>


          <div className="border-b border-[#2c4724]" />


          {/* Size */}
          <div>
            <span className="text-sm font-semibold">Size</span>
            <div className="flex gap-2 mt-2 flex-wrap">
              {["8oz", "12oz", "16oz"].map(s => (
                <button
                  key={s}
                  className={`px-3 py-1.5 rounded-full text-xs border-2 transition-all ${
                    selectedSizes.includes(s)
                      ? "border-primary bg-primary text-black font-semibold"
                      : "border-[#2c4724] hover:bg-primary hover:text-black"
                  }`}
                  onClick={() => {
                    setSelectedSizes(prev => 
                      prev.includes(s) ? prev.filter(size => size !== s) : [...prev, s]
                    );
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>


          <div className="border-b border-[#2c4724]" />


          {/* Scent Profile */}
          <div>
            <span className="text-sm font-semibold">Scent Profile</span>
            {["Woody", "Floral", "Fresh", "Citrus"].map(s => (
              <label key={s} className="flex gap-3 mt-2 text-sm items-center">
                <input 
                  type="checkbox"
                  checked={selectedScentProfiles.includes(s)}
                  onChange={() => {
                    setSelectedScentProfiles(prev => 
                      prev.includes(s) ? prev.filter(scent => scent !== s) : [...prev, s]
                    );
                  }}
                  className="w-4 h-4 accent-primary"
                />
                {s}
              </label>
            ))}
          </div>


          <div className="border-b border-[#2c4724]" />


          <label className="flex gap-3 text-sm items-center">
            <input 
              type="checkbox"
              checked={isMosquitoRepellent}
// REPLACE both checkbox onChange handlers with:
onChange={(e) => {
  setIsMosquitoRepellent(e.target.checked);
  setSearchParams(e.target.checked ? { mosquito: 'true' } : {});
}}
              className="w-4 h-4 accent-primary"
            />
            Mosquito Repellent
          </label>
        </aside>


        {/* Products */}
<section id="sort-by" className="flex-1 flex flex-col">

          {/* Top Bar */}
  {/* Top Bar - WITH CLEAR BUTTON */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
  <div className="flex items-center gap-3">
    <p className="text-sm text-primary">
      Showing <span className="font-bold text-primary">{sortedProducts.length}</span> of {(originalProducts || []).length} products
    </p>
    
    {/* ✅ CLEAR BUTTON NEXT TO RESULTS */}
    {(sortedProducts.length !== originalProducts.length || searchQuery || selectedSizes.length || selectedScentProfiles.length || isMosquitoRepellent || sort !== "featured") && (
      <button
        onClick={() => {
          setSearchQuery("");
          setPriceRange(150);
          setSelectedSizes([]);
          setSelectedScentProfiles([]);
          setIsMosquitoRepellent(false);
            setSort("featured"); // ✅ ADD THIS

        }}
        className="ml-4 px-4 py-2 bg-red-500/5 md:hover:bg-red-500/10 border border-red-500/50 text-red-400 hover:text-red-300 text-xs font-semibold rounded-full transition-all"
      >
        Clear All Filters
      </button>
    )}
  </div>

  <div  className=" relative w-60">
  <div className="flex items-center gap-3">
    <span  className="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
      Sort by
    </span>

    <button
      onClick={() => setOpen(!open)}
      className="
        w-full
        flex items-center justify-between
        bg-white dark:bg-[#1E1E1E]
        border border-gray-300 dark:border-[#2c4724]
        rounded-2xl
        px-4 py-2
        text-sm font-medium
        shadow-sm
        hover:border-primary
        focus:outline-none focus:ring-2 focus:ring-primary
        transition-all
      "
    >
      {sortOptions.find(o => o.value === sort)?.label}
<span
  className={`
    transition-transform duration-200 ease-in-out
    ${open ? "rotate-180" : ""}
  `}
>
  <svg
    className="w-4 h-4 text-gray-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
</span>
    </button>
  </div>

  {open && (
    <div className="
      absolute mt-2 w-full
      bg-white dark:bg-[#1E1E1E]
      border border-gray-200 dark:border-white/10
      rounded-2xl
      shadow-lg
      overflow-hidden
      z-50
    ">
      {sortOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => {
            setSort(option.value);
            setOpen(false);
          }}
          className={`
            w-full text-left px-4 py-3 text-sm
            transition-colors
            hover:bg-gray-100 dark:hover:bg-white/5
            ${sort === option.value ? "bg-gray-100 dark:bg-white/5 font-semibold" : ""}
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  )}
</div>

</div>
 

             
      


      {/* Products Grid (COMPLETE + FUNCTIONAL) */}
<div
  ref={productsRef}
  className="flex-1 max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#2c4724]  no-scrollbar"
>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
{sortedProducts.slice(0, visibleCount).map(product => (
    <div key={product._id} className="relative group">
      {/* Badges */}
      {product.badge && (
        <span className={`absolute top-3 left-3 z-10 px-3 py-1 text-xs font-bold rounded-full
          ${product.badge === "Best Seller" ? "bg-[#c9a24d] text-black" : "bg-primary text-black"}`}>
          {product.badge}
        </span>
      )}



      {/* Wishlist Heart - TOGGLE FUNCTION */}
      <button 
        className="absolute top-3 right-3 z-20 size-9 rounded-full bg-black/60 md:hover:bg-primary/80 flex items-center justify-center transition-all duration-200 hover:scale-110"
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product._id);
        }}
      >
        <span className={`material-symbols-outlined text-sm transition-all ${
wishlistIds.includes(product._id) ? "text-red-400 text-base" : "text-white/70 hover:text-white"        }`}>
          favorite
        </span>
      </button>


      {/* Wishlist Success Popup - ADD */}
      {showWishlistPopup[product._id] === 'added' && (
        <div className="absolute top-14 right-0 bg-gradient-to-r from-green-500 to-green-600/95 backdrop-blur-md text-white px-4 py-2.5 rounded-xl shadow-2xl z-30 border border-green-400/30 animate-">
          <div className="flex items-center justify-between gap-2 text-xs font-semibold">
            <span> ❤ Added to Wishlist!</span>
            <button 
              onClick={() => navigate('/Wishlist')} 
              className="px-2 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-all text-xs"
            >
              View
            </button>
          </div>
        </div>
      )}


      {/* Wishlist Remove Popup */}
      {showWishlistPopup[product._id] === 'removed' && (
        <div className="absolute top-14 right-0 bg-gradient-to-r from-orange-500 to-orange-600/95 backdrop-blur-md text-white px-4 py-2.5 rounded-xl shadow-2xl z-30 border border-orange-400/30 animate-bounce">
          <div className="flex items-center text-xs  font-semibold">
            <span>💔 Removed from Wishlist</span>
          </div>
        </div>
      )}


      {/* Product Image - CLICKABLE */}
      <div 
        className="aspect-[4/5] overflow-hidden rounded-2xl bg-surface-dark cursor-pointer"
        onClick={() => viewProductDetails(product._id)}
      >
        <img
          src={product.images?.[0] || "https://via.placeholder.com/300x400/2c4724/ffffff?text=No+Image"}
          alt={product.title}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>


      {/* Product Title - CLICKABLE */}
      <h3 
        className="mt-3 text-lg font-bold cursor-pointer hover:text-primary transition-colors"
        onClick={() => viewProductDetails(product._id)}
      >
        {product.title}
      </h3>


      {/* Product Info */}
      <div className="flex justify-between items-center text-sm mt-1">
        <span className="text-text/70">{product.scentProfile || 'Unspecified'}</span>
        <span className="font-semibold text-lg">${product.price}</span>
      </div>


      {/* Add to Cart Button *
      <button
        onClick={(e) => {
          e.stopPropagation();
          addToCart(product._id);
        }}
        className="mt-4 w-full rounded-full bg-primary py-3 font-semibold text-black hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 group/cart"
      >
        <span className="material-symbols-outlined text-sm group-hover/cart:scale-110">shopping_cart</span>
        Add to Cart
      </button>


      {/* Cart Success Popup *
      {showCartPopup[product._id] && (
        <div className="mt-2 bg-gradient-to-r from-emerald-500 to-teal-600/95 backdrop-blur-md text-white px-4 py-2.5 rounded-xl shadow-2xl z-30 border border-emerald-400/30 animate-bounce mx-auto w-full">
          <div className="flex items-center justify-between gap-2 text-xs font-semibold">
            <span>🛒 Added to Cart!</span>
            <button 
              onClick={() => navigate('/Cart')} 
              className="px-2 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-all text-xs"
            >
              View
            </button>
          </div>
        </div>
      )}*/}
          </div>
  ))}
</div>



          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-text/30 mb-4 block">search_off</span>
              <p className="text-text/50 text-lg">No products found..🕯</p>
              <button 
                onClick={resetFilters}
                className="mt-4 px-8 py-3 rounded-full border border-[#2c4724] hover:bg-[#2c4724]/40 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}


          {/* Load More */}
        {visibleCount < sortedProducts.length && (
  <div className="mt-16 flex justify-center">
    <button
      onClick={() => setVisibleCount(prev => prev + 6)}
      className="rounded-full border border-[#2c4724] px-10 py-3 font-bold hover:bg-primary hover:text-black transition-all duration-200"
    >
      Load More Products
    </button>
  </div>
  
)}
</div>
        </section>
      </main>

{showTopBtn && (
  <button
    onClick={() =>productsRef.current?.scrollTo({ top: 0, behavior: "smooth" })
}
    className="fixed bottom-6 right-6 z-50 bg-primary text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all"
  >
    ↑
  </button>
)}

      <Footer />
    </div>
  );
}