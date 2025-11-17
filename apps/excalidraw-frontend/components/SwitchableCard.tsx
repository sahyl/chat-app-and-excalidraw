"use client"
import { ReactNode, useState } from "react";

interface SwitchableCardProps {
  leftTitle: string;
  rightTitle: string;
  leftContent: ReactNode;
  rightContent: ReactNode;
}

export function SwitchableCard({
  leftTitle,
  rightTitle,
  leftContent,
  rightContent,
}: SwitchableCardProps) {
  const [activeTab, setActiveTab] = useState<"left" | "right">("left");

  return (
    <div className="w-full bg-card text-card-foreground rounded-lg border border-border overflow-hidden">
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("left")}
          className={`flex-1 px-6 py-4 text-lg font-semibold transition-colors cursor-pointer ${activeTab === "left" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          {leftTitle}
        </button>

        <button
          onClick={() => setActiveTab("right")}
          className={`flex-1 px-6 py-4 text-lg font-semibold transition-colors cursor-pointer ${activeTab === "right" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          {rightTitle}
        </button>
      </div>
      <div className="p-6">
        {activeTab === "left" ? leftContent : rightContent}
      </div>
    </div>
  );
}
