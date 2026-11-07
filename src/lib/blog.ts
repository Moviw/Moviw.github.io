import { getCollection, type CollectionEntry } from "astro:content";
import { langs, type Lang } from "../i18n/ui";

export type Post = CollectionEntry<"blog">;
export type Resolved = { slug: string; post: Post; postLang: Lang; fallback: boolean };

/** Published posts grouped by slug: { "my-post": { zh: entry, en: entry } }. Drafts show only in `astro dev`. */
async function bySlug() {
  const all = await getCollection("blog", (p) => import.meta.env.DEV || !p.data.draft);
  const map = new Map<string, Partial<Record<Lang, Post>>>();
  for (const p of all) {
    const [l, ...rest] = p.id.split("/");
    const slug = rest.join("/");
    if (!langs.includes(l as Lang) || !slug) continue;
    map.set(slug, { ...map.get(slug), [l]: p });
  }
  return map;
}

/** Every post as seen from `lang`: its own version if it exists, otherwise the original with a fallback flag. */
export async function postsFor(lang: Lang): Promise<Resolved[]> {
  const out: Resolved[] = [];
  for (const [slug, versions] of await bySlug()) {
    const postLang = versions[lang] ? lang : langs.find((l) => versions[l])!;
    out.push({ slug, post: versions[postLang]!, postLang, fallback: postLang !== lang });
  }
  return out.sort((a, b) => b.post.data.date.valueOf() - a.post.data.date.valueOf());
}

export const fmtDate = (d: Date) => d.toISOString().slice(0, 10).replaceAll("-", ".");
