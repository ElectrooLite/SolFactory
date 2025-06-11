import React, { useState, useEffect } from "react";
import Link from "next/link";
import WalletButton from "../wallet/WalletButton";
import { FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all ${
        isScrolled ? "bg-[#06001D] shadow-md py-2" : "bg-[#06001D] py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center z-50 relative">
            <div className="flex-shrink-0 relative">
              <Image
                src="/logo.png"
                alt="Solana Token Creator"
                width={50}
                height={50}
                className="h-auto"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation - Centered */}
    

          {/* Desktop Wallet Button */}
          <div className="hidden md:block">
            <WalletButton />
          </div>

          {/* Mobile Menu Button and Wallet */}
          <div className="md:hidden flex items-center">
            <WalletButton />
            <button
              className="ml-4 text-white focus:outline-none z-50 relative"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <FiX size={28} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Mobile Navigation */}
      <div
        className={`fixed inset-0 bg-[#06001D] z-40 transition-all duration-300 transform ${
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-full flex flex-col justify-center items-center">


          {/* Social links or additional info could go here */}
          <div className="mt-12 flex space-x-6">
            {/* Optional: Add social media icons or additional links */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
