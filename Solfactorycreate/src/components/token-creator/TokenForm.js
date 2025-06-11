import React, { useState, useEffect } from "react";
import { useToken } from "../../contexts/TokenContext";
import StepTwo from "./Steps/StepTwo";
import StepThree from "./Steps/StepThree";
import StepFour from "./Steps/StepFour";
import StepFive from "./Steps/StepFive";
import TokenCreationSuccess from "./TokenCreationSuccess";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const TokenForm = () => {
  const { currentStep } = useToken();
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  const [hydrated, setHydrated] = useState(false);

  // ✅ Only run this after the component mounts on client
  useEffect(() => {
    setHydrated(true);
  }, []);

  // ✅ Prevent mismatched render during hydration
  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-[#0a021e] py-0 px-4 text-white mt-[-30px]">
      <div className="max-w-4xl mx-auto space-y-12">
        {currentStep === 6 ? (
          <TokenCreationSuccess />
        ) : (
          <>
            <StepTwo />
            <StepThree />
            <StepFour />
            {connected ? (
              <StepFive />
            ) : (
              <div className="bg-[#0c0325] p-4 rounded-lg border border-purple-800 text-white shadow-md w-full">
                <p className="text-center p-3 text-sm">
                  Please connect your wallet to continue.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setVisible(true)}
                    className="w-full bg-gradient-to-r 
                      from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 
                      text-white font-medium py-2 px-4 sm:px-6 rounded-md transition-all 
                      text-sm sm:text-base max-w-xs"
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TokenForm;
