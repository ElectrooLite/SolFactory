import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  setAuthority,
  AuthorityType,
} from "@solana/spl-token";
import { COMMISSION_WALLET, COMMISSION_FEE } from "./constants";

const MAINNET_RPC_URL = process.env.NEXT_PUBLIC_MAINNET_RPC_URL;

/**
 * Create a connection to the Solana network
 */


export const createConnection = () => {
  const connection = new Connection(MAINNET_RPC_URL, "confirmed");

  // Extend the default confirmation timeout
  connection.confirmTransactionInitialTimeout = 60000; // 60 seconds instead of 30

  return connection;
};


/**
 * Convert SOL to lamports
 */
export const solToLamports = (sol) => {
  return sol * LAMPORTS_PER_SOL;
};

/**
 * Send commission to the fee wallet
 */
export const sendCommission = async (
  connection,
  feePayer,
  amount = COMMISSION_FEE
) => {
  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: feePayer,
        toPubkey: new PublicKey(COMMISSION_WALLET),
        lamports: solToLamports(amount),
      })
    );

    return transaction;
  } catch (error) {
    console.error("Error sending commission:", error);
    throw error;
  }
};
