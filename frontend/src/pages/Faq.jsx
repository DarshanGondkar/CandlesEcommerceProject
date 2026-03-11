import React from "react";
import Footer2 from "./Footer2";
import Header2 from "./Header2";

const Faq = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
     <Header2/> <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">

        {/* PAGE CONTENT */}
        <div className="flex flex-col flex-1">

          {/* MAIN */}
          <main className="flex-1">
            <div className="px-4 sm:px-6 lg:px-10 py-12 md:py-16">
              <div className="max-w-3xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-12">
                  <h1 className="text-text text-4xl sm:text-5xl font-black tracking-tight">
                    Frequently Asked Questions
                  </h1>
                  <p className="mt-4 text-lg text-text/70 max-w-2xl mx-auto">
                    Find answers to common questions about our products, shipping,
                    and more. If you can't find what you're looking for, feel free
                    to contact us.
                  </p>
                </div>

                {/* FAQ LIST */}
                <div className="space-y-6">

                  {/* ITEM */}
                  <details className="group border-b border-border/10 pb-6" open>
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <h3 className="text-xl font-medium text-text">
                        What type of wax do you use in your candles?
                      </h3>
                      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-background/5 group-hover:bg-white/10 transition">
                        <span className="material-symbols-outlined text-text transition-transform duration-300 group-open:-rotate-180">
                          expand_more
                        </span>
                      </div>
                    </summary>
                    <p className="mt-4 text-text/70">
                      We use a custom blend of natural soy and coconut wax. This
                      blend is vegan, cruelty-free, and provides a clean,
                      long-lasting burn while holding fragrance beautifully.
                    </p>
                  </details>

                  <details className="group border-b border-border/10 pb-6">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <h3 className="text-xl font-medium text-text">
                        Are your fragrance oils phthalate-free?
                      </h3>
                      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-background/5 group-hover:bg-white/10 transition">
                        <span className="material-symbols-outlined text-text transition-transform duration-300 group-open:-rotate-180">
                          expand_more
                        </span>
                      </div>
                    </summary>
                    <p className="mt-4 text-text/70">
                      Yes. All of our fragrances are 100% phthalate-free and made
                      with premium essential and perfume-grade oils.
                    </p>
                  </details>

                  <details className="group border-b border-border/10 pb-6">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <h3 className="text-xl font-medium text-text">
                        What is the best way to care for my candle?
                      </h3>
                      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-border/5 group-hover:bg-white/10 transition">
                        <span className="material-symbols-outlined text-text transition-transform duration-300 group-open:-rotate-180">
                          expand_more
                        </span>
                      </div>
                    </summary>
                    <p className="mt-4 text-text/70">
                      Trim the wick to ¼ inch before each burn, allow wax to melt
                      edge-to-edge, and never burn longer than 4 hours at a time.
                    </p>
                  </details>

                  <details className="group border-b border-border/10 pb-6">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <h3 className="text-xl font-medium text-text">
                        What is your shipping policy?
                      </h3>
                      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-bacground/5 group-hover:bg-white/10 transition">
                        <span className="material-symbols-outlined text-text transition-transform duration-300 group-open:-rotate-180">
                          expand_more
                        </span>
                      </div>
                    </summary>
                    <p className="mt-4 text-text/70">
                      Orders are processed within 1–3 business days. Standard
                      shipping takes 3–5 days. Free shipping on orders over $75.
                    </p>
                  </details>

                  <details className="group border-b border-border/10 pb-6">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <h3 className="text-xl font-medium text-text">
                        Do you accept returns or exchanges?
                      </h3>
                      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-background/5 group-hover:bg-white/10 transition">
                        <span className="material-symbols-outlined text-text transition-transform duration-300 group-open:-rotate-180">
                          expand_more
                        </span>
                      </div>
                    </summary>
                    <p className="mt-4 text-text/70">
                      Yes. We accept returns of unused candles within 14 days of
                      delivery. Please see our Shipping & Returns page.
                    </p>
                  </details>

                </div>
              </div>
            </div>
          </main>

          {/* FOOTER */}
         <Footer2/>

        </div>
      </div>
    </div>
  );
};

export default Faq;
