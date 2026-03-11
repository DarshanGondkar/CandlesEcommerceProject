import React from "react";
import "./animation.css";

const animation = () => {
  return (
    <div className="product-card">
      <h3>Scented Candle</h3>
      <p>₹499</p>

      {/* Quantity with flame animation */}
      <div className="quantity-flame">
        <span className="flame">🔥</span>
        <span className="quantity-text">Only 5 left</span>
      </div>

      <button className="add-to-bag">Add to Bag</button>
    </div>
  );
};

export default animation;
