// Merge guest cart & wishlist into logged-in user's account
/*export const mergeGuestData = async (token) => {
  try {
    // 1️⃣ Merge Cart
    const guestCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (guestCart.length > 0) {
      for (const item of guestCart) {
        await fetch("http://localhost:5000/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            productId: item._id,
            quantity: item.quantity || 1
          })
        });
      }
      // Clear guest cart after merge
      localStorage.removeItem("cart");
      console.log("✅ Guest cart merged to backend");
    }

    // 2️⃣ Merge Wishlist
    const guestWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (guestWishlist.length > 0) {
      for (const productId of guestWishlist) {
        await fetch("http://localhost:5000/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productId })
        });
      }
      // Clear guest wishlist after merge
      localStorage.removeItem("wishlist");
      console.log("✅ Guest wishlist merged to backend");
    }

    // Trigger count update
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('wishlistUpdated'));

  } catch (err) {
    console.error("Merge guest data failed:", err);
  }
};*/

// Merge guest cart & wishlist into logged-in user's account
export const mergeGuestData = async (token) => {
  try {
    console.log("🔄 Starting guest data merge...");

    // 1️⃣ Merge Cart
    const guestCart = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log("📦 Guest cart items:", guestCart.length, guestCart);

    if (guestCart.length > 0) {
      for (const item of guestCart) {
        try {
          // ✅ FIXED: Backend expects 'qty' not 'quantity'
          const response =await fetch("http://localhost:5000/api/cart/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            /*body: JSON.stringify({
              productId: item._id,
              qty: item.quantity || 1  // ✅ Changed from 'quantity' to 'qty'
            })*/
              body: JSON.stringify({
  productId: item.productId || item._id,
  quantity: item.qty || item.quantity || 1
})
          });

          if (!response.ok) {
            const error = await response.json();
            console.error("❌ Cart merge failed for item:", item._id, error);
          } else {
            console.log("✅ Added to cart:", item.title || item.name);
          }
        } catch (err) {
          console.error("❌ Failed to add cart item:", err);
        }
      }
      
      // Clear guest cart after merge
      localStorage.removeItem("cart");
      console.log("🗑️ Guest cart cleared from localStorage");
    }

    // 2️⃣ Merge Wishlist
    const guestWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    console.log("❤️ Guest wishlist items:", guestWishlist.length, guestWishlist);

    if (guestWishlist.length > 0) {
      for (const productId of guestWishlist) {
        try {
         
        /*  const response = await fetch("http://localhost:5000/api/wishlist", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ 
              productId: productId
            })
          });*/
           const response =await fetch(`http://localhost:5000/api/wishlist/${productId}`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`
  }
});

          if (!response.ok) {
            const error = await response.json();
            console.error("❌ Wishlist merge failed for:", productId, error);
          } else {
            console.log("✅ Added to wishlist:", productId);
          }
        } catch (err) {
          console.error("❌ Failed to add wishlist item:", err);
        }
      }
      
      // Clear guest wishlist after merge
      localStorage.removeItem("wishlist");
      console.log("🗑️ Guest wishlist cleared from localStorage");
    }

    // 3️⃣ Trigger count update in Header
    console.log("📢 Triggering count updates...");
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('wishlistUpdated'));
    
    console.log("✅ Guest data merge complete!");
    
    // ✅ IMPORTANT: Return success
    return { success: true, cartMerged: guestCart.length, wishlistMerged: guestWishlist.length };

  } catch (err) {
    console.error("❌ Merge guest data failed:", err);
    return { success: false, error: err.message };
  }
};