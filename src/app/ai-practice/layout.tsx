import type { ReactNode } from "react";
import "./ai-practice.css";

export default function AiPracticeLayout({ children }: { children: ReactNode }) {
  return <div className="ap-root">{children}</div>;
}
