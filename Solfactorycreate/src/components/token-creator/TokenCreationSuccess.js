import React, { useEffect, useState } from "react";
import { useToken } from "../../contexts/TokenContext";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { SOLANA_EXPLORERS } from "../../utils/constants";
import {
  IoCheckmarkCircle,
  IoLink,
  IoCopy,
  IoWater,
  IoAdd,
} from "react-icons/io5";
import { toast } from "react-toastify";


const TokenCreationSuccess = () => {
const { createdTokenAddress, resetTokenData } = useToken();
const [visibleAddress, setVisibleAddress] = useState(null);

useEffect(() => {
  if (createdTokenAddress) {
    setVisibleAddress(createdTokenAddress);
  }
}, [createdTokenAddress]);


  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // Get the explorer URL based on devnet/mainnet
  const explorerUrl = `${SOLANA_EXPLORERS.mainnet}/address/${visibleAddress}`;


  return (
    <div className="w-full max-w-xl mx-auto bg-[#06001D] border border-purple-900 rounded-lg p-4 sm:p-6 md:p-8 text-white shadow-xl relative">
      {/* Pink dashed line at top */}
      <div className="absolute top-4 left-0 right-0">
        <div className="w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500 flex">
          {Array(40)
            .fill()
            .map((_, i) => (
              <div key={i} className="h-full w-2 mx-0.5 bg-[#06001D]"></div>
            ))}
        </div>
      </div>

      <div className="mt-6 sm:mt-8 text-center">
        <div className="flex flex-col xs:flex-row justify-between mb-2 text-gray-400 px-2 sm:px-4 md:px-6 text-xs sm:text-sm">
          <div className="mb-1 xs:mb-0">
            Current Progress= <span className="text-green-400">done</span>
          </div>
          <div>
            Estimated Coin Launch={" "}
            <span className="text-green-400">completed</span>
          </div>
        </div>

        <div className="mt-6 sm:mt-10 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 px-2">
            <IoCheckmarkCircle className="text-green-400 mb-2 sm:mb-0 sm:mr-2 text-xl sm:text-2xl" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-green-400 tracking-wide text-center">
              YOUR TOKEN HAS BEEN CREATED
            </h2>
          </div>
        </div>

        {/* Token Address Display */}
        <div
          className="flex items-center justify-between bg-[#0e0129] p-2 sm:p-3 rounded-md border border-purple-800 mb-4 sm:mb-6 mx-auto max-w-md cursor-pointer hover:bg-opacity-70 transition-all"
          onClick={() => copyToClipboard(createdTokenAddress)}
        >
          <div className="flex items-center overflow-hidden">
            <IoLink className="text-pink-400 mr-2 flex-shrink-0" />
           <div className="font-mono text-xs sm:text-sm text-gray-300 truncate">
  {visibleAddress ? visibleAddress : "Token address not available"}
</div>
          </div>
          <IoCopy className="text-gray-400 hover:text-white ml-2 flex-shrink-0" />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 sm:space-y-3 max-w-md mx-auto">
          <Button
            onClick={() =>
              window.open("https://raydium.io/liquidity/", "_blank")
            }
            className="w-full bg-transparent border border-purple-800 hover:bg-purple-900 hover:bg-opacity-30 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-md transition-all flex items-center justify-center text-sm sm:text-base"
          >
            <IoWater className="mr-2 text-green-400" /> Create Liquidity Pool
          </Button>

          <Button
            onClick={() => window.open(explorerUrl, "_blank")}
            className="w-full bg-transparent border border-purple-800 hover:bg-purple-900 hover:bg-opacity-30 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-md transition-all flex items-center justify-center text-sm sm:text-base"
          >
            <IoLink className="mr-2 text-green-400" /> View on Explorer
          </Button>

          <Button
            onClick={() =>
              window.open(
                "https://solscan.io/token/" + visibleAddress,
                "_blank"
              )
            }
            className="w-full bg-transparent border border-purple-800 hover:bg-purple-900 hover:bg-opacity-30 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-md transition-all flex items-center justify-center text-sm sm:text-base"
          >
            <IoLink className="mr-2 text-green-400" /> View on Solscan
          </Button>

          <Button
            onClick={() => resetTokenData()}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-md transition-all flex items-center justify-center text-sm sm:text-base"
          >
            <IoCheckmarkCircle className="mr-2" /> Create Another Token
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TokenCreationSuccess;
