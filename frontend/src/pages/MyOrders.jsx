import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader3 from "./DashboardHeader3";
import Header2 from "./Header2";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrders =
      JSON.parse(localStorage.getItem("myOrders")) || [];

    const validOrders = storedOrders.filter(
      (order) => order && order.orderNumber
    );

    setOrders(validOrders.reverse());
  }, []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
     <Header2/>
     {/* <DashboardHeader3 />*/}

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No orders found.
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map((order, index) => (
              <div
                key={index}
                className="bg-surface-dark border border-border-dark rounded-2xl p-6 space-y-6"
              >
                {/* ORDER HEADER */}
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="text-sm text-gray-400">
                      Order Number
                    </p>
                    <p className="font-bold text-lg">
                      #{order.orderNumber}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      Date
                    </p>
                    <p className="font-medium">
                      {new Date(order.paymentDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* ITEMS */}
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border bg-gray-200">
                        <img
                          src={item.image || item.images?.[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
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

                {/* TOTAL */}
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Paid</span>
                    <span className="font-bold text-primary">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* TRACK BUTTON */}
                <div className="border-t pt-6">
                  <button
                  onClick={() =>
  navigate(`/TrackOrder/${order.orderNumber}`)
}
                    className="w-full md:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
