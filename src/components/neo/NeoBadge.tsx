import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface NeoBadgeProps {
  children: ReactNode;
  variant?: "default" | "accent" | "primary" | "outline" | "marketing" | "ai" | "data";
  className?: string;
}

export function NeoBadge({ children, variant = "default", className }: NeoBadgeProps) {
  const variants = {
    default: "bg-black text-white",
    accent: "bg-accent text-black",
    primary: "bg-primary text-white",
    outline: "bg-white text-black",
    marketing: "bg-marketing text-white",
    ai: "bg-ai text-black",
    data: "bg-data text-white",
  };

  return (
    <span
      className={cn(
        "inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 border-black",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
