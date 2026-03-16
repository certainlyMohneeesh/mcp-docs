import { notFound, redirect } from "next/navigation";
import { getAllDocSlugs } from "@/lib/docs";

export default async function DocsIndexPage() {
  const slugs = await getAllDocSlugs();

  if (slugs.length === 0) {
    notFound();
  }

  redirect(`/docs/${slugs[0].join("/")}`);
}
