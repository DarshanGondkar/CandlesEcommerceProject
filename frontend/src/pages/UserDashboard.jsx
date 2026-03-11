import React, { useState, useEffect } from "react";
import Header2 from "./Header2";
import Footer2 from "./Footer2";
import { getUser, isAuthenticated } from "../utils/auth";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch real logged-in user
  useEffect(() => {
    if (isAuthenticated()) {
      const currentUser = getUser();
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated() || !user) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-8 rounded-xl max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <Link to="/Login" className="bg-primary text-white px-6 py-3 rounded-lg inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className=" font-display bg-background dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen">
      <Header2 />

      <main className="p-6 lg:p-10 max-w-6xl mx-auto">

        {/* ================= WELCOME HEADER ================= */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#28282B] mb-2">
            Welcome back, {user.firstName || user.name || user.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            Here's a quick overview of your account activity.
          </p>
        </div>

        {/* ================= QUICK LINKS ================= */}
        <div className="mb-14">
          <h2 className="mb-4 text-lg font-bold">Quick Links</h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[
              ["My Profile", "person", "/UpdateProfile"],
                 ["Address Book", "import_contacts", "/AddressBook"],
              ["My Orders", "package_2", "/MyOrders"],
              //["Payment Methods", "credit_card", "/PaymentMethod"],
              ["Wishlist", "favorite", "/Wishlist"],
            ].map(([label, icon, href]) => (
              <a
                key={label}
                href={href}
                className="group flex flex-col items-center justify-center gap-2 rounded-xl border bg-surface-light dark:bg-surface-dark p-6 transition hover:bg-primary/10"
              >
                <span className="material-symbols-outlined text-3xl">
                  {icon}
                </span>
                <p className="text-sm font-medium">{label}</p>
              </a>
            ))}

            <a
              href="/Contact"
              className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 hover:border-primary"
            >
              <span className="material-symbols-outlined text-3xl">
                support_agent
              </span>
              <p className="text-sm font-medium">Help & Support</p>
            </a>
          </div>
        </div>

        {/* ================= LOGGED-IN USER INFO ================= */}
        <div className="mb-12">
          <h2 className="text-lg font-bold mb-4">Logged in as</h2>

          <div className="rounded-xl border bg-surface-light dark:bg-surface-dark p-6 flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-text">
             <span className="material-symbols-outlined text-3xl">
                person    </span>
{   /*           {user.firstName?.charAt(0) || user.name?.charAt(0) || user.email?.charAt(0)}*/}            </div>

            <div>
              <p className="font-semibold text-lg">
                {user.firstName || user.name || 'User'}
              </p>
              <p className="text-sm text-text-muted-light">
                {user.email}
              </p>
            </div>
          </div>
        </div>

  {/* ================= LATEST ORDER DETAILS ================= *
        <div className="mb-16">
          <h2 className="text-lg font-bold mb-4">Your Latest Order</h2>

          <div className="rounded-xl border bg-surface-light dark:bg-surface-dark p-5">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div
                className="h-32 w-32 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${latestOrder.image})` }}
              />

              <div className="flex-1">
                <p className="font-bold text-lg">
                  Order #{latestOrder.id}
                </p>
                <p className="text-sm text-text-muted-light mb-1">
                  {latestOrder.product}
                </p>
                <p className="text-sm text-text-muted-light">
                  Estimated Delivery: {latestOrder.deliveryDate}
                </p>
              </div>

              <div className="flex gap-3">
                <a href="/MyOrders">
                  <button className="px-4 py-2 rounded-lg border font-medium hover:bg-primary/10">
                    View Orders
                  </button>
                </a>
                <a href="/TrackOrder">
                  <button className="px-4 py-2 rounded-lg bg-primary font-bold text-background-dark">
                    Track Order
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
*/}
      </main>

      <Footer2 />
    </div>
  );
};

export default UserDashboard;
