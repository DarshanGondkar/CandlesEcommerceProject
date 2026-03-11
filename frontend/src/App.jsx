import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import ProductListing from "./pages/ProductListingPage";
import ProductDetails from "./pages/ProductDetailsPage";
import Cart from "./pages/CartPage";
import Wishlist from "./pages/WishlistPage";
import animation from "./pages/animation";
import Contact from "./pages/Contact";
import Subscription from "./pages/SubscriptionPage";
import Journal from "./pages/Journal";
import PaymentCustomerInfoPage from "./pages/PaymentCustomerInfoPage";
import Payment from "./pages/PaymentPage";
import OrderReviewPage from "./pages/OrderReviewPage";
import OrderConfirmationPage from "./pages/OrderConfirmation";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/ResgistrationPage";
import UpdateProfile from "./pages/UpdateProfile";
import UserDashboard from "./pages/UserDashboard";
import AddressBook from "./pages/AddressBook";
import ShippingAndReturns from "./pages/ShippingAndReturns";
import MyOrders from "./pages/MyOrders";
import PaymentMethod from "./pages/PaymentMethod";
import Faq from "./pages/Faq";

import Header from "./pages/Header";
import Footer from "./pages/Footer";
import ShippingPage from "./pages/ShippingPage";
import TrackOrderPage from "./pages/TrackOrder";
import { SearchProvider } from "./context/SearchContext";
import GlobalSearch from './components/GlobalSearch';
import ResetPassword from "./pages/ResetPassword";
import FlameTransition from "./pages/FlameTransition";
import PrivacyAndTerms from "./pages/PrivacyAndTerms";
import { Toaster } from "react-hot-toast";

import { AnimatePresence, motion } from "framer-motion";
import React, { Suspense, lazy } from "react";
import CandleLoader from "./components/CandleLoader";
import LoaderRoute from "./components/LoaderRoute";
function App() {
  
   const location = useLocation();
  const [loading, setLoading] = useState(false);

 useEffect(() => {
  const pagesWithLoader = [
   // "/ProductListing",
    "/ProductDetails",
   // "/Journal",
    "/Wishlist",
    "/Cart",
  ];

  const shouldShowLoader = pagesWithLoader.some((path) =>
    location.pathname.startsWith(path)
  );

  if (shouldShowLoader) {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  } else {
    setLoading(false);
  }
}, [location]);

  return (

    
<>
  <Toaster
    position="bottom-center"
    containerStyle={{ bottom: 80 }}
    toastOptions={{
      duration: 2500,
      style: {
        borderRadius: "16px",
        padding: "14px 18px",
        fontWeight: "600",
      },
    }}
  />

  <SearchProvider>
    <GlobalSearch />

    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        <Route path="/" element={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            <HomePage />
          </motion.div>
        }/>

        <Route path="/AboutUs" element={
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          > 
          <AboutUs /> </motion.div>} />
        <Route path="/ProductListing" element={<ProductListing />} />

        <Route path="/ProductDetails/:id" element={
          <LoaderRoute>
            <ProductDetails />
          </LoaderRoute>
        }/>

        <Route path="/Cart" element={
          <LoaderRoute>
            <Cart />
          </LoaderRoute>
        }/>

        <Route path="/Wishlist" element={
          <LoaderRoute>
            <Wishlist />
          </LoaderRoute>
        }/>

        <Route path="/animation" element={<Animation />} />

        <Route path="/Contact" element={  <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          > <Contact /> </motion.div>} />
        <Route path="/Subscription" element={<Subscription />} />
        <Route path="/Journal" element={  <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          > <Journal /></motion.div>} />
        <Route path="/PaymentCustomerInfo" element={<PaymentCustomerInfoPage />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/OrderReview" element={<OrderReviewPage />} />
        <Route path="/OrderConfirmation" element={<OrderConfirmationPage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Registration" element={<RegistrationPage />} />
        <Route path="/UpdateProfile" element={<UpdateProfile />} />
        <Route path="/UserDashboard" element={<UserDashboard />} />
        <Route path="/AddressBook" element={<AddressBook />} />
        <Route path="/ShippingAndReturns" element={<ShippingAndReturns />} />
        <Route path="/MyOrders" element={<MyOrders />} />
        <Route path="/PaymentMethod" element={<PaymentMethod />} />
        <Route path="/Faq" element={<Faq />} />
        <Route path="/TrackOrder" element={<TrackOrderPage />} />
        <Route path="/TrackOrder/:orderNumber" element={<TrackOrderPage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/PrivacyAndTerms" element={<PrivacyAndTerms />} />

      </Routes>
    </AnimatePresence>

  </SearchProvider>
</>
  );
}

export default App;
