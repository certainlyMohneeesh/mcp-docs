import Link from "next/link";
import { RiGithubFill, RiTwitterXFill } from "@remixicon/react";

export function SiteFooter({ lastUpdated }: { lastUpdated?: string }) {
  return (
    <footer className="mt-auto border-t border-border py-8">
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-8 text-muted-foreground">
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-foreground transition-colors">
            <RiGithubFill className="size-5" />
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            <RiTwitterXFill className="size-5" />
          </Link>
        </div>
        {lastUpdated ? (
          <p className="text-sm">Last updated {lastUpdated}</p>
        ) : (
          <p className="text-sm">Last updated March 16, 2026</p>
        )}
      </div>
    </footer>
  );
}
