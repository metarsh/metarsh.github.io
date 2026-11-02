export type SectionId =
  | "hero"
  | "about"
  | "skills"
  | "work"
  | "research"
  | "experience"
  | "credentials"
  | "insights"
  | "contact";

export type ProjectIcon = "Bot" | "Code2";
export type SocialIcon = "github" | "linkedin" | "telegram" | "huggingface" | "kaggle" | "link";

export type Project = {
  title: string;
  tagline: string;
  description: string;
  link: string;
  tags: string[];
  matte?: string;
  lightText?: boolean;
  architecture?: string;
  highlights?: string[];
  roleAndDecisions?: string;
  botLink?: string;
  gallery?: string[];
  icon?: ProjectIcon;
  image?: string;
  imageSm?: string;
};

export type HeroScreen = {
  title: string;
  src: string;
  srcSm?: string;
  alt: string;
  width: number;
  height: number;
  objectPos?: string;
  scale?: string;
  isDark?: boolean;
};

export type StackTool = { name: string; url: string; note: string };
export type StackLayer = { id: string; matte: string; headline: string; tools: StackTool[] };
export type CredentialCategory = "Hackathon" | "Certification" | "Workshop" | "Course";
export type Credential = {
  title: string;
  issuer: string;
  category: CredentialCategory;
  issuedLabel: string;
  issuedOn: string;
  summary: string;
  result?: string;
  expiresLabel?: string;
};
export type TextPart = string | { text: string; href: string; icon?: string };

export type PortfolioConfig = {
  site: {
    title: string;
    description: string;
    url: string;
    basePath: string;
    customDomain: string;
    language: string;
    locale: string;
    themeColor: string;
    keywords: string[];
    favicon: string;
    socialImage: string;
    googleSiteVerification: string;
  };
  profile: {
    name: string;
    username: string;
    role: string;
    tagline: string;
    email: string;
    location: string;
    availability: string;
    avatar: string;
    university: string;
  };
  sections: Record<SectionId, { enabled: boolean; title: string }>;
  navigation: { label: string; href: string; section: SectionId }[];
  hero: {
    projectLabel: string;
    contactLabel: string;
    proofPoints: [string, string][];
    screens: HeroScreen[];
  };
  about: { stats: { title: string; label: string }[]; education: string };
  skills: {
    machine: { host: string; prompt: string; rows: { key: string; value: string }[] };
    layers: StackLayer[];
    languages: StackTool[];
  };
  projects: Project[];
  publications: {
    title: string;
    venue: string;
    result: string;
    matte: string;
    links: { label: string; href: string }[];
  }[];
  research: { image: string; imageAlt: string; badge: string };
  experiences: {
    role: string;
    company: string;
    timeframe: string;
    matte: string;
    bullets: (string | TextPart[])[];
    stack: string[];
  }[];
  experience: { image: string; imageAlt: string };
  credentials: Credential[];
  credentialsLink: string;
  socials: { id: string; label: string; href: string; icon: SocialIcon }[];
  contact: {
    formEndpoint: string;
    recaptchaSiteKey: string;
    successMessage: string;
    image: string;
    imageAlt: string;
    ditherImage: string;
    imageCaption: string;
    footerNote: string;
  };
  pet: { enabled: boolean; sprite: string; label: string };
  insight: {
    title: string;
    summary: string;
    introduction: string;
    date: string;
    readingTime: string;
    category: string;
    tags: string[];
    metrics: { label: string; value: string; note: string }[];
    links: { label: string; href: string }[];
  };
};
