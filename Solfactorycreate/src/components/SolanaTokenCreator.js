import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";
import WalletButton from "./wallet/WalletButton";

// Star element for reusability
const Star = ({ className }) => (
  <div className={`absolute w-1 h-1 bg-white rounded-full ${className}`}></div>
);

// Diagonal divider as a separate component for better reusability
const DiagonalDivider = () => (
  <div className="w-full py-3 sm:py-4 overflow-hidden bg-transparent">
    <div className="flex justify-center items-center">
      {Array(65)
        .fill()
        .map((_, i) => (
          <div
            key={i}
            className="h-5 sm:h-7 w-[3px] sm:w-[5px] transform rotate-[25deg] mx-[2px] sm:mx-[3px]"
            style={{ backgroundColor: "#ff00ff" }}
          />
        ))}
    </div>
  </div>
);

const SolanaTokenCreator = () => {
  const { publicKey } = useWallet();
  const router = useRouter();

  // Redirect to token creation page if wallet is connected
  // useEffect(() => {
  //   if (publicKey) {
  //     router.push("/token/create");
  //   }
  // }, [publicKey, router]);

  // Array of star positions for more programmatic approach
  const stars = [
    "top-24 left-14 opacity-60",
    "top-32 left-1/4 opacity-80",
    "top-48 right-1/3 opacity-70",
    "top-16 right-1/4 opacity-90",
    "top-96 left-1/3 opacity-60",
    "bottom-40 right-1/4 opacity-70",
    "bottom-60 left-1/5 opacity-80",
    "bottom-36 left-2/3 opacity-90",
    "top-1/3 right-16 opacity-60",
    "top-20 right-64 opacity-70",
    "bottom-1/4 right-1/2 opacity-80",
    // Added more stars for smaller screens
    "bottom-10 left-10 opacity-75 sm:opacity-0",
    "top-60 left-5 opacity-80 sm:opacity-0",
    "top-80 right-10 opacity-70 sm:opacity-0",
  ];

  return (
    <div className="relative bg-[#06001D] min-h-screen w-full overflow-hidden flex items-center justify-center px-4 py-10 sm:py-0">
      {/* Stars background - optimized with map function */}
      <div className="absolute inset-0">
        {stars.map((position, index) => (
          <Star key={index} className={position} />
        ))}

        {/* Earth image - hidden on very small screens */}
        <div className="absolute top-20 sm:top-40 right-5 sm:right-10 hidden xs:block">
          <Image
            src="/api/placeholder/40/40"
            alt="Earth"
            width={40}
            height={40}
            className="rounded-full sm:w-[60px] sm:h-[60px]"
          />
        </div>

        {/* Purple cube - responsive sizing */}
        <div className="absolute bottom-36 sm:bottom-56 right-10 sm:right-32 hidden sm:block">
          <div className="w-10 h-10 sm:w-16 sm:h-16 bg-purple-600 transform rotate-45"></div>
        </div>

        {/* Comet - hidden on small screens */}
        <div className="absolute top-[25rem] right-20 sm:right-40 hidden sm:block">
          <div className="w-8 sm:w-12 h-1 bg-gradient-to-l from-white to-transparent transform rotate-45"></div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 px-2">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              Solana Token{" "}
            </span>
            <span className="bg-gradient-to-r from-teal-300 to-blue-300 text-transparent bg-clip-text">
              Creator
            </span>
          </h1>
          <p className="text-white text-base sm:text-lg">
            from concept to token in just a few clicks
          </p>
        </div>

        {/* Content Box - responsive padding */}
        <div className="border border-opacity-20 border-purple-500 rounded-lg bg-[#06001D] bg-opacity-50 p-4 sm:p-8 md:p-12 backdrop-blur-sm">
          {/* Pink line divider - now a component */}
          <DiagonalDivider />

          {/* Wallet Connection */}
          <div className="flex flex-col items-center justify-center mt-6 sm:mt-12 mb-4 sm:mb-8">
            <p className="text-white text-base sm:text-lg mb-4 sm:mb-6 text-center">
              Please connect your wallet to continue
            </p>
            <WalletButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolanaTokenCreator;
