"use client";
import { cn } from "@/lib/utils/utils";
import { Heart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../UI/tooltip";

interface LikeButtonProps {
  onClick: (e: React.MouseEvent) => void;
  isFilled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export default function LikeButton({
  onClick,
  isFilled = false,
  isLoading = false,
  className,
}: LikeButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          disabled={isLoading}
          aria-label={isFilled ? "Unregister from run" : "Register for run"}
          className={cn(
            "flex items-center justify-center rounded-full w-8 h-8 transition-colors",
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100",
            isFilled ? "text-primary" : "text-gray-400 hover:text-primary",
            className,
          )}
        >
          <Heart className={cn("w-5 h-5", isFilled ? "fill-current" : "")} />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isFilled ? "Unregister from run" : "Register for run"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
