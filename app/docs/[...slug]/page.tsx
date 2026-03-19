import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { DocsToc } from "@/components/docs-toc";
import { mdxComponents } from "@/components/mdx-components";
import { getAllDocSlugs, getDocBySlug } from "@/lib/docs";
import { remarkMdxDetailsAccordion } from "@/lib/remark-mdx-details-accordion";

import * as RemixIcons from "@remixicon/react";

type DocsPageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  const slugs = await getAllDocSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DocsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocBySlug(slug);

  if (!doc) {
    return {
      title: "Docs",
    };
  }

  return {
    title: doc.title,
    description: doc.description,
  };
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = await params;
  const doc = await getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const { content } = await compileMDX({
    source: doc.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMdxDetailsAccordion],
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, { theme: { dark: "github-dark", light: "github-light" }, keepBackground: false }]
        ],
      },
    },
  });

  const IconComponent = doc.icon && (doc.icon in RemixIcons) 
    ? RemixIcons[doc.icon as keyof typeof RemixIcons] 
    : null;

  return (
    <>
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-16 px-8 py-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="min-w-0 max-w-3xl">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              {doc.icon && (
                <div className="flex bg-background items-center justify-center rounded-xl border border-border p-2 size-12 shadow-sm text-foreground">
                  {doc.icon.startsWith("/") || doc.icon.startsWith("http") ? (
                    <img src={doc.icon} alt={`${doc.title} logo`} className="w-full h-full object-contain" />
                  ) : IconComponent ? (
                    // @ts-ignore
                    <IconComponent className="size-6 text-primary" />
                  ) : (
                    <span className="text-xl">{doc.icon}</span>
                  )}
                </div>
              )}
              <h1 className="text-4xl font-bold tracking-tight">{doc.title}</h1>
            </div>
            {doc.description ? (
              <p className="mt-2 text-xl text-muted-foreground">{doc.description}</p>
            ) : null}
          </header>
          <div>{content}</div>
        </article>
        <DocsToc headings={doc.headings} />
      </div>
    </>
  );
}
