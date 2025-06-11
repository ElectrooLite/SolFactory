import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToken } from "../../../contexts/TokenContext";
import {
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { createCreateMetadataAccountV3Instruction as createMetadataInstruction } from "@metaplex-foundation/mpl-token-metadata";
import {
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createMintToCheckedInstruction,
  AuthorityType,
  createSetAuthorityInstruction,
} from "@solana/spl-token";
import { createUpdateMetadataAccountV2Instruction } from "@metaplex-foundation/mpl-token-metadata";
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
  IoShield,
} from "react-icons/io5";
import { createConnection } from "../../../utils/solana";

const StepFour = () => {
  // Get wallet and token context
  const { publicKey, signTransaction } = useWallet();
  const {
    tokenData,
    updateTokenData,
    setCreatedTokenAddress,
    creationProgress,
    setCreationProgress,
    isCreating,
    setIsCreating,
    setMetadataIpfsHash,
    setImageIpfsHash,
    nextStep,
    prevStep,
  } = useToken();

  // Local state
  const [isPinataConfigured, setIsPinataConfigured] = useState(false);
  const [isPinataChecking, setIsPinataChecking] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [isBalanceSufficient, setIsBalanceSufficient] = useState(false);
  const [requiredBalance, setRequiredBalance] = useState(0);
  const [mintRentExempt, setMintRentExempt] = useState(0);
  const [showAuthorities, setShowAuthorities] = useState(false);
  const [estimatedTxFee, setEstimatedTxFee] = useState(0.01); // Default estimate

  // Memoized fee calculations to prevent unnecessary recalculations
  const { baseFee, commissionFee, additionalFees, totalFee } = useMemo(() => {
    const base = TOKEN_CREATION_FEE;
    const commission = COMMISSION_FEE;

    // Calculate additional fees based on selected authority options
    const additional =
      (tokenData.revokeMint ? 0.1 : 0) +
      (tokenData.revokeFreeze ? 0.1 : 0) +
      (tokenData.revokeUpdate ? 0.1 : 0);

    return {
      baseFee: base,
      commissionFee: commission,
      additionalFees: additional,
      totalFee: commission + additional,
    };
  }, [tokenData.revokeMint, tokenData.revokeFreeze, tokenData.revokeUpdate]);

  // Toggle handler with memoization to prevent recreation on each render
  const handleToggleChange = useCallback(
    (name) => {
      updateTokenData({ [name]: !tokenData[name] });
    },
    [updateTokenData, tokenData]
  );

  // Test Pinata connection - memoized to prevent unnecessary recreation
  const testPinataConnection = useCallback(async () => {
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
  }, []);

  // Check wallet balance effect
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

    checkWalletBalance();
  }, [publicKey, totalFee, estimatedTxFee]);

  // Check Pinata connection only once on component mount
  useEffect(() => {
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
  }, [testPinataConnection]);

  // Debug fees whenever they change
  useEffect(() => {
    console.log("Fee breakdown:", {
      baseFee,
      commissionFee,
      additionalFees,
      totalFee,
      revokeMint: tokenData.revokeMint,
      revokeFreeze: tokenData.revokeFreeze,
      revokeUpdate: tokenData.revokeUpdate,
    });
  }, [
    baseFee,
    commissionFee,
    additionalFees,
    totalFee,
    tokenData.revokeMint,
    tokenData.revokeFreeze,
    tokenData.revokeUpdate,
  ]);

  // Token creation handler
  const handleCreateToken = async () => {
    // Validation checks
    if (!publicKey) {
      toast.error("Wallet not connected");
      return;
    }

    if (!signTransaction) {
      toast.error("Wallet doesn't support required methods");
      return;
    }

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

      // Create connection
      const connection = createConnection();

      // Upload metadata to IPFS if applicable
      let metadataUrl = null;
      if (tokenData.logo && isPinataConfigured) {
        try {
          // Prepare metadata for IPFS
          const metadataForPinata = {
            name: tokenData.name,
            symbol: tokenData.symbol,
            description: tokenData.description || "",
            decimals: parseInt(tokenData.decimals, 10),
            supply: tokenData.supply,
            external_url: tokenData.website || null,
            seller_fee_basis_points: 0,
            attributes: [
              {
                trait_type: "decimals",
                value: parseInt(tokenData.decimals, 10),
              },
            ],
            properties: {
              creators: [
                {
                  address: publicKey.toString(),
                  share: 100,
                },
              ],
            },
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

          // Upload to IPFS
          const ipfsData = await uploadToPinata(
            tokenData.logo,
            metadataForPinata
          );

          if (ipfsData) {
            setMetadataIpfsHash(ipfsData.metadataUri.split("/").pop());
            setImageIpfsHash(ipfsData.imageUri.split("/").pop());
            metadataUrl = ipfsData.metadataUri;
            console.log("IPFS upload successful:", ipfsData);
          }
        } catch (error) {
          console.error("IPFS upload error:", error);
          toast.warning(
            "Could not upload to IPFS. Continuing without metadata."
          );
        }
      }

      setCreationProgress(40);

      // Generate mint keypair and get rent exemption
      const mintKeypair = Keypair.generate();
      const lamportsForMint = await getMinimumBalanceForRentExemptMint(
        connection
      );

      // Derive metadata account PDA
      const metadataProgramId = new PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
      );
      const [metadataAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          metadataProgramId.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        metadataProgramId
      );

      // Create transaction
      const transaction = new Transaction();

      // FIXED: Combine all fees into a single transfer
      // Use Math.round to ensure we have an integer value for lamports
const totalFeesLamports = Math.round(
  (COMMISSION_FEE + additionalFees) * LAMPORTS_PER_SOL
);

console.log("Charging total fee:", COMMISSION_FEE + additionalFees, "SOL");


      // Add single combined fee transfer instead of separate transfers
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(COMMISSION_WALLET),
          lamports: totalFeesLamports,
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

      // Add metadata instruction if we have metadata URL
      if (metadataUrl) {
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

        
        transaction.add(
          createMetadataInstruction(
            {
              metadata: metadataAccount,
              mint: mintKeypair.publicKey,
              mintAuthority: publicKey,
              payer: publicKey,
              updateAuthority: tokenData.revokeUpdate
  ? new PublicKey("11111111111111111111111111111111")
  : publicKey,

            },
            {
              createMetadataAccountArgsV3: {
                data: metadataData,
                
                isMutable: !tokenData.revokeUpdate, // Make immutable if revokeUpdate is true
                collectionDetails: null,
              },
            }
          )
        );
      }

      // Mint initial supply if specified
      if (parseInt(tokenData.supply) > 0) {
        // Create token account
        const ata = await getAssociatedTokenAddress(
          mintKeypair.publicKey,
          publicKey
        );

        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            ata,
            publicKey,
            mintKeypair.publicKey
          )
        );

        // Calculate supply with decimals using BigInt
        const decimals = parseInt(tokenData.decimals, 10);
        const adjustedAmount =
          BigInt(tokenData.supply) * BigInt(10 ** decimals);

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

      // Revoke authorities if requested
      if (tokenData.revokeMint) {
        transaction.add(
          createSetAuthorityInstruction(
            mintKeypair.publicKey,
            publicKey,
            AuthorityType.MintTokens,
            null
          )
        );
      }

      if (tokenData.revokeFreeze) {
        transaction.add(
          createSetAuthorityInstruction(
            mintKeypair.publicKey,
            publicKey,
            AuthorityType.FreezeAccount,
            null
          )
        );
      }
      
      if (tokenData.revokeUpdate) {
  transaction.add(
    createSetAuthorityInstruction(
      mintKeypair.publicKey,
      publicKey,
      AuthorityType.Metadata, // THIS is the missing part
      null
    )
  );
}


      // Get latest blockhash and finalize transaction
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      transaction.sign(mintKeypair);

setCreationProgress(80);

// First, sign with wallet
const walletSignedTx = await signTransaction(transaction);

// Then, also sign with mintKeypair
walletSignedTx.partialSign(mintKeypair);

setCreationProgress(90);

// Now send the transaction
const signature = await connection.sendRawTransaction(walletSignedTx.serialize());


      try {
        await connection.confirmTransaction(
          {
            signature,
            blockhash,
            lastValidBlockHeight,
          },
          "confirmed"
        );

        setCreationProgress(100);
        setCreatedTokenAddress(mintKeypair.publicKey.toString());
        nextStep();
        toast.success("Token created successfully!");
      } catch (confirmError) {
        console.error("Confirmation error:", confirmError);

        // Check transaction status as fallback
        const status = await connection.getSignatureStatus(signature);

        if (status?.value && !status.value.err) {
          setCreationProgress(100);
          setCreatedTokenAddress(mintKeypair.publicKey.toString());
          nextStep();
          toast.success("Token created successfully!");
        } else if (status?.value?.err) {
          throw new Error(`Transaction failed: ${status.value.err}`);
        } else {
          toast.success("Check Solana Explorer for status.");
          setCreatedTokenAddress(mintKeypair.publicKey.toString());
          nextStep();
        }
      }
    } catch (error) {
      console.error("Token creation error:", error);

      // User-friendly error message
      let errorMessage = error.message || "Unknown error occurred";

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

      toast.error(`Check Solana Explorer for status`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4">
   

      {/* Authority Options Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {AUTHORITY_OPTIONS.map(renderAuthorityOption)}
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Revoke Freeze Authority Card */}
        <div className="border border-purple-500 rounded-xl p-4 bg-gray-900 bg-opacity-70">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-gray-900 p-3 rounded-xl">
              <div className="text-green-400 text-2xl">
                <span className="lock-icon">🔒</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">(+0.1 SOL)</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={tokenData.revokeFreeze}
                  onChange={() => handleToggleChange("revokeFreeze")}
                />
                <span className="slider round bg-green-400"></span>
              </label>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Revoke Freeze</h3>
          <p className="text-gray-400">
            Freeze Authority allows you to freeze token accounts of holders.
          </p>
        </div>

        <div className="border border-purple-500 rounded-xl p-4 bg-gray-900 bg-opacity-70">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-gray-900 p-3 rounded-xl">
              <div className="text-green-400 text-2xl">
                <span className="plus-icon">➕</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">(+0.1 SOL)</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={tokenData.revokeMint}
                  onChange={() => handleToggleChange("revokeMint")}
                />
                <span className="slider round bg-green-400"></span>
              </label>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Revoke Mint</h3>
          <p className="text-gray-400">
            Mint Authority allows you to mint more supply of your token.
          </p>
        </div>

        <div className="border border-purple-500 rounded-xl p-4 bg-gray-900 bg-opacity-70">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-gray-900 p-3 rounded-xl">
              <div className="text-green-400 text-2xl">
                <span className="plus-icon">📋</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">(+0.1 SOL)</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={tokenData.revokeUpdate}
                  onChange={() => handleToggleChange("revokeUpdate")}
                />
                <span className="slider round bg-green-400"></span>
              </label>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Revoke Update</h3>
          <p className="text-gray-400">
            Update Authority allows you to Update token metadata.
          </p>
        </div>
      </div>

      {/* Wallet Balance Warning (only show if insufficient) */}
      {publicKey && !isBalanceLoading && !isBalanceSufficient && (
        <div className="mt-4 p-2 rounded-md bg-gray-800 bg-opacity-50">
          <div className="flex items-center text-red-400 text-sm">
            <IoWarningOutline className="mr-2" size={16} />
            <span>
              Insufficient balance. Required: {requiredBalance.toFixed(4)} SOL
            </span>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {isCreating && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-white mb-2">
            Creation Progress
          </h3>
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full"
              style={{ width: `${creationProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right">
            {creationProgress}%
          </p>
        </div>
      )}

      {/* Action Buttons */}


      {/* CSS for the toggle switch */}
      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #2b2b2b;
          transition: 0.4s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
        }

        input:checked + .slider {
          background-color: #4ade80;
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .slider.round {
          border-radius: 34px;
        }

        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default StepFour;
