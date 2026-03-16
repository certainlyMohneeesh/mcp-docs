import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getAllDocSlugs, getDocBySlug } from "@/lib/docs";
import type { SearchDoc } from "@/components/search-dialog";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const slugs = await getAllDocSlugs();
  const docsPromises = slugs.map(async (slug) => {
    const doc = await getDocBySlug(slug);
    if (!doc) return null;
    return {
      title: doc.title,
      url: `/docs/${slug.join("/")}`,
      description: doc.description,
    } as SearchDoc;
  });
  
  const searchDocs = (await Promise.all(docsPromises)).filter((d): d is SearchDoc => d !== null);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader docs={searchDocs} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
