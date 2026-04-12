"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline";
  size?: "sm" | "md" | "lg";
}

export const NeoButton = forwardRef<HTMLButtonElement, NeoButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-white hover:bg-black hover:text-white hover:shadow-[8px_8px_0_0_#FF0033]",
      secondary: "bg-black text-white hover:bg-[#FF0033] hover:text-white hover:shadow-[8px_8px_0_0_#000]",
      accent: "bg-accent text-black hover:bg-black hover:text-white hover:shadow-[8px_8px_0_0_#FFD700]",
      outline: "bg-white text-black hover:bg-black hover:text-white",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "font-bold uppercase tracking-wide border-3 border-black neo-shadow neo-hover",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

NeoButton.displayName = "NeoButton";
