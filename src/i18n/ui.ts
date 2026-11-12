import { parse } from "yaml";
import siteRaw from "../../content/site.yaml?raw";
import enRaw from "../../content/en.yaml?raw";
import zhRaw from "../../content/zh.yaml?raw";

export const languages = { en: "English", zh: "中文" } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = "en";
export const langs = Object.keys(languages) as Lang[];

/** Route prefix for a language: "" for English, "/zh" for Chinese. */
export const prefix = (lang: Lang) => (lang === defaultLang ? "" : `/${lang}`);
export const href = (lang: Lang, path = "/") => `${prefix(lang)}${path}` || "/";

/** getStaticPaths entries for the `[...lang]` rest param. */
export const langPaths = () =>
  langs.map((lang) => ({ params: { lang: lang === defaultLang ? undefined : lang }, props: { lang } }));

// All personal content lives in /content/*.yaml; this file only loads it.
// `?raw` keeps the files watched by `astro dev`, so edits reload live.

type Social = { name: string | Record<Lang, string>; handle: string; url: string; icon: string };
export const site: {
  name: string;
  homeTitle: string;
  links: Record<string, string>;
  email: { user: string; domain: string };
  socials: Social[];
} = parse(siteRaw);
// Split so the address never appears whole in the HTML; joined in the browser.
export const email = site.email;

/** A link target is either a key of site.links or a full URL. */
export const url = (key = "") => site.links[key] ?? key;

/** Turn every `[text](target)` in the YAML into an <a> tag. */
const linkify = (x: unknown): any =>
  typeof x === "string"
    ? x.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, to) => `<a href="${url(to)}">${text}</a>`)
    : Array.isArray(x)
      ? x.map(linkify)
      : x && typeof x === "object"
        ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, linkify(v)]))
        : x;

type Item = { date: string; text: string };
type Entry = { when: string; title: string; org: string; orgUrl?: string; where?: string; detail?: string };

interface Dict {
  meta: { description: string };
  nav: { home: string; experience: string; blog: string; about: string };
  home: {
    name: string;
    nickname?: string;
    tagline?: string;
    role: string;
    bio: string[];
    open?: string;
    interestsTitle: string;
    interests: string[];
    newsTitle: string;
    news: Item[];
  };
  exp: {
    title: string;
    workTitle: string;
    work: Entry[];
    eduTitle: string;
    edu: Entry[];
  };
  blog: {
    title: string;
    intro: string;
    empty: string;
    all: string;
    /** `{lang}` is replaced with the original language name. */
    fallback: string;
    back: string;
  };
  about: { title: string; intro: string[]; hobbiesTitle: string; hobbies: string[]; findTitle: string; email: string };
  footer: string;
  theme: string;
}

export const ui: Record<Lang, Dict> = { en: linkify(parse(enRaw)), zh: linkify(parse(zhRaw)) };

export const langName = (lang: Lang, inLang: Lang) =>
  ({
    en: { en: "English", zh: "英文" },
    zh: { en: "Chinese", zh: "中文" },
  })[lang][inLang];
