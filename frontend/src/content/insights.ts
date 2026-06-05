/**
 * Server-side loader for Insights blog posts.
 *
 * Each post is a Markdown file in  frontend/content/insights/  — see
 * `_TEMPLATE.md` there for the format. Drop a .md file into that folder and it
 * publishes automatically (newest date first).
 *
 * BILINGUAL: a post is English by default (`my-post.md`). To add a Mongolian
 * version, add a sibling file `my-post.mn.md`. When the site language is set to
 * Mongolian, the .mn.md content is shown; otherwise (or if it's missing) the
 * English file is used. Shared fields (date, author, thumbnail, linkedin) come
 * from the English file.
 *
 * NOTE: uses Node `fs`; only call from getStaticProps / getStaticPaths.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

/** Per-language text for a post. */
export interface LocalizedText {
  title: string;
  excerpt: string;
  body: string; // raw Markdown
}

/** Card metadata for the index (no body). */
export interface InsightCard {
  slug: string;
  author: string;
  date: string; // YYYY-MM-DD
  thumbnail: string;
  linkedin: string;
  en: { title: string; excerpt: string };
  mn?: { title: string; excerpt: string };
}

/** Full post for the article page. */
export interface InsightPost {
  slug: string;
  author: string;
  date: string;
  thumbnail: string;
  linkedin: string;
  en: LocalizedText;
  mn?: LocalizedText;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "insights");

function listFiles(): string[] {
  try {
    return fs.readdirSync(CONTENT_DIR);
  } catch {
    return [];
  }
}

/** Canonical (English) post files: *.md, excluding *.mn.md, templates and dotfiles. */
function isCanonical(file: string): boolean {
  return (
    file.endsWith(".md") &&
    !file.endsWith(".mn.md") &&
    !file.startsWith("_") &&
    !file.startsWith(".")
  );
}

function slugOf(file: string): string {
  return file.replace(/\.md$/, "");
}

/** YAML parses an unquoted `date: 2026-05-20` into a Date — normalize to YYYY-MM-DD. */
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
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > 180 ? `${plain.slice(0, 177).trimEnd()}…` : plain;
}

function parse(file: string): { data: Record<string, unknown>; body: string } {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
  const { data, content } = matter(raw);
  return { data: data as Record<string, unknown>, body: content.trim() };
}

function localizedFrom(data: Record<string, unknown>, body: string, fallbackTitle: string): LocalizedText {
  return {
    title: String(data.title ?? fallbackTitle),
    excerpt: data.excerpt ? String(data.excerpt) : deriveExcerpt(body),
    body,
  };
}

function buildPost(slug: string): InsightPost | null {
  const enFile = `${slug}.md`;
  if (!isCanonical(enFile)) return null;

  let en: { data: Record<string, unknown>; body: string };
  try {
    en = parse(enFile);
  } catch {
    return null;
  }

  const post: InsightPost = {
    slug,
    author: String(en.data.author ?? ""),
    date: normalizeDate(en.data.date),
    thumbnail: String(en.data.thumbnail ?? ""),
    linkedin: String(en.data.linkedin ?? en.data.linkedInUrl ?? ""),
    en: localizedFrom(en.data, en.body, slug),
  };

  const mnFile = `${slug}.mn.md`;
  if (fs.existsSync(path.join(CONTENT_DIR, mnFile))) {
    const mn = parse(mnFile);
    post.mn = localizedFrom(mn.data, mn.body, post.en.title);
  }

  return post;
}

export function getAllSlugs(): string[] {
  return listFiles().filter(isCanonical).map(slugOf);
}

export function getAllCards(): InsightCard[] {
  return getAllSlugs()
    .map(buildPost)
    .filter((p): p is InsightPost => p !== null)
    .map((p) => {
      const card: InsightCard = {
        slug: p.slug,
        author: p.author,
        date: p.date,
        thumbnail: p.thumbnail,
        linkedin: p.linkedin,
        en: { title: p.en.title, excerpt: p.en.excerpt },
      };
      if (p.mn) card.mn = { title: p.mn.title, excerpt: p.mn.excerpt };
      return card;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
}

export function getPostBySlug(slug: string): InsightPost | null {
  return buildPost(slug);
}
