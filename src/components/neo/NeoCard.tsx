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
        "bg-white border-3 sm:border-4 border-black neo-shadow p-3 sm:p-6",
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
  return <h3 className={cn("text-base sm:text-2xl font-black uppercase tracking-tight leading-snug", className)}>{children}</h3>;
}

export function NeoCardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-xs sm:text-base text-muted-foreground mt-1 leading-relaxed", className)}>{children}</p>;
}

export function NeoCardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("", className)}>{children}</div>;
}

export function NeoCardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mt-2 sm:mt-4 pt-2 sm:pt-4 border-t-2 border-black", className)}>{children}</div>;
}
