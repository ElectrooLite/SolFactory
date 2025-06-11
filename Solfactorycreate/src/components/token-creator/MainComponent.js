import React from "react";
import TokenForm from "./TokenForm";

const MainComponent = () => {
  return (
    <div id="create" className="bg-[#06001D] min-h-screen text-white relative">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none w-full h-full">
        {Array(30)
          .fill()
          .map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.1,
              }}
            ></div>
          ))}
      </div>

      <div className="container mx-auto px-4 pt-0 relative z-10">
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 break-words">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              Create Your Solana Token
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Free Audited Solana Token Creator
          </p>
        </div>

        <div className="relative bg-[#0c0325] bg-opacity-50 rounded-xl backdrop-blur-sm md:p-12 shadow-xl max-w-5xl mx-auto">
          <TokenForm />
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
