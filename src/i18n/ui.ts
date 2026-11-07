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

export const links = {
  github: "https://github.com/Moviw",
  linkedin: "https://www.linkedin.com/in/zimo-xu/",
  zhihu: "https://www.zhihu.com/people/Movix333",
  instagram: "https://www.instagram.com/movix333/",
  lab: "https://www.nlab.ci.i.u-tokyo.ac.jp/",
  lis: "https://lis.inf.kyushu-u.ac.jp/",
  yodo: "https://yodolabs.jp/en",
};
// Split so the address never appears whole in the HTML; joined in the browser.
export const email = { user: "xuzimo333", domain: "nlab-mpg.jp" };

type Item = { date: string; html: string };
/** `detail` may contain HTML links. */
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
    fallback: (lang: string) => string;
    back: string;
  };
  about: { title: string; intro: string[]; hobbiesTitle: string; hobbies: string[]; findTitle: string; email: string };
  footer: string;
  theme: string;
}

const lab = (text: string) => `<a href="${links.lab}">${text}</a>`;
const yodo = (text: string) => `<a href="${links.yodo}">${text}</a>`;
const lis = (text: string) => `<a href="${links.lis}">${text}</a>`;

export const ui: Record<Lang, Dict> = {
  en: {
    meta: {
      description:
        "Zimo Xu (Movi) — M.S. student at The University of Tokyo working on multimodal learning and mixture-of-experts models.",
    },
    nav: { home: "Home", experience: "Experience", blog: "Blog", about: "About" },
    home: {
      name: "Zimo Xu",
      nickname: "a.k.a. Movi",
      role: "M.S. student @ The University of Tokyo",
      bio: [
        `I'm a second-year master's student in the Graduate School of Information Science and Technology (IST) at The University of Tokyo, advised by Prof. Hideki Nakayama at the ${lab("Nakayama Lab")}.`,
        "My research is on multimodal learning and mixture-of-experts (MoE) models: building models that understand images, 3D scenes and language together, and scaling them efficiently with sparse experts. I am also interested in reinforcement learning and agent systems.",
        "Right now I'm a Research Scientist Intern at Yodo Labs, building 3D multimodal LLMs that reason about metric geometry in point clouds.",
      ],
      interestsTitle: "Interests",
      interests: ["Multimodal learning", "Mixture-of-Experts", "3D vision", "Reinforcement learning", "Agent systems"],
      newsTitle: "News",
      news: [
        { date: "2026.08", html: `Joined ${yodo("Yodo Labs")} as a Research Scientist Intern.` },
        { date: "2025.04", html: `Started my M.S. at The University of Tokyo, ${lab("Nakayama Lab")}.` },
        { date: "2024.10", html: `Joined the ${lis("Laboratory of Intelligent Systems")} at Kyushu University as a research student.` },
        { date: "2024.07", html: "Graduated from the Faculty of Information Technology, Beijing University of Technology." },
      ],
    },
    exp: {
      title: "Experience",
      workTitle: "Work",
      work: [
        {
          when: "2026.08 – present",
          title: "Research Scientist Intern",
          org: "Yodo Labs",
          orgUrl: links.yodo,
          where: "Tokyo (remote)",
          detail: "3D multimodal LLMs and grounded metric reasoning on point clouds.",
        },
      ],
      eduTitle: "Education",
      edu: [
        {
          when: "2025.04 – present",
          title: "M.S., Graduate School of Information Science and Technology (IST)",
          org: "The University of Tokyo",
          detail: `${lab("Nakayama Lab")}, advised by Prof. Hideki Nakayama. Multimodal learning, mixture-of-experts, computer vision.`,
        },
        {
          when: "2024.10 – 2025.03",
          title: "Research Student",
          org: "Kyushu University",
          detail: `${lis("Laboratory of Intelligent Systems (LIS)")}, Department of Informatics. Theme: robust and adaptive AI.`,
        },
        { when: "– 2024.07", title: "Bachelor's degree", org: "Beijing University of Technology", detail: "Faculty of Information Technology." },
      ],
    },
    blog: {
      title: "Blog",
      intro: "Notes on research, tools, and life in Tokyo.",
      empty: "Nothing here yet. The first post is on its way.",
      all: "All",
      fallback: (l) => `This post isn't available in English yet. Showing the ${l} original.`,
      back: "← All posts",
    },
    about: {
      title: "About",
      intro: [
        "Hi, I'm Zimo. Most people call me Movi.",
        "I grew up in China, did my undergrad in Beijing, spent half a year in Fukuoka, and now live in Tokyo.",
      ],
      hobbiesTitle: "Off the clock",
      hobbies: ["🎸 Guitar", "🏀 Basketball", "🎤 Singing", "🎮 PS5 & Switch"],
      findTitle: "Find me",
      email: "Email",
    },
    footer: "Built with Astro.",
    theme: "Toggle theme",
  },

  zh: {
    meta: { description: "许子墨（Movi），东京大学硕士生，研究多模态学习与混合专家（MoE）模型。" },
    nav: { home: "首页", experience: "经历", blog: "博客", about: "关于" },
    home: {
      name: "许子墨",
      role: "东京大学 硕士在读",
      bio: [
        `我是东京大学 情报理工学系研究科（IST）的硕士二年级学生，在${lab("中山研究室")}，导师是中山英树教授。`,
        "我的研究方向是多模态学习和混合专家（MoE）模型：让模型同时理解图像、3D 场景和语言，并借助稀疏专家结构高效地扩展规模。同时也关注强化学习和 Agent 系统。",
        "目前在 Yodo Labs 担任 Research Scientist 实习生，做能在点云中进行度量推理的 3D 多模态大模型。",
      ],
      open: "正在寻找多模态 AI 方向的研究或工程机会，欢迎联系我。",
      interestsTitle: "研究兴趣",
      interests: ["多模态学习", "混合专家（MoE）", "3D 视觉", "强化学习", "Agent 系统"],
      newsTitle: "动态",
      news: [
        { date: "2026.08", html: `加入 ${yodo("Yodo Labs")}，担任 Research Scientist 实习生。` },
        { date: "2025.04", html: `进入东京大学${lab("中山研究室")}攻读硕士。` },
        { date: "2024.10", html: `作为 Research Student 进入九州大学${lis("智能系统研究室（LIS）")}。` },
        { date: "2024.07", html: "本科毕业于北京工业大学信息学部。" },
      ],
    },
    exp: {
      title: "经历",
      workTitle: "工作",
      work: [
        {
          when: "2026.08 – 至今",
          title: "Research Scientist 实习生",
          org: "Yodo Labs",
          orgUrl: links.yodo,
          where: "东京（远程）",
          detail: "3D 多模态大模型，点云上的度量推理。",
        },
      ],
      eduTitle: "教育",
      edu: [
        {
          when: "2025.04 – 至今",
          title: "情报理工学系研究科（IST） 硕士",
          org: "东京大学",
          detail: `${lab("中山研究室")}，导师中山英树教授。多模态学习、混合专家模型、计算机视觉。`,
        },
        {
          when: "2024.10 – 2025.03",
          title: "研究生（Research Student）",
          org: "九州大学",
          detail: `系统信息学研究课 ${lis("智能系统研究室（LIS）")}，课题：强化学习与自适应 AI。`,
        },
        { when: "– 2024.07", title: "本科", org: "北京工业大学", detail: "信息学部。" },
      ],
    },
    blog: {
      title: "博客",
      intro: "关于研究、工具和东京生活的一些记录。",
      empty: "这里还什么都没有，第一篇在路上了。",
      all: "全部",
      fallback: (l) => `这篇文章还没有中文版，下面显示的是${l}原文。`,
      back: "← 所有文章",
    },
    about: {
      title: "关于",
      intro: [
        "你好，我是许子墨。",
        "在中国长大，本科在北京，在福冈待过半年，现在住在东京。",
      ],
      hobbiesTitle: "Interests",
      hobbies: ["🎸 吉他", "🏀 篮球", "🎤 唱歌", "🎮 PS5 和 Switch"],
      findTitle: "Find Me",
      email: "邮箱",
    },
    footer: "使用 Astro 构建。",
    theme: "切换主题",
  },

};

export const langName = (lang: Lang, inLang: Lang) =>
  ({
    en: { en: "English", zh: "英文" },
    zh: { en: "Chinese", zh: "中文" },
  })[lang][inLang];
