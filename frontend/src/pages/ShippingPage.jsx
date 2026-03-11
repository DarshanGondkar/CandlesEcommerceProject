import React from "react";

export default function ShippingPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen">
      <div className="layout-container flex h-full grow flex-col">
        
        {/* ================= TOP NAVIGATION ================= */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#234836] px-6 md:px-40 py-4 bg-background-light dark:bg-background-dark">
          <div className="flex items-center gap-4 text-slate-900 dark:text-white">
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path 
                  clipRule="evenodd" 
                  d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" 
                  fill="currentColor" 
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[0.15em] uppercase">
              LUXE CANDLE CO.
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-9 mr-8">
              <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">
                Shop
              </a>
              <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">
                About
              </a>
            </div>
            <button className="flex cursor-pointer items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-[#234836] text-slate-900 dark:text-white transition-colors hover:bg-primary/20">
              <span className="material-symbols-outlined">shopping_bag</span>
            </button>
          </div>
        </header>

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex flex-1 justify-center py-8 px-4 md:px-0">
          <div className="layout-content-container flex flex-col max-w-[560px] flex-1">
            
            {/* ================= ORDER SUMMARY ACCORDION ================= */}
             <div className="mb-4 -mt-4  mx-auto ">
              <details className="flex flex-col rounded-xl border border-slate-200 dark:border-[#32674d] bg-white dark:bg-[#11221a] overflow-hidden group">
                <summary className="flex cursor-pointer items-center justify-between gap-6 px-5 py-4 list-none">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">shopping_cart</span>
                    <p className="text-slate-900 dark:text-white text-sm font-semibold tracking-wide">
                      Show order summary
                    </p>
                    <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </div>
                  <p className="text-slate-900 dark:text-white text-lg font-bold leading-normal">$113.00</p>
                </summary>
                
                <div className="px-5 pb-5 border-t border-slate-100 dark:border-[#234836] pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-[#92c9ad]">2x Midnight Soy Wax Candle</span>
                    <span className="text-slate-900 dark:text-white font-medium">$120.00</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-[#92c9ad]">
                      Discount <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">WELCOME10</span>
                    </span>
                    <span className="text-primary font-medium">-$12.00</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-[#92c9ad]">Shipping</span>
                    <span className="text-slate-400 dark:text-[#92c9ad] italic">Calculated next step</span>
                  </div>
                </div>
              </details>
            </div>

            {/* ================= BREADCRUMBS ================= */}
            <div className="mb-10">
  {/* Breadcrumb */}
{/* Breadcrumb */}
  <nav aria-label="Breadcrumb">
    <ol className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-gray-400">
      <li className="text-primary font-semibold cursor-pointer hover:text-primary">
        Information
      </li>

      <li className="material-symbols-outlined text-xs">chevron_right</li>

      <li className="cursor-pointer hover:text-primary transition-colors">
        Shipping
      </li>

      <li className="material-symbols-outlined text-xs">chevron_right</li>

      <li className="cursor-pointer hover:text-primary transition-colors">
        Order Review
      </li>

      <li className="material-symbols-outlined text-xs">chevron_right</li>

      <li className="cursor-pointer hover:text-primary transition-colors">
        Payment
      </li>
    </ol>
  </nav>
</div>

            {/* ================= INFORMATION SUMMARY SECTION ================= */}
            <div className="bg-white dark:bg-transparent border border-slate-200 dark:border-[#32674d] rounded-xl overflow-hidden mb-10">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-[#32674d]/50 flex justify-between items-center group">
                <div className="flex flex-col md:flex-row md:gap-8">
                  <p className="text-slate-400 dark:text-[#92c9ad] text-xs uppercase tracking-widest w-20">
                    Contact
                  </p>
                  <p className="text-slate-900 dark:text-white text-sm font-medium">
                    julian.v@example.com
                  </p>
                </div>
                <a className="text-primary text-xs font-bold uppercase tracking-tighter hover:underline" href="#">
                  Edit
                </a>
              </div>
              
              <div className="px-5 py-4 flex justify-between items-center group">
                <div className="flex flex-col md:flex-row md:gap-8">
                  <p className="text-slate-400 dark:text-[#92c9ad] text-xs uppercase tracking-widest w-20">
                    Ship to
                  </p>
                  <p className="text-slate-900 dark:text-white text-sm font-medium leading-relaxed">
                    123 Luxury Lane, Manhattan, New York NY 10001, United States
                  </p>
                </div>
                <a className="text-primary text-xs font-bold uppercase tracking-tighter hover:underline" href="#">
                  Edit
                </a>
              </div>
            </div>

            {/* ================= SHIPPING METHOD SECTION ================= */}
            <section className="mb-10">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-5 tracking-tight">
                Shipping method
              </h3>
              
              <div className="space-y-3">
                {/* Standard Shipping */}
                <label className="relative flex cursor-pointer rounded-xl border border-slate-200 dark:border-[#32674d] bg-white dark:bg-[#11221a] p-5 focus-within:ring-2 focus-within:ring-primary transition-all hover:border-primary/50">
                  <input 
                    defaultChecked 
                    className="mt-1 h-5 w-5 border-slate-300 text-primary focus:ring-primary dark:bg-[#11221a] dark:border-[#32674d]" 
                    name="shipping_method" 
                    type="radio" 
                    value="standard"
                  />
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between items-start">
                      <span className="block text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Standard Courier
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">$5.00</span>
                    </div>
                    <span className="mt-1 flex items-center text-xs text-slate-500 dark:text-[#92c9ad]">
                      <span className="material-symbols-outlined text-[16px] mr-1">schedule</span>
                      3–5 business days
                    </span>
                  </div>
                </label>

                {/* Express Shipping */}
                <label className="relative flex cursor-pointer rounded-xl border border-slate-200 dark:border-[#32674d] bg-white dark:bg-[#11221a] p-5 focus-within:ring-2 focus-within:ring-primary transition-all hover:border-primary/50">
                  <input 
                    className="mt-1 h-5 w-5 border-slate-300 text-primary focus:ring-primary dark:bg-[#11221a] dark:border-[#32674d]" 
                    name="shipping_method" 
                    type="radio" 
                    value="express"
                  />
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between items-start">
                      <span className="block text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Express Luxury Delivery
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">$15.00</span>
                    </div>
                    <span className="mt-1 flex items-center text-xs text-slate-500 dark:text-[#92c9ad]">
                      <span className="material-symbols-outlined text-[16px] mr-1">bolt</span>
                      1–2 business days
                    </span>
                  </div>
                </label>
              </div>
            </section>

            {/* ================= ACTIONS ================= */}
            <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-6 pt-4 border-t border-slate-100 dark:border-[#234836]">
              <a href="/PaymentCustomerInfo" className="flex items-center justify-center text-slate-500 dark:text-[#92c9ad] text-sm font-medium hover:text-primary transition-colors" >
                <span className="material-symbols-outlined text-[18px] mr-1">arrow_back</span>
                Return to information
              </a>
              
            <a href="/OrderReview">
  <button className="w-full md:w-auto px-10 py-4 bg-primary text-background-dark text-sm font-extrabold uppercase tracking-widest rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20">
   Review Order
  </button>
</a>

            </div>

            {/* ================= FOOTER LINKS ================= */}
            <div className="mt-20 py-10 border-t border-slate-100 dark:border-[#234836]/30 flex gap-6 justify-center md:justify-start">
              <a className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-[#32674d] hover:text-primary" href="#">
                Refund policy
              </a>
              <a className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-[#32674d] hover:text-primary" href="#">
                Shipping policy
              </a>
              <a className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-[#32674d] hover:text-primary" href="#">
                Privacy policy
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}