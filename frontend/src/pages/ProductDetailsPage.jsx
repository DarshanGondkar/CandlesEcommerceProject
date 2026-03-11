import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById, getCart } from "../services/authService";
//import { getWishlist, saveWishlist, getCart, saveCart } from "../utils/storage";
import Footer from "./Footer";
import { isAuthenticated } from "../utils/auth";

import {addToWishlist,getWishlist, removeFromWishlist, 
} from "../services/authService"; // or authService if merged
import { addToCart} from "../services/authService";
import { addToCartAuth } from "../services/authService"; // for logged-in users
import Header from "./Header";


export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  //const [wishlist, setWishlist] = useState(getWishlist());
  const [showWishlistPopup, setShowWishlistPopup] = useState(null);
  const [showCartPopup, setShowCartPopup] = useState(false);
const [wishlist, setWishlist] = useState([]);
const [cartItems, setCartItems] = useState([]);

const getImageUrl = (product) => {
  const image = product?.images?.[0];

  if (!image) {
    return "/fallback.png"; // put this in public/
  }

  return image.startsWith("http")
    ? image
    : `http://localhost:5000/${image}`;
};
useEffect(() => {
  const loadWishlist = async () => {
    try {
      if (isAuthenticated()) {
        // 🔐 LOGGED-IN → Backend
        const data = await getWishlist();
        const ids = data.map(item => typeof item === "string" ? item : item._id);
        setWishlist(ids);
      } else {
        // 👤 GUEST → localStorage
        const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlist(saved);
      }
    } catch (err) {
      console.error("Wishlist load failed", err);
      setWishlist([]);
    }
  };

  loadWishlist();
}, []);






  useEffect(() => {
    fetchProductById(id)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

 useEffect(() => {
  const loadCart = async () => {
    setLoading(true);
    try {
      let data = [];
      
      if (isAuthenticated()) {
        const res = await getCart();
        data = res.map((item) => ({
          _id: item._id,
          name: item.product?.title || item.product?.name || "Product",
          image: item.product?.images?.[0] || item.product?.image,
          price: parseFloat(item.product?.price || item.price || 0),
          quantity: item.quantity || 1,
          // Keep full product for Cart compatibility
          title: item.product?.title,
          images: item.product?.images,
          description: item.product?.description
        }));
      } else {
        data = JSON.parse(localStorage.getItem("cart") || "[]");
      }

      // ✅ SMART NORMALIZATION - works for Cart + Payment
      const normalized = data.map(item => ({
        _id: item._id || item.id,
        name: item.name || item.title || "Product",
        image: item.image || item.images?.[0],
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity || 1),
        // Preserve full data for Cart
        ...(item.title && { title: item.title }),
        ...(item.images && { images: item.images }),
        ...(item.description && { description: item.description })
      })).filter(item => item.name && item.price > 0);

      console.log("🛒 PAYMENT CART:", normalized);
      setCartItems(normalized);
    } catch (err) {
      console.error("Cart load failed:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };
  loadCart();
}, []);

useEffect(() => {
  if (product?._id) {
    localStorage.setItem("recentProduct", product._id);
    console.log("Saved recent:", product._id);
  }
}, [product]);


  /* ---------------- WISHLIST ---------------- */
 /* ---------------- FIXED WISHLIST ---------------- */
const toggleWishlist = async (productId) => {
  try {
    let updated;
    let status;

    if (wishlist.includes(productId)) {
      // ❌ REMOVE from wishlist
      if (isAuthenticated()) {
        // 🔐 LOGGED-IN → Backend remove
        await removeFromWishlist(productId);
      } else {
        // 👤 GUEST → localStorage remove
        const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
        updated = saved.filter(id => id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(updated));
      }
      status = "removed";
      window.dispatchEvent(new Event('wishlistUpdated'));
    } else {
      // ✅ ADD to wishlist
      if (isAuthenticated()) {
        // 🔐 LOGGED-IN → Backend add
        await addToWishlist(product);
      } else {
        // 👤 GUEST → localStorage add
        const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const newWishlist = [...saved, productId];
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        updated = newWishlist;
      }
      status = "added";
      window.dispatchEvent(new Event('wishlistUpdated'));
    }

    // Update state
    setWishlist(prev => 
      status === "added" 
        ? [...prev, productId]
        : prev.filter(id => id !== productId)
    );

    setShowWishlistPopup(status);
    setTimeout(() => setShowWishlistPopup(null), 2000);
  } catch (err) {
    console.error("Wishlist toggle failed:", err);
  }
};


/*const addToCartHandler = async () => {
  try {
    await addToCartAuth(product._id, 1);
    alert("Added to cart");
  } catch (err) {
    console.error("Add to cart failed", err);
  }
};*/
  /* ---------------- CART ---------------- */
const addToCartHandler = async () => {
  try {
    if (isAuthenticated()) {
      await addToCartAuth(product._id, quantity);
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find((i) => i._id === product._id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        // ✅ KEEP FULL PRODUCT DATA for Cart page
        const cartItem = { ...product, quantity };
        cart.push(cartItem);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    window.dispatchEvent(new Event('cartUpdated'));  // ✅ ADD THIS LINE

    setShowCartPopup(true);
    setTimeout(() => setShowCartPopup(false), 2000);
  } catch (err) {
    console.error("Add to cart failed", err);
  }
};





 /* if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="animate-pulse text-primary text-xl">
          Loading product…🕯
        </span>
      </div>
    );
  }*/

 /* if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Product not found</p>
      </div>
    );
  }*/
 if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="animate-pulse text-primary text-xl">

        </span>
      </div>
    );
  }

  // ✅ ADD THIS FUNCTION - exactly like addToCartHandler but goes to checkout
const handleBuyNow = async () => {
  try {
    // ✅ NO CART ADDITION - Direct to checkout with single product
    const singleItem = {
      _id: product._id,
      name: product.title,
      image: product.images?.[0],
      price: parseFloat(product.price),
      quantity
    };
    
    // Save directly as "currentOrder" - bypass cart completely
    localStorage.setItem("currentOrder", JSON.stringify({
      id: Date.now(),
      items: [singleItem],
      customer: { newsletter: true },
      shippingMethod: "standard",
      subtotal: singleItem.price * quantity,
      shippingCost: 5,
      discountAmount: 0,
      total: singleItem.price * quantity + 5,
      status: "pending",
      orderDate: new Date().toISOString()
    }));
    
    navigate("/PaymentCustomerInfo");
  } catch (err) {
    console.error("Buy Now failed", err);
    alert("Something went wrong");
  }
};




  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white antialiased">

      {/* HEADER (SAME AS LISTING PAGE) */}
     <div className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-[#2c4724] pb-1 md:pb-0">
       <Header/> {/*  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-40">
       <Header/>    {/* <header className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <button className="md:hidden h-10 w-10 rounded-full bg-[#2c4724]/50 flex items-center justify-center">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <a href="/" className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-3xl">
                  local_fire_department
                </span>
                <h2 className="text-xl font-extrabold tracking-wide relative group">
                  LUMINA
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary transition-all duration-500 group-hover:w-full" />
                </h2>
              </a>
            </div>
            <nav className="hidden md:flex gap-10 text-sm font-semibold text-white/80">
              <a href="/ProductListing" className="text-primary border-b-2 border-primary pb-1">Collections</a>
              <a className="hover:text-primary">Journal</a>
              <a href="/AboutUS" className="hover:text-primary">About</a>
              <a className="hover:text-primary">Contact Us</a>
            </nav>
            <div className="flex items-center gap-1">
              {["search", "favorite", "shopping_cart", "account_circle"].map(icon => {
                let href = "#";
                if (icon === "favorite") href = "/Wishlist";
                if (icon === "shopping_cart") href = "/Cart";
                return (
                  <a key={icon} href={href} className="h-10 w-10 rounded-full bg-[#2c4724]/50 hover:bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">{icon}</span>
                  </a>
                );
              })}
            </div>
          </header> /}
        </div> */}
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 md:px-10 py-10 flex flex-col lg:flex-row gap-4 lg:gap-12">
        
        {/* IMAGE SECTION */}
      <div className="lg:w-1/2">

  {/* MOBILE Breadcrumb */}
  <nav className="lg:hidden text-xs uppercase tracking-[0.3em] text-text/60 mb-6 px-1">
     Collections / <span className="text-primary">Product details</span>
  </nav>

  {/* Image Wrapper MUST be relative */}
  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-surface-dark">

    {/* Wishlist Heart */}
    <button
      onClick={() => toggleWishlist(product._id)}
      className="absolute top-4 right-4 z-20 size-12 rounded-full bg-black/60 
                 flex items-center justify-center 
                 transition-all duration-200 hover:scale-110"
    >
      <span
        className={`material-symbols-outlined text-lg transition-all ${
          wishlist.includes(product._id)
            ? "text-red-400 text-xl"
            : "text-white/70 hover:text-white"
        }`}
      >
        favorite
      </span>
    </button>

    {/* Added Popup */}
    {showWishlistPopup === "added" && (
      <div className="absolute top-20 right-4 z-30 
                      bg-gradient-to-r from-green-500 to-green-600/95 
                      text-white px-5 py-3 rounded-xl shadow-2xl 
                      border border-green-400/30 animate-fade-in">
        <div className="flex items-center gap-3 text-sm font-semibold">
          <span>❤ Added to Wishlist!</span>
          <button
            onClick={() => navigate("/Wishlist")}
            className="px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 text-xs"
          >
            View
          </button>
        </div>
      </div>
    )}

    {/* Removed Popup */}
    {showWishlistPopup === "removed" && (
      <div className="absolute top-20 right-4 z-30 
                      bg-gradient-to-r from-orange-500 to-orange-600/95 
                      text-white px-5 py-3 rounded-xl shadow-2xl 
                      border border-orange-400/30 animate-bounce">
        <span className="text-sm font-semibold ">
          💔 Removed from Wishlist
        </span>
      </div>
    )}

    {/* Main Image */}
    <img
      src={product.images?.[0] || "/no-image.png"}
      alt={product.title}
      className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
    />

  </div>

  {/* Thumbnails */}
  {product.images?.length > 1 && (
    <div className="grid grid-cols-4 gap-3 mt-6">
      {product.images.slice(0, 4).map((img, i) => (
        <div key={i} className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all">
          <img src={img} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  )}

</div>

        {/* PRODUCT INFO */}
        <div className="lg:w-1/2 space-y-8">
          {/* Breadcrumb */}
      {/* DESKTOP Breadcrumb */}
<nav className="hidden lg:block text-xs uppercase tracking-[0.3em] text-text/60">
  Home / Collections / <span className="text-primary">Product details</span>
</nav>

          {/* Title & Price */}
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">{product.title}</h1>
            <p className="text-3xl lg:text-4xl font-bold text-primary mb-6">${product.price}</p>
          </div>

          {/* Description */}
          <p className="text-lg text-text/80 max-w-xl leading-relaxed">
            {product.description}
          </p>

          {/* Size */}
          {product.size && (
            <div className="space-y-2">
              <span className="text-sm font-semibold uppercase tracking-wide text-text/60">Size</span>
              <p className="text-xl font-bold">{product.size}</p>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold uppercase tracking-wide text-text/60">Quantity</span>
            <div className="flex items-center gap-3 bg-backgrond/30 rounded-full px-4 py-3">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full bg-[#152211]/50 md:hover:bg-primary flex items-center justify-center font-bold text-lg transition-all"
              >
                -
              </button>
              <span className="text-xl font-bold min-w-[2rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 rounded-full bg-[#152211]/50 md:hover:bg-primary flex items-center justify-center font-bold text-lg transition-all"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            {/* Add to Cart */}
            <button
              onClick={addToCartHandler}
              className="w-full h-16 rounded-full bg-primary text-black font-bold text-lg hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 group"
            >
              <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-all">shopping_cart</span>
              Add to Cart
            </button>

            {/* Cart Popup */}
            {showCartPopup && (
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600/95 backdrop-blur-md text-white px-6 py-4 rounded-xl shadow-2xl border border-emerald-400/30 animate- flex items-center justify-between">
                <span className="font-semibold text-lg">🛒 Added to Cart!</span>
                <button
                  onClick={() => navigate("/Cart")}
                  className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all text-sm font-bold"
                >
                  View Cart
                </button>
              </div>
            )}

           { /* Buy Now */}
                       {/* Buy Now */}
<button 
  onClick={handleBuyNow}
  className="w-full h-16 rounded-full border-2 border-primary bg-gradient-to-r from-primary/90 to-primary text-black font-bold text-lg hover:from-primary to-primary/80 transition-all duration-200 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 group"
>
  <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-all">payments</span>
  Buy Now
</button>

                      </div>

                      {/* Details Accordion */}
          <div className="space-y-4 pt-8 border-t border-[#2c4724]/50">
            <details className="group border border-[#2c4724]/30 rounded-2xl p-6 hover:bg-[#152211]/30 transition-all">
              <summary className="font-bold text-lg cursor-pointer flex items-center justify-between group-open:mb-4">
                Scent Profile
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-all">expand_more</span>
              </summary>
              <p className="text-text/80">{product.scentProfile || "—"}</p>
            </details>

            <details className="group border border-[#2c4724]/30 rounded-2xl p-6 hover:bg-[#152211]/30 transition-all">
              <summary className="font-bold text-lg cursor-pointer flex items-center justify-between group-open:mb-4">
                Category
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-all">expand_more</span>
              </summary>
              <p className="text-text/80">{product.category || "—"}</p>
            </details>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
