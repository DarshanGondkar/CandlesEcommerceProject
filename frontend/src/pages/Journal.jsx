import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";


const Journal = () => {
      const [menuOpen, setMenuOpen] = useState(false);
    
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background dark:bg-background-dark font-display text-zinc-900 dark:text-zinc-100 antialiased">
      {/* Top Nav Bar */}
         
       {/* ================= CANDLE BRAND HEADER ================= */}
        <div className="sticky top-0 z-50 w-full backdrop-blur-md bg-background border-b border-border pb-2 md:pb-0">
           <Header/>

                                    {/* Mobile Menu (ONLY nav links) */}
            {menuOpen && (
              <div className="md:hidden border-t border-[#2c4724] bg-[#152211] px-6 py-6 space-y-4">
                <a href="/ProductListing" className="block text-white font-semibold hover:text-primary">Collections</a>
                <a className="block text-white font-semibold hover:text-primary">Journal</a> 
              <a href="/AboutUs" className="block text-white font-semibold hover:text-primary">About</a>
                <a className="block text-white font-semibold hover:text-primary">Contact</a>
      </div>
            )}
        </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-12">
            {/* Page Heading */}
            <div className="text-center">
              <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
                Candle Care Guide
              </h1>
              <p className="mt-4 mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                Follow these essential tips to ensure the best performance and
                longevity of your luxury candle.
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-primary">The First Burn</h2>
                <p className="text-zinc-700 dark:text-zinc-300">
                  The first burn is the most important. To prevent tunneling,
                  allow the wax to melt across the entire surface of the candle.
                  This can take 2–4 hours and creates a memory ring.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-primary">Wick Care</h2>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Trim your wick to 1/4 inch before every burn. This prevents
                  sooting and uneven burning.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-primary">
                  Burn Time & Safety
                </h2>
                <ul className="list-inside list-disc space-y-3 text-zinc-700 dark:text-zinc-300">
                  <li>Never burn a candle for more than 4 hours.</li>
                  <li>Always burn on a heat-resistant surface.</li>
                  <li>Keep away from drafts, children, and pets.</li>
                  <li>Never leave a burning candle unattended.</li>
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-primary">
                  When to Say Goodbye
                </h2>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Discontinue use when only 1/2 inch of wax remains. Burning a
                  candle to the end may overheat the glass.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <a
                href="/ProductListing"
                className="inline-block rounded-lg bg-primary px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
              >
                Explore Our Collection
              </a>
            </div>
          </div>
        </div>
      </main>

           
{/* ================= FOOTER ================= */}
<Footer/>


    </div>
  );
};

export default Journal;
