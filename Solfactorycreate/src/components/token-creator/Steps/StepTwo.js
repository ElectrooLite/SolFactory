import React, { useState } from "react";
import { useToken } from "../../../contexts/TokenContext";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { useDropzone } from "react-dropzone";
import {
  validateTokenName,
  validateTokenSymbol,
  validateTokenSupply,
  validateTokenDecimals,
} from "../../../utils/token";
import { DEFAULT_TOKEN_DECIMALS } from "../../../utils/constants";
import { IoArrowBack, IoImageOutline } from "react-icons/io5";

const StepTwo = () => {
  const { tokenData, updateTokenData, nextStep, prevStep } = useToken();
  const [errors, setErrors] = useState({});

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        updateTokenData({ logo: file });
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateTokenData({ [name]: value });

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = () => {
    // Validate all fields
    const nameError = validateTokenName(tokenData.name);
    const symbolError = validateTokenSymbol(tokenData.symbol);
    const supplyError = validateTokenSupply(tokenData.supply);
    const decimalsError = validateTokenDecimals(tokenData.decimals);

    const newErrors = {
      name: nameError,
      symbol: symbolError,
      supply: supplyError,
      decimals: decimalsError,
    };

    // Filter out null errors
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value !== null)
    );

    if (Object.keys(filteredErrors).length > 0) {
      setErrors(filteredErrors);
      return;
    }

    // If all validations pass, proceed to next step
    nextStep();
  };

  // Custom input style to match the design in the image
  const inputStyle = `block w-full px-3 py-2 bg-[#13102b] border border-purple-500/70 rounded-full
                     shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                     text-white placeholder-gray-400 text-base`;

  // Custom textarea style matching the theme but with appropriate shape
  const textareaStyle = `block w-full px-3 py-2 bg-[#13102b] border border-purple-500/70 rounded-3xl
                        shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                        text-white placeholder-gray-400 text-base`;

  // Custom select style to match input fields
  const selectStyle = `block w-full px-3 py-2 bg-[#13102b] border border-purple-500/70 rounded-full
                      shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                      text-white appearance-none`;

  return (
    <Card className="bg-[#0c0325] p-4 rounded-lg border border-purple-800 text-white shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">Token Details</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Token Name <span className="text-pink-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={tokenData.name}
            onChange={handleChange}
            placeholder="e.g. Jupiter Coin"
            className={`${inputStyle} ${errors.name ? "border-red-500" : ""}`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Token Symbol <span className="text-pink-500">*</span>
          </label>
          <input
            type="text"
            name="symbol"
            value={tokenData.symbol}
            onChange={handleChange}
            placeholder="e.g. JUP"
            maxLength={8}
            className={`${inputStyle} ${errors.symbol ? "border-red-500" : ""}`}
          />
          {errors.symbol && (
            <p className="mt-1 text-sm text-red-400">{errors.symbol}</p>
          )}
          <p className="mt-1 text-sm text-gray-400">Maximum 8 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Token Description
          </label>
          <textarea
            name="description"
            value={tokenData.description}
            onChange={handleChange}
            className={textareaStyle}
            rows={4}
            placeholder="Describe what your token stands for..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Token Supply <span className="text-pink-500">*</span>
            </label>
            <input
              type="number"
              name="supply"
              value={tokenData.supply}
              onChange={handleChange}
              placeholder="e.g. 1000000"
              className={`${inputStyle} ${
                errors.supply ? "border-red-500" : ""
              }`}
            />
            {errors.supply && (
              <p className="mt-1 text-sm text-red-400">{errors.supply}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Decimals <span className="text-pink-500">*</span>
            </label>
            <div className="relative">
              <select
                name="decimals"
                value={tokenData.decimals}
                onChange={handleChange}
                className={`${selectStyle} ${
                  errors.decimals ? "border-red-500" : ""
                }`}
              >
                <option value={DEFAULT_TOKEN_DECIMALS}>
                  {DEFAULT_TOKEN_DECIMALS} (Common)
                </option>
                <option value={9}>9 (Standard)</option>
                <option value={0}>0 (No decimals)</option>
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={8}>8</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {errors.decimals && (
              <p className="mt-1 text-sm text-red-400">{errors.decimals}</p>
            )}
            <p className="mt-1 text-sm text-gray-400">
              Controls how divisible your token is
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Token Logo (Optional)
          </label>
          <div
            {...getRootProps()}
            className={`mt-1 border-2 border-dashed rounded-2xl px-6 py-8 cursor-pointer transition-colors ${
              isDragActive
                ? "border-purple-500 bg-purple-900 bg-opacity-10"
                : "border-purple-500/50 hover:border-purple-500 hover:bg-purple-900 hover:bg-opacity-5"
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              {tokenData.logo ? (
                <div className="flex flex-col items-center">
                  <img
                    src={URL.createObjectURL(tokenData.logo)}
                    alt="Token logo preview"
                    className="w-20 h-20 object-contain mb-2"
                  />
                  <p className="text-sm text-gray-300">
                    {tokenData.logo.name} (
                    {Math.round(tokenData.logo.size / 1024)} KB)
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Click or drag to replace
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="rounded-full p-4 border-2 border-purple-500/50 mb-2">
                    <IoImageOutline
                      className="h-10 w-10 text-purple-400"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="font-medium text-white">Upload logo</p>
                  <p className="mt-4 text-sm text-gray-300">
                    Please ensure your image is 128x128 pixels
                  </p>
                  <p className="mt-2 text-sm text-gray-300">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

 
    </Card>
  );
};

export default StepTwo;
