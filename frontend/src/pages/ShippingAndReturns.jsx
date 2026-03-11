import React from "react";
import Footer from "./Footer";
import Header2 from "./Header2";
import Footer2 from "./Footer2";

export default function ShippingAndReturns() {
  return (
    <main className="min-h-screen bg-background text-text">
<Header2 />
      {/* PAGE WRAPPER */}
      <div className="px-5 sm:px-6 md:px-10 lg:px-40 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">

          {/* PAGE HEADER */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-text">
              Shipping &amp; Returns
            </h1>
            <p className="mt-4 text-lg text-text/70 max-w-2xl mx-auto">
              Everything you need to know about our shipping and returns process.
            </p>
          </div>

          {/* CONTENT */}
          <div className="space-y-14">

            {/* SHIPPING POLICY */}
            <section>
              <h2 className="text-2xl font-bold text-text mb-6 border-b border-border/10 pb-4">
                Shipping Policy
              </h2>

              <div className="grid md:grid-cols-2 gap-8 text-text/80">

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text">
                    Processing Time
                  </h3>
                  <p>
                    Orders are processed within 1–2 business days (excluding
                    weekends and holidays) after receiving your order
                    confirmation email. You’ll receive another notification
                    when your order has shipped.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text">
                    Shipping Rates &amp; Delivery Estimates
                  </h3>
                  <p>
                    We offer flat-rate shipping for all domestic orders.
                    Shipping charges are calculated and displayed at checkout.
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>Standard Shipping (5–7 business days):</strong>{" "}
                      $7.99
                    </li>
                    <li>
                      <strong>Expedited Shipping (2–3 business days):</strong>{" "}
                      $14.99
                    </li>
                    <li>
                      <strong>Free shipping on orders over $100.</strong>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text">
                    International Shipping
                  </h3>
                  <p>
                    We currently do not offer international shipping. We’re
                    working on expanding our shipping zones — stay tuned!
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text">
                    Order Tracking
                  </h3>
                  <p>
                    Once your order ships, you’ll receive an email with a
                    tracking number. Please allow up to 48 hours for tracking
                    details to become active.
                  </p>
                </div>

              </div>
            </section>

            {/* RETURN POLICY */}
            <section>
              <h2 className="text-2xl font-bold text-text mb-6 border-b border-border/10 pb-4">
                Return Policy
              </h2>

              <div className="space-y-6 text-text/80">
                <p>
                  We accept returns up to <strong>30 days</strong> after
                  delivery, provided the item is unused and in its original
                  condition. Refunds are issued for the full order amount minus
                  return shipping costs.
                </p>

                <p>
                  If your order arrives damaged, please contact us immediately
                  at{" "}
                  <a
                    href="mailto:support@candleco.com"
                    className="text-primary hover:underline"
                  >
                    support@candleco.com
                  </a>{" "}
                  with your order number and photos of the item.
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-text mb-2">
                    How to Initiate a Return
                  </h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Visit our online return portal.</li>
                    <li>Enter your order number and email address.</li>
                    <li>Select items and reason for return.</li>
                    <li>
                      Receive confirmation and shipping instructions via email.
                    </li>
                  </ol>
                </div>

                <p>
                  Need help? Reach us anytime at{" "}
                  <a
                    href="mailto:support@candleco.com"
                    className="text-primary hover:underline"
                  >
                    support@candleco.com
                  </a>
                  .
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
      <Footer2 />
    </main>
  );
}
