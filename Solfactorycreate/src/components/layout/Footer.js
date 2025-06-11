import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const CommunityAndFooter = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generatedStars = Array(50)
      .fill()
      .map((_, i) => ({
        key: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.7 + 0.1,
      }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="bg-[#06001D] text-white">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.key}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: star.left,
              top: star.top,
              opacity: star.opacity,
            }}
          ></div>
        ))}
      </div>

      {/* Community Section */}
      <div className="relative py-16 container mx-auto px-4 text-center max-w-3xl">
        <div className="flex justify-center mb-2">
          <div className="relative">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-[#06001D]"
              >
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-bold mb-6">
          <span className="text-purple-500">Join The Community!</span>
        </h2>

        <p className="text-lg mb-16 leading-relaxed">
          Join the SolFactory Community
          <br />
          Get product updates, launch support, and early access to new features.
        </p>

        <div className="mb-16">
          <h3 className="text-xl font-bold mb-1">
            Your token. Your rules. No code. No limits.
          </h3>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0a0020] pt-12 pb-6 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center z-50 relative">
                <div className="flex-shrink-0 relative">
                  <div className="block sm:hidden">
                    <Image
                      src="/logo.png"
                      alt="Solana Token Creator"
                      width={150}
                      height={30}
                      className="h-auto"
                      priority
                    />
                  </div>
                  <div className="hidden sm:block md:hidden">
                    <Image
                      src="/logo.png"
                      alt="Solana Token Creator"
                      width={180}
                      height={36}
                      className="h-auto"
                      priority
                    />
                  </div>
                  <div className="hidden md:block">
                    <Image
                      src="/logo.png"
                      alt="Solana Token Creator"
                      width={200}
                      height={40}
                      className="h-auto"
                      priority
                    />
                  </div>
                </div>
              </Link>
          <p className="text-sm text-gray-400 whitespace-nowrap mt-8">
  Built by SolanaFactory · 100% non-custodial · Made for token creators
</p>

            </div>
            <div></div>
            <div></div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6">
            <div className="flex justify-end">
              <p className="text-gray-400 text-sm">
                © 2025 SolanaFactory. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CommunityAndFooter;
