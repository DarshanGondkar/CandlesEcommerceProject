import React from "react";
import DashboardHeader3 from "./DashboardHeader3";

export default function PaymentMethod() {
  return (
    <main className="min-h-screen bg-[#112117] text-white">
<DashboardHeader3 />
      {/* PAGE CONTENT */}
      <div className="flex justify-center py-10 sm:py-16">
        <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8">

          {/* HEADER */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-black tracking-tight">
                Payment Methods
              </h1>
              <p className="text-base text-white/60">
                Manage your saved payment methods for faster checkout.
              </p>
            </div>

            <button className="flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-[#112117] transition-transform hover:scale-105">
              <span className="material-symbols-outlined text-xl">add</span>
              Add New Method
            </button>
          </div>

          {/* PAYMENT METHODS */}
          <div className="flex flex-col gap-4">

            {/* CARD 1 */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-16 items-center justify-center rounded-md bg-white">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAu97I9O7XAOCX96N5_t93GfwN4wSeeVSUSElO8mhIjOpX5BpYtZskpwNL1dI-t80c_If9b-zLrYeNXjqC2ahPPbnwfU4BYpq8gXTxMXb1PSPKfODGgLFk72MsksNOdPpIcQbGszc3QeQC49FF5SxmIx0mRN312P8jP0sdJNI0R75unGzqpRzllbwHUw53p21R6mMfq6axPotsJoNQxDrVC80M4wQfDW__9oy3_Ge9pTHQRs8IZBfMgpwTD6PvUyJeKdRe5NSY2WtwX"
                    alt="Mastercard"
                    className="h-6"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-base font-medium">
                      Mastercard ending in 1234
                    </p>
                    <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                      Default
                    </span>
                  </div>
                  <p className="text-sm text-white/60">Expires 08/26</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="h-9 rounded-md bg-white/10 px-4 text-sm text-white/80 hover:bg-white/20">
                  Edit
                </button>
                <button className="h-9 rounded-md px-4 text-sm text-red-400/80 hover:bg-red-500/10">
                  Remove
                </button>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-16 items-center justify-center rounded-md bg-white">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJHkHz6rAYD4GJi6Slc74vNgb4Qnc63reHxzphBti2Pt8MiDmhl6-fEbpL3zSjIXDM6El1tujG7MQT2w7nnd1HS9O37R_zjjsZsbNc5a_9OhDJerw-45zN1t8S9gOEnyywgP5Zhw0jLMFMFM728-YPXn4yOV8DaMAnkNxPonmUAZ5h68huKSqDxtWHGnFFaB3nmbgqWh50a66s4JvtntlgirSUppXYHhzLceTuoPSTfeKm2-m4DL2AxLxucJnSPkBA8r5WFwwZcZ8R"
                    alt="Visa"
                    className="h-4"
                  />
                </div>

                <div>
                  <p className="text-base font-medium">
                    Visa ending in 5678
                  </p>
                  <p className="text-sm text-white/60">Expires 11/25</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="h-9 rounded-md px-4 text-sm font-medium text-primary hover:bg-primary/10">
                  Set as Default
                </button>
                <button className="h-9 rounded-md bg-white/10 px-4 text-sm text-white/80 hover:bg-white/20">
                  Edit
                </button>
                <button className="h-9 rounded-md px-4 text-sm text-red-400/80 hover:bg-red-500/10">
                  Remove
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
