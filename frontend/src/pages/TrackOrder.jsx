import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer2 from "./Footer2";
import Header2 from "./Header2";
  import { Link } from "react-router-dom";

const TrackOrderPage = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const storedOrders =
      JSON.parse(localStorage.getItem("myOrders")) || [];


  const foundOrder = storedOrders.find(
  (o) => String(o.orderNumber) === String(orderNumber)
);

    setOrder(foundOrder);
  }, [orderNumber]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text">
        Order not found.
      </div>
    );
  }

  const orderDate = new Date(order.paymentDate);
  const estimatedDelivery = new Date(orderDate);
  estimatedDelivery.setDate(orderDate.getDate() + 5);

  return (
    <div className="bg-background-light dark:bg-background-dark text-text min-h-screen">
      <Header2 />

<header className="flex items-center p-2 bg-dark shadow-lg">
  <Link
    to="/MyOrders"
    className="flex items-center gap-2 px-2 py-1 rounded-lg bg-primary text-gray-200 text-lg font-medium hover:bg-gray-200 hover:text-white transition-all duration-200 active:scale-95"
  >
    <span className="text-2xl">←</span>
    <span>Back</span>
  </Link>
</header>

      <main className="max-w-6xl mx-auto px-6 py-16">

        {/* ORDER HEADER */}
        <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 mb-10">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <p className="text-sm text-gray-400">Order Number</p>
              <p className="text-2xl font-bold">
                #{order.orderNumber}
              </p>
            </div>

            <div className="mt-4 md:mt-0 text-left md:text-right">
              <p className="text-sm text-gray-400">Order Date</p>
              <p className="font-medium">
                {orderDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* TRACKING STATUS */}
        <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-bold mb-6">Tracking Status</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: "Order Placed", active: true },
              { title: "Processing", active: true },
              { title: "Shipped", active: true },
              { title: "Delivered", active: false },
            ].map((step, i) => (
              <div
                key={i}
                className={`flex md:flex-col items-center gap-4 ${
                  !step.active ? "opacity-40" : ""
                }`}
              >
                <div
                  className={`size-12 flex items-center justify-center rounded-full ${
                    step.active
                      ? "bg-primary text-text"
                      : "border border-border/20"
                  }`}
                >
                  <span className="material-symbols-outlined">
                    {step.active ? "check" : "schedule"}
                  </span>
                </div>

                <div className="text-left md:text-center">
                  <h4 className="font-semibold">{step.title}</h4>
                  <p className="text-xs text-gray-400">
                    {orderDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right">
            <p className="text-sm text-gray-400">
              Estimated Delivery
            </p>
            <p className="font-semibold">
              {estimatedDelivery.toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* ORDER ITEMS */}
        <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-bold mb-6">Order Items</h2>

          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border bg-gray-200">
                  <img
                    src={item.image || item.images?.[0]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-text text-xs rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold">
                    {item.name}
                  </h4>
                  <p className="text-base text-sm text-[#A0A0A0]">Price: ${item.price}</p>
                 <p className="text-base text-sm text-[#A0A0A0]">Quantity: {item.variant ||    item.quantity}</p>
                </div>

                <span className="font-medium">
                  $
                  {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PAYMENT SUMMARY */}
        <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-bold mb-6">Payment Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${order.shippingCost.toFixed(2)}</span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between">
                <span>Discount</span>
                <span>- ${order.discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-bold text-primary pt-4 border-t">
              <span>Total Paid</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* SHIPPING ADDRESS */}
        <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">
            Shipping Address
          </h2>

          <p>{order.customer.firstName} {order.customer.lastName}</p>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city},{" "}
            {order.shippingAddress.state}{" "}
            {order.shippingAddress.zip}
          </p>
        </div>

      </main>

      <Footer2 />
    </div>
  );
};

export default TrackOrderPage;
