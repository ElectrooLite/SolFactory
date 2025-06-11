import React from "react";
import { CgSpinner } from "react-icons/cg";

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  type = "button",
  className = "",
  ...props
}) => {
  const baseStyles = "rounded-lg font-medium transition-all focus:outline-none";

  const variants = {
    primary: "bg-solana-purple text-white hover:opacity-90",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    gradient: "btn-gradient text-white",
    outline:
      "bg-transparent border border-solana-purple text-solana-purple hover:bg-solana-purple hover:bg-opacity-10",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${
        sizes[size]
      } ${widthClass} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      <div className="flex items-center justify-center">
        {loading && <CgSpinner className="animate-spin mr-2 h-5 w-5" />}
        {children}
      </div>
    </button>
  );
};

export default Button;
