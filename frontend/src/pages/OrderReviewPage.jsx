import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header2 from "./Header2";
import axios from "axios";
import { isAuthenticated, getUser } from "../utils/auth";

import { showSuccess, showError, showInfo } from "../utils/toast";

const API_URL = 'https://candlesecommerceproject.onrender.com/api';

export default function OrderReviewPage() {
  const navigate = useNavigate();
  
  // States
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editContact, setEditContact] = useState({
    firstName: '', lastName: '', email: '', phone: ''
  });
  const [editShipping, setEditShipping] = useState({
    address: '', apartment: '', city: '', state: '', zip: '', country: ''
  });
  const [shippingMethod, setShippingMethod] = useState("standard");
const [userAddresses, setUserAddresses] = useState(null);
const [defaultShippingAddress, setDefaultShippingAddress] = useState(null);

const [discountCode, setDiscountCode] = useState("");

const fetchUserAddresses = async (currentOrder) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${API_URL}/users/addresses`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const defaultShipping = res.data.find(
      a => a.isDefault && a.type === "shipping"
    );

    if (!defaultShipping) return;

    setDefaultShippingAddress(defaultShipping);

    // ✅ Only override if order doesn't already have address
    if (!currentOrder?.shippingAddress?.address) {

      const updatedOrder = {
        ...currentOrder,
        shippingAddress: {
          address: defaultShipping.addressLine1,
          apartment: defaultShipping.addressLine2 || "",
          city: defaultShipping.city,
          state: defaultShipping.state,
          zip: defaultShipping.zipCode,
          country: defaultShipping.country
        },
        customer: {
          ...currentOrder.customer,
          firstName: defaultShipping.name?.split(" ")[0] || "",
          lastName: defaultShipping.name?.split(" ").slice(1).join(" ") || "",
          phone: defaultShipping.phone || ""
        }
      };

      setOrder(updatedOrder);
      localStorage.setItem("currentOrder", JSON.stringify(updatedOrder));
    }

  } catch (error) {
    console.error("Failed to fetch addresses:", error);
  }
};

/*useEffect(() => {
  const savedOrder = localStorage.getItem("currentOrder");
  if (savedOrder) {
    setOrder(JSON.parse(savedOrder));
  }
}, []);*/

useEffect(() => {
  const savedOrder = localStorage.getItem("currentOrder");
  if (savedOrder) {
    const parsedOrder = JSON.parse(savedOrder);
    setOrder(parsedOrder);
    
    // ✅ Load discount code
    if (parsedOrder.discountCode) {
      setDiscountCode(parsedOrder.discountCode);
    }
    
    // ✅ Load shipping method
    if (parsedOrder.shippingMethod) {
      setShippingMethod(parsedOrder.shippingMethod);
    }
  }
}, []);

  const handleShippingMethodChange = (method) => {
    const shippingCost = method === "express" ? 15 : 5;
    const updatedOrder = {
      ...order,
      shippingMethod: method,
      shippingCost,
      total: order.subtotal + shippingCost - (order.discountAmount || 0)
    };
    setOrder(updatedOrder);
    setShippingMethod(method);
    localStorage.setItem("currentOrder", JSON.stringify(updatedOrder));
  };

useEffect(() => {
  const loadOrderData = async () => {
    try {
      const orderData = localStorage.getItem("currentOrder");

      if (!orderData) {
        navigate("/PaymentCustomerInfo");
        return;
      }

      const parsedOrder = JSON.parse(orderData);

      const normalizedItems = parsedOrder.items?.map(item => ({
        _id: item._id,
        name: item.name || item.title || "Product",
        image: item.image || item.images?.[0] || "",
        price: parseFloat(item.price || item.product?.price || 0),
        quantity: item.quantity || 1,
      })) || [];

      parsedOrder.items = normalizedItems;

      setOrder(parsedOrder);

      if (isAuthenticated()) {
        await fetchUserAddresses(parsedOrder);
      }

    } catch (err) {
      console.error("Order load failed:", err);
      navigate("/PaymentCustomerInfo");   // ✅ MOVE redirect here
    } finally {
      setLoading(false);
    }
  };

  loadOrderData();
}, []);



  // Load order data - FIXED (single useEffect)
 

const handleEditToggle = () => {
  if (!editMode) {
    // Open edit mode
    const firstName =
      order?.customer?.firstName ||
      defaultShippingAddress?.name?.split(" ")[0] ||
      "";
    const lastName =
      order?.customer?.lastName ||
      defaultShippingAddress?.name?.split(" ").slice(1).join(" ") ||
      "";
    const email =
      order?.customer?.email ||
      getUser()?.email ||
      "";
    const phone =
      order?.customer?.phone ||
      defaultShippingAddress?.phone ||
      "";
    const address =
      order?.shippingAddress?.address ||
      defaultShippingAddress?.addressLine1 ||
      "";
    const apartment =
      order?.shippingAddress?.apartment ||
      defaultShippingAddress?.addressLine2 ||
      "";
    const city =
      order?.shippingAddress?.city ||
      defaultShippingAddress?.city ||
      "";
    const state =
      order?.shippingAddress?.state ||
      defaultShippingAddress?.state ||
      "";
    const zip =
      order?.shippingAddress?.zip ||
      defaultShippingAddress?.zipCode ||
      "";
    const country =
      order?.shippingAddress?.country ||
      defaultShippingAddress?.country ||
      "";

    setEditContact({ firstName, lastName, email, phone });
    setEditShipping({ address, apartment, city, state, zip, country });
    setEditMode(true);
  } else {
    // Save mode – validate first
    const { firstName, lastName, email, phone } = editContact;
    const { address, city, state, zip, country } = editShipping;

    // ✅ Check empty fields
    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zip || !country) {
      showInfo("Please fill all required contact & shipping fields before saving.");
      return;
    }

    // ✅ Check phone number length
    if (phone.replace(/\D/g, "").length < 10) {
      showInfo("Phone number must be at least 10 digits.");
      return;
    }

    // Save
    const updatedOrder = {
      ...order,
      customer: { ...order.customer, ...editContact },
      shippingAddress: { ...order.shippingAddress, ...editShipping },
    };
    setOrder(updatedOrder);
    localStorage.setItem("currentOrder", JSON.stringify(updatedOrder));
    showInfo("Details updated successfully ✅");
    setEditMode(false);
  }
};


  const handleContactChange = (e) => {
    setEditContact({ ...editContact, [e.target.id]: e.target.value });
  };

  const handleShippingChange = (e) => {
    setEditShipping({ ...editShipping, [e.target.id]: e.target.value });
  };



 const validateBeforePayment = () => {

  const customer = {
    firstName:
      order?.customer?.firstName ||
      defaultShippingAddress?.name?.split(" ")[0] ||
      "",
    lastName:
      order?.customer?.lastName ||
      defaultShippingAddress?.name?.split(" ").slice(1).join(" ") ||
      "",
    email:
      order?.customer?.email ||
      getUser()?.email ||
      "",
    phone:
      order?.customer?.phone ||
      defaultShippingAddress?.phone ||
      "",
  };

  const shipping = {
    address:
      order?.shippingAddress?.address ||
      defaultShippingAddress?.addressLine1 ||
      "",
    city:
      order?.shippingAddress?.city ||
      defaultShippingAddress?.city ||
      "",
    state:
      order?.shippingAddress?.state ||
      defaultShippingAddress?.state ||
      "",
    zip:
      order?.shippingAddress?.zip ||
      defaultShippingAddress?.zipCode ||
      "",
    country:
      order?.shippingAddress?.country ||
      defaultShippingAddress?.country ||
      "",
  };

  if (
    !customer.firstName ||
    !customer.lastName ||
    !customer.email ||
    !customer.phone ||
    !shipping.address ||
    !shipping.city ||
    !shipping.state ||
    !shipping.zip ||
    !shipping.country
  ) {
    alert("Please fill all contact and shipping address fields before continuing.");
    return false;
  }

  if (customer.phone.length !== 10) {
    alert("Mobile number must be exactly 10 digits.");
    return false;
  }

  return true;
};

const handleContinueToPayment = () => {
  if (!validateBeforePayment()) return;

  navigate("/Payment");
};


  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400 animate-pulse">
          Loading your order...
        </div>
      </div>
    );
  }

 /*  if (!order) {
    navigate("/PaymentCustomerInfo");
    return null;
  }
 /* if (!order) {
  return null;
}*/

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text min-h-screen flex flex-col">
      <Header2 />

      {/* Mobile Order Summary Accordion */}
      <div className="sticky top-2 z-50 mb-1 mt-6 mx-auto max-w-2xl px-4 lg:hidden">
        <details className="rounded-xl border border-slate-200 dark:border-[#32674d] bg-white dark:bg-[#11221a] overflow-hidden group">
          <summary className="flex cursor-pointer items-center justify-between gap-6 px-5 py-4 list-none">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">shopping_cart</span>
              <p className="text-slate-900 dark:text-text text-sm font-semibold tracking-wide">
                Order summary
              </p>
              <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </div>
            <p className="text-slate-900 dark:text-text text-lg font-bold">
              ${order.total?.toFixed(2) || '0.00'}
            </p>
          </summary>
          <div className="px-5 pb-5 border-t border-slate-100 dark:border-[#234836] pt-4 space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded overflow-hidden bg-gray-200 flex-shrink-0">
                  <img 
                    src={item.image || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFOUU5RTkvMzNGNEY0Ii8+Cjx0ZXh0IHg9IjIwIiB5PSIyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii0zIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZm9udC13ZWlnaHQ9IjYwMCI+Q2FuZGxlPC90ZXh0Pgo8L3N2Zz4="} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-slate-900 dark:text-white font-medium block">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <span className="text-slate-500 dark:text-[#92c9ad] truncate">
                         {item.name} x ${item.price} x {item.quantity} 
                  </span>
                </div>
              </div>
            )) || <p className="text-slate-500">No items</p>}
            
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Discount <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">{order.discountCode}</span></span>
                <span className="text-primary font-medium">-${order.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Shipping</span>
              <span className="text-slate-400">${order.shippingCost?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </details>
      </div>

      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-7 lg:py-9">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-12">
            <ol className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-gray-400">
              <li>Information</li>
              <li className="material-symbols-outlined text-xs">chevron_right</li>
              <li className="text-primary font-semibold">Order Review</li>
              <li className="material-symbols-outlined text-xs">chevron_right</li>
              <li>Payment</li>
            </ol>
          </nav>

          <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-text pb-10 ">
            Order Review
          </h2>

          {/* ✅ FIXED GRID LAYOUT - NO OVERLAP */}
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 gap-y-12">
            
            {/* LEFT: Order Details - 7/12 columns */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Contact & Shipping */}
          {/* Contact & Shipping */}
<div className="rounded-xl bg-white p-8 border border-slate-200 shadow-sm">
  <div className="flex justify-between items-start mb-8">
    <h3 className="text-2xl font-bold text-text">
      Contact & Shipping
      {defaultShippingAddress && (
        <span className="ml-2 inline-flex items-center gap-1 text-green-600 text-sm px-3 py-1 rounded-full font-medium bg-green-50">
          <span className="material-symbols-outlined text-sm">verified</span>
          Using your default address
        </span>
      )}
    </h3>

    <button 
      onClick={handleEditToggle}
      className="text-sm text-primary hover:text-primary/80 font-semibold flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg hover:bg-primary/10 transition border border-primary/20"
    >
      {editMode ? 'Save Changes' : 'Edit'}
      <span className="material-symbols-outlined text-base">
        {editMode ? 'save' : 'edit'}
      </span>
    </button>
  </div>

  {editMode ? (
    /* ================= EDIT MODE ================= */
    <div className="space-y-8">

      {/* Contact Info */}
      <div className="space-y-4">
        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
          Contact Information
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            id="firstName"
            value={editContact.firstName}
            onChange={handleContactChange}
            className="w-full bg-background text-text px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="First name"
          />
          <input
            id="lastName"
            value={editContact.lastName}
            onChange={handleContactChange}
            className="w-full bg-background text-text px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Last name"
          />
        </div>

        <input
          id="email"
          type="email"
          value={editContact.email}
          onChange={handleContactChange}
          className="w-full bg-background text-text px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Email address"
        />

        <input
          id="phone"
          value={editContact.phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
            setEditContact({ ...editContact, phone: value });
          }}
          className="w-full bg-background text-text px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Phone number"
        />
      </div>

      {/* Shipping Address */}
      <div className="space-y-4">
        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">
          Shipping Address
        </p>

        <input
          id="address"
          value={editShipping.address}
          onChange={handleShippingChange}
          className="w-full bg-background text-text px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Street address"
        />

        <input
          id="apartment"
          value={editShipping.apartment}
          onChange={handleShippingChange}
          className="w-full bg-background text-text px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Apartment, suite, etc. (optional)"
        />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            id="city"
            value={editShipping.city}
            onChange={handleShippingChange}
            className="bg-background text-text px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="City"
          />
          <input
            id="state"
            value={editShipping.state}
            onChange={handleShippingChange}
            className="bg-background text-text px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="State"
          />
          <input
            id="zip"
            value={editShipping.zip}
            onChange={handleShippingChange}
            className="bg-background text-text px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="ZIP code"
          />
        </div>

        <input
          id="country"
          value={editShipping.country}
          onChange={handleShippingChange}
          className="w-full bg-background text-text px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Country"
        />
      </div>
    </div>
  ) : (
    /* ================= VIEW MODE ================= */
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 pt-8">

      <div>
        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide mb-2">
          Contact:
        </p>
        <div className="space-y-1">
          <p className="text-text text-lg font-semibold">
            {order.customer?.firstName || ''} {order.customer?.lastName || ''}
          </p>
          <p className="text-slate-600 text-sm">
            {order.customer?.email || 'No email'}
          </p>
          <p className="text-slate-600 text-sm">
            {order.customer?.phone || 'No phone'}
          </p>
        </div>
      </div>

      <div>
        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide mb-2">
          Shipping Address:
        </p>
        <div className="space-y-1">
          <p className="text-text text-sm">
            {order.shippingAddress?.address}
            {order.shippingAddress?.apartment && `, ${order.shippingAddress?.apartment}`}
          </p>
          <p className="text-slate-600 text-sm">
            {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}
          </p>
          <p className="text-slate-600 text-sm">
            {order.shippingAddress?.country}
          </p>
        </div>
      </div>

    </div>
  )}
</div>

              {/* Shipping Method */}
              {/* Shipping Method */}
<div className="rounded-xl bg-white p-6 border border-slate-200 shadow-sm">
  <h3 className="text-xl lg:text-2xl font-bold text-text mb-4">Shipping method</h3>

  <div className="space-y-3">
    {[
      { id: "standard", label: "Standard Courier", price: 5, icon: "schedule", days: "3–5 business days" },
      { id: "express", label: "Express Delivery", price: 15, icon: "bolt", days: "1–2 business days" },
    ].map((option) => (
      <label
        key={option.id}
        className="relative flex cursor-pointer items-center rounded-lg border-2 border-slate-200 bg-background hover:border-primary p-3 lg:p-4 hover:border-primary/50 transition-all"
      >
        <input
          type="radio"
          checked={shippingMethod === option.id}
          onChange={() => handleShippingMethodChange(option.id)}
          className="absolute left-3 h-4 w-4 lg:h-5 lg:w-5 border-white text-primary focus:ring-primary"
        />
        <div className="ml-6 flex flex-1 flex-col">
          <div className="flex justify-between items-center">
            <span className="text-sm lg:text-base font-bold text-text uppercase">{option.label}</span>
            <span className="text-sm lg:text-base font-bold text-primary">${option.price.toFixed(2)}</span>
          </div>
          <span className="flex items-center text-xs lg:text-sm text-[#A0A0A0] mt-1">
            <span className="material-symbols-outlined text-sm lg:text-base mr-1">{option.icon}</span>
            {option.days}
          </span>
        </div>
      </label>
    ))}
  </div>
</div>
            </div>

            {/* RIGHT: Order Summary - 5/12 columns */}
            <div className="lg:col-span-5">
              <div className="rounded-xl  bg-white p-8 border border-slate-200 shadow-sm sticky top-12 lg:top-24 h-fit">
                <h3 className="text-2xl font-bold text-text mb-8">Order Summary</h3>

                {/* Items */}
                <div className="space-y-6 border-b border-white/10 pb-8 mb-8">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="relative h-20 w-20 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNFOUU5RTkvMzNGNEY0Ii8+Cjx0ZXh0IHg9IjQwIiB5PSI0OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii0zIiBmaWxsPSIjRkZGRkZGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSI2MDAiPkNhbmRsZTwvdGV4dD4KPC9zdmc+"} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                        {item.quantity > 1 && (
                          <span className="absolute -top-2 -right-2 bg-primary text-text text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                      <div className="flex-grow min-w-0 pt-1">
                        <p className="text-text font-bold text-base sm:text-lg leading-snug break-words ">{item.name}</p>
                     <p className="text-base text-sm text-[#A0A0A0]">Price: ${item.price}</p>
                        <p className="text-base text-sm text-[#A0A0A0]">Quantity: {item.variant ||    item.quantity}</p>
                      </div>
                      <p className="text-2xl font-bold text-text whitespace-nowrap">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  )) || <p className="text-[#A0A0A0] py-8">No items in order</p>}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 text-lg mb-8">
                  <div className="flex justify-between py-2">
                    <span className="text-[#A0A0A0]">Subtotal</span>
                    <span className="text-text font-semibold">${order.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[#A0A0A0]">Shipping ({shippingMethod === "express" ? "Express" : "Standard"})</span>
                    <span className="text-text font-semibold">${order.shippingCost?.toFixed(2) || '0.00'}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between py-2 bg-primary/10  rounded-xl">
                      <span className="text-[#A0A0A0] font-medium align-start">Discount ({order.discountCode ||"Welcome10"})</span>
                      <span className="text-primary font-bold text-lg">-${order.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-slate-200 pt-8 mb-10">
                  <div className="flex justify-between items-baseline pb-2">
                    <span className="text-2xl font-bold text-text">Total</span>
                    <span className="text-4xl font-black text-primary">${order.total?.toFixed(2) || '0.00'}</span>
                  </div>
                  <p className="text-sm text-[#A0A0A0]">Includes taxes & fees</p>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <button 
  onClick={handleContinueToPayment}
                    className="w-full h-14 bg-gradient-to-r from-primary to-primary-dark text-white font-black text-lg rounded-2xl flex items-center justify-center hover:scale-[1.02] transition-all shadow-2xl hover:shadow-primary/25"
                  >
                    Continue to Payment
                  </button>
                 <button
  onClick={() => navigate("/PaymentCustomerInfo")}
  className="w-full h-12 text-primary hover:text-primary/80 font-bold flex items-center justify-center gap-2 text-sm tracking-widest"
>
  <span className="material-symbols-outlined text-lg">arrow_back</span>
  Return to details
</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-7 pb-7 px-6 text-center">
          <p className="text-sm text-gray-400">          © {new Date().getFullYear()} Lumina Candles Pvt. Ltd. All rights reserved.
</p>
        </div>
      </main>
    </div>
  );
}
