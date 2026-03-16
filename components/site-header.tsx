"use client";

import Link from "next/link";
import { RiMoonLine, RiSunLine, RiScissorsLine } from "@remixicon/react";
import { SearchDialog, type SearchDoc } from "./search-dialog";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

export function SiteHeader({ docs }: { docs: SearchDoc[] }) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center gap-8 pl-4 pr-4 max-w-7xl">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-semibold text-lg tracking-tight uppercase tracking-widest text-foreground">
            MCP MARKETPLACE <span className="opacity-50 font-normal">| DOCS</span>
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <SearchDialog docs={docs} />
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="#" className="hidden text-muted-foreground hover:text-foreground transition-colors sm:block">
            Support
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Login
          </Link>
          <Button className="rounded-none px-4 font-semibold hidden sm:flex border-0">
            Sign up <span className="ml-1 leading-none">&rsaquo;</span>
          </Button>
          <button 
            className="text-muted-foreground hover:text-foreground ml-2"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <RiMoonLine className="size-5 hidden dark:block" />
            <RiSunLine className="size-5 block dark:hidden" />
          </button>
        </div>
      </div>
    </header>
  );
}
