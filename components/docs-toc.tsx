import type { TocHeading } from "@/lib/docs";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/core/accordion";
import { RiArrowUpSLine } from "@remixicon/react";

type DocsTocProps = {
  headings: TocHeading[];
};

type TocSection = {
  section: TocHeading;
  subsections: TocHeading[];
};

export function DocsToc({ headings }: DocsTocProps) {
  if (headings.length === 0) {
    return null;
  }

  const groupedSections = headings.reduce<TocSection[]>((acc, heading) => {
    if (heading.depth === 2) {
      acc.push({ section: heading, subsections: [] });
      return acc;
    }

    const last = acc[acc.length - 1];
    if (heading.depth === 3 && last) {
      last.subsections.push(heading);
    }

    return acc;
  }, []);

  return (
    <aside className="sticky top-16 hidden h-fit lg:block">
      <p className="text-sm font-semibold text-foreground">On this page</p>
      <nav aria-label="On this page" className="mt-4 ">
        <Accordion
          className="flex w-full flex-col divide-y divide-border border border-border bg-background"
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {groupedSections.map(({ section, subsections }) => (
            <AccordionItem key={section.id} value={section.id} className="px-3 py-2">
              <AccordionTrigger className="w-full text-left text-sm text-foreground">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate">{section.text}</span>
                  <RiArrowUpSLine className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-expanded:-rotate-180" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <ul className="space-y-2 border-l border-border pl-3">
                  <li>
                    <a
                      href={`#${section.id}`}
                      className="block text-xs font-medium text-foreground hover:text-primary transition-colors"
                    >
                      Go to {section.text}
                    </a>
                  </li>
                  {subsections.length > 0 ? (
                    subsections.map((subheading) => (
                      <li key={subheading.id}>
                        <a
                          href={`#${subheading.id}`}
                          className={cn(
                            "block text-xs text-muted-foreground hover:text-foreground transition-colors",
                          )}
                        >
                          {subheading.text}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-muted-foreground">No subsections</li>
                  )}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </nav>
    </aside>
  );
}
