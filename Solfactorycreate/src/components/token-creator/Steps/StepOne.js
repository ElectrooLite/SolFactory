import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToken } from "../../../contexts/TokenContext";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import WalletButton from "../../wallet/WalletButton";
import { IoWallet, IoCheckmarkCircle, IoWarning } from "react-icons/io5";

const StepOne = () => {
  const { connected } = useWallet();
  const { nextStep } = useToken();

  return (
    <Card className="bg-[#0c0325] p-4 rounded-lg border border-purple-800 text-white shadow-md">
      <div className="text-center mb-4">
        <div className="bg-purple-900 bg-opacity-50 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center border border-purple-500">
          <IoWallet className="text-pink-400 text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-gray-300">
          Connect your Solana wallet to create your token. Your wallet will be
          used to pay creation fees and will be the owner of the token.
        </p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start p-3 border border-gray-700 rounded-lg bg-black bg-opacity-30 hover:bg-opacity-40 transition-all">
          <div className="mr-3 mt-0.5">
            <IoCheckmarkCircle className="text-green-400 text-xl" />
          </div>
          <div>
            <h3 className="font-medium text-white">Sign Transactions</h3>
            <p className="text-sm text-gray-300">
              Your wallet will be used to sign token creation transactions.
            </p>
          </div>
        </div>

        <div className="flex items-start p-3 border border-gray-700 rounded-lg bg-black bg-opacity-30 hover:bg-opacity-40 transition-all">
          <div className="mr-3 mt-0.5">
            <IoCheckmarkCircle className="text-green-400 text-xl" />
          </div>
          <div>
            <h3 className="font-medium text-white">Pay Fees</h3>
            <p className="text-sm text-gray-300">
              You&apos;ll need SOL to pay for token creation (0.0001 SOL).
            </p>
          </div>
        </div>

        <div className="flex items-start p-3 border border-gray-700 rounded-lg bg-black bg-opacity-30 hover:bg-opacity-40 transition-all">
          <div className="mr-3 mt-0.5">
            <IoCheckmarkCircle className="text-green-400 text-xl" />
          </div>
          <div>
            <h3 className="font-medium text-white">Token Ownership</h3>
            <p className="text-sm text-gray-300">
              Your wallet will be the initial owner of all token supply.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-2">
        {!connected && (
          <div className="w-full max-w-xs">
            <WalletButton />
          </div>
        )}

        {connected ? (
          <div className="flex flex-col items-center space-y-4 w-full">
            <div className="flex items-center text-green-400 mb-2">
              <IoCheckmarkCircle className="mr-2" size={20} />
              <span>Wallet connected!</span>
            </div>
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-md transition-all w-full"
            >
              Continue to Token Details
            </Button>
          </div>
        ) : (
          <div className="text-sm text-gray-300 mt-2 flex items-center">
            <IoWarning className="mr-1 text-yellow-400" />
            <span>Please connect your wallet to continue</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StepOne;
