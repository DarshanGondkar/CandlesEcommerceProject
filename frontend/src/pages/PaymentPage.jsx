import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Header2 from "./Header2";
import Footer2 from "./Footer2";

export default function PaymentPage() {
  const [order, setOrder] = useState(null);
  const [rzpOrder, setRzpOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const savedOrder = localStorage.getItem("currentOrder");
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder);
        setOrder(parsedOrder);
        createRazorpayOrder(parsedOrder);
      } catch (error) {
        console.error("Invalid order data:", error);
        window.location.href = "/OrderReview";
      }
    } else {
      window.location.href = "/OrderReview";
    }
    setLoading(false);
  }, []);

  const createRazorpayOrder = async (orderData) => {
    try {
      const response = await axios.post("https://candlesecommerceproject.onrender.com/api/payment/create-order", {
        amount: Number(orderData.total),
        receipt: `lumina_${orderData.id}`,
        orderId: orderData.id
      });
      console.log("✅ Backend order created:", response.data);
      setRzpOrder(response.data);
    } catch (error) {
      console.error("Order creation failed:", error.response?.data || error.message);
    }
  };

  const loadRazorpayOnDemand = useCallback(async () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        console.log("✅ Razorpay already available");
        resolve(true);
        return;
      }

      console.log("🔄 Loading Razorpay script...");
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        console.log("✅ Razorpay script loaded!");
        resolve(true);
      };
      script.onerror = () => {
        console.error("❌ Razorpay script failed");
        resolve(false);
      };
      document.head.appendChild(script);
    });
  }, []);

  const getRazorpayOptions = useCallback(() => {
    return {
      key: "rzp_test_SDuzJfTZ1epVWB",
      amount: rzpOrder?.amount || Math.round(order.total * 100),
      currency: rzpOrder?.currency || "INR",
      order_id: rzpOrder?.orderId || `temp_${Date.now()}`,
      name: "Lumina Candles ",
      description: `Order #${order?.id || 'N/A'}`,
      
   handler: async function (response) {
  console.log("✅ RAZORPAY SUCCESS:", response);

  try {
    // 🔥 CALL BACKEND VERIFY ROUTE
    await axios.post("https://candlesecommerceproject.onrender.com/api/payment/verify-payment", {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      email: order.customer?.email,
      discountCode: order.discountCode
    });

    console.log("✅ Payment verified & discount marked used");

  } catch (error) {
    console.error("❌ Verification failed:", error.response?.data || error.message);
  }

  // Continue your existing logic
  const completedOrder = {
    ...order,
    status: "paid",

      paymentDate: new Date().toISOString(), // add this
  transactionId: response.razorpay_payment_id, // <-- add this
  orderNumber: order.id || `LUM-${Date.now()}`, // ensure order number exists
 
    razorpayPaymentId: response.razorpay_payment_id,
    razorpayOrderId: response.razorpay_order_id,
    razorpaySignature: response.razorpay_signature
  };

  localStorage.setItem("completedOrder", JSON.stringify(completedOrder));
  localStorage.removeItem("currentOrder");

  window.location.href = "/OrderConfirmation";
},
      //razorpay ui theme color
      theme: { color: "#e68d19" },
      prefill: {
        name: `${order?.customer?.firstName || ''} ${order?.customer?.lastName || ''}`.trim() || "Customer",
        email: order?.customer?.email || "",
        contact: order?.customer?.phone || ""
      },
      modal: {
        escape: false,
        backdropclose: false,
        ondismiss: () => alert("Please complete payment")
      },
      payment_methods: { upi: true, card: true, netbanking: true, wallet: true },
      preferred_network: ["gpay", "phonepe", "paytm"]
    };
  }, [rzpOrder, order]);


//add my order page new

  
  const handlePayment = async () => {
    if (!order) return;
    
    setPaymentLoading(true);
    
    try {
      if (!rzpOrder) {
        console.log("🧪 Creating backend order...");
        await createRazorpayOrder(order);
      }
      
      if (!window.Razorpay) {
        await loadRazorpayOnDemand();
      }
      
      console.log("✅ Opening Razorpay with order:", rzpOrder?.orderId);
      const options = getRazorpayOptions();
      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment setup failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-900 dark:text-white">Loading payment...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No order found</h2>
          <a href="/OrderReview" className="bg-primary text-background-dark px-6 py-3 rounded-lg font-semibold hover:bg-primary/90">
            Go back to Review
          </a>
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = order.shippingCost || 5;
  const total = order.total || (subtotal + shippingCost - (order.discountAmount || 0));

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased min-h-screen flex flex-col">
      <Header2 />
      
      <div className="flex flex-col lg:flex-row flex-1">
        {/* LEFT: Payment */}
        <main className="w-full lg:w-[58%] xl:w-[60%] flex flex-col items-center px-5 pt-8 pb-10 lg:px-12 xl:px-20 order-2 lg:order-1">
         
          <div className="w-full max-w-[500px] lg:max-w-[600px] flex flex-col gap-10 lg:gap-8">
            
            {/* Mobile Order Summary - EXACTLY like PaymentCustomerInfo */}
            <div className=" lg flex flex-col gap-4">
              <details className=" mb-0 -mt-4 mx-auto rounded-xl border border-slate-200 dark:border-[#32674d] bg-white dark:bg-[#11221a] overflow-hidden group">
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
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 rounded overflow-hidden bg-gray-200 flex-shrink-0">
                        <img 
                          src={item.image || item.images?.[0] || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFOUU5RTkvMzNGNEY0Ii8+Cjx0ZXh0IHg9IjIwIiB5PSIyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii0zIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9IjYwMCI+Q2FuZGxlPC90ZXh0Pgo8L3N2Zz4="} 
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
                    {order.discountAmount > 0 && (
        <div className="flex justify-between bg-primary/10  rounded-lg">
          <span className="text-[#A0A0A0]">
            Discount 
          </span>
          <span className="text-primary font-bold">
            -${order.discountAmount.toFixed(2)}
          </span>
        </div>
      )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-[#92c9ad]">Shipping</span>
                    <span className="text-slate-400 dark:text-[#92c9ad]">${shippingCost.toFixed(2)}</span>
                  </div>
                </div>
              </details>


 {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-gray-400">
              <li>Information</li>
              <li className="material-symbols-outlined text-xs">chevron_right</li>
              <li>Order Review</li>
              
              <li className="material-symbols-outlined text-xs">chevron_right</li>
              <li className="text-primary font-semibold">Payment</li>
            </ol>
          </nav>

          <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-text pb-2">
            Payment
          </h2>

              {/*<nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-gray-400">
                  <li className="text-primary font-semibold">Payment</li>
                </ol>
              </nav>*/}
            </div>


            {/* Desktop Breadcrumb
            <nav aria-label="Breadcrumb" className="hidden lg:block">
              <ol className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-gray-400">
                <li className="text-primary font-semibold">Payment</li>
              </ol>
            </nav> */}

{/* ✅ MOBILE ONLY - Big Order Summary Card */}
<div className="lg:hidden w-full mb-8">
  <div className="rounded-xl bg-background p-6 border border-border/10">

    <h3 className="text-xl font-bold text-text mb-6">
      Order Summary
    </h3>

    {/* Items */}
    <div className="space-y-6 border-b border-border/10 pb-6 mb-6">
      {order.items?.map((item, idx) => (
        <div key={idx} className="flex items-start gap-4">
          
          <div className="relative h-16 w-16 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
            <img
              src={item.image || item.images?.[0] || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNFOUU5RTkvMzNGNEY0Ii8+Cjx0ZXh0IHg9IjQwIiB5PSI0OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii0zIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSI2MDAiPkNhbmRsZTwvdGV4dD4KPC9zdmc+"}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {item.quantity > 1 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                {item.quantity}
              </span>
            )}
          </div>

          <div className="flex-grow min-w-0 pt-1">
            <p className="text-text font-semibold text-sm ">
              {item.name}
            </p>
             <p className="text-base text-sm text-[#A0A0A0]">Price: ${item.price}</p>
        <p className="text-base text-sm text-[#A0A0A0]">Quantity: {item.variant ||    item.quantity}</p>

          </div>

          <p className="text-lg font-bold text-text whitespace-nowrap">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      )) || (
        <p className="text-[#A0A0A0] py-6">
          No items in order
        </p>
      )}
    </div>

    {/* Price Breakdown */}
    <div className="space-y-3 text-sm mb-6">
      <div className="flex justify-between">
        <span className="text-[#A0A0A0]">Subtotal</span>
        <span className="text-text font-semibold">
          ${subtotal.toFixed(2)}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-[#A0A0A0]">
          Shipping ({order.shippingMethod || "Standard"})
        </span>
        <span className="text-text font-semibold">
          ${shippingCost.toFixed(2)}
        </span>
      </div>

      {order.discountAmount > 0 && (
        <div className="flex justify-between bg-primary/10  rounded-lg">
          <span className="text-[#A0A0A0]">
            Discount 
          </span>
          <span className="text-primary font-bold">
            -${order.discountAmount.toFixed(2)}
          </span>
        </div>
      )}
    </div>

    {/* Total */}
    <div className="border-t border-border/20 pt-6">
      <div className="flex justify-between items-baseline">
        <span className="text-lg font-bold text-text">Total</span>
        <span className="text-2xl font-black text-primary">
          ${total.toFixed(2)}
        </span>
      </div>
      <p className="text-xs text-[#A0A0A0] mt-1">
        Includes taxes & fees
      </p>
    </div>
  </div>
</div>



            {/* Payment Status */}
            <div className="bg-surface-dark p-4 rounded-2xl border border-border-dark text-center">
              {rzpOrder ? (
                <div className="flex items-center justify-center gap-2 text-primary font-semibold text-sm">
                  <span className="material-symbols-outlined">check_circle</span>
                  Ready! Order {rzpOrder.orderId?.slice(-8) || 'Loading...'}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                  <span className="material-symbols-outlined animate-spin">hourglass_empty</span>
                  Preparing secure checkout...
                </div>
              )}
            </div>

            {/* BIG Payment Button */}
            <button 
              onClick={handlePayment}
              disabled={paymentLoading || !rzpOrder}
                    className="w-full h-14 bg-gradient-to-r from-primary to-primary-dark text-white font-black text-lg rounded-2xl flex items-center justify-center hover:scale-[1.02] transition-all shadow-2xl hover:shadow-primary/25"
            >
              {paymentLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-2xl">payment</span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-2xl">payments</span>
                  Pay ${total.toFixed(2)} Now
                </>
              )}
            </button>

            {/* Return Link */}
            <div className="flex flex-col gap-6 pt-4">
              <a 
                href="/OrderReview"
                className="-mt text-primary hover:text-primary/80 font-bold flex items-center justify-center gap-2 text-md  tracking-widest"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Edit Order
              </a>
            </div>
          </div>
        </main>


        {/* RIGHT: Desktop Summary - IDENTICAL */}
        <aside className="hidden lg:block w-[42%] xl:w-[40%] bg-background-light dark:bg-background-dark border-l border-gray-200 dark:border-border-dark order-1 lg:order-2">
          <div className="sticky top-0 h-screen overflow-y-auto px-8 xl:px-14 py-12 flex flex-col gap-6">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-300 dark:border-border-dark bg-gray-200">
                  <img 
                    src={item.image || item.images?.[0] || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNFOUU5RTkvMzNGNEY0Ii8+Cjx0ZXh0IHg9IjMyIiB5PSIzOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii0yIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSI2MDAiPkNhbmRsZTwvdGV4dD4KPC9zdmc+"} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold ">{item.name}</h4>
                   <p className="text-base text-sm text-[#A0A0A0]">Price: ${item.price}</p>
                  <p className="text-xs text-gray-400">Quantity: {item.variant || item.quantity}</p>
                </div>
                <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="border-t border-gray-300 dark:border-border-dark" />
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({order.shippingMethod || 'Standard'})</span>
                <span className="text-gray-400">${shippingCost.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-gray-400">-${order.discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="border-t border-gray-300 dark:border-border-dark" />
            <div className="flex justify-between items-baseline pt-4">
              <span className="text-base font-medium">Total</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-gray-400">USD</span>
                <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
        </aside>
        
      </div>
      
<div className="">
           <Footer2 /></div>
    </div>
  );
}
