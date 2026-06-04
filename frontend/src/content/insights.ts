/**
 * Server-side loader for Insights blog posts.
 *
 * Each post is a single Markdown file in  frontend/content/insights/  — see the
 * `_TEMPLATE.md` in that folder for the format. To publish a post, drop its .md
 * file into that folder; it appears automatically (sorted newest first).
 *
 * NOTE: this module uses Node's `fs` and is only safe to call from
 * getStaticProps / getStaticPaths (server/build time). Pages import the loader
 * functions there, and `import type` the interfaces — so this never ends up in
 * the browser bundle.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface InsightMeta {
  /** Derived from the filename: "winter-2026.md" -> "winter-2026" -> /insights/winter-2026 */
  slug: string;
  title: string;
  author: string;
  /** Normalized to "YYYY-MM-DD". */
  date: string;
  /** Path under /public, e.g. "/insights/foo.jpg". */
  thumbnail: string;
  /** URL of the original LinkedIn post. */
  linkedin: string;
  /** Short blurb for the card (front matter `excerpt`, or first paragraph). */
  excerpt: string;
}

export interface InsightPost extends InsightMeta {
  /** Raw Markdown body (rendered with react-markdown on the page). */
  body: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "insights");

function listMarkdownFiles(): string[] {
  try {
    return fs.readdirSync(CONTENT_DIR).filter(isPostFile);
  } catch {
    return [];
  }
}

/** Published posts are *.md, excluding templates/partials (names starting with "_" or "."). */
function isPostFile(file: string): boolean {
  return file.endsWith(".md") && !file.startsWith("_") && !file.startsWith(".");
}

function fileToSlug(file: string): string {
  return file.replace(/\.md$/, "");
}

/** YAML parses an unquoted `date: 2026-05-20` into a Date — normalize back to YYYY-MM-DD. */
function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "");
}

function deriveExcerpt(body: string): string {
  const firstParagraph =
    body
      .split(/\n\s*\n/)
      .map((s) => s.trim())
      .find((s) => s.length > 0 && !s.startsWith("#") && !s.startsWith(">")) ?? "";
  const plain = firstParagraph
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // [text](url) / ![alt](src) -> text
    .replace(/[*_`#>~]/g, "") // strip common Markdown symbols
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > 180 ? `${plain.slice(0, 177).trimEnd()}…` : plain;
}

function parseFile(file: string): InsightPost {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const slug = fileToSlug(file);
  const body = content.trim();
  return {
    slug,
    title: String(data.title ?? slug),
    author: String(data.author ?? ""),
    date: normalizeDate(data.date),
    thumbnail: String(data.thumbnail ?? ""),
    linkedin: String(data.linkedin ?? data.linkedInUrl ?? ""),
    excerpt: data.excerpt ? String(data.excerpt) : deriveExcerpt(body),
    body,
  };
}

export function getAllSlugs(): string[] {
  return listMarkdownFiles().map(fileToSlug);
}

export function getAllPostsMeta(): InsightMeta[] {
  return listMarkdownFiles()
    .map((file) => {
      const { body, ...meta } = parseFile(file);
      void body;
      return meta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
}

export function getPostBySlug(slug: string): InsightPost | null {
  const file = `${slug}.md`;
  if (!isPostFile(file)) return null;
  try {
    return parseFile(file);
  } catch {
    return null;
  }
}
