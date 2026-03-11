import React from "react";
import { FaInstagram, FaFacebookF, FaXTwitter } from "react-icons/fa6"; // or X icon if needed
 import { Link } from "react-router-dom";

export default function Footer() {

const socialLinks = [
  { icon: <FaInstagram />, url: "https://www.instagram.com/darshan.r.gondkar" },
  { icon: <FaXTwitter />, url: "https://twitter.com/yourprofile" }, // for X, replace with FaX if you want
  { icon: <FaFacebookF />, url: "https://www.facebook.com/yourprofile" },
];


  return (
     <div>
{/* ================= FOOTER ================= */}
<footer className="bg-[#0a1108] border-t border-[#2c4724] pt-12 pb-6">
  <div className="px-4 sm:px-6 md:px-10 lg:px-40">
    
    {/* Top Footer */}
    <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12 text-center md:text-left">
      
      {/* Brand */}
      <div>
        <h3 className="text-lg text-gray-100 font-bold mb-4 flex items-center justify-center md:justify-start gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            local_fire_department
          </span>
          LUMINA
        </h3>
        <p className="text-gray-200 text-sm leading-relaxed">
          Illuminating spaces with <br />
          sustainable luxury and <br />
          international design since 2023.
        </p>
      </div>

      {/* Shop + Support (side by side on mobile) */}
      <div className="grid grid-cols-2 gap-8 md:col-span-2 text-center">
        {/* Shop */}
        <div>
          <h4 className="font-bold mb-4 text-gray-100">Shop</h4>
          <ul className="space-y-3 text-gray-200 text-sm">
            <li>
              <a className="hover:border-b border-gray-200" href="/ProductListing">
                All Candles
              </a>
            </li>
            <li>

<a
  href="/ProductListing?sort=newest"
  className="hover:border-b border-gray-200"
>
  New Arrivals
</a>
            </li>
            <li>
              <a className="hover:border-b border-gray-200" href="/ProductListing">
                Gift Sets
              </a>
            </li>
            <li>
              <a className="hover:border-b border-gray-200" href="/ProductListing">
                Accessories
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-bold mb-4 text-gray-100">Support</h4>
          <ul className="space-y-3 text-gray-200 text-sm">
            <li>
              <a className="hover:border-b border-gray-200" href="/Contact">
                Contact Us
              </a>
            </li>
            <li>
              <a className="hover:border-b border-gray-400" href="/ShippingAndReturns">
                Shipping and Returns
              </a>
            </li>
            <li>
              <a className="hover:border-b border-gray-400" href="/Faq">
                FAQ
              </a>
            </li>
            <li>
              <a className="hover:border-b border-gray-400" href="/Journal">
                Candle Care
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Social */}
     <div>
      <h4 className="font-bold mb-4 text-gray-100">Follow Us</h4>
      <div className="flex justify-center md:justify-start gap-4">
        {socialLinks.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 hover:bg-primary transition"
          >
            {item.icon}
          </a>
        ))}
      </div>
    </div>
    </div>

    {/* Bottom Footer */}
    <div className="border-t border-white/70 text-gray-300 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-gray-500 text-center sm:text-left">
      <p>© 2026 Lumina Candles. All rights reserved.</p>
      <div className="flex gap-4 hover:border-b border-gray-400">
       <a href="/PrivacyAndTerms"> <span>Privacy Policy</span> &
        <span>Terms of Service</span> </a>
      </div>
    </div>

  </div>
</footer>
</div>
  );
}