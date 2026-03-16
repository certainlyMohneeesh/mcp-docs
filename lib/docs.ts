import fs from "node:fs/promises";
import type { Dirent } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { unified } from "unified";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";

const docsDirectory = path.join(process.cwd(), "content", "docs");

export type TocHeading = {
  id: string;
  text: string;
  depth: number;
};

export type DocPageData = {
  slug: string[];
  title: string;
  description?: string;
  icon?: string;
  content: string;
  headings: TocHeading[];
};

type DocFrontmatter = {
  title?: string;
  description?: string;
  icon?: string;
};

export async function getAllDocSlugs(): Promise<string[][]> {
  const files = await getMdxFiles(docsDirectory);
  return files
    .map(filePathToSlug)
    .sort((a, b) => a.join("/").localeCompare(b.join("/")));
}

export async function getDocBySlug(slug: string[]): Promise<DocPageData | null> {
  const fullPath = path.join(docsDirectory, `${slug.join("/")}.mdx`);

  try {
    const file = await fs.readFile(fullPath, "utf8");
    const { content, data } = matter(file);
    const frontmatter = data as DocFrontmatter;

    return {
      slug,
      title: frontmatter.title ?? slug[slug.length - 1] ?? "Untitled",
      description: frontmatter.description,
      icon: frontmatter.icon,
      content,
      headings: extractHeadings(content),
    };
  } catch {
    return null;
  }
}

async function getMdxFiles(targetDirectory: string): Promise<string[]> {
  let entries: Dirent[];

  try {
    entries = await fs.readdir(targetDirectory, {
      withFileTypes: true,
      encoding: "utf8",
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }

    throw error;
  }

  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(targetDirectory, entry.name);
      if (entry.isDirectory()) {
        return getMdxFiles(entryPath);
      }

      if (entry.isFile() && entry.name.endsWith(".mdx")) {
        return [entryPath];
      }

      return [];
    }),
  );

  return files.flat();
}

function filePathToSlug(filePath: string): string[] {
  const relativePath = path.relative(docsDirectory, filePath);
  const noExt = relativePath.replace(/\.mdx$/, "");
  return noExt.split(path.sep);
}

function extractHeadings(source: string): TocHeading[] {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(source);
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];

  visit(tree, "heading", (node) => {
    const currentNode = node as {
      depth: number;
      children?: Array<unknown>;
    };

    if (currentNode.depth < 2 || currentNode.depth > 3) {
      return;
    }

    const text = extractText(currentNode).trim();
    if (!text) {
      return;
    }

    headings.push({
      id: slugger.slug(text),
      text,
      depth: currentNode.depth,
    });
  });

  return headings;
}

function extractText(node: unknown): string {
  if (!node || typeof node !== "object") {
    return "";
  }

  const typedNode = node as {
    type?: string;
    value?: string;
    alt?: string;
    children?: Array<unknown>;
  };

  if (typedNode.type === "text" || typedNode.type === "inlineCode") {
    return typedNode.value ?? "";
  }

  if (typedNode.type === "image") {
    return typedNode.alt ?? "";
  }

  if (!typedNode.children) {
    return "";
  }

  return typedNode.children.map(extractText).join("");
}
