import React from "react";

// Star component for reusability
const Star = ({ size = "small", className }) => {
  const sizeClasses = size === "medium" ? "w-2 h-2" : "w-1 h-1";
  return (
    <div
      className={`absolute ${sizeClasses} bg-white rounded-full ${className}`}
    ></div>
  );
};

// Step number component for consistent styling
const StepNumber = ({ number }) => (
  <div className="flex-shrink-0 mr-3 sm:mr-4">
    <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-pink-900 bg-opacity-70 border border-pink-500 text-pink-500 font-semibold text-sm sm:text-base">
      {number}
    </div>
  </div>
);

const HowToUseGuide = () => {
  // Arrays for stars to reduce repetition
  const smallStars = [
    "top-1/4 left-1/4 opacity-60",
    "top-1/3 right-1/3 opacity-70",
    "top-16 left-2/3 opacity-80",
    "bottom-1/4 left-1/5 opacity-60",
    "top-1/2 right-1/4 opacity-70",
    "bottom-36 right-1/3 opacity-80",
    "top-32 left-40 opacity-90",
    "bottom-64 right-64 opacity-60",
    "top-96 left-1/3 opacity-70",
    "top-24 right-1/5 opacity-80",
    // Extra stars for visual consistency on small screens
    "bottom-20 left-10 opacity-70 sm:opacity-0",
    "top-40 right-5 opacity-80 sm:opacity-0",
  ];

  const mediumStars = [
    "top-20 right-20 opacity-40",
    "bottom-32 left-32 opacity-30",
    "top-1/2 right-96 opacity-40 hidden md:block",
    "bottom-96 left-20 opacity-30 hidden md:block",
  ];

  // Steps data for the guide
  const steps = [
    {
      title: "Connect your Solana wallet",
      description: "Simply click on the button!",
    },
    {
      title: "Insert your token name and symbol",
      description:
        "Note that your token symbol can be a maximum of 8 characters",
    },
    {
      title: "Provide a brief description for your token",
      description: "Just tell us a little bit about what your token stands for",
    },
    {
      title: "Upload the logo for your token",
      description: "Make sure it's correct pixels",
    },
    {
      title: "Select the decimals quanitity for your token",
      description: "The standard value is recommended",
    },
    {
      title: "Determine the authorities",
      description: "It's recommended to use our standard settings",
    },
    {
      title: "Click on Launch!",
      description: "Your token will be ready in a few seconds!",
    },
  ];

  return (
    <div
      id="features"
      className="relative bg-[#06001D] min-h-screen w-full overflow-hidden flex items-center justify-center py-8 sm:py-12 md:py-16 px-4"
    >
      {/* Stars background */}
      <div className="absolute inset-0">
        {/* Small stars */}
        {smallStars.map((position, index) => (
          <Star key={`small-${index}`} className={position} />
        ))}

        {/* Medium stars */}
        {mediumStars.map((position, index) => (
          <Star key={`medium-${index}`} size="medium" className={position} />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-3xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 px-2">
          <span className="text-purple-500">How To</span>
          <span className="text-purple-500"> Use The Solana Token Creator</span>
        </h1>

        {/* Instructions Card */}
        <div className="bg-[#0c0325] bg-opacity-70 rounded-xl sm:rounded-2xl border border-[#1a1138] shadow-lg p-4 sm:p-6 md:p-10">
          <ol className="space-y-5 sm:space-y-6 md:space-y-8">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start">
                <StepNumber number={index + 1} />
                <div>
                  <h3 className="text-white text-base sm:text-sm  md:text-sm font-semibold break-words">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm  sm:text-base">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default HowToUseGuide;
