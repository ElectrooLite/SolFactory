import React, { useState } from "react";
import { useToken } from "../../../contexts/TokenContext";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { validateUrl } from "../../../utils/token";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const StepThree = () => {
  const { tokenData, updateTokenData, nextStep, prevStep } = useToken();
  const [errors, setErrors] = useState({});
  const [showSocial, setShowSocial] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateTokenData({ [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = () => {
    const websiteError = validateUrl(tokenData.website);

    const newErrors = {
      website: websiteError,
    };

    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value !== null)
    );

    if (Object.keys(filteredErrors).length > 0) {
      setErrors(filteredErrors);
      return;
    }

    nextStep();
  };

  const inputStyle = `block w-full px-3 py-2 bg-[#13102b] border border-purple-500/70 rounded-full
                     shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                     text-white placeholder-gray-400 text-base`;

  return (
<Card className="relative bg-[#0c0325] px-4 py-3 rounded-lg border border-purple-800 text-white shadow-md">
  {/* Static Header with Toggle Button */}
  <div className="flex justify-between items-center">
    <div>
      <h2 className="text-xl font-semibold text-white">Social Media Links (optional)</h2>
      <p className="text-gray-300 text-sm">
        Connect your active social channels. You can skip this step.
      </p>
    </div>
    <button
      className="text-purple-400 text-xl focus:outline-none"
      onClick={() => setShowSocial(!showSocial)}
    >
      {showSocial ? <IoChevronUp /> : <IoChevronDown />}
    </button>
  </div>

  {/* Collapsible Section */}
  <div
    className={`transition-all duration-300 ease-in-out overflow-hidden ${
      showSocial ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"
    }`}
  >
    <div className="space-y-4 pt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-lg font-medium text-white mb-2">Website</label>
          <input
            type="text"
            name="website"
            value={tokenData.website}
            onChange={handleChange}
            placeholder="https://yourcoin.fun (Optional)"
            className={`${inputStyle} ${errors.website ? "border-red-500" : ""}`}
          />
          {errors.website && (
            <p className="mt-1 text-sm text-red-400">{errors.website}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-medium text-white mb-2">Twitter</label>
          <input
            type="text"
            name="twitter"
            value={tokenData.twitter}
            onChange={handleChange}
            placeholder="@yourtwitter (Optional)"
            className={inputStyle}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-lg font-medium text-white mb-2">Telegram</label>
          <input
            type="text"
            name="telegram"
            value={tokenData.telegram}
            onChange={handleChange}
            placeholder="https://t.me/yourchannel (Optional)"
            className={inputStyle}
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-white mb-2">Discord</label>
          <input
            type="text"
            name="discord"
            value={tokenData.discord}
            onChange={handleChange}
            placeholder="https://discord.gg/your-server (Optional)"
            className={inputStyle}
          />
        </div>
      </div>
    </div>
  </div>
</Card>

  );
};

export default StepThree;
