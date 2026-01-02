import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface NeoInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const NeoInput = forwardRef<HTMLInputElement, NeoInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3 bg-white border-4 border-black neo-shadow-sm",
          "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary",
          "transition-shadow",
          className
        )}
        {...props}
      />
    );
  }
);

NeoInput.displayName = "NeoInput";
