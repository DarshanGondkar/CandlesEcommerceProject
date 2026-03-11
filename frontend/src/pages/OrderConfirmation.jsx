import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header2 from "./Header2";
import { FiCopy, FiDownload } from "react-icons/fi";
import Footer2 from "./Footer2";

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copyStatus, setCopyStatus] = useState("");

  // Ensure every order has a proper orderNumber
useEffect(() => {
// inside useEffect in OrderConfirmationPage
const completedOrder = localStorage.getItem("completedOrder");
if (!completedOrder) {
  navigate("/Payment");
  return;
}

const parsedOrder = JSON.parse(completedOrder);

// Make sure every order has an orderNumber
const normalizedOrder = {
  ...parsedOrder,
  orderNumber: parsedOrder.orderNumber || parsedOrder.transactionId || parsedOrder.razorpayPaymentId,
};

// Save to myOrders
const existingOrders = JSON.parse(localStorage.getItem("myOrders")) || [];
const alreadyExists = existingOrders.find(o => o.orderNumber === normalizedOrder.orderNumber);

if (!alreadyExists) {
  localStorage.setItem("myOrders", JSON.stringify([...existingOrders, normalizedOrder]));
}

setOrder(normalizedOrder);
  setVerified(true);
  setLoading(false);
}, [navigate]);

  // Replace your useEffect verification:
useEffect(() => {
  const completedOrder = localStorage.getItem("completedOrder");
  if (completedOrder) {
    const parsedOrder = JSON.parse(completedOrder);
    console.log("OrderConfirmation loaded:", parsedOrder);
    
    // ✅ Use local data directly - NO verification needed
    if (parsedOrder.razorpayPaymentId) {
//new
// ✅ Save order to myOrders list
const existingOrdersRaw =
  JSON.parse(localStorage.getItem("myOrders")) || [];

// ✅ remove null or invalid orders
const existingOrders = existingOrdersRaw.filter(
  (o) => o && o.orderNumber
);

// check duplicate safely
const alreadyExists = existingOrders.find(
  (o) => o.orderNumber === parsedOrder.orderNumber
);

if (!alreadyExists) {
  localStorage.setItem(
    "myOrders",
    JSON.stringify([...existingOrders, parsedOrder])
  );
}


/*if (!alreadyExists) {
  localStorage.setItem(
    "myOrders",
    JSON.stringify([...existingOrders, parsedOrder])
  );
}
*/

      setOrder(parsedOrder);
      setVerified(true);
      setLoading(false);
    } else {
      navigate("/Payment");
    }
  } else {
    navigate("/Payment");
  }
}, [navigate]);

  // Load and verify order
 /* useEffect(() => {
    const completedOrder = localStorage.getItem("completedOrder");
    if (completedOrder) {
      const parsedOrder = JSON.parse(completedOrder);
      
      // Auto-verify payment (simulate gateway callback)
      verifyPayment(parsedOrder).then((isValid) => {
        if (isValid) {
          parsedOrder.verificationStatus = "verified";
          setOrder(parsedOrder);
          setVerified(true);
          localStorage.setItem("completedOrder", JSON.stringify(parsedOrder));
        } else {
          // Payment failed verification
          localStorage.removeItem("completedOrder");
          navigate("/Payment", { state: { error: "payment_failed" } });
        }
        setLoading(false);
      });
    } else {
      navigate("/Payment");
    }
  }, [navigate]);*/

  const verifyPayment = async (order) => {
    // Simulate real payment verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check transaction patterns (production: verify with gateway)
    const isValid = order.status === "paid" && order.transactionId;
    console.log("Payment verified:", isValid, order.transactionId);
    return isValid;
  };

  
  const copyOrderId = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopyStatus("Copied!");
    setTimeout(() => setCopyStatus(""), 2000);
  };

  const downloadInvoice = () => {
  const invoice = `
═══════════════════════════════════════════════
           LUMINA CANDLES - INVOICE
═══════════════════════════════════════════════

Order Number: #${order.orderNumber}
Date: ${new Date(order.paymentDate).toLocaleDateString()}
Transaction ID: ${order.transactionId || order.razorpayPaymentId}
Payment Method: ${(order.paymentMethod || "Online Payment").toUpperCase()}

───────────────────────────────────────────────
CUSTOMER DETAILS
───────────────────────────────────────────────
Name: ${order.customer.firstName} ${order.customer.lastName}
Email: ${order.customer.email}
Phone: ${order.customer.phone}

───────────────────────────────────────────────
SHIPPING ADDRESS
───────────────────────────────────────────────
${order.shippingAddress.address}
${order.shippingAddress.apartment ? order.shippingAddress.apartment + '\n' : ''}${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}
${order.shippingAddress.country}

───────────────────────────────────────────────
ITEMS ORDERED
───────────────────────────────────────────────
${order.items.map(item => 
  `${item.name}\nQty: ${item.quantity} × $${item.price.toFixed(2)} = $${(item.price * item.quantity).toFixed(2)}`
).join('\n\n')}

───────────────────────────────────────────────
PAYMENT SUMMARY
───────────────────────────────────────────────
Subtotal:        $${order.subtotal.toFixed(2)}
Shipping:        $${order.shippingCost.toFixed(2)}
${order.discountAmount > 0 ? `Discount:       -$${order.discountAmount.toFixed(2)}\n` : ''}
───────────────────────────────────────────────
TOTAL PAID:      $${order.total.toFixed(2)}
═══════════════════════════════════════════════

Thank you for shopping with Lumina Candles!
© ${new Date().getFullYear()} Lumina Candles Pvt. Ltd.
All rights reserved.
`;

  try {
    const blob = new Blob([invoice], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Lumina-Invoice-${order.orderNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log("✅ Invoice downloaded successfully");
  } catch (error) {
    console.error("Download failed:", error);
    alert("Failed to download invoice. Please try again.");
  }
};
  /*const downloadInvoice = () => {
    // Generate PDF (simple text version)
    const invoice = `LUMINA CANDLES - INVOICE

Order: ${order.orderNumber}
Date: ${new Date(order.paymentDate).toLocaleDateString()}
Total: $${order.total.toFixed(2)}

Items:
${order.items.map(item => `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Shipping: ${order.shippingAddress.address}, ${order.shippingAddress.city}
Payment: ${order.paymentMethod.toUpperCase()} (${order.transactionId})

Thank you for shopping with Lumina Candles!
    `;
    
    const blob = new Blob([invoice], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.orderNumber}.txt`;
    a.click();
  };*/

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-xl text-green-600 animate-pulse flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl">hourglass_empty</span>
          Verifying payment...
        </div>
      </div>
    );
  }

  if (!order || !verified) return null;
return (
  <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased min-h-screen flex flex-col">
    <Header2 />

    <div className="flex flex-col lg:flex-row flex-1">

      {/* LEFT SECTION */}
      <main className="w-full lg:w-[58%] xl:w-[60%] px-5 pt-10 pb-16 lg:px-12 xl:px-20 flex flex-col gap-10 order-2 lg:order-1">

        {/* SUCCESS HEADER */}
        <div className="text-center lg:text-left">
          <div className="w-16 h-16 lg:ml-40 bg-primary rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6 animate-bounce">
            <span className="material-symbols-outlined text-background-dark text-3xl">
              check
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Order Confirmed
          </h1>

          <p className="text-slate-500 dark:text-[#92c9ad] text-lg max-w-xl">
            Thank you <strong>{order.customer.firstName}</strong>. 
            Your order has been successfully placed.
          </p>
        </div>

        {/* ORDER INFO CARD */}
        <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 space-y-4">

          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Order Number</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold">
                #{order.orderNumber}
              </span>
              <button onClick={copyOrderId}>
                <FiCopy className="text-sm hover:text-primary" />
              </button>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Transaction ID</span>
          
          
           <span className="font-medium text-sm">{order.transactionId || order.razorpayPaymentId}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Payment Method</span>
            <span className="font-medium">
              {(order.paymentMethod || "Online Payment").toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Date</span>
            <span className="font-medium">
              {new Date(order.paymentDate).toLocaleDateString()}
            </span>
          </div>
        </div>

{/* MOBILE ORDER SUMMARY */}
<div className="lg:hidden bg-surface-dark border border-border-dark rounded-2xl p-6 space-y-4">

  <h3 className="text-lg font-bold mb-4">Order Summary</h3>

  {order.items.map((item, idx) => (
    <div key={idx} className="flex items-center gap-4">
      <div className="relative w-14 h-14 rounded-lg overflow-hidden border bg-gray-200">
        <img
          src={item.image || item.images?.[0]}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
          {item.quantity}
        </span>
        
      </div>

 <div className="flex-1 min-w-0">
  <h4 className="text-sm font-semibold ">
    {item.name}
  </h4>
   <p className="text-base text-sm text-[#A0A0A0]">Price: ${item.price}</p>
  <p className="text-xs text-slate-500">Quantity: {item.quantity}</p>
</div>
      

      <span className="text-sm font-medium">
        ${(item.price * item.quantity).toFixed(2)}
      </span>

    </div>
  ))}

  <div className="border-t border-border-dark pt-4 text-sm space-y-2">
    <div className="flex justify-between">
      <span>Subtotal</span>
      <span>${order.subtotal.toFixed(2)}</span>
    </div>

    <div className="flex justify-between">
      <span>Shipping</span>
      <span>${order.shippingCost.toFixed(2)}</span>
    </div>

    {order.discountAmount > 0 && (
      <div className="flex justify-between">
        <span>Discount</span>
        <span>- ${order.discountAmount.toFixed(2)}</span>
      </div>
    )}

    <div className="flex justify-between font-bold text-primary text-base pt-3 border-t border-border-dark">
      <span>Total Paid</span>
      <span>${order.total.toFixed(2)}</span>
    </div>
  </div>

</div>

        {/* SHIPPING DETAILS */}
        <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              local_shipping
            </span>
            Shipping Address
          </h3>

          <div className="text-sm text-slate-400 space-y-1">
            <p className="text-slate-900 dark:text-white font-semibold">
              {order.customer.firstName} {order.customer.lastName}
            </p>
            <p>{order.shippingAddress.address}</p>
            {order.shippingAddress.apartment && (
              <p>{order.shippingAddress.apartment}</p>
            )}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </p>
            <p className="pt-2 text-primary font-semibold">
              {order.shippingMethod === "standard"
                ? "Standard (3–5 days)"
                : "Express (1–2 days)"}
            </p>
          </div>
        </div>


        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={downloadInvoice}
            className="flex-1 border border-border-dark hover:border-primary transition rounded-xl py-4 font-semibold"
          >
            Download Invoice
          </button>

          <a
            href="/MyOrders"
            className="flex-1 bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 rounded-xl text-center"
          >
            My Orders
          </a>
        </div>


        <div className="pt-6">
          <a
            href="/ProductListing"
            className="text-primary font-bold text-sm uppercase tracking-widest"
          >
            ← Continue Shopping 
          </a>
        </div>

      </main>

      {/* RIGHT DESKTOP SUMMARY (SAME AS PAYMENT PAGE) */}
      <aside className="hidden lg:block w-[42%] xl:w-[40%] bg-background-light dark:bg-background-dark border-l border-gray-200 dark:border-border-dark order-1 lg:order-2">
        <div className="sticky top-0 h-screen overflow-y-auto px-8 xl:px-14 py-12 flex flex-col gap-6">

          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-300 dark:border-border-dark bg-gray-200">
                <img
                  src={item.image || item.images?.[0]}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold ">
                  {item.name}
                </h4>
                 <p className="text-base text-sm text-[#A0A0A0]">Price: ${item.price}</p>
                                       <p className="text-base text-sm text-[#A0A0A0]">Quantity: {item.variant ||    item.quantity}</p>

              </div>
              <span className="text-sm font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="border-t border-gray-300 dark:border-border-dark" />

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${order.shippingCost.toFixed(2)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-${order.discountAmount.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-gray-300 dark:border-border-dark" />

          <div className="flex justify-between items-baseline pt-4">
            <span className="text-base font-medium">Total Paid</span>
            <span className="text-2xl font-bold text-primary">
              ${order.total.toFixed(2)}
            </span>
          </div>

        </div>
      </aside>

    </div>
    <Footer2 />
  </div>
);
}
