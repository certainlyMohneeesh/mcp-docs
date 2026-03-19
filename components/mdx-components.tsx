import type { ComponentProps, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import * as RemixIcons from "@remixicon/react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/core/accordion";
import { RiArrowUpSLine } from "@remixicon/react";

import { CopyButton } from "./copy-button";

import { CodeTabs as CodeTabsComponent } from "./code-tabs";

const iconComponents = RemixIcons as unknown as MDXComponents;

// Helper to extract plain text from React nodes (like code block children)
const getTextValue = (node: any): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getTextValue).join("");
  }
  if (node && typeof node === "object" && node.props && node.props.children) {
    return getTextValue(node.props.children);
  }
  return "";
};

function GoogleMeetToolsAccordion() {
  const tools = [
    {
      id: "space-management",
      title: "Meeting Space Management",
      description:
        "Create, retrieve, update, and end Google Meet spaces using create_meeting_space, get_meeting_space, update_meeting_space, and end_meeting_space.",
    },
    {
      id: "conference-analytics",
      title: "Conference Analytics",
      description:
        "Fetch conference-level insights with get_conference_record and list_conference_records for reporting, audits, and usage tracking.",
    },
    {
      id: "participant-tracking",
      title: "Participant Tracking",
      description:
        "Inspect people and attendance details with get_participant and list_participants, including pagination and filtering support.",
    },
    {
      id: "session-history",
      title: "Participant Session History",
      description:
        "Query granular join and leave session timelines with get_participant_session and list_participant_sessions.",
    },
  ];

  return (
    <Accordion
      className="mt-6 flex w-full flex-col divide-y divide-border border border-border bg-background"
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {tools.map((tool) => (
        <AccordionItem key={tool.id} value={tool.id} className="px-4 py-2">
          <AccordionTrigger className="w-full text-left text-foreground">
            <div className="flex items-center justify-between">
              <div className="font-medium">{tool.title}</div>
              <RiArrowUpSLine className="h-4 w-4 text-foreground transition-transform duration-200 group-data-expanded:-rotate-180" />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p className="pt-2 text-sm text-muted-foreground">{tool.description}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export const mdxComponents: MDXComponents = {
  ...iconComponents,
  h1: ({ className, ...props }) => (
    <h1
      className={cn("text-4xl font-bold tracking-tight text-foreground", className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-10 scroll-mt-24 border-t border-border pt-6 text-2xl font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn("mt-6 scroll-mt-24 text-xl font-semibold text-foreground", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p className={cn("mt-4 leading-7 text-muted-foreground", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("mt-4 list-disc space-y-1.5 pl-6 text-muted-foreground", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("mt-4 list-decimal space-y-1.5 pl-6 text-muted-foreground", className)} {...props} />
  ),
  li: ({ className, ...props }) => <li className={cn("leading-6", className)} {...props} />,
  hr: ({ className, ...props }) => (
    <hr className={cn("my-8 border-border", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "mt-4 border-l-2 border-primary pl-5 text-base italic text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, href, ...props }) => {
    const external = typeof href === "string" && /^https?:\/\//.test(href);
    return (
      <a
        className={cn("font-medium text-primary hover:text-primary/80 underline underline-offset-4", className)}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        {...props}
      />
    );
  },
  code: ({ className, children, ...props }: ComponentProps<"code">) => {
    const blockCode = className?.includes("language-");

    if (blockCode || "data-language" in props || "data-theme" in props) {
      return (
        <code
          className={cn(
            "font-mono text-[13px] leading-6",
            className,
          )}
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <code
        className={cn(
          "rounded-none border border-border bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ className, children, ...props }: ComponentProps<"pre">) => {
    const rawText = getTextValue(children);
    
    // Check if it's inside a tab, where we want no top margin, else use mt-6
    const isTab = className?.includes("mcp-tabbed-code") || false;
    
    return (
      <div className={cn("group/pre relative border border-border bg-zinc-50 dark:bg-[#0d1117] rounded-none mcp-pre-wrapper", !isTab && "mt-6")}>
        <pre
          className={cn(
            "overflow-x-auto p-4 text-[13px] rounded-none bg-transparent",
            className,
          )}
          {...props}
        >
          {children as ReactNode}
        </pre>
        <CopyButton 
          text={rawText} 
          className="opacity-0 group-hover/pre:!opacity-100 transition-opacity" 
        />
      </div>
    );
  },
  img: ({ className, alt = "", ...props }) => (
    <img
      className={cn("mt-4 w-full rounded-none border border-border", className)}
      alt={alt}
      {...props}
    />
  ),
  table: ({ className, ...props }) => (
    <div className="mt-4 overflow-x-auto">
      <table className={cn("w-full text-left text-sm text-foreground", className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }) => (
    <th className={cn("border-b border-border px-3 py-2 font-semibold", className)} {...props} />
  ),
  td: ({ className, ...props }) => (
    <td className={cn("border-b border-border px-3 py-2 align-top text-muted-foreground", className)} {...props} />
  ),
  CardGroup: ({ children }: { children: ReactNode }) => (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {children}
    </div>
  ),
  Card: ({ title, icon, href, children }: { title: string; icon?: ReactNode; href?: string; children: ReactNode }) => {
    const Elem = href ? 'a' : 'div';
    return (
      <Elem
        href={href}
        className={cn(
          "group block rounded-none border border-border bg-card p-4 transition-colors",
          href && "hover:border-primary/50"
        )}
      >
        {icon && <div className="mb-3 text-primary">{icon}</div>}
        <h3 className="mb-2 font-semibold text-foreground group-hover:text-primary transition-colors">{title}</h3>
        <div className="text-sm text-muted-foreground [&>p]:mt-0">{children}</div>
      </Elem>
    );
  },
  CodeTabs: CodeTabsComponent,
  GoogleMeetToolsAccordion,
  Tab: ({ children }: { children: ReactNode }) => <>{children}</>,
};
