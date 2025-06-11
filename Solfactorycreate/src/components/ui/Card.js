import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-[#0c0325] rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
