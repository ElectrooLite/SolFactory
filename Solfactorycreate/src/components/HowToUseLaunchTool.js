import React from "react";
import Image from "next/image";

// Optimized star generation with proper Tailwind classes
const generateStars = (count) => {
  return Array(count)
    .fill()
    .map((_, i) => {
      const size = Math.random() > 0.8 ? 2 : 1;
      const opacity = Math.floor(Math.random() * 40) + 20;

      return (
        <div
          key={i}
          className={`absolute rounded-full ${
            size === 2 ? "w-2 h-2" : "w-1 h-1"
          }`}
          style={{
            backgroundColor: "white",
            opacity: opacity / 100,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        ></div>
      );
    });
};

const HowToUseLaunchTool = () => {
  return (
    <div className="bg-[#06001D] min-h-screen text-white overflow-hidden relative">
      {/* Stars background - optimized */}
      <div className="absolute inset-0">{generateStars(30)}</div>

      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            <span className="text-green-400">How</span> To Use Crypto King?
          </h1>
          <p className="max-w-3xl mx-auto text-center leading-relaxed text-sm sm:text-base px-2">
            At Crypto King we believe that everybody should be able to create
            their own tokens, not only coders! This is why Crypto King is your
            key to this revolution:
          </p>
        </div>

        {/* Features Section */}
        <div className="relative max-w-5xl mx-auto mb-12 sm:mb-16 md:mb-24">
          {/* Central purple planet/sphere - hidden on small screens */}
          <div className="absolute left-1/2 transform -translate-x-1/2 z-0 hidden md:block">
            <div className="relative w-40 h-40 md:w-60 md:h-60">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-80"></div>
              {/* Orbital rings */}
              <div className="absolute inset-0 border-2 border-pink-300 rounded-full transform rotate-12 scale-110"></div>
              <div className="absolute inset-0 border-2 border-pink-300 rounded-full transform -rotate-12 scale-125"></div>
              <div className="absolute inset-0 border-2 border-pink-300 rounded-full transform rotate-45 scale-140"></div>
            </div>
          </div>

          {/* Feature Cards - Responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative z-10">
            {/* Efficiency Card */}
            <div className="bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-gray-800 transform rotate-0 sm:rotate-3 hover:rotate-0 transition-transform">
              <div className="bg-yellow-500 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Efficiency</h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Easy setup, instant results.
              </p>
            </div>

            {/* Lightning Fast Launch Card */}
            <div className="bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-gray-800 transform rotate-0 sm:-rotate-3 hover:rotate-0 transition-transform sm:mt-8">
              <div className="bg-purple-500 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Lightning - Fast Launch
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                You Launch your token within 5 minutes!
              </p>
            </div>

            {/* Simplified Card */}
            <div className="bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-gray-800 transform rotate-0 sm:rotate-2 hover:rotate-0 transition-transform sm:mt-12">
              <div className="bg-green-400 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Simplified for everyone
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                No coding. Just clicking.
              </p>
            </div>

            {/* Affordable Price Card */}
            <div className="bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-gray-800 transform rotate-0 sm:-rotate-2 hover:rotate-0 transition-transform sm:mt-6">
              <div className="bg-pink-400 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Affordable price
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Budget-friendly launches.
              </p>
            </div>
          </div>
        </div>

        {/* Who is the next Winner Section */}
        <div className="pt-8 sm:pt-12 md:pt-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-12">
            <span className="text-green-400">Who</span> is the next Winner?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {/* BONK Token Card */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="p-3 sm:p-4 text-black font-bold">$BONK</div>
              <div className="bg-[#06001D] p-6 sm:p-10 flex justify-center">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                  <div className="absolute inset-0 bg-yellow-300 rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/bonk.png" // Update path to your actual image location
                      alt="BONK Token"
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                  </div>
                </div>
              </div>
              <div className="p-3 sm:p-4 text-black">
                <div className="text-gray-600 text-xs sm:text-sm">
                  Market Cap
                </div>
                <div className="font-bold text-sm sm:text-base">
                  $1,402,083,298
                </div>
              </div>
            </div>

            {/* FLOKI Token Card */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="p-3 sm:p-4 text-black font-bold">$FLOKI</div>
              <div className="bg-[#06001D] p-6 sm:p-10 flex justify-center">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/floki.png" // Update path to your actual image location
                      alt="FLOKI Token"
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                  </div>
                </div>
              </div>
              <div className="p-3 sm:p-4 text-black">
                <div className="text-gray-600 text-xs sm:text-sm">
                  Market Cap
                </div>
                <div className="font-bold text-sm sm:text-base">
                  $918,084,213
                </div>
              </div>
            </div>

            {/* SHIB Token Card */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="p-3 sm:p-4 text-black font-bold">$SHIB</div>
              <div className="bg-[#06001D] p-6 sm:p-10 flex justify-center">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/shib.png" // Update path to your actual image location
                      alt="SHIB Token"
                      width={300}
                      height={300}
                      className="rounded-full"
                    />
                  </div>
                </div>
              </div>
              <div className="p-3 sm:p-4 text-black">
                <div className="text-gray-600 text-xs sm:text-sm">
                  Market Cap
                </div>
                <div className="font-bold text-sm sm:text-base">
                  $9,577,353,232
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToUseLaunchTool;
