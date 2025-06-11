import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToken } from "../../../contexts/TokenContext";
import {
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  CreateMetadataAccountArgsV3,
  createCreateMetadataAccountV3Instruction as createMetadataInstruction,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createUpdateMetadataAccountV2Instruction,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createMintToCheckedInstruction,
  createMint,
  AuthorityType,
  createSetAuthorityInstruction,
} from "@solana/spl-token";
import { formatAddress } from "../../../utils/token";
import { uploadToPinata } from "../../../utils/pinata";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import {
  COMMISSION_WALLET,
  TOKEN_CREATION_FEE,
  COMMISSION_FEE,
} from "../../../utils/constants";
import { toast } from "react-toastify";
import axios from "axios";
import {
  IoArrowBack,
  IoWallet,
  IoCheckmarkCircleOutline,
  IoWarningOutline,
  IoCloudUpload,
} from "react-icons/io5";
import { createConnection } from "../../../utils/solana";

const StepFive = () => {
  // Get wallet information at the component level
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

const {
  tokenData,
  prevStep,
  nextStep,
  createdTokenAddress,
  setCreatedTokenAddress,
  setCurrentStep, // ✅ ADD THIS LINE
  creationProgress,
  setCreationProgress,
  isCreating,
  setIsCreating,
  setMetadataIpfsHash,
  setImageIpfsHash,
} = useToken();


  // State for Pinata connection
  const [isPinataConfigured, setIsPinataConfigured] = useState(false);
  const [isPinataChecking, setIsPinataChecking] = useState(true);

  // New state for balance check
  const [walletBalance, setWalletBalance] = useState(0);
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const [isBalanceSufficient, setIsBalanceSufficient] = useState(false);
  const [showAuthorities, setShowAuthorities] = useState(false);
  const [requiredBalance, setRequiredBalance] = useState(0);

  // Calculate total fee
  const baseFee = TOKEN_CREATION_FEE;
  const commissionFee = COMMISSION_FEE;
const additionalFees =
  (tokenData.revokeMint ? 0.1 : 0) +
  (tokenData.revokeFreeze ? 0.1 : 0) +
  (tokenData.revokeUpdate ? 0.1 : 0);

  const totalFee = baseFee + commissionFee + additionalFees;

  // Display fee breakdown in console for debugging
  useEffect(() => {
    console.log("Fee breakdown:", {
      baseFee,
      commissionFee,
      additionalFees,
      totalFee,
      revokeMint: tokenData.revokeMint,
      revokeFreeze: tokenData.revokeFreeze,
    });
  }, [tokenData.revokeMint, tokenData.revokeFreeze]);

  // Check wallet balance and Pinata connection on component mount or when publicKey changes
  useEffect(() => {
const checkWalletBalance = async () => {
  if (!publicKey) {
    setWalletBalance(0);
    setIsBalanceSufficient(false);
    setIsBalanceLoading(false);
    return;
  }

  try {
    setIsBalanceLoading(true);
    const connection = createConnection();

    // 🛠 Safely get balance
    const balanceLamports = await connection.getBalance(publicKey);
    const balanceSOL = balanceLamports / LAMPORTS_PER_SOL;

    setWalletBalance(balanceSOL);

    // ⚠️ You must define `requiredBalance` in the scope before this
    const estimatedTxFee = 0.01;
    const totalRequired = totalFee + estimatedTxFee;
    setIsBalanceSufficient(balanceSOL >= totalRequired);
    setRequiredBalance(totalRequired);

    console.log("Wallet balance:", balanceSOL);
    console.log("Required balance:", totalRequired);
  } catch (err) {
    console.error("Error checking wallet balance:", err);
    setWalletBalance(0);
    setIsBalanceSufficient(false);
  } finally {
    setIsBalanceLoading(false);
  }
};



    const checkPinataConnection = async () => {
      try {
        setIsPinataChecking(true);
        const isConnected = await testPinataConnection();
        setIsPinataConfigured(isConnected);
        if (!isConnected && process.env.NEXT_PUBLIC_PINATA_API_KEY) {
          console.warn(
            "Pinata credentials are configured but connection failed"
          );
        }
      } catch (error) {
        console.error("Error checking Pinata connection:", error);
        setIsPinataConfigured(false);
      } finally {
        setIsPinataChecking(false);
      }
    };

    checkPinataConnection();
    checkWalletBalance();
  }, [publicKey, totalFee]);

  const testPinataConnection = async () => {
    if (
      !process.env.NEXT_PUBLIC_PINATA_API_KEY ||
      !process.env.NEXT_PUBLIC_PINATA_SECRET_KEY
    ) {
      return false;
    }

    try {
      const response = await axios.get(
        "https://api.pinata.cloud/data/testAuthentication",
        {
          headers: {
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
            pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
          },
        }
      );
      return response.status === 200;
    } catch (error) {
      console.error("Pinata connection test failed:", error);
      return false;
    }
  };

  const simulateTokenCreation = async () => {
  const fakeMint = "MockMint11111111111111111111111111111111111111";

  try {
    setIsCreating(true);
    setCreationProgress(10);
    toast.info("Simulating token creation...");

    await new Promise((r) => setTimeout(r, 800));
    setCreationProgress(40);

    await new Promise((r) => setTimeout(r, 800));
    setCreationProgress(70);

setCreatedTokenAddress(fakeMint);
setCreationProgress(100);
toast.success("Token created (simulation)");
setTimeout(() => {
  setCurrentStep(6);
}, 300);



   
  } catch (error) {
    toast.error("Simulation failed");
    console.error("Simulation error:", error);
  } finally {
    setIsCreating(false);
  }
};

  const handleCreateToken = async () => {

   

    // Validate wallet connection
    if (!publicKey) {
      toast.error("Wallet not connected");
      return;
    }

    if (!signTransaction) {
      toast.error("Wallet doesn't support required methods");
      return;
    }

    // Check balance again before proceeding
    if (!isBalanceSufficient) {
      toast.error(
        `Insufficient balance. You need at least ${requiredBalance.toFixed(
          4
        )} SOL`
      );
      return;
    }

    try {
      setIsCreating(true);
      setCreationProgress(5);
      toast.info("Preparing token creation...");

      // Create connection to Solana with extended timeout
      const connection = createConnection();

      // IPFS handling
      let metadataUrl = null;
      let ipfsData = null;

      // Upload to IPFS if we have a logo and Pinata is configured
      if (tokenData.logo && isPinataConfigured) {
        try {
          // Format metadata for Pinata using the expected structure
          const metadataForPinata = {
            name: tokenData.name,
            symbol: tokenData.symbol,
            description: tokenData.description || "",
            decimals: parseInt(tokenData.decimals, 10),
            supply: tokenData.supply,
            // Add any external URL (website)
            external_url: tokenData.website || null,
            // Set royalty basis points (optional)
            seller_fee_basis_points: 0,
            // Prepare attributes array
            attributes: [
              {
                trait_type: "decimals",
                value: parseInt(tokenData.decimals, 10),
              },
            ],
            // Prepare properties object with creators
            properties: {
              creators: [
                {
                  address: publicKey.toString(),
                  share: 100,
                },
              ],
            },
            // Add social links
            links: [],
          };

          // Add social links when available
          if (tokenData.website) {
            metadataForPinata.links.push({
              name: "website",
              url: tokenData.website,
            });
          }

          if (tokenData.twitter) {
            metadataForPinata.links.push({
              name: "twitter",
              url: `https://twitter.com/${tokenData.twitter}`,
            });
          }

          if (tokenData.telegram) {
            metadataForPinata.links.push({
              name: "telegram",
              url: `https://t.me/${tokenData.telegram}`,
            });
          }
          if (tokenData.discord) {
            metadataForPinata.links.push({
              name: "discord",
              url: `https://discord.gg/${tokenData.discord}`,
            });
          }

          // Upload to Pinata and log result
          ipfsData = await uploadToPinata(tokenData.logo, metadataForPinata);
          console.log("IPFS upload successful:", ipfsData);

          // Save IPFS data
          if (ipfsData) {
            setMetadataIpfsHash(ipfsData.metadataUri.split("/").pop());
            setImageIpfsHash(ipfsData.imageUri.split("/").pop());
            metadataUrl = ipfsData.metadataUri;
          }
        } catch (error) {
          console.error("IPFS upload error:", error);
          toast.warning(
            "Could not upload to IPFS. Continuing without metadata."
          );
        }
      }

      setCreationProgress(40);

      // Format the token data
      const preparedTokenData = {
        name: tokenData.name,
        symbol: tokenData.symbol,
        description: tokenData.description || "",
        supply: tokenData.supply,
        decimals: parseInt(tokenData.decimals, 10),
        revokeMint: tokenData.revokeMint === true,
        revokeFreeze: tokenData.revokeFreeze === true,
        metadataUrl: metadataUrl,
      };

      // Log wallet status for debugging
      console.log("Wallet status at token creation:", {
        connected: !!publicKey,
        publicKey: publicKey?.toString(),
        hasSignTransaction: !!signTransaction,
        hasSignAllTransactions: !!signAllTransactions,
      });

      // Create a Keypair for the token mint
      const mintKeypair = Keypair.generate();
      console.log(
        "Generated mint keypair with public key:",
        mintKeypair.publicKey.toString()
      );

      // Get minimum lamports for rent exemption
      const lamportsForMint = await getMinimumBalanceForRentExemptMint(
        connection
      );
      console.log("Got lamports for mint:", lamportsForMint);

      // IMPORTANT: Derive the metadata account PDA
      // This is critical for the metadata to be properly linked to the token
      const metadataProgramId = new PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
      );
      console.log("Using metadata program ID:", metadataProgramId.toString());

      const [metadataAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          metadataProgramId.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        metadataProgramId
      );
      console.log("Derived metadata account:", metadataAccount.toString());

      // Create transactions manually
      const transaction = new Transaction();

// Calculate all authority fees safely
const totalAuthorityFee =
  (tokenData.revokeMint ? 0.1 : 0) +
  (tokenData.revokeFreeze ? 0.1 : 0) +
  (tokenData.revokeUpdate ? 0.1 : 0);

// Combine base commission and authority fees
const totalFeeLamports = BigInt(
  Math.round((COMMISSION_FEE + totalAuthorityFee) * LAMPORTS_PER_SOL)
);

// One single transfer
transaction.add(
  SystemProgram.transfer({
    fromPubkey: publicKey,
    toPubkey: new PublicKey(COMMISSION_WALLET),
    lamports: Number(totalFeeLamports),
  })
);



      // Create mint account
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports: lamportsForMint,
          programId: TOKEN_PROGRAM_ID,
        })
      );

      // Initialize mint
      transaction.add(
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          parseInt(tokenData.decimals, 10),
          publicKey,
          publicKey,
          TOKEN_PROGRAM_ID
        )
      );

      // IMPORTANT: Add metadata instruction
      // This is critical for the token to be recognized by wallets and display correctly
      if (metadataUrl) {
        console.log("Adding metadata instruction with URI:", metadataUrl);

        // Create metadata for the token
        const metadataData = {
          name: tokenData.name,
          symbol: tokenData.symbol,
          uri: metadataUrl,
          sellerFeeBasisPoints: 0,
          creators: [
            {
              address: publicKey,
              verified: true,
              share: 100,
            },
          ],
          collection: null,
          uses: null,
        };

        // Create metadata instruction
const revokeUpdate = tokenData.revokeUpdate === true;


// Create metadata instruction (must be above transaction.add)
const createMetadataIx = createMetadataInstruction(
  {
    metadata: metadataAccount,
    mint: mintKeypair.publicKey,
    mintAuthority: publicKey,
    payer: publicKey,
    updateAuthority: publicKey,
  },
  {
    createMetadataAccountArgsV3: {
      data: metadataData,
      isMutable: !tokenData.revokeUpdate,
      collectionDetails: null,
    },
  }
);

// ✅ Now add it to the transaction
transaction.add(createMetadataIx);

// ✅ Then, if revokeUpdate is true, add the update instruction
if (tokenData.revokeUpdate) {
  const updateIx = createUpdateMetadataAccountV2Instruction(
    {
      metadata: metadataAccount,
      updateAuthority: publicKey,
    },
    {
      updateMetadataAccountArgsV2: {
        data: null,
        updateAuthority: new PublicKey("11111111111111111111111111111111"),
        primarySaleHappened: null,
        isMutable: false,
      },
    }
  );

  transaction.add(updateIx);
}





      } else {
        console.warn("No metadata URL available, skipping metadata creation");
      }

      // If we want to mint initial supply
      if (parseInt(tokenData.supply) > 0) {
        console.log(
          "Adding instructions for initial supply:",
          tokenData.supply
        );
        console.log("With decimals:", tokenData.decimals);

        // Get the associated token account for the wallet
        const ata = await getAssociatedTokenAddress(
          mintKeypair.publicKey,
          publicKey
        );
        console.log("Associated token account:", ata.toString());

        // Create the token account
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            ata,
            publicKey,
            mintKeypair.publicKey
          )
        );

        // Calculate adjusted amount with BigInt to handle large numbers properly
        const decimals = parseInt(tokenData.decimals, 10);
        const multiplier = BigInt(10 ** decimals);
        const supply = BigInt(tokenData.supply);
        const adjustedAmount = supply * multiplier;

        console.log(
          "Adjusted amount to mint (BigInt):",
          adjustedAmount.toString()
        );

        // Mint tokens with the big integer value
        transaction.add(
          createMintToCheckedInstruction(
            mintKeypair.publicKey,
            ata,
            publicKey,
            adjustedAmount,
            decimals
          )
        );
      }

      // Revoke mint authority if requested
      if (tokenData.revokeMint) {
        console.log("Adding instruction to revoke mint authority");

        // Add instruction to revoke mint authority by setting it to null
        transaction.add(
          createSetAuthorityInstruction(
            mintKeypair.publicKey, // mint account
            publicKey, // current authority
            AuthorityType.MintTokens, // authority type
            null // new authority (null to revoke)
          )
        );
      }

      // Revoke freeze authority if requested
      if (tokenData.revokeFreeze) {
        console.log("Adding instruction to revoke freeze authority");

        // Add instruction to revoke freeze authority by setting it to null
        transaction.add(
          createSetAuthorityInstruction(
            mintKeypair.publicKey, // mint account
            publicKey, // current authority
            AuthorityType.FreezeAccount, // authority type
            null // new authority (null to revoke)
          )
        );
      }

      console.log("tokenData.revokeUpdate is", tokenData.revokeUpdate);

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Add the mint keypair as signer
// Sign with mint keypair
transaction.partialSign(mintKeypair);

setCreationProgress(80);

// Sign with wallet
const signedTransaction = await signTransaction(transaction);

setCreationProgress(90);

// Send transaction to Solana
const signature = await connection.sendRawTransaction(signedTransaction.serialize());
setCreatedTokenAddress(mintKeypair.publicKey.toString());
setTimeout(() => {
  setCurrentStep(6);
}, 100);
toast.success("Token submitted! View mint address below.");

console.log("Transaction sent with signature:", signature);

      // Wait for confirmation with explicit timeout and recent blockhash
      try {
        // Use the enhanced confirmation method with explicit blockhash and lastValidBlockHeight
        const confirmation = await connection.confirmTransaction(
          {
            signature,
            blockhash,
            lastValidBlockHeight,
          },
          "confirmed"
        );

        console.log("Transaction confirmed:", confirmation);

        setCreationProgress(100);
        setCreatedTokenAddress(mintKeypair.publicKey.toString());
        nextStep();
        toast.success("Token created successfully!");
      } catch (confirmError) {
        console.error("Confirmation error:", confirmError);

        // The transaction may still have succeeded even if confirmation times out
        // Check the status one more time before giving up
        try {
          const status = await connection.getSignatureStatus(signature);
          console.log("Transaction status:", status);

          if (status && status.value && !status.value.err) {
            // Transaction likely succeeded despite timeout
            setCreationProgress(100);
            setCreatedTokenAddress(mintKeypair.publicKey.toString());
            nextStep();
            toast.success("Token created successfully! Check Solana Explorer");
          } else if (status && status.value && status.value.err) {
            // Transaction failed
            throw new Error(`Transaction failed: ${status.value.err}`);
          } else {
            // Status unknown, but transaction was sent
            toast.success("Check Solana Explorer for status.");
            setCreatedTokenAddress(mintKeypair.publicKey.toString());
            nextStep();
          }
        } catch (statusError) {
          console.error("Status check error:", statusError);
          toast.success(" Token created successfully! Check Solana Explorer.");
          // Still proceed to next step since the transaction might have succeeded
          setCreatedTokenAddress(mintKeypair.publicKey.toString());
          nextStep();
        }
      }
    } catch (error) {
      console.error("Token creation error:", error);

      // Provide user-friendly error message
      let errorMessage = error.message || "Unknown error occurred";

      // Simplify common error messages
      if (errorMessage.includes("slice") || errorMessage.includes("null")) {
        errorMessage =
          "Error with wallet connection. Please reconnect your wallet and try again.";
      } else if (errorMessage.includes("insufficient")) {
        errorMessage =
          "Not enough SOL in your wallet to complete this transaction.";
      } else if (errorMessage.includes("blockhash")) {
        errorMessage = "Network timeout. Please try again.";
      } else if (errorMessage.includes("0x1")) {
        errorMessage =
          "Transaction simulation failed. Please check your wallet balance.";
      } else if (errorMessage.includes("timeout")) {
        errorMessage =
          "Transaction confirmation timed out. Your token may still have been created. Check your wallet.";
      }

      toast.error(`Error creating token: ${errorMessage}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="bg-[#0c0325] pt-1 pb-8 px-4 rounded-lg border border-purple-800 text-white shadow-md w-full">
      {/* Wallet Balance Status */}
      <div className="mb-4">
        {publicKey && !isBalanceLoading && (
          <div
            className={`mt-2 p-2 rounded-md ${
              !isBalanceSufficient ? "bg-gray-800" : ""
            }  bg-opacity-50`}
          >
            {!isBalanceSufficient && (
              <div className="flex items-center text-red-400 text-xs">
                <IoWarningOutline className="mr-2" size={16} />
                <span>
                  Insufficient balance. Required: {requiredBalance.toFixed(4)}{" "}
                  SOL ({totalFee.toFixed(2)} SOL fee + estimated transaction
                  costs)
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-center p-3 text-sm">
        Click, to launch the token creation process.
      </p>

      {/* Progress Bar */}
      {isCreating && (
        <div className="mt-3">
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1 sm:mb-2">
            Creation Progress
          </h3>
          <div className="w-full bg-gray-800 rounded-full h-2 sm:h-2.5">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 sm:h-2.5 rounded-full"
              style={{ width: `${creationProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right">
            {creationProgress}%
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col xs:flex-row justify-between items-center gap-3 mt-4">
        <Button
          onClick={handleCreateToken}
          className={`w-full xs:w-auto bg-gradient-to-r 
            ${
              isBalanceSufficient
                ? "from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                : "from-gray-500 to-gray-600 cursor-not-allowed"
            } 
            text-white font-medium py-2 px-4 sm:px-6 rounded-md transition-all 
            disabled:opacity-50 disabled:cursor-not-allowed relative text-sm sm:text-base`}
          disabled={isCreating || !isBalanceSufficient || !publicKey}
        >
          {isCreating && (
            <span className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"></div>
            </span>
          )}
          <span className={isCreating ? "opacity-0" : ""}>Create Token</span>
        </Button>
      </div>


    </Card>
  );
};

export default StepFive;
