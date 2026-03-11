import Footer from "./Footer";
import Header from "./Header";
import React, { useState, useEffect } from "react";
import { getUser, isAuthenticated, logout } from "../utils/auth";
import { Link, useNavigate } from "react-router-dom"; // 
import axios from "axios";
import { showError, showInfo } from "../utils/toast";

import ScrollReveal from "../components/ScrollReveal";
import AnimatedCard from "../components/AnimatedCard";
export default function HomePage() {
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [user, setUser] = useState(null);
 const navigate = useNavigate();
const viewProductDetails = (id) => {
  navigate(`/ProductDetails/${id}`);
};

const [email, setEmail] = useState("");
const [loading, setLoading] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);

//slider
const [currentSlide, setCurrentSlide] = useState(0);
const [touchStartX, setTouchStartX] = useState(0);
const [touchEndX, setTouchEndX] = useState(0);
const [recommended, setRecommended] = useState([]);

const getImageUrl = (item) => {
  const img = item.images?.[0] || item.image;

  if (!img) return "/placeholder.jpg";

  // If already full URL (Google, Cloudinary, etc.)
  if (img.startsWith("http://") || img.startsWith("https://")) {
    return img;
  }

  // If local upload
  return `https://candlesecommerceproject.onrender.com${img}`;
};

const slides = [
  {
    id: 1,
    type: "hero",
    link: "/ProductListing",
    bg: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_LSIaYTuR41nS2TUzRpVUPwdZj77P43NkPVM5R6thdhZAiA6cSOqrL7MP-vudeuqoaBl28xGXd9EtEUtTotDOMmNEr7eVyh2wle25hCaTN14JH51f5bq49cqBAYJ1neMEGngHt4Ds4OJcTmE-wUfvyTyVGfjGwXa_0D0bBvPtuSn_u3-m9m1yxf-1_D2Q4QtLQS3GbdaFn4-aCtto9fcPPqrCtpeZgYV6poTYV2dSnz4xaNqfB3ED-9DrPd2RKIyIk8j8KARSDVni"
  },
   {
    id: 3,
    type: "QuoteGif",
    link: "/ProductListing",
bg: "https://cdn.dribbble.com/userupload/22778851/file/original-219c49e59c706959911ebecdd3f319a3.gif"
  },
  {
    id: 2,
    type: "mosquito",
    link: "/ProductListing?mosquito=true",
    bg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOQBNROMlkZMAADmD9G29wayQhqvjTxxUaVBXx3cR8Br2zWvJB3lavTNexbh-gKzrgMsn7fx82-_682LgxQEOXDl0fj3eI6sdsCd3RUVcC9TQgs37M89qNYXcsoKmxP1FwRkwYaycLoEgd49QNk_PNJB8rCm4i-Gkgw5GWY7jjD8qXh2v2CH3tBQlEm5T709xiNCyrIvAeXGGl37gE2210MliJmbmZCYUGGHHniEeA0GypCfKqzDpAfl-ZKTbsUMjR0thxFlQ1urM_"
  },

  {
    id: 4,
    type: "",
    link: "/ProductListing",
    bg: "https://img.freepik.com/premium-photo/scent-your-space-ecofriendly-handmade-candles-elevate-your-ambiance_606187-25282.jpg?semt=ais_user_personalization&w=740&q=80"
  },
  {
    id: 5,
    type: "collection",
    link: "/ProductListing",
    bg: "https://i.pinimg.com/originals/6b/2d/89/6b2d89b97ab406ba1693ce425b6b885e.gif" 
  },
];

const handleSwipe = () => {
  const swipeDistance = touchStartX - touchEndX;

  if (swipeDistance > 50) {
    // Swiped Left → Next Slide
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }

  if (swipeDistance < -50) {
    // Swiped Right → Previous Slide
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  }
};

const handleSubscribe = async (e) => {
  e.preventDefault();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    showError("Please enter a valid email address");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("https://candlesecommerceproject.onrender.com/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      setShowSuccess(true);   // ✅ SHOW POPUP
      setEmail("");           // clear input
    } else {
      showInfo(data.message);    // keep alert for error
    }
  } catch (error) {
    alert("Server error");
  } finally {
    setLoading(false);
  }
};




useEffect(() => {
  const fetchRecommendations = async () => {
    try {
      const recentId = localStorage.getItem("recentProduct");

      const { data } = await axios.get(
        "https://candlesecommerceproject.onrender.com/api/recommendations",
        {
          params: { recentId }   // ✅ SEND recentId
        }
      );

      setRecommended(data);
    } catch (err) {
      console.error("Recommendation error:", err);
    }
  };

  fetchRecommendations();
}, []);

  useEffect(() => {
    setUser(getUser());
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


  //slider auto slide
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, 5000);

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  const fetchRecommendations = async () => {
    const recentId = localStorage.getItem("recentProduct");
    const userId = userInfo?._id;

    const { data } = await axios.get(
      `https://candlesecommerceproject.onrender.com/api/recommendations?userId=${userId}&recentId=${recentId}`
    );

    setRecommended(data);
  };

  fetchRecommendations();
}, []);

  return (
    <div className="bg-background dark:bg-background-dark text-text dark:text-white font-display overflow-x-hidden transition-colors duration-300">

      {/* ================= NAVBAR ================= */}
      <div className="sticky top-0 z-[100] w-full backdrop-blur-md bg-background border-b border-gray-300 pb-1 md:pb-0">
       <Header/>
      </div>

      {/* ================= HERO ================= */}
  {/* ================= HERO SLIDER ================= */}
{/* ================= HERO SLIDER ================= */}

<section className="px-2  md:px-10 lg:px-1 py-1">
  <div className="max-w-[1400px] mx-auto relative">

<div
  className="relative min-h-[560px] rounded-xl overflow-hidden  touch-pan-y"
  onTouchStart={(e) => setTouchStartX(e.targetTouches[0].clientX)}
  onTouchMove={(e) => setTouchEndX(e.targetTouches[0].clientX)}
  onTouchEnd={handleSwipe}
>

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          onClick={() => navigate(slide.link)}
          className={`absolute inset-0 transition-all duration-700 ease-in-out cursor-pointer ${
            index === currentSlide
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full"
          }`}
        >
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 238, 183, 0.33), rgba(21,33,17,0.7)), url(${slide.bg})`
            }}
          />

          {/* Content */}

<div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-6 text-white select-none pointer-events-none">
            {slide.type === "hero" && (
              <>
                <span className="text-primary text-sm font-bold tracking-widest uppercase">
                  New Collection Drop
                </span>

                <h1 className="mt-6 text-5xl md:text-7xl font-black leading-tight">
                  The Art of <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                    Slow Burning
                  </span>
                </h1>

                <p className="mt-6 text-gray-200 max-w-lg">
                  Hand-poured soy & coco wax blends designed to transform your modern sanctuary.
                </p>
              </>
            )}

            {slide.type === "mosquito" && (
              <>
                <span className="text-primary text-sm font-bold tracking-widest uppercase">
                  Outdoor Evenings
                </span>

                <h2 className="mt-6 text-5xl font-bold">
                  Enjoy Serene, Pest-Free Nights
                </h2>

                <p className="mt-6 text-gray-200 max-w-lg">
                  Natural citronella & lemongrass blends for clean, effective outdoor burning.
                </p>
                  <span className="text-primary text-xl font-bold tracking-widest  mt-6">
                  Shop Mosquito Repellants
                </span>
              </>
            )}

            {slide.type === "collection" && (
              <>
                <span className="text-primary text-sm font-bold tracking-widest uppercase">
                  Signature Collection
                </span>

                <h2 className="mt-6 text-5xl font-bold">
                  Discover Timeless Scents
                </h2>

                <p className="mt-6 text-gray-200 max-w-lg">
                  Explore our handcrafted luxury candles designed for every mood.
                </p>
              </>
            )}
                 {slide.type === "QuoteGif" && (
  <div className="mt-auto pb-12">
    <h4 className="text-2xl md:text-3xl font-black leading-tight">
     🕯 "Let your life burn like a candle, <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
        but never go out in the darkness." 🕯
      </span>
    </h4>
  </div>
)}


          </div>
        </div>
      ))}

      {/* LEFT ARROW */}
      <button
       onClick={(e) => {
  e.stopPropagation();
  setCurrentSlide((prev) =>
    prev === 0 ? slides.length - 1 : prev - 1
  );
}}
onTouchStart={(e) => e.stopPropagation()}
onTouchEnd={(e) => e.stopPropagation()}

        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/20 text-white p-2 rounded-full lg:hover:bg-gray-900 transition"
      >
        ‹
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={(e) => {
  e.stopPropagation();
  setCurrentSlide((prev) => (prev + 1) % slides.length);
}}
onTouchStart={(e) => e.stopPropagation()}
onTouchEnd={(e) => e.stopPropagation()}

        className="absolute  right-4 top-1/2 -translate-y-1/2 z-30 bg-black/20 text-white p-2 rounded-full lg:hover:bg-gray-900  transition"
      >
        ›
      </button>

      {/* DOTS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide(i);
            }}
            className={`w-3 h-3 rounded-full transition ${
              currentSlide === i ? "bg-primary" : "bg-white/40"
            }`}
          />
        ))}
      </div>

    </div>
  </div>
</section>




      {/* ================= FEATURES ROW ================= */}
           <ScrollReveal direction="left">

      <div className="border-b border-[#2c4724]/20">
        <div className="px-5 md:px-10 lg:px-40 py-6">
          <div className="max-w-[1200px] mx-auto flex flex-wrap justify-center  md:justify-between gap-8 text-text">
            {[
              ["local_shipping", "FREE SHIPPING OVER $75"],
              ["eco", "100% VEGAN WAX BLEND"],
              ["verified_user", "SECURE CHECKOUT"],
              ["recycling", "RECYCLABLE PACKAGING"],
            ].map(([icon, text]) => (
              <div key={icon} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  {icon}
                </span>
                <span className="text-sm font-bold">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
     </ScrollReveal>

      {/* ================= SHOP BY SCENT ================= */}
     {/* ================= SHOP BY SCENT ================= */}

<section className="flex flex-col w-full py-10">
  <div className="px-5 md:px-10 lg:px-40 flex justify-center">
    <div className="max-w-[1200px] w-full">

      {/* Header */}
      <div className="flex items-end justify-between px-4 pb-6">
        <h2 className="text-text text-3xl font-bold tracking-tight">
          Shop by Scent
        </h2>
        <a
          href="/ProductListing"
          className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
        >
          View All
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 text-center">
        {[
          {
            title: "Woody & Earthy",
            sub: "Grounding • Rich",
             scent: "Woody",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB05xfdbZ2JaxWzG5nLBKlsDPhvJM5oDCSDDhskyE_Zpd8Gvn5tcgHLMVVl8Ogfz1V8fhJrxCtQqCUaZjt2yrfJqX2DX4kJvS_v-3qyJXcI6e1mah1UwzczGCQdIsLSZyK22msFH6--atrXP4-ajN5Zs3MGMbFmaYjZqjUurkqG28o7_EhP_dxwcFEaI6obvJNBC0KHdt8ItUuHt0RAwix0u-djvED60EPV-AT_QS127otwKCD_kKCCx8MqU-Jdfzv0WsZ6n062GRM8",
          },
          {
            title: " Floral",
            sub: "Blooming • Light",
             scent: "Floral",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBV4oJTBq-37RiNaDEBCZwN_-NM6pxPAUQ07JkfX82fl0codZxXM6mtC9JKq_mZ0XzDX_rmxbrki1NA1AeA39f4lCwungmAfuEkmklQ00RPzq-xMbR1rFnC2fb4kjij_f_dquDJhQC0sMr9lssnw5cWoyZ0ZXmpNSqIb4GubFMgJJtJsDw3dssamjzrfpHG2Qk8LceGcacT8lBNPuLHJzuFdt9x3Fr__uvhAM3px10XQfXwNMdNwMWeUM4JJ-H3aMsiS9I_F-OQE93h",
          },
          {
            title: "Bright Citrus",
            sub: "Energizing • Zesty",
             scent: "Citrus",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTnSZGz4m8TyC3RwYyVQdBIw6p81qsYGoQrnyrHtnc6T6uYGmrtEKBPxlu5l36A5yMn3XbJSGEPY_iihcXEWKFw-99B3yMGoAfuqHVM-IZg2qVPGC4zW6IdtWtPWyPp8hvf2mRTJq4MBwom32gYumDC0wfSNlxoJJRwuDD_kZiE34Pyzy80kXeEu8Xui9h-e3Kt5nH9qbmQv7FMNedrcZs54a0uyIE0Xwe9aPgQTmaNonV3J6UkGRbwiShAi0RvciMWPv2Hdz_nbF0",
          },
          {
            title: "Fresh Warm ",
            sub: "Comforting • Deep",
             scent: "Fresh",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0E7-ecjeN8vPYVYJ9awx1npP61_1_MeArnThPKOWwQMpvgmyEh18_-xWeRprVRKPIUQQk5bp46wvfHEtYD0slBZWI6EwUw6Qb_SWAPDX1SwqyesaaRxuWnCE7yGl_3aBeaQ6_vPabE5a6ZX_UO9HfhwbGwzjf_8qayhdPL_JZ_J0xgp9NPd2deonMcMzG0sevMgg2ixJpCmESp7ou3gBgKylwEVaelYQI5RfaHEmeHjP_sYdA9hNigB1da0BKpdKGw0xXk2TVsMXy",
          },
       ].map((item, index) => (

<ScrollReveal
  key={item.title}
  direction={index % 2 === 0 ? "left" : "right"}
  delay={index * 0.1}
>

<div
  onClick={() =>
    navigate(`/ProductListing?scent=${item.scent}#sort-by`)
  }
  className="flex flex-col gap-4 group cursor-pointer"
>   <div className="px-2">
              <div
className="w-full aspect-square rounded-full bg-cover bg-center border-2 border-transparent group-hover:border-primary transition-all duration-300 group-hover:scale-105"                style={{ backgroundImage: `url(${item.img})` }}
              />
            </div>

            <div>
              <p className="text-text text-lg font-bold group-hover:text-primary transition-colors">
                {item.title}
              </p>
              <p className="text-gray text-sm">
                {item.sub}
              </p>
            </div>
          </div>
          </ScrollReveal>
        ))}
      </div>

    </div>
  </div>
</section>



{/* ================= OUTDOOR EVENING ================= */}
    {/* Outdoor Evenings */}<ScrollReveal direction="zoom">

<section className="flex flex-col w-full py-20 border-t border-[#2c4724]/20">
  <div className="px-5 md:px-10 lg:px-40 flex justify-center">
    <div className="max-w-[1200px] w-full flex flex-col md:flex-row gap-12 items-center">
      
      <div className="flex-1 flex flex-col gap-6 text-center md:text-left items-center md:items-start">
        <span className="text-primary text-sm font-bold tracking-widest uppercase">
          Outdoor Evenings, Redefined
        </span>
        <h2 className="text-text text-4xl font-bold leading-tight">
          Enjoy Serene, Pest-Free Nights
        </h2>
        <p className="text-gray-700 leading-relaxed max-w-md">
          Our mosquito repellent candles blend natural citronella and lemongrass
          with our signature soy wax for a clean, effective burn.
        </p>
      {/* DESKTOP BUTTON */}
<button 
  onClick={() => navigate("/ProductListing?mosquito=true#sort-by")}
  className="hidden md:inline-flex mt-4 rounded-full bg-primary hover:bg-gray-200 hover:text-black transition-colors text-[#152211] px-8 py-4 font-bold"
>
  Shop Mosquito Repellent
</button>

      </div>

     <div className="flex-1 flex flex-col items-center">
             <ScrollReveal direction="zoom"> 

  <div className="relative rounded-xl overflow-hidden aspect-square md:aspect-[4/5] group w-full">
    <img
      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOQBNROMlkZMAADmD9G29wayQhqvjTxxUaVBXx3cR8Br2zWvJB3lavTNexbh-gKzrgMsn7fx82-_682LgxQEOXDl0fj3eI6sdsCd3RUVcC9TQgs37M89qNYXcsoKmxP1FwRkwYaycLoEgd49QNk_PNJB8rCm4i-Gkgw5GWY7jjD8qXh2v2CH3tBQlEm5T709xiNCyrIvAeXGGl37gE2210MliJmbmZCYUGGHHniEeA0GypCfKqzDpAfl-ZKTbsUMjR0thxFlQ1urM_"
      alt="Outdoor candle"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  </div></ScrollReveal>

  {/* ✅ MOBILE BUTTON */}
  <button 
    onClick={() => navigate("/ProductListing?mosquito=true#sort-by")}
    className="mt-9 md:hidden rounded-full bg-primary hover:bg-white hover:text-black transition-colors text-[#152211] px-8 py-4 font-bold w-full max-w-"
  >
    Shop Mosquito Repellent
  </button>

</div>


    </div>
  </div>
</section>
</ScrollReveal>


      {/* ================= AI RECOMMENDATIONS ================= */}
      {/* AI Recommendations */}
      <ScrollReveal >

<section className="flex flex-col w-full py-10 bg-[#1a2b15]/10">
  <div className="px-5 md:px-10 lg:px-40 flex justify-center">
    <div className="max-w-[1200px] w-full">
      
      <div className="text-center pb-8">
        <span className="text-primary text-lg font-bold uppercase tracking-widest">
          AI Recommendations
        </span>
        <h2 className="text-text text-3xl font-bold">
          Curated for Your Space
        </h2>
      </div>

      <div href="" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
 {recommended.map((item, index) => (
  <ScrollReveal delay={index * 0.12} direction="up" key={item._id}>
  <div
    key={item._id}
    className="group cursor-pointer"
    onClick={() => viewProductDetails(item._id)}
  >
    <div className="relative rounded-xl overflow-hidden aspect-[4/5]">
      
        {/* Badge */}
  {/* Badge */}
  {item.badge && (
    <span className={`absolute top-3 left-3 z-10 px-3 py-1 text-xs font-bold rounded-full
      ${item.badge === "Best Seller"
        ? "bg-primary text-black"
        : item.badge === "Personalized"
        ? "bg-green-500 text-white"
        : "bg-gray-500 text-white"
      }`}>
      {item.badge}
    </span>
  )}
      <img
        src={getImageUrl(item)}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>

    <div className="mt-3">
      <div className="flex justify-between">
        <h3 className="text-text font-bold group-hover:text-primary transition-colors">
          {item.title || item.name}
        </h3>
        <span className="text-text font-bold">₹{item.price}</span>
      </div>

      <p className="text-gray-700 text-sm">
        {item.description}
      </p>
    </div>
  </div></ScrollReveal>
))}
</div>

    </div>
  </div>
</section>
</ScrollReveal>


      {/* ================= OUR PHILOSOPHY ================= */}
      {/* Our Philosophy */}<ScrollReveal>

<section className="flex flex-col w-full py-20">
  <div className="px-5 md:px-10 lg:px-40 flex justify-center">
    <div className="max-w-[1200px] w-full flex flex-col md:flex-row gap-12 items-center">

    <div className="flex-1 relative">
  <div className="absolute -top-4 -left-4 w-full h-full border border-primary/30 rounded-2xl"></div>
     <ScrollReveal direction="left"> 
<div className="relative rounded-2xl overflow-hidden
                  aspect-[4/3] min-h-[200px] md:min-h-[0]">
    <div
      className="w-full h-full bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3iJkz5wLU4O_CaSAIWoaP99BhJi_DdS1cCGXOCnfe6UMARXcpw_ELK_XGR_OTnj5waHevTDpZIQyWtnzZDjTGiH0nLVhQH9MNKr_qWfuyuGgczBzHD7re8KCKH5d80JV8u300Tl8A7jhB6SrNFX7m3OXArbx-5GBW1M77vJepp-fkDa7WvWA1Q9iwCkW21_25SfLo7tFXMdeOPF5pkJ5JoRKQd5Mb3FJ6a_reGCXnV5HqGuFJc0WabLx6XkTl97elD0wHxTmpsXZP')",
      }}
    />
  </div></ScrollReveal>
</div>

      <div className="flex-1 flex flex-col gap-6">
        <span className="text-primary text-sm font-bold uppercase tracking-widest">
          Our Philosophy
        </span>
        <h2 className="text-text text-4xl font-bold">
          Consciously Crafted for the Modern Mind
        </h2>
        <p className="text-gray-600">
          We believe lighting a candle is a ritual—a moment to pause, breathe,
          and reset. Every vessel is hand-poured using sustainable practices.
        </p>
    <a
  href="/Journal"
  className="inline-block text-text font-bold border-b-2 border-primary w-40 hover:text-primary transition"
>
     Read Our Journal
</a>


      </div>

    </div>
  </div>
</section>
</ScrollReveal>


      {/* ================= NEWSLETTER ================= */}

      {/* ================= NEWSLETTER ================= */}

<ScrollReveal direction="zoom">

<section className="py-20 bg-gradient-to-b from-[#ffffff] to-gray-400 border-t border-[#2c4724]/20">
  <div className="px-5 md:px-10 lg:px-40">
    <div className="max-w-[600px] mx-auto text-center space-y-6">
      <div className="w-12 h-12 bg-backgound rounded-full flex items-center justify-center mx-auto">
        <span className="material-symbols-outlined text-primary">mail</span>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold">Join the Inner Circle</h2>
      <p className="text-gray-600">
        Receive early access to limited edition drops, exclusive scent profiles and 10% off <br/>
        on your first order.
      </p>

      {/* Subscribe Form */}
      <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubscribe}>
        <input
          type="email"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"

          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="flex-1 bg-gray-200 border border-[#2c4724]/20 rounded-full px-6 py-4 text-text outline-none focus:border-primary"
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-primary text-text font-bold rounded-full px-8 py-4 md:hover:bg-white/60 transition disabled:opacity-50"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {/* Success Popup */}
    {showSuccess && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="relative bg-white dark:bg-[#152211] rounded-2xl p-8 max-w-sm w-full text-center border border-primary shadow-2xl">

      {/* CLOSE BUTTON */}
      <button
        onClick={() => setShowSuccess(false)}
        className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
      >
        ×
      </button>

      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <span className="material-symbols-outlined text-green-500 text-3xl">
          check_circle
        </span>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Welcome to the Inner Circle!
      </h3>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        You'll receive your 10% off discount code.
      </p>

      <button
        onClick={() => {
          setShowSuccess(false);
          navigate("/Subscription");
        }}
        className="w-full bg-primary text-[#152211] font-bold py-3 px-6 rounded-xl hover:bg-primary/90 transition-all"
      >
        View Discount
      </button>
    </div>
  </div>
)}


      <p className="text-gray-900 text-sm opacity-50">
        By subscribing you agree to our terms and Privacy policy
      </p>
    </div>
  </div>
</section>
</ScrollReveal>

     
{/* ================= FOOTER ================= */}
<Footer />

    </div>
  );
}
