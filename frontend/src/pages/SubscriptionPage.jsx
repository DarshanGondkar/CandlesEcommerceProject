import React, { useState } from "react";
import Header2 from "./Header2";
import Footer2 from "./Footer2";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const SubscriptionPage = () => {
  const [isCopied, setIsCopied] = useState(false); // ✅ React state
const navigate = useNavigate();

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText("WELCOME10");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // ✅ Reset after 2s
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  useEffect(() => {
    // Check if user subscribed
    const subscribedEmail = localStorage.getItem("subscribedEmail");
    if (!subscribedEmail) {
      navigate("/"); // Redirect to home if not subscribed
    }
  }, [navigate]);
return (
    <div className="font-display">
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
            <div className="flex h-full grow flex-col">
                <Header2/>
                

<div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 flex flex-1 justify-center py-6 sm:py-8">
                        <div className="flex flex-col max-w-[960px] flex-1">
                        <main className="flex flex-1 items-center justify-center py-10 sm:py-14 px-4">
                            <div className="w-full max-w-lg text-center flex flex-col items-center gap-4">
                                
                                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-zinc-800 dark:text-white pt-6">
                                    Thank You for Joining the Inner Circle!
                                </h1>

                                <p className="text-zinc-600 dark:text-white/70 text-base max-w-md">
                                    As a welcome gift, enjoy 10% off your first order. Use the code below at checkout.
                                </p>

                                {/* Discount Code - FIXED */}
                                <div className="w-full max-w-sm relative  ">
                                    <div className="bg-black/5 dark:bg-[#2c4724]/60 border border-zinc-200 dark:border-[#2c4724] rounded-xl px-8 py-4 flex items-center justify-between gap-5">
                                        <h2 className="text-2xl md:text-3xl font-bold tracking-widest text-zinc-800 dark:text-white">
                                            WELCOME10
                                        </h2>
                                        <button 
                                            onClick={copyCode}
                                            className={`h-8 w-20 rounded-md flex items-center justify-center gap-1 text-xs font-bold transition-all ${
                                                isCopied
                                                    ? "bg-green-500 dark:bg-green-600 text-white hover:bg-green-600"
                                                    : "bg-primary text-white hover:bg-primary/90"
                                            }`}
                                            title="Copy discount code"
                                        >
                                            <span className="material-symbols-outlined text-xs">
                                                {isCopied ? "check" : "content_copy"}
                                            </span>
                                            {isCopied ? "Copied!" : "Copy"}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row w-full gap-3 max-w-[480px] py-3">
                                    <a href="/productlisting" className="h-12 rounded-lg bg-primary dark:bg-[#2c4724] text-zinc-800 dark:text-white text-base font-bold grow hover:bg-black/10 dark:hover:bg-[#2c4724]/70 transition-all flex items-center justify-center">
                                        Explore collections
                                    </a>
                                </div>

                            </div>
                        </main>
                    </div>
                </div>
            </div>
            <Footer2/>
        </div>
    </div>
);
};

export default SubscriptionPage;
