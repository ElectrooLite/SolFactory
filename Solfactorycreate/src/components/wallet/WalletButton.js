import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import { formatAddress } from "../../utils/token";
import { CgSpinner } from "react-icons/cg";
import { useToken } from "../../contexts/TokenContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { FaTelegramPlane } from "react-icons/fa";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

const WalletButton = () => {
  const { connected, connecting, publicKey } = useWallet();
  const { setCurrentStep } = useToken();
  const router = useRouter();

  useEffect(() => {
    if (connected && publicKey) {
      setCurrentStep(2);
    } else if (!connected && !connecting && router.pathname !== "/") {
      router.push("/");
    }
  }, [connected, connecting, publicKey, setCurrentStep, router]);

  const twitterIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-7 h-7 text-pink-400 hover:text-purple-400 transition-colors"
    >
      <path d="M17.525 3H20.5L13.974 10.13 21.75 21h-6.42l-4.674-6.464L5.5 21H2.5l7.052-7.78L2.25 3h6.61l4.1 5.736L17.525 3Zm-1.14 16h1.57L7.688 5h-1.6l10.297 14Z" />
    </svg>
  );

  const telegramIcon = (
    <FaTelegramPlane
      size={28}
      className="text-pink-400 hover:text-purple-400 transition-colors"
    />
  );

  const socialIcons = (
    <>
      <a
        href="https://x.com/solanafactoryio"
        target="_blank"
        rel="noopener noreferrer"
      >
        {twitterIcon}
      </a>
      <a
        href="https://t.me/SolFactoryDeFi"
        target="_blank"
        rel="noopener noreferrer"
      >
        {telegramIcon}
      </a>
    </>
  );

  if (connecting) {
    return (
      <div className="flex items-center gap-3">
        {socialIcons}
        <button className="flex items-center wallet-adapter-button" disabled>
          <CgSpinner className="animate-spin mr-2 h-5 w-5" />
          Connecting...
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {socialIcons}
      <WalletMultiButton className="bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400 text-white font-medium" />
    </div>
  );
};

export default WalletButton;
