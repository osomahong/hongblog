import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface NeoInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const NeoInput = forwardRef<HTMLInputElement, NeoInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3 bg-white border-3 border-black neo-shadow-sm",
          "placeholder:text-gray-400 focus:outline-none focus:border-[#FF0033] focus:-translate-y-1 focus:shadow-[8px_8px_0_0_#000]",
          "transition-all",
          className
        )}
        {...props}
      />
    );
  }
);

NeoInput.displayName = "NeoInput";
