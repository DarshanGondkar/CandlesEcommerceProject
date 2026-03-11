import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardHeader3 from "./DashboardHeader3";
import Footer2 from "./Footer2";
import { getUser, isAuthenticated } from "../utils/auth";
import axios from "axios"; // Your API client
import { showError, showInfo, showSuccess } from "../utils/toast";
const API_URL = 'https://candlesecommerceproject.onrender.com/api'; // ✅ HARDCODE (like your authService)


const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
    isDefault: false,
    type: "shipping",
  });
  
  const [user, setUser] = useState(null); // 🔥 ADD USER STATE
// 🔥 FIXED: Get user + addresses
useEffect(() => {
 console.log('🔑 Token:', localStorage.getItem('token'));
  console.log('🔑 Token length:', localStorage.getItem('token')?.length);
  console.log('✅ isAuthenticated:', isAuthenticated());
  if (isAuthenticated()) {
    const currentUser = getUser();
    console.log('Current user:', currentUser);
    setUser(currentUser);
    
    // Fetch addresses
    fetchAddresses();
  } else {
    console.log('❌ Not authenticated - redirecting...');
  }
  
  setIsLoading(false);
}, []);


 const fetchAddresses = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('🚀 Sending token:', token?.substring(0, 20) + '...');  // ✅ DEBUG
    
  if (!token) {
  alert("Please login again");
  return;
}
    
    const res = await axios.get(`${API_URL}/users/addresses`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    setAddresses(res.data);
  } catch (error) {
    console.error('Failed to fetch addresses:', error.response?.data);
  }
};



  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.name ||
    !formData.addressLine1 ||
    !formData.city ||
    !formData.state ||
    !formData.zipCode ||
    !formData.country ||
    formData.phone.length !== 10) {
  showInfo("Please fill all required fields correctly (Phone must be 10 digits)");
  return;
}

  const token = localStorage.getItem('token');
  if (!token || token.length < 100) {  // ✅ ADD LINES 68-70
    console.error('❌ No valid token found');
    alert('Please login again');
    return;
  }
  try {
   // const token = localStorage.getItem('token');
    const endpoint = editingId 
      ? `${API_URL}/users/addresses/${editingId}` 
      : `${API_URL}/users/addresses`;
    
    const method = editingId ? 'put' : 'post';
    
    await axios[method](endpoint, formData, {
     headers: { 
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json'
}

    });
  showSuccess(editingId ? "Address updated successfully!" : "Address saved successfully!");

setFormData({
  name: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  phone: "",
  isDefault: false,
  type: "shipping",
});

setShowAddForm(false);
setEditingId(null);
fetchAddresses();
    // ... rest unchanged
  } catch (error) {
console.error("Address save failed:", error.response?.data);
showError(error.response?.data?.message || "Failed to save address");  }
};


  // ... rest of your functions (handleEdit, handleDelete, handleSetDefault stay same)

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary/60">Loading addresses...</p>
        </div>
      </div>
    );
  }



  const handleEdit = (address) => {
    setEditingId(address._id);
    setFormData(address);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
  if (!confirm('Delete this address?')) return;
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/users/addresses/${id}`, {  // ✅ FIXED
headers: { 
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json'
}
    });
    fetchAddresses();
  } catch (error) {
    console.error('Delete failed');
  }
};

const handleSetDefault = async (id) => {
  try {
    const token = localStorage.getItem('token');
    await axios.patch(`${API_URL}/users/addresses/${id}/default`, {}, {  // ✅ FIXED
headers: { 
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json'
}
    });
    fetchAddresses();
  } catch (error) {
    console.error('Set default failed');
  }
};



  const defaultShipping = addresses.find(a => a.isDefault && a.type === 'shipping');
  const billingAddress = addresses.find(a => a.type === 'billing');

  return (
    <div className=" bg-background  font-display text-gray-800 dark:text-gray-200 min-h-screen overflow-x-hidden">
      <DashboardHeader3 />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <main className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <h1 className="text-text text-4xl sm:text-5xl font-black tracking-[-0.033em]">
                  Address Book
                </h1>
                <p className="mt-2 text-lg text-text/70">
                  Manage your saved addresses for faster checkout.
                </p>
              </div>

              <button 
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-text hover:bg-primary/90 transition-all"
              >
                <span className="material-symbols-outlined">add_location</span>
                Add New Address
              </button>
            </div>

            {/* ADD/EDIT FORM MODAL */}
            {showAddForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/20 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                      {editingId ? 'Edit Address' : 'Add New Address'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingId(null);
                      }}
                      className="text-white/70 hover:text-white"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm text-white/80 mb-2">Full Name</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-lg bg-white/10 px-4 py-3 text-white border border-white/20 focus:border-primary focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white/80 mb-2">Address Line 1</label>
                      <input
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleInputChange}
                        className="w-full rounded-lg bg-white/10 px-4 py-3 text-white border border-white/20 focus:border-primary focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white/80 mb-2">Address Line 2 (Optional)</label>
                      <input
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleInputChange}
                        className="w-full rounded-lg bg-white/10 px-4 py-3 text-white border border-white/20 focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/80 mb-2">City</label>
                        <input
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full rounded-lg bg-white/10 px-4 py-3 text-white border border-white/20 focus:border-primary focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/80 mb-2">ZIP Code</label>
                        <input
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full rounded-lg bg-white/10 px-4 py-3 text-white border border-white/20 focus:border-primary focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/80 mb-2">State</label>
                     <input
  name="state"
  value={formData.state}
  onChange={handleInputChange}
  className="w-full rounded-lg bg-white/10 px-4 py-3 text-white border border-white/20 focus:border-primary focus:outline-none"
  required
/>
                      </div>

<div>
  <label className="block text-sm text-white/80 mb-2">Country</label>
  <input
    name="country"
    value={formData.country}
    onChange={handleInputChange}
    className="w-full rounded-lg bg-white/10 px-4 py-3 text-white border border-white/20 focus:border-primary focus:outline-none"
    required
  />
</div>

           
                     <div > <label className="block text-sm text-white/80 mb-2">Phone</label>
                   <input
  name="phone"
  type="tel"
  inputMode="numeric"
  maxLength={10}
  value={formData.phone}
  onChange={(e) => {
    const numbersOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData({
      ...formData,
      phone: numbersOnly,
    });
  }}
  className="w-full rounded-lg bg-white/10 px-4 py-3 text-white border border-white/20 focus:border-primary focus:outline-none"
  required
/>
    </div>   
     </div>

                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-white/80">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={formData.isDefault}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary bg-white/10 border-white/20 rounded focus:ring-primary"
                        />
                        Set as default
                      </label>
                      <label className="flex items-center gap-2 text-white/80">
                        <input
                          type="radio"
                          name="type"
                          value="shipping"
                          checked={formData.type === "shipping"}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary bg-white/10 border-white/20 rounded focus:ring-primary"
                        />
                        Shipping
                      </label>
                      <label className="flex items-center gap-2 text-white/80">
                        <input
                          type="radio"
                          name="type"
                          value="billing"
                          checked={formData.type === "billing"}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary bg-white/10 border-white/20 rounded focus:ring-primary"
                        />
                        Billing
                      </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-all"
                      >
                        {editingId ? 'Update Address' : 'Save Address'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingId(null);
                        }}
                        className="flex-1 bg-white/10 text-white py-3 px-6 rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ADDRESS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* DEFAULT SHIPPING */}
              {defaultShipping && (
                <div className="bg-background/5 rounded-xl p-6 border border-border/10 flex flex-col">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold text-text">Default Shipping</h3>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(defaultShipping)} className="h-8 w-8 rounded-full bg-primary/20 hover:bg-primary text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button onClick={() => handleDelete(defaultShipping._id)} className="h-8 w-8 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-text/70 space-y-1 grow">
                    <p>{defaultShipping.name}</p>
                    <p>{defaultShipping.addressLine1}</p>
                    {defaultShipping.addressLine2 && <p>{defaultShipping.addressLine2}</p>}
                    <p>{defaultShipping.city}, {defaultShipping.state} {defaultShipping.zipCode}</p>
                    <p>{defaultShipping.country}</p>
                    <p>{defaultShipping.phone}</p>
                  </div>

                  <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
                    <span className="material-symbols-outlined">check_circle</span>
                    Default Address
                  </span>
                </div>
              )}

              {/* OTHER ADDRESSES */}
              {addresses.map((address) => (
                <div key={address._id} className="bg-background/5 rounded-xl p-6 border border-border/10 flex flex-col">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold text-text capitalize">
                      {address.type} Address
                    </h3>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(address)} className="h-8 w-8 rounded-full bg-primary/20 hover:bg-primary text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button onClick={() => handleDelete(address._id)} className="h-8 w-8 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-text/70 space-y-1 grow">
                    <p>{address.name}</p>
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                    <p>{address.country}</p>
                    <p>{address.phone}</p>
                  </div>

                  {!address.isDefault && (
                    <button 
                      onClick={() => handleSetDefault(address._id)}
                      className="mt-6 text-sm font-medium text-primary hover:text-primary/80"
                    >
                      Set as Default {address.type === 'shipping' ? 'Shipping' : 'Billing'}
                    </button>
                  )}
                </div>
              ))}

              {/* EMPTY STATE */}
              {!addresses.length && !showAddForm && (
                <div className="md:col-span-2 text-center py-20">
                  <span className="material-symbols-outlined text-6xl text-text/30 mb-4 block">location_off</span>
                  <h3 className="text-2xl font-bold text-text mb-2">No addresses saved</h3>
                  <p className="text-text/60 mb-6">Add your first address for faster checkout.</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center gap-2 bg-primary text-text px-6 py-3 rounded-lg font-semibold hover:bg-primary/90"
                  >
                    <span className="material-symbols-outlined">add_location</span>
                    Add First Address
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer2 />
    </div>
  );
};

export default AddressBook;
