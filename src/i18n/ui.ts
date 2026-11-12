// All personal content lives in /content/*.yaml; this file only loads it.
// `?raw` keeps the files watched by `astro dev`, so edits reload live.
import { parse } from "yaml";
import siteRaw from "../../content/site.yaml?raw";
import enRaw from "../../content/en.yaml?raw";
import zhRaw from "../../content/zh.yaml?raw";

export const langs = ["en", "zh"] as const;
export type Lang = (typeof langs)[number];
export const defaultLang: Lang = "en";

/** English pages live at the root, Chinese ones under /zh. */
export const href = (lang: Lang, path = "/") => (lang === defaultLang ? "" : `/${lang}`) + path;

/** getStaticPaths entries for the `[...lang]` rest param. */
export const langPaths = () =>
  langs.map((lang) => ({ params: { lang: lang === defaultLang ? undefined : lang }, props: { lang } }));

export const site = parse(siteRaw);

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

export const ui: Record<Lang, any> = { en: linkify(parse(enRaw)), zh: linkify(parse(zhRaw)) };

/** "English", "中文", ... — the name of `lang` written in `inLang`. */
export const langName = (lang: Lang, inLang: Lang) => new Intl.DisplayNames([inLang], { type: "language" }).of(lang)!;
