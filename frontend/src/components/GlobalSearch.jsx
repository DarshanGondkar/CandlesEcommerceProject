// GlobalSearch.jsx - Premium design with product suggestions
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from "../services/authService";

import ScrollReveal from './ScrollReveal';
import { motion, AnimatePresence } from "framer-motion";
export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Mock products for suggestions (replace with your actual products later)
 /* const allProducts = [
    { _id: 1, title: 'Red Candle Santal', scentProfile: 'Floral' },
    { _id: 2, title: 'Midnight Santal', scentProfile: 'Woody' },
    { _id: 3, title: 'Morning Santal', scentProfile: 'Citrus' },
    { _id: 4, title: 'Night', scentProfile: 'Fresh' },
    { _id: 5, title: 'Mosquito Repellent', scentProfile: 'mosquito repellent' },
        { _id: 6, title: 'Night Santal', scentProfile: 'Citrus' },
    { _id: 7, title: 'Church Candle', scentProfile: 'Citrus' },

  ];*/
const [allProducts, setAllProducts] = useState([]);

const searchOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const searchBox = {
  hidden: { opacity: 0, scale: 0.92, y: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.25 }
  }
};

useEffect(() => {
  const loadProducts = async () => {
    try {
      const res = await fetchProducts();
      const data = res.data || res;
      setAllProducts(data || []);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  loadProducts();
}, []);

  useEffect(() => {
    const handleSearch = (e) => {
      if (e.target.closest('#search-trigger')) {
        setIsOpen(true);
        setQuery('');
        setSuggestions([]);
      }
    };

    document.addEventListener('click', handleSearch);
    return () => document.removeEventListener('click', handleSearch);
  }, []);

  // Generate suggestions as user types
  useEffect(() => {
    if (query.length > 0) {
      const filtered = allProducts.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.scentProfile.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4); // Top 4 suggestions
      
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = () => {
    setIsOpen(false);
    if (query.trim()) {
      navigate(`/ProductListing?search=${encodeURIComponent(query)}`);
    }
  };

  const selectSuggestion = (product) => {
    setQuery(product.title);
    setIsOpen(false);
    navigate(`/ProductListing?search=${encodeURIComponent(product.title)}#sort-by`);
  };

  return (
    <>
    <AnimatePresence>

      {isOpen && (
        
      <motion.div
  variants={searchOverlay}
  initial="hidden"
  animate="visible"
  exit="exit"
  className="z-[10000] fixed inset-0 bg-black/60 backdrop-blur- flex items-center justify-center p-4"
  onClick={() => setIsOpen(false)}
>
          
          <div className="w-full max-w-2xl max-h-[95vh] flex flex-col overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Search Container */}
            <div className="bg-white/90 border-2 border-border rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 pb-4 border-b border-[#2c4724]/50">
                <div className=" relative">
{ /*new close button*/}
  <button 
    onClick={(e) => {
      e.stopPropagation();   // prevent bubbling issues
      setIsOpen(false);
    }}
    className="absolute -top-6 -right-3 z-50 text-2xl text-text/70 hover:text-text transition-colors cursor-pointer"
  >
    ×
  </button>
</div>

                
                <div className="relative mb-2">
                  <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-text/50 text-xl ml-1">
                    search
                  </span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                      if (e.key === 'Escape') {
                        setIsOpen(false);
                        setQuery('');
                      }
                    }}
                    placeholder="Search products by name or scent..."
                    autoFocus
                    className="w-full pl-10 pr-12 py-4 rounded-2xl bg-white/70 border border-white/20 text-text text-lg placeholder-text/60 focus:outline-none focus:border-[#2c4724]/70 focus:ring-2 focus:ring-[#2c4724]/30 transition-all"
                  />
                </div>
              </div>

              {/* Suggestions List */}
             {/* Action Buttons - Moved Above Suggestions */}
<div className="p-2 pt-2 border-t border-[#2c4724]/50 space-y-3">
  <button 
    onClick={handleSearch}
    className="w-full py-2 rounded-3xl bg-gradient-to-r from-white to-black hover:from-white hover:to-gray-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
    disabled={!query.trim()}
  >
    <span className="material-symbols-outlined mr-2">search</span>
    Search Products
  </button>

  {query && (
    <button 
      onClick={() => setQuery('')}
      className="w-full py-0 rounded-xl border border-text/20 hover:border-text/40 bg-text/5 hover:bg-text/10 text-gray-500 text-md font-medium transition-all"
    >
      Clear
    </button>
  )}
</div>

{/* Suggestions List - Now Below Buttons */}
<div className="max-h-72 overflow-y-auto border-t border-white/5">
  {suggestions.length > 0 ? (
    suggestions.map(product => (
      <div
        key={product._id}
        className="flex items-center gap-4 p-4 hover:bg-text/10 transition-all cursor-pointer group border-b border-white/5 last:border-b-0"
        onClick={() => selectSuggestion(product)}
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400/20 to-orange-500/20 flex items-center justify-center p-1">
          <span className="material-symbols-outlined text-orange-300 text-lg">
            local_fire_department
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-text truncate group-hover:text-primary">
            {product.title}
          </h4>
          <p className="text-text/60 text-sm">
            {product.scentProfile}
          </p>
        </div>
        <span className="material-symbols-outlined text-text/40 group-hover:text-text text-sm">
          arrow_forward_ios
        </span>
      </div>
    ))
  ) : query ? (
    <div className="p-8 text-center">
      <span className="material-symbols-outlined text-4xl text-text/30 mb-2 block">
        search_off
      </span>
      <p className="text-text/50 text-sm">
        No products found for "{query}"
      </p>
    </div>
  ) : null}
</div>

            </div>
          </div>
      </motion.div>
      )}
  </AnimatePresence>  </>
  );
}
