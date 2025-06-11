import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// Import styles for wallet adapter
import "@solana/wallet-adapter-react-ui/styles.css";

const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
const MAINNET_RPC_URL = process.env.NEXT_PUBLIC_MAINNET_RPC_URL;

export default function WalletProvider({ children }) {
  // Determine network based on environment variable
  const network = useMemo(() => {
    if (NETWORK === "mainnet-beta") {
      return WalletAdapterNetwork.Mainnet;
    } else {
      // Default to devnet for any other value
      return WalletAdapterNetwork.Devnet;
    }
  }, []);

  console.log("Using Solana network:", network);

  // Define endpoint based on network
  const endpoint = useMemo(() => {
    if (network === WalletAdapterNetwork.Mainnet && MAINNET_RPC_URL) {
      console.log("Using custom mainnet RPC URL");
      return MAINNET_RPC_URL;
    }
    // Otherwise use default cluster API
    return clusterApiUrl(network);
  }, [network]);

  // Initialize all the supported wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
