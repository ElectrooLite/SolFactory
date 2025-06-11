import React from "react";
import { BsCheckCircleFill } from "react-icons/bs";

// Define steps based on the image
import { TOKEN_STEPS } from "../../utils/constants";

const StepProgress = ({ currentStep = 1 }) => {
  return (
    <div className="mb-8 bg-[#06001D]">
      {/* Desktop Version - hidden on small screens */}
      <div className="hidden md:flex justify-between items-center relative">
        {/* Background line that spans across all steps */}
        <div className="absolute top-7 left-0 right-0 h-0.5 bg-gray-800 z-0"></div>

        {TOKEN_STEPS.map((step, index) => (
          <div
            key={`desktop-${step.id}`}
            className="flex flex-col items-center relative z-10"
          >
            {/* Step circle */}
            <div
              className={`h-14 w-14 rounded-full flex items-center justify-center text-base border ${
                step.id < currentStep
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400"
                  : step.id === currentStep
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400"
                  : "bg-[#0e0724] border-gray-700 text-gray-400"
              }`}
            >
              {step.id < currentStep ? (
                <BsCheckCircleFill size={24} className="text-white" />
              ) : (
                step.id
              )}
            </div>

            {/* Step name */}
            <div
              className={`text-sm text-center mt-2 font-medium ${
                step.id === currentStep
                  ? "text-pink-400"
                  : step.id < currentStep
                  ? "text-pink-400"
                  : "text-gray-400"
              }`}
            >
              {step.name}
            </div>

            {/* Progress line to the left of current step */}
            {step.id <= currentStep && index > 0 && (
              <div
                className="absolute top-7 right-1/2 h-0.5 bg-pink-500 z-0"
                style={{
                  width: "calc(100% - 1rem)",
                  transform: "translateX(-100%)",
                }}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Version - only visible on small screens */}
      <div className="block md:hidden">
        {/* Step indicators with numbers at the top */}
        <div className="flex justify-between items-center relative px-2 mb-4">
          {/* Background line spanning all steps */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-800 z-0"></div>

          {TOKEN_STEPS.map((step, index) => (
            <div key={`mobile-indicator-${step.id}`} className="relative z-10">
              {/* Small step circle */}
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm border ${
                  step.id < currentStep
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400"
                    : step.id === currentStep
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400"
                    : "bg-[#0e0724] border-gray-700 text-gray-400"
                }`}
              >
                {step.id < currentStep ? (
                  <BsCheckCircleFill size={16} className="text-white" />
                ) : (
                  step.id
                )}
              </div>

              {/* Progress line to the left of current step */}
              {step.id <= currentStep && index > 0 && (
                <div
                  className="absolute top-4 right-1/2 h-0.5 bg-pink-500 z-0"
                  style={{
                    width: "calc(100% - 0.5rem)",
                    transform: "translateX(-100%)",
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Current step name - show only the active step name on mobile */}
        <div className="text-center">
          <div className={`text-base font-medium text-pink-400`}>
            {TOKEN_STEPS.find((step) => step.id === currentStep)?.name || ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepProgress;
