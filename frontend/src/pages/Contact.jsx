import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import SupportChat from "../components/SupportChat";
export default function Contact() {
  const [menuOpen, setMenuOpen] = useState(false);
  
   const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill all fields");
      return;
    }

    const phoneNumber = "+91 7743899965"; // 👉 replace with your number (with country code)

    const text = `Hello Lumina,

Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}`;

    const smsURL = `sms:${phoneNumber}?body=${encodeURIComponent(text)}`;

    window.location.href = smsURL;
  };

  
  
  
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen flex flex-col">

 {/* ================= NAVBAR ================= */}
           {/* ================= CANDLE BRAND HEADER ================= */}
        <div className="sticky top-0 z-50 w-full backdrop-blur-md bg-background border-b border-border pb-2 md:pb-0">
            <Header /> 

            {/* Mobile Menu (ONLY nav links) /}
            {menuOpen && (
              <div className="md:hidden border-t border-[#2c4724] bg-[#152211] px-6 py-6 space-y-4">
                 <a href="/ProductListing" className="block text-white font-semibold hover:text-primary">Collections</a>
                <a className="block text-white font-semibold hover:text-primary">Journal</a> 
              <a href="/AboutUs" className="block text-white font-semibold hover:text-primary">About</a>
                <a href="/Contact" className="block text-white font-semibold hover:text-primary">Contact</a>
     </div>
            )}*/}
        </div>


      {/* ================= MAIN ================= */}
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-12 md:py-16 mt-4">
        <div className="max-w-4xl mx-auto">

          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-text text-4xl sm:text-5xl font-black tracking-tight">
              Contact Us
            </h1>
            <p className="mt-4 text-lg text-text/70 max-w-2xl mx-auto">
              We're here to help. Whether you have a question about our products,
              an order, or just want to share your experience, we'd love to hear from you.
            </p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">

            {/* Contact Form */}
            <div className="bg-white/5 border border-black/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-text">
                Send us a message
              </h2>
              <p className="mt-2 text-text/60">
                Fill out the form and we'll get back to you as soon as possible.
              </p>

             <form onSubmit={handleSubmit} className="mt-8 space-y-6">

        <div>
          <label className="text-sm font-medium text-text/90">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="mt-2 w-full rounded-md border-white/10 bg-gray-50 p-3 text-text"
          />
        </div>



        <div>
          <label className="text-sm font-medium text-text/90">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your e-mail"
            className="mt-2 w-full rounded-md border-white/20 bg-gray-50 p-3 text-text"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-text/90">
            Message
          </label>
          <textarea
            rows="5"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="How can we help?"
            className="mt-2 w-full rounded-md border-white/20 bg-gray-50 p-3 text-text"
          />
        </div>

        <button
          type="submit"
          className="w-full h-12 rounded-2xl bg-primary text-text font-bold hover:bg-primary/90"
        >
          Send SMS
        </button>

      </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-10">

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-white/10 text-primary">
                  <span className="material-symbols-outlined text-2xl">mail</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">Email Us</h3>
                  <p className="text-text/60 mt-1">
                    For general inquiries, support, or feedback.
                  </p>
                  <a
  href="https://mail.google.com/mail/?view=cm&to=darshangondkar2018@gmail.com"
  target="_blank"
  rel="noopener noreferrer"
  className="mt-2 inline-block text-primary hover:text-green-300 transition"
>
  darshangondkar2018@gmail.com
</a>

                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-background/10 text-primary">
                  <span className="material-symbols-outlined text-2xl">call</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">Call Us</h3>
                  <p className="text-text/60 mt-1">
                    Mon - Fri, 9am - 5pm EST.
                  </p>
                  <a
                    href="tel:+1234567890"
                    className="mt-2 inline-block text-primary hover:text-green-300 transition"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </div>

              {/* Live Chat */}
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-white/10 text-primary">
                  <span className="material-symbols-outlined text-2xl">chat</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">Support Chat</h3>
                  <p className="text-text/60 mt-1">
                    Get instant answers from our support team.
                  </p>
                  <div className="flex items-start gap-4">
<SupportChat/>
</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

     

{/* ================= FOOTER ================= */}
<Footer/>

    </div>
  );
}
