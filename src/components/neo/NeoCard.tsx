import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface NeoCardProps {
  children: ReactNode;
  className?: string;
  rotate?: boolean;
  hover?: boolean;
}

export function NeoCard({ children, className, rotate = false, hover = false }: NeoCardProps) {
  return (
    <div
      className={cn(
        "border-0 sm:border-3 border-black sm:neo-shadow p-0 sm:p-6",
        className?.includes("bg-") ? "" : "bg-transparent sm:bg-white",
        rotate && "sm:rotate-1",
        hover && "neo-hover cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function NeoCardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mb-2 sm:mb-4", className)}>{children}</div>;
}

export function NeoCardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn("text-lg sm:text-2xl font-black uppercase tracking-tight leading-snug", className)}>{children}</h3>;
}

export function NeoCardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-sm sm:text-base text-muted-foreground mt-1 leading-relaxed", className)}>{children}</p>;
}

export function NeoCardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("", className)}>{children}</div>;
}

export function NeoCardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 sm:border-t-3 sm:border-black", className)}>{children}</div>;
}
