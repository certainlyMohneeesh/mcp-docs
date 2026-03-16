"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface CodeTabsProps {
  items?: string[] | string;
  languages?: string;
  children: React.ReactNode;
}

export function CodeTabs({ items = [], languages, children }: CodeTabsProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  let parsedItems: string[] = [];
  
  if (languages) {
    parsedItems = languages.split(",").map((s) => s.trim());
  } else if (Array.isArray(items)) {
    parsedItems = items;
  } else if (typeof items === "string") {
    try {
      // Try parsing stringified array like "['A', 'B']"
      parsedItems = JSON.parse((items as string).replace(/'/g, '"'));
    } catch {
      parsedItems = [items];
    }
  }

  if (!parsedItems || parsedItems.length === 0) {
    return <div className="mt-6">{children}</div>;
  }

  // Filter out any stray newline strings to properly match indices
  const elements = React.Children.toArray(children).filter(React.isValidElement);

  if (!mounted) {
    return (
      <div className="mt-6 border border-border bg-zinc-50 dark:bg-[#0d1117] rounded-none">
        <div className="flex items-center justify-between border-b border-border/40 bg-zinc-100 dark:bg-black/40 px-2 py-1">
          <div className="h-auto bg-transparent p-0 rounded-none border-b-0 space-x-2">
            {parsedItems.map((item, index) => (
              <span
                key={item}
                className={cn(
                  "inline-flex px-2 py-2 text-xs font-medium text-muted-foreground",
                  index === 0 && "border-b-2 border-primary text-foreground"
                )}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="relative [&_.mcp-pre-wrapper]:!mt-0 [&_.mcp-pre-wrapper]:!border-0 [&_.mcp-pre-wrapper]:!bg-transparent [&_.copy-btn]:!top-[-40px] [&_.copy-btn]:!bg-transparent [&_.copy-btn]:!border-0">
          {elements[0] ?? null}
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue={parsedItems[0]} className="mt-6 border border-border bg-zinc-50 dark:bg-[#0d1117] rounded-none group/tabs relative isolate">
      <div className="flex items-center justify-between border-b border-border/40 bg-zinc-100 dark:bg-black/40 px-2 py-1">
        <TabsList className="h-auto bg-transparent p-0 rounded-none border-b-0 space-x-2">
          {parsedItems.map((item) => (
            <TabsTrigger
              key={item}
              value={item}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-2 text-xs font-medium text-muted-foreground data-[state=active]:text-foreground transition-all duration-300"
            >
              {item}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <div className="relative [&_.mcp-pre-wrapper]:!mt-0 [&_.mcp-pre-wrapper]:!border-0 [&_.mcp-pre-wrapper]:!bg-transparent [&_.copy-btn]:!top-[-40px] [&_.copy-btn]:!bg-transparent [&_.copy-btn]:!border-0 [&_.copy-btn]:group-hover/tabs:!opacity-100 [&_.copy-btn]:!opacity-0 [&_.copy-btn]:hover:!text-foreground">
        {elements.map((child, index) => {
          const tabValue = parsedItems[index] || `tab-${index}`;
          return (
            <TabsContent 
              key={tabValue} 
              value={tabValue} 
              className="mt-0 outline-none p-0 data-[state=active]:animate-in data-[state=active]:fade-in duration-500"
            >
              {child}
            </TabsContent>
          );
        })}
      </div>
    </Tabs>
  );
}
