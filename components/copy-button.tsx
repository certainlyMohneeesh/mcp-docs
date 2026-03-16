"use client";

import { useState } from "react";
import { RiFileCopyLine, RiCheckLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <button
      onClick={copy}
      className={cn(
        "copy-btn absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-none border border-border bg-background text-muted-foreground shadow-sm transition-all hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 z-10",
        className
      )}
      aria-label="Copy to clipboard"
    >
      {isCopied ? (
        <RiCheckLine className="size-4 text-green-500" />
      ) : (
        <RiFileCopyLine className="size-4" />
      )}
    </button>
  );
}
