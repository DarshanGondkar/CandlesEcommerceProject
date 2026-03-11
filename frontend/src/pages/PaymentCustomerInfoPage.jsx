
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header2 from "./Header2";
import { getCart } from "../services/authService"; 

import { showSuccess, showError, showInfo } from "../utils/toast";
import { showToastWithOK, showSuccessWithOK, showErrorWithOK, showConfirm } from "../utils/customToast";

export default function PaymentCustomerInfoPage() {
  const navigate = useNavigate();
  
  // ✅ CLEAN STATES - NO isAuthLoading
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [formData, setFormData] = useState({
    email: "", firstName: "", lastName: "", address: "", apartment: "",
    city: "", state: "", zip: "", phone: "", country: ""
  });
  const [loading, setLoading] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = shippingMethod === "standard" ? 5 : 15;
  const total = subtotal + shippingCost - discountAmount;

const [showSuccess, setShowSuccess] = useState(false);
const [subscribeLoading, setSubscribeLoading] = useState(false);
const [showDiscountPopup, setShowDiscountPopup] = useState(false);
//new
const handleNewsletterSubscribe = async () => {
  if (!formData.email) {
    showInfo("Enter email first");
    return;
  }

// ✅ ADD THIS for wrong subscribe checkbox
  if (!isValidEmail(formData.email)) {
    showError("Enter correct email id");
    setNewsletter(false);
    return;
  }


  setSubscribeLoading(true);

  try {
    const res = await fetch("https://candlesecommerceproject.onrender.com/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: formData.email }),
    });

    const data = await res.json();

    if (res.ok) {
      setShowSuccess(true); // 🎉 SHOW POPUP
    } else {
      // If already subscribed, don't break UX
      if (data.message?.includes("already")) {
        console.log("Already subscribed");
      } else {
        showInfo(data.message);
      }
    }

  } catch (error) {
    showError("Server error");
  } finally {
    setSubscribeLoading(false);
  }
};

  // Reset discount if email changes (prevents abuse)
useEffect(() => {
  setDiscountAmount(0);
  setDiscountCode("");
}, [formData.email]);

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

  // Apply discount
const applyDiscount = async () => {
  if (!formData.email) {
    showInfo("Please enter your email first");
    return;
  }

  if (!isValidEmail(formData.email)) {
    showInfo("Please enter a valid email address");
    return;
  }

  // ✅ Discount code empty check (FIXED)
  if (!discountCode || discountCode.trim() === "") {
    showInfo("Enter discount code");
    return;
  }

  if (discountCode.trim() !== "WELCOME10") {
    showError("Invalid discount code");
    return;
  }

  try {
    const res = await fetch("https://candlesecommerceproject.onrender.com/api/verify-discount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        code: discountCode
      })
    });

    const data = await res.json();

    if (!res.ok) {
      showInfo(data.message);
      return;
    }

    
    //const calculatedDiscount = Math.min(subtotal * 0.1, 12);
    const calculatedDiscount = Math.min(subtotal * 0.1);
    setDiscountAmount(calculatedDiscount);

    // ✅ SHOW SUCCESS POPUP
    setShowDiscountPopup(true);

  } catch (err) {
    console.error(err);
    showError("Server error");
  }
};





  // Handle form changes
  const handleInputChange = (e) => {
  const { id, value } = e.target;

  if (id === "email") {
    setNewsletter(false); // ✅ uncheck when email changes
  }

  if (id === "phone") {
    const numbersOnly = value.replace(/\D/g, "").slice(0, 10);
    setFormData({ ...formData, phone: numbersOnly });
  } else {
    setFormData({ ...formData, [id]: value });
  }
};

  // Place Order
  const placeOrder = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      showInfo("Your cart is empty");
      return;
    }
    if (!formData.email || !formData.firstName || !formData.lastName || 
        !formData.address || !formData.city || !formData.state || 
        !formData.zip || !formData.phone) {
      showInfo("Please fill all required fields");
      return;
    }

  // ✅ Email format validation
  if (!isValidEmail(formData.email)) {
    showError("Please enter a valid email address");
    return;
  }

  // ✅ Phone must be exactly 10 digits
  if (!/^\d{10}$/.test(formData.phone)) {
    showError("Phone number must be exactly 10 digits");
    return;
  }

 
    setLoading(true);
    
    const orderData = {
      id: Date.now(),
      items: [...cartItems],
      customer: {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        newsletter: newsletter,
        
      },
      shippingAddress: {
        country: formData.country,
        address: formData.address,
        apartment: formData.apartment || "",
        city: formData.city,
        state: formData.state,
        zip: formData.zip
      },
      shippingMethod,
      subtotal,
      shippingCost,
      discountAmount,
     // discountCode: discountCode || "WELCOME10",
      discountCode: discountAmount > 0 ? discountCode : "",

      total,
      status: "pending",
      orderDate: new Date().toISOString()
    };
    
    localStorage.setItem("currentOrder", JSON.stringify(orderData));
    setLoading(false);
    navigate("/OrderReview");
  };

  // ✅ SINGLE LOAD useEffect
// ... all your states + functions ...
// Auto subscribe when newsletter checked
/*useEffect(() => {
  if (newsletter && formData.email) {
    fetch("http://localhost:5000/api/verify-discount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email })
    }).catch(() => {});
  }
  
}, [newsletter, formData.email]);*/



useEffect(() => {
  const loadCartData = async () => {
    try {
      // 1️⃣ Check if Buy Now order exists
      const currentOrder = JSON.parse(localStorage.getItem("currentOrder") || "null");
      if (currentOrder?.items?.length) {
        setCartItems(currentOrder.items);
        setIsLoading(false);
        return;
      }

      // 2️⃣ Logged-in cart fallback
      const token = localStorage.getItem("token");
      if (token) {
        const res = await getCart().catch(() => []);
        const backendItems = res.map(item => ({
          _id: item.product?._id,
          name: item.product?.title || "Product",
          image: item.product?.images?.[0] || item.product?.image || "",
          price: parseFloat(item.product?.price || 0),
          quantity: parseInt(item.qty) || 1
        }));
        setCartItems(backendItems);
        setIsLoading(false);
        return;
      }

      // 3️⃣ Guest cart fallback
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const fixedCart = cart.map(item => ({
        _id: item._id,
        name: item.title || item.name,
        image: item.image || item.images?.[0] || "",
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity) || 1
      }));
      setCartItems(fixedCart);

    } catch (err) {
      console.error("Payment load error:", err);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  loadCartData();
}, []);


// ✅ LOADING CHECKS
if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading your cart...</p>
      </div>
    </div>
  );
}

if (cartItems.length === 0) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some candles to get started.</p>
        <a href="/cart" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90">
          Go to Cart
        </a>
      </div>
    </div>
  );
}

// ✅ PAGE RENDERS HERE 

//new code pay button
const handlePayClick = () => {
  const isRegistered = window.confirm("Use Express Pay if registered with details, else click cancel & fill below details");

 if (isRegistered) {
  const orderData = {
    id: Date.now(),
    items: [...cartItems],
    subtotal,
    shippingCost,
    discountAmount,
    total,
    shippingMethod,
    status: "pending",
    orderDate: new Date().toISOString(),
  };

  localStorage.setItem("currentOrder", JSON.stringify(orderData));
  navigate("/OrderReview");
} /*else {
    alert("Please register with details first to use Express Pay.");
  }*/
};

  // ✅ MAIN RENDER - PAGE VISIBLE HERE
  return (
    <>
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased min-h-screen flex flex-col">
      <Header2 />
      
      <div className="flex flex-col lg:flex-row flex-1">
        {/* LEFT: FORM */}
        <main className="w-full lg:w-[58%] xl:w-[60%] flex flex-col items-center px-5 pt-8 pb-10 lg:px-12 xl:px-20 order-2 lg:order-1">
          <div className="w-full max-w-[500px] lg:max-w-[600px] flex flex-col gap-10 lg:gap-8">
            
            {/* Mobile Order Summary + Breadcrumb */}
            <div className="lg:hidden flex flex-col gap-4">
              <details className="mb-0 -mt-4 mx-auto rounded-xl border border-slate-200 dark:border-[#32674d] bg-white dark:bg-[#11221a] overflow-hidden group">
                <summary className="flex cursor-pointer items-center justify-between gap-6 px-5 py-4 list-none">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">shopping_cart</span>
                    <p className="text-slate-900 dark:text-white text-sm font-semibold tracking-wide">
                      Order summary
                    </p>
                    <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </div>
                  <p className="text-slate-900 dark:text-white text-lg font-bold">${total.toFixed(2)}</p>
                </summary>
                <div className="px-5 pb-5 border-t border-slate-100 dark:border-[#234836] pt-4 space-y-3">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 rounded overflow-hidden bg-gray-200 flex-shrink-0">
                        <img 
                          src={item.image || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFOUU5RTkvMzNGNEY0Ii8+Cjx0ZXh0IHg9IjIwIiB5PSIyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii0zIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9IjYwMCI+Q2FuZGxlPC90ZXh0Pgo8L3N2Zz4="} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-slate-900 dark:text-white font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-slate-500 dark:text-[#92c9ad] block truncate">
                         {item.name} x ${item.price} x {item.quantity} 
                        </span>
                      </div>
                    </div>
                  ))}
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-[#92c9ad]">
                        Discount <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">WELCOME10</span>
                      </span>
                      <span className="text-primary font-medium">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-[#92c9ad]">Shipping</span>
                    <span className="text-slate-400 dark:text-[#92c9ad]">${shippingCost.toFixed(2)}</span>
                  </div>
                </div>
              </details>

              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-gray-400">
                  <li className="text-primary font-semibold">Information</li>
                  <li className="material-symbols-outlined text-xs">chevron_right</li>
                  <li>Order Review</li>
                  <li className="material-symbols-outlined text-xs">chevron_right</li>
                  <li>Payment</li>
                </ol>
              </nav>
            </div>

            {/* Desktop Breadcrumb */}
            <nav aria-label="Breadcrumb" className="hidden lg:block">
              <ol className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-gray-400">
                <li className="text-primary font-semibold">Information</li>
                <li className="material-symbols-outlined text-xs">chevron_right</li>
                <li>Order Review</li>
                <li className="material-symbols-outlined text-xs">chevron_right</li>
                <li>Payment</li>
              </ol>
            </nav>

            {/* Express Checkout */}
            <section className="flex flex-col gap-4">
              <h5 className="text-sm text-gray-500  tracking-widest">
                 Already Registered with details? Make Secure Express Checkout
              </h5>
              <h3 className="text-center lg:text-left text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-1 lg:mb-0">
                Express Checkout
              </h3>
              <div className="justify-center w-full">
                  {/* <button className="flex items-center justify-center h-14 lg:h-12 rounded-xl lg:rounded-lg bg-[#5A2581] hover:bg-[#481e67] transition-all text-white relative group">
                  <span className="font-bold text-lg lg:text-base tracking-tight">Shop Pay</span>
                </button> */}
              <button
  type="button"
  onClick={handlePayClick}
  className="flex items-center justify-center h-14 lg:h-12 rounded-xl lg:rounded-lg bg-gradient-to-r from-primary to [#FF9800] text-black hover:bg-gray-100 dark:bg-[#F2F4F7] dark:text-black transition-all w-full"
>
  <span className="font-bold text-lg lg:text-base tracking-tight flex items-center gap-1">
    <span className="material-symbols-outlined text-2xl lg:text-xl">
      payments
    </span>
   Express Pay
  </span>
</button>

                
              </div>

<div className="lg:hidden">
              {/* Mobile Discount */}
              <section className="lg:hidden bg-surface-dark p-1 rounded-xl flex items-center border border-border-dark">
                <input 
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="block px-4 py-3.5 w-full text-base bg-white dark:bg-background-dark rounded-lg border border-gray-300 dark:border-border-dark peer"

                  placeholder="Discount code" 
                />
  &nbsp;&nbsp;&nbsp; <button 
                  onClick={applyDiscount}
                  className="px-6 py-3  mr-1 bg-border-dark bg-primary text-white hover:opacity-70 text-xs font-bold  tracking-widest rounded-xl  transition-colors"
                >
                  Apply
                </button>
                
              </section>
{discountAmount > 0 && (
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2 px-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">sell</span>
                 Discount: WELCOME10
                </div>
                <span className="text-green-600 font-medium">-${discountAmount.toFixed(2)}</span>
              </div>
            )}
</div>

              <div className="relative flex py-4 lg:py-2 items-center">
                <div className="flex-grow border-t border-gray-300 dark:border-border-dark"></div>
                <span className="flex-shrink-0 mx-4 text-gray-500 text-[10px] lg:text-xs uppercase tracking-[0.2em] lg:tracking-wider">Or</span>
                <div className="flex-grow border-t border-gray-300 dark:border-border-dark"></div>
              </div>
            </section>

            {/* Email + Newsletter */}
            <div className="relative">
              <input
                id="email"
                type="email"
  pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                value={formData.email}
                onChange={handleInputChange}
                className="peer block px-4 py-4 lg:py-3.5 w-full text-base bg-white dark:bg-[#1a251a] text-gray-900 dark:text-white rounded-xl lg:rounded-lg border border-gray-300 dark:border-[#2c4724] appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder-transparent h-[58px]"
               
               
                placeholder="Email address"
                required
              />
              <label 
                htmlFor="email"
                className="absolute rounded-2xl text-sm text-gray-500 dark:text-gray-300 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] bg-white dark:bg-[#1a251a] px-2 peer-focus:bg-white peer-focus:text-primary peer-focus:scale-75 peer-focus:-translate-y-3 left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2"
              >
                Email address *
              </label>
            </div>
            <div className="flex items-center gap-3 mt-0">
          <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
  <input
    type="checkbox"
    checked={newsletter}
    disabled={!formData.email} // ❌ disabled if email empty
    onChange={async (e) => {
      const checked = e.target.checked;

      if (!formData.email) {
        setNewsletter(false);
        showInfo("Please enter your email first");
        return;
      }

// ✅ ADD THIS
  if (!isValidEmail(formData.email)) {
    showError("Enter correct email id");
    setNewsletter(false);
    return;
  }

      setNewsletter(checked);

      if (checked) {
        handleNewsletterSubscribe(); // subscribe & show popup
      }
    }}
    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
  />
  Subscribe by e-mail & get 10% off
</label>


            </div>
{showDiscountPopup && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-[#1a251a] p-8 rounded-xl shadow-xl text-center max-w-sm">
      
      <h2 className="text-xl font-bold mb-3 text-green-600">
        🎉 Discount Applied!
      </h2>

      <p className="text-sm mb-4">
        You saved <span className="font-bold text-primary">
          ${discountAmount.toFixed(2)}
        </span>
      </p>

      <button
        onClick={() => setShowDiscountPopup(false)}
        className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
      >
        Continue
      </button>

    </div>
  </div>
)}

            {/* Shipping Address */}
            <section className="flex flex-col gap-6 lg:gap-5 lg:mt-4">
              <h2 className="text-2xl lg:text-lg font-serif lg:font-sans text-white italic lg:not-italic lg:font-semibold">
                Shipping Address
              </h2>

              <div className="flex flex-col gap-4">
                {/* Country */}
                <div className="relative">
                  <input 
                    id="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="peer block px-4 py-4 lg:py-3.5 w-full text-base bg-white dark:bg-[#1a251a] text-gray-900 dark:text-white rounded-xl lg:rounded-lg border border-gray-300 dark:border-[#2c4724] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder-transparent h-[58px]"
                    placeholder="Country"
                    required
                  />
                  <label htmlFor="country" className="absolute rounded-2xl  text-sm text-gray-500 dark:text-gray-300 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] bg-white dark:bg-[#1a251a] px-2 peer-focus:bg-white peer-focus:text-primary peer-focus:scale-75 peer-focus:-translate-y-3 left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2">
                    Country/Region *
                  </label>
                </div>

                {/* First & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input 
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="peer block px-4 py-4 lg:py-3.5 w-full text-base bg-white dark:bg-[#1a251a] text-gray-900 dark:text-white rounded-xl lg:rounded-lg border border-gray-300 dark:border-[#2c4724] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder-transparent h-[58px]"
                      placeholder="First name"
                      required
                    />
                    <label htmlFor="firstName" className="absolute rounded-2xl text-sm text-gray-500 dark:text-gray-300 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] bg-white dark:bg-[#1a251a] px-2 peer-focus:bg-white peer-focus:text-primary peer-focus:scale-75 peer-focus:-translate-y-3 left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2">
                      First name *
                    </label>
                  </div>
                  <div className="relative">
                    <input 
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="peer block px-4 py-4 lg:py-3.5 w-full text-base bg-white dark:bg-[#1a251a] text-gray-900 dark:text-white rounded-xl lg:rounded-lg border border-gray-300 dark:border-[#2c4724] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder-transparent h-[58px]"
                      placeholder="Last name"
                      required
                    />
                    <label htmlFor="lastName" className="absolute rounded-2xl text-sm text-gray-500 dark:text-gray-300 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] bg-white dark:bg-[#1a251a] px-2 peer-focus:bg-white peer-focus:text-primary peer-focus:scale-75 peer-focus:-translate-y-3 left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2">
                      Last name *
                    </label>
                  </div>
                </div>

                {/* Address */}
                <div className="relative">
                  <input 
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="peer block px-4 py-4 lg:py-3.5 w-full text-base bg-white dark:bg-[#1a251a] text-gray-900 dark:text-white rounded-xl lg:rounded-lg border border-gray-300 dark:border-[#2c4724] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder-transparent h-[58px]"
                    placeholder="Address"
                    required
                  />
                  <label htmlFor="address" className="absolute rounded-2xl text-sm text-gray-500 dark:text-gray-300 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] bg-white dark:bg-[#1a251a] px-2 peer-focus:bg-white peer-focus:text-primary peer-focus:scale-75 peer-focus:-translate-y-3 left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2">
                    Address *
                  </label>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 top-1/2 -translate-y-1/2">
                    {/* <span className="material-symbols-outlined text-lg">search</span> */}
                  </div>
                </div>

                {/* Apartment (Optional) */}
                <div className="relative">
                  <input 
                    id="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    className="peer block px-4 py-4 lg:py-3.5 w-full text-base bg-white dark:bg-[#1a251a] text-gray-900 dark:text-white rounded-xl lg:rounded-lg border border-gray-300 dark:border-[#2c4724] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder-transparent h-[58px]"
                    placeholder="Apartment, suite, etc."
                  />
                  <label htmlFor="apartment" className="absolute text-sm text-gray-500 dark:text-gray-300 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] bg-white dark:bg-[#1a251a] px-2 peer-focus:bg-white peer-focus:text-primary peer-focus:scale-75 peer-focus:-translate-y-3 left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2 rounded-2xl">
                    Apartment, suite, etc. (optional)
                  </label>
                </div>

                {/* City, State, ZIP */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="relative">
                    <input 
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="peer block px-4 py-4 lg:py-3.5 w-full text-base bg-white dark:bg-[#1a251a] text-gray-900 dark:text-white rounded-xl lg:rounded-lg border border-gray-300 dark:border-[#2c4724] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder-transparent h-[58px]"
                      placeholder="City"
                      required
                    />
                    <label htmlFor="city" className="absolute rounded-2xl text-sm text-gray-500 dark:text-gray-300 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] bg-white dark:bg-[#1a251a] px-2 peer-focus:bg-white peer-focus:text-primary peer-focus:scale-75 peer-focus:-translate-y-3 left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2">
                      City *
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 lg:gap-2">
                    <div className="relative">
                      <input 
                        id="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="peer block px-4 py-4 lg:py-3.5 w-full text-base bg-white dark:bg-[#1a251a] text-gray-900 dark:text-white rounded-xl lg:rounded-lg border border-gray-300 dark:border-[#2c4724] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder-transparent h-[58px]"
                        placeholder="State"
                        required
                      />
                      <label htmlFor="state" className="absolute rounded-2xl text-sm text-gray-500 dark:text-gray-300 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] bg-white dark:bg-[#1a251a] px-2 peer-focus:bg-white peer-focus:text-primary peer-focus:scale-75 peer-focus:-translate-y-3 left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2">
                        State *
                      </label>
                    </div>
                    <div className="relative">
                      <input 
                        id="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="peer block px-4 py-4 lg:py-3.5 w-full text-base bg-white dark:bg-[#1a251a] text-gray-900 dark:text-white rounded-xl lg:rounded-lg border border-gray-300 dark:border-[#2c4724] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder-transparent h-[58px]"
                        placeholder="ZIP code"
                        required
                      />
                      <label htmlFor="zip" className="absolute rounded-2xl text-sm text-gray-500 dark:text-gray-300 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] bg-white dark:bg-[#1a251a] px-2 peer-focus:bg-white peer-focus:text-primary peer-focus:scale-75 peer-focus:-translate-y-3 left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2">
                        ZIP code *
                      </label>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="relative">
                  <input 
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                   
                    className="peer block px-4 py-4 lg:py-3.5 w-full text-base bg-white dark:bg-[#1a251a] text-gray-900 dark:text-white rounded-xl lg:rounded-lg border border-gray-300 dark:border-[#2c4724] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder-transparent h-[58px]"
                    placeholder="Phone"
type="tel"
inputMode="numeric"
maxLength={10}  
                  required

                  
                  />
                  <label htmlFor="phone" className="absolute rounded-2xl text-sm text-gray-500 dark:text-gray-300 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] bg-white dark:bg-[#1a251a] px-2 peer-focus:bg-white peer-focus:text-primary peer-focus:scale-75 peer-focus:-translate-y-3 left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2">
                    Contact number *
                  </label>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 top-1/2 -translate-y-1/2">
                    <span className="material-symbols-outlined text-lg"> phone</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Method */}
            <section className="mb-10">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-5 tracking-tight">
                Shipping method
              </h3>
              <div className="space-y-3">
                <label className="relative flex cursor-pointer rounded-xl border border-slate-200 dark:border-[#32674d] bg-white dark:bg-[#11221a] p-5 focus-within:ring-2 focus-within:ring-primary transition-all hover:border-primary/50">
                  <input 
                    checked={shippingMethod === "standard"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="mt-1 h-5 w-5 border-slate-300 text-primary focus:ring-primary dark:bg-[#11221a] dark:border-[#32674d]" 
                    name="shipping_method" 
                    type="radio" 
                    value="standard"
                  />
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between items-start">
                      <span className="block text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Standard Courier
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">$5.00</span>
                    </div>
                    <span className="mt-1 flex items-center text-xs text-slate-500 dark:text-[#92c9ad]">
                      <span className="material-symbols-outlined text-[16px] mr-1">schedule</span>
                      3–5 business days
                    </span>
                  </div>
                </label>
                <label className="relative flex cursor-pointer rounded-xl border border-slate-200 dark:border-[#32674d] bg-white dark:bg-[#11221a] p-5 focus-within:ring-2 focus-within:ring-primary transition-all hover:border-primary/50">
                  <input 
                    checked={shippingMethod === "express"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="mt-1 h-5 w-5 border-slate-300 text-primary focus:ring-primary dark:bg-[#11221a] dark:border-[#32674d]" 
                    name="shipping_method" 
                    type="radio" 
                    value="express"
                  />
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between items-start">
                      <span className="block text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Express Luxury Delivery
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">$15.00</span>
                    </div>
                    <span className="mt-1 flex items-center text-xs text-slate-500 dark:text-[#92c9ad]">
                      <span className="material-symbols-outlined text-[16px] mr-1">bolt</span>
                      1–2 business days
                    </span>
                  </div>
                </label>
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-col gap-6 pt-4 lg:pt-6">
              <form onSubmit={placeOrder}>
                <button 
                  type="submit"
                  disabled={loading || cartItems.length === 0}
                    className="w-full h-14 bg-gradient-to-r from-primary to-primary-dark text-white font-black text-lg rounded-2xl flex items-center justify-center hover:scale-[1.02] transition-all shadow-2xl hover:shadow-primary/25"

>
                  {loading ? "Processing..." : "Review Order"}
                </button>
              </form>
              <a className=" text-primary hover:text-primary/80 font-bold flex items-center justify-center gap-2 text-sm  tracking-widest" href="/Cart">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Return to cart
              </a>
            </div>

         
          </div>

        {showSuccess && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
<div className="relative bg-white dark:bg-[#1a251a] p-8 rounded-xl shadow-xl text-center max-w-sm">      <h2 className="text-xl font-bold mb-3">🎉 You're Subscribed!</h2>
<button
  onClick={() => setShowSuccess(false)}
  className="absolute top-3 right-5 text-gray-500 hover:text-red-500 text-lg"
>
  ✕
</button>
      <p className="text-sm mb-4">
        Use code{" "}
        <span className="font-bold text-primary text-lg">
          WELCOME10
        </span>{" "}
        to get 10% off.
      </p>

      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText("WELCOME10");
            showToastWithOK("Code copied! Paste and apply for 10% off.");
            setShowSuccess(false);
          } catch (err) {
            showToastWithOK("Failed to copy");
          }
        }}
        className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
      >
        📋 Copy Code
      </button>
    </div>
  </div>
)}


        </main>

        {/* RIGHT: Order Summary (Desktop) */}
        <aside className="hidden lg:block w-[42%] xl:w-[40%] bg-background-light dark:bg-background-dark border-l border-gray-200 dark:border-border-dark order-1 lg:order-2">
          <div className="sticky top-0 h-screen overflow-y-auto px-8 xl:px-14 py-12 flex flex-col gap-6">
            {/* Products */}
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-300 dark:border-border-dark bg-gray-200">
                  <img 
                    src={item.image || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNFOUU5RTkvMzNGNEY0Ii8+Cjx0ZXh0IHg9IjMyIiB5PSIzOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii0yIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSI2MDAiPkNhbmRsZTwvdGV4dD4KPC9zdmc+"} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                                          <p className="text-base text-sm text-[#A0A0A0]">Price: ${item.price}</p>
                        <p className="text-base text-sm text-[#A0A0A0]">Quantity: {item.variant ||    item.quantity}</p>
                </div>
                <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="border-t border-gray-300 dark:border-border-dark" />

            {/* Discount Input */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="block px-4 py-3.5 w-full text-base bg-white dark:bg-background-dark rounded-lg border border-gray-300 dark:border-border-dark peer"
                  placeholder="Discount code"
                />
              </div>
              <button 
                onClick={applyDiscount}
                className="px-5 py-3 bg-primary text-white hover:opacity-70  dark:bg-border-dark rounded-lg font-semibold"
              >
                Apply
              </button>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">sell</span>
                  Discount: WELCOME10
                </div>
                <span className="text-green-600 font-medium pr-6">-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="border-t border-gray-300 dark:border-border-dark" />

            {/* Price Breakdown */}
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({shippingMethod})</span>
                <span className="text-gray-400">${shippingCost.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-gray-400">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-300 dark:border-border-dark" />

            {/* Total */}
            <div className="flex justify-between items-baseline">
              <span className="text-base font-medium">Total</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-gray-400">USD</span>
                <span className="text-2xl font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
     <div className="border-t border-gray-300 dark:border-border-dark pt-7 mb-7">
              <p className="text-center text-xs text-gray-400">          © {new Date().getFullYear()} Lumina Candles Pvt. Ltd. All rights reserved.
</p>
            </div></>
  );
}
