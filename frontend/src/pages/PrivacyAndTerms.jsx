import React from "react";
import Footer2 from "./Footer2";
import Header2 from "./Header2";

export default function PrivacyAndTerms() {
  return (
   <> 
    <Header2 />
   <div className="bg-white text-black min-h-screen">
     <div className="max-w-5xl mx-auto px-6 py-16">
        
        <h1 className="text-4xl font-bold mb-8 border-b pb-4">
          Privacy Policy & Terms of Service
        </h1>

        {/* Privacy Policy Section */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
          <p className="mb-4 text-gray-700">
            Welcome to our Lumina Candles Store. Your privacy is important to us.
            This Privacy Policy explains how we collect, use, and protect your
            personal information when you use our website.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            1. Information We Collect
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Name, email address, phone number, and shipping address.</li>
            <li>Payment details (processed securely through payment providers).</li>
            <li>Order history and browsing behavior on our website.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            2. How We Use Your Information
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>To process and deliver your candle orders.</li>
            <li>To improve our website and customer experience.</li>
            <li>To send order updates and promotional offers (if subscribed).</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            3. Data Protection
          </h3>
          <p className="text-gray-700">
            We implement industry-standard security measures to protect your
            personal data. Payment information is encrypted and handled by
            trusted third-party payment gateways.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            4. Cookies
          </h3>
          <p className="text-gray-700">
            Our website uses cookies to enhance your browsing experience,
            remember preferences, and analyze site traffic.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            5. Your Rights
          </h3>
          <p className="text-gray-700">
            You may request access, correction, or deletion of your personal
            information by contacting us at support@yourcandlestore.com.
          </p>
        </section>

        {/* Terms of Service Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Terms of Service
          </h2>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            1. General Conditions
          </h3>
          <p className="text-gray-700">
            By using our website, you agree to comply with these Terms of
            Service. We reserve the right to update or modify these terms at
            any time.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            2. Products & Pricing
          </h3>
          <p className="text-gray-700">
            All candle products listed are subject to availability. Prices are
            subject to change without notice.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            3. Orders & Payments
          </h3>
          <p className="text-gray-700">
            Once an order is placed, you will receive a confirmation email.
            We reserve the right to cancel or refuse any order at our discretion.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            4. Shipping & Delivery
          </h3>
          <p className="text-gray-700">
            Delivery times may vary depending on your location. We are not
            responsible for delays caused by courier services.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            5. Returns & Refunds
          </h3>
          <p className="text-gray-700">
            If you receive a damaged product, please contact us within 48 hours.
            Refunds or replacements will be processed after verification.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">
            6. Contact Information
          </h3>
          <p className="text-gray-700">
            For any questions regarding these terms, please contact us at
            support@yourcandlestore.com.
          </p>
        </section>


      {/*  <div className="mt-16 border-t pt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} Lumina Candle Store. All rights reserved.
        </div>*/}

      </div><Footer2/>
    </div></>
  );
}