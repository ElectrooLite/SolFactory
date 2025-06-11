import React, { useState } from "react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "Is it Safe to Create Solana Tokens here?",
      answer:
        "Yes, our platform uses secure, audited smart contracts to create your Solana tokens. All transactions are performed directly through your connected wallet, ensuring you maintain full control of your assets throughout the process.",
    },
    {
      question: "How much time will the Solana Token Creator Take?",
      answer:
        "Creating a Solana token on our platform is extremely fast - typically less than 5 minutes from start to finish. Just connect your wallet, fill in your token details, and launch!",
    },
    {
      question: "How much will it cost?",
      answer:
        "The cost includes a small platform fee plus the Solana network fees. The total typically ranges from 0.1 to 0.5 SOL depending on current network conditions and the token features you select.",
    },
    {
      question: "Do I have full ownership of the token?",
      answer:
        "Absolutely! You have 100% ownership of your created token. We don't retain any control or ownership rights. All token authorities are assigned directly to your wallet address.",
    },
    {
      question: "How can I manage token authorities on Solana?",
      answer:
        "After creating your token, you can manage authorities through our dashboard or directly via Solana CLI. Token authorities include minting, freezing, and thawing capabilities which you can delegate or revoke as needed.",
    },
  ];

  return (
    <div
      id="faq"
      className="relative bg-[#06001D] text-white min-h-screen w-full overflow-hidden py-16"
    >
      {/* Stars background */}
      <div className="absolute inset-0">
        {Array(40)
          .fill()
          .map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.1,
              }}
            ></div>
          ))}
      </div>

      {/* Large outline text in background */}
      <div className="absolute top-0 left-0 right-0 text-center text-9xl font-bold opacity-5 text-white pointer-events-none">
        FREQUENT
      </div>

      {/* Small purple diamond icon */}
      <div className="absolute top-20 left-1/4 w-6 h-6 bg-purple-600 transform rotate-45"></div>

      {/* Sunburst icon */}
      <div className="absolute top-40 right-1/4">
        <div className="w-12 h-12 relative">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-4 bg-white left-1/2 top-1/2 -translate-x-1/2 origin-bottom"
              style={{
                transform: `rotate(${i * 30}deg) translateY(-16px)`,
              }}
            ></div>
          ))}
          <div className="absolute w-2 h-2 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-16 text-center">
            <span className="text-white">Frequently </span>
            <span className="text-pink-400">Asked</span>
            <br />
            <span className="text-white">Question</span>
          </h2>

          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-gray-700 pb-6">
                <button
                  className="w-full flex justify-between items-center text-left focus:outline-none"
                  onClick={() => toggleAccordion(index)}
                >
                  <h3 className="text-xl font-medium">{item.question}</h3>
                  <span className="text-2xl text-pink-400 ml-4">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>

                {openIndex === index && (
                  <div className="mt-4 text-gray-300">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
