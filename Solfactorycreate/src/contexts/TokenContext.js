import { createContext, useContext, useState, useEffect } from "react";

const TokenContext = createContext(null);

export function TokenProvider({ children }) {
  const [tokenData, setTokenData] = useState({
    name: "",
    symbol: "",
    description: "",
    supply: 1000000000,
    decimals: 9,
    logo: null,
    website: "",
    twitter: "",
    telegram: "",
    discord: "",
    revokeMint: false,
    revokeFreeze: false,
    revokeUpdate: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
const [createdTokenAddress, setCreatedTokenAddressState] = useState(null);

useEffect(() => {
  const stored = localStorage.getItem("createdTokenAddress");
  if (stored) setCreatedTokenAddressState(stored);
}, []);


const setCreatedTokenAddress = (address) => {
  console.log("TOKEN ADDRESS SET:", address);
  setCreatedTokenAddressState(address);
  localStorage.setItem("createdTokenAddress", address);
};


  const [creationProgress, setCreationProgress] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [metadataIpfsHash, setMetadataIpfsHash] = useState(null);
  const [imageIpfsHash, setImageIpfsHash] = useState(null);

  const updateTokenData = (data) => {
    setTokenData((prev) => ({ ...prev, ...data }));
  };

  const resetTokenData = () => {
    setTokenData({
      name: "",
      symbol: "",
      description: "",
      supply: 1000000000,
      decimals: 9,
      logo: null,
      website: "",
      twitter: "",
      telegram: "",
      discord: "",
      revokeMint: false,
      revokeFreeze: false,
    });
    setCurrentStep(1);
   setCreatedTokenAddress(null);
localStorage.removeItem("createdTokenAddress");
    setCreationProgress(0);
    setIsCreating(false);
    setMetadataIpfsHash(null);
    setImageIpfsHash(null);
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  return (
    <TokenContext.Provider
      value={{
        tokenData,
        updateTokenData,
        resetTokenData,
        currentStep,
        nextStep,
        prevStep,
        goToStep,
        createdTokenAddress,
        setCreatedTokenAddress,
        creationProgress,
        setCreationProgress,
        isCreating,
        setIsCreating,
        metadataIpfsHash,
        setMetadataIpfsHash,
        imageIpfsHash,
        setImageIpfsHash,
        setCurrentStep,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}

export function useToken() {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
}
