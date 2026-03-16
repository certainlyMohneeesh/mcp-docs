import type { TocHeading } from "@/lib/docs";
import { cn } from "@/lib/utils";

type DocsTocProps = {
  headings: TocHeading[];
};

export function DocsToc({ headings }: DocsTocProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="sticky top-10 hidden h-fit lg:block">
      <p className="text-sm font-semibold text-foreground">On this page</p>
      <nav aria-label="On this page" className="mt-4">
        <ul className="space-y-3 border-l border-border pl-4">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  "block text-sm text-muted-foreground hover:text-foreground transition-colors",
                  heading.depth === 3 && "pl-3 text-muted-foreground/80",
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
