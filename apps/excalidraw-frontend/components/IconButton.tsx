'use client'
import { ReactNode } from "react";

interface IconButonProps {
  icon: ReactNode;
  onClick: () => void;
  isSelected: boolean;
  tooltip: string;
}

export function IconButton({
  icon,
  onClick,
  isSelected = false,
  tooltip,
}: IconButonProps) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-all duration-200 
        ${isSelected ? "bg-white text-black" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"}`}
    >
      {icon}
    </button>
  );
}
