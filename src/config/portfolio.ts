import type { PortfolioConfig } from "@/types/portfolio";

export const templateFormEndpoint = "https://formcarry.com/s/k3N9Se5D7b";
export const templateRecaptchaSiteKey = "6LdpcQwuAAAAAKZmEk4kNAMUhwXICzSYRGjM5ATr";

/**
 * All public portfolio content and site settings live here.
 * Edit this one file to make the portfolio yours.
 * These values appear in the deployed website.
 */
export const portfolio: PortfolioConfig = {
  site: {
    // GitHub Pages detects the deployment URL automatically for copied repositories.
    title: "arsh",
    description:
      "arsh's personal corner of the internet. Software builder, CS student at Graphic Era, and creator of Emilia Bot. Explore projects, and research.",
    url: "https://arshjaved.in",
    basePath: "/",
    customDomain: "arshjaved.in",
    language: "en",
    locale: "en_IN",
    themeColor: "#050505",
    keywords: [
      "Software Engineer",
      "Backend",
      "Distributed Systems",
      "Python",
      "PyTorch",
      "Telegram Bots",
      "Portfolio",
      "Cloud",
      "Generative AI",
    ],
    favicon: "/favicon.ico",
    socialImage: "/images/og.png",
    googleSiteVerification: "",
  },
  profile: {
    name: "Arsh Javed",
    username: "halalneko",
    role: "product engineer",
    tagline: "i can make it work and i like cats.",
    email: "arsh0javed@gmail.com",
    location: "Dehradun, Uttarakhand, India",
    availability: "Based in India • Available for work",
    avatar: "/images/profile/avatar.webp",
    university: "Graphic Era University",
  },
  sections: {
    hero: {
      enabled: true,
      title: "",
    },
    about: {
      enabled: true,
      title: "About",
    },
    skills: {
      enabled: true,
      title: "Technical Stack",
    },
    work: {
      enabled: true,
      title: "Featured Projects",
    },
    research: {
      enabled: true,
      title: "Research & Publications",
    },
    experience: {
      enabled: true,
      title: "Work Experience",
    },
    credentials: {
      enabled: true,
      title: "Competitions & Certifications",
    },
    insights: {
      enabled: true,
      title: "Technical Insights",
    },
    contact: {
      enabled: true,
      title: "Get in Touch",
    },
  },
  navigation: [
    {
      label: "Home",
      href: "#hero",
      section: "hero",
    },
    {
      label: "About",
      href: "#about",
      section: "about",
    },
    {
      label: "Projects",
      href: "#work",
      section: "work",
    },
    {
      label: "Research",
      href: "#research",
      section: "research",
    },
    {
      label: "Insights",
      href: "/insights",
      section: "insights",
    },
  ],
  hero: {
    projectLabel: "my projects",
    contactLabel: "Say hi?",
    proofPoints: [
      ["900K+", "Telegram users"],
      ["15+", "Hackathon finals"],
    ],
    screens: [
      {
        title: "Leadly",
        src: "/images/projects/hero-leadly.webp",
        srcSm: "/images/projects/hero-leadly-sm.webp",
        alt: "Leadly landing page with workspace preview",
        width: 1400,
        height: 810,
        objectPos: "object-center",
        scale: "scale-[1.12] origin-center",
        isDark: true,
      },
      {
        title: "Emilia Bot",
        src: "/images/projects/emilia.webp",
        srcSm: "/images/projects/emilia-sm.webp",
        alt: "Emilia Telegram bot interface",
        width: 1400,
        height: 810,
        objectPos: "object-top",
        isDark: true,
      },
    ],
  },
  about: {
    stats: [
      {
        title: "IIT Guwahati '25",
        label: "Hackathon Winner",
      },
      {
        title: "Google GenAI",
        label: "Top 5 Finalist",
      },
      {
        title: "2 accepted",
        label: "First-Author Papers",
      },
    ],
    education: "cs @ graphic era ’27 · cgpa 8.16/10",
  },
  skills: {
    machine: {
      host: "arsh@archlinux",
      prompt: "arsh@archlinux:~$ neofetch --stack",
      rows: [
        {
          key: "os",
          value: "Arch Linux · x86_64",
        },
        {
          key: "editor",
          value: "Neovim · VS Code",
        },
        {
          key: "runtime",
          value: "Python 3.12 · Node 24",
        },
        {
          key: "uptime",
          value: "22 years",
        },
        {
          key: "papers",
          value: "2 accepted · IC2E3, IEEE INDISCON",
        },
        {
          key: "certs",
          value: "OCI GenAI Professional",
        },
      ],
    },
    layers: [
      {
        id: "interface",
        matte: "#c9b8dd",
        headline: "Interfaces and web applications",
        tools: [
          {
            name: "Next.js",
            url: "https://nextjs.org/",
            note: "App Router for Leadly",
          },
          {
            name: "React",
            url: "https://react.dev/",
            note: "component architecture, this site included",
          },
          {
            name: "Tailwind CSS",
            url: "https://tailwindcss.com/",
            note: "design tokens, no component library",
          },
          {
            name: "Framer Motion",
            url: "https://www.framer.com/motion/",
            note: "scroll choreography and reveals",
          },
        ],
      },
      {
        id: "serving",
        matte: "#b07d2b",
        headline: "900K users across 5K groups",
        tools: [
          {
            name: "FastAPI",
            url: "https://fastapi.tiangolo.com/",
            note: "Asynchronous API services",
          },
          {
            name: "Pyrogram / Telethon",
            url: "https://docs.pyrogram.org/",
            note: "dual MTProto clients on uvloop",
          },
          {
            name: "Express",
            url: "https://expressjs.com/",
            note: "worker pool behind the Next.js app",
          },
          {
            name: "Flask",
            url: "https://flask.palletsprojects.com/",
            note: "internal REST APIs at TBI GEU",
          },
          {
            name: "WebRTC + VAD",
            url: "https://webrtc.org/",
            note: "Realtime voice and communication",
          },
          {
            name: "Socket.IO",
            url: "https://socket.io/",
            note: "realtime channels and presence",
          },
        ],
      },
      {
        id: "models",
        matte: "#175263",
        headline: "2 papers accepted · 7 fine-tuned models on the Hub",
        tools: [
          {
            name: "PyTorch",
            url: "https://pytorch.org/",
            note: "",
          },
          {
            name: "Transformers",
            url: "https://huggingface.co/docs/transformers",
            note: "",
          },
          {
            name: "scikit-learn",
            url: "https://scikit-learn.org/",
            note: "",
          },
          {
            name: "ONNX Runtime",
            url: "https://onnxruntime.ai/",
            note: "",
          },
          {
            name: "LangChain",
            url: "https://www.langchain.com/",
            note: "",
          },
          {
            name: "Gemini API",
            url: "https://ai.google.dev/",
            note: "",
          },
          {
            name: "Vertex AI",
            url: "https://cloud.google.com/vertex-ai",
            note: "",
          },
          {
            name: "Groq",
            url: "https://groq.com/",
            note: "",
          },
        ],
      },
      {
        id: "state",
        matte: "#6f9e85",
        headline: "95% fewer Mongo writes via an in-memory buffer",
        tools: [
          {
            name: "MongoDB",
            url: "https://www.mongodb.com/",
            note: "write buffer cut IOPS by 95% at 900K users",
          },
          {
            name: "Redis",
            url: "https://redis.io/",
            note: "BullMQ queues, LRU with Pub/Sub invalidation",
          },
          {
            name: "PostgreSQL",
            url: "https://www.postgresql.org/",
            note: "Relational data with Prisma",
          },
          {
            name: "Supabase",
            url: "https://supabase.com/",
            note: "row-level security per user",
          },
          {
            name: "ChromaDB",
            url: "https://www.trychroma.com/",
            note: "vector store for retrieval",
          },
        ],
      },
      {
        id: "ground",
        matte: "#8e4a5b",
        headline: "50+ public repos · OCI GenAI Professional, certified",
        tools: [
          {
            name: "Docker",
            url: "https://www.docker.com/",
            note: "80 concurrent bot clones",
          },
          {
            name: "Linux",
            url: "https://www.kernel.org/",
            note: "Arch daily driver, every deploy",
          },
          {
            name: "Git",
            url: "https://git-scm.com/",
            note: "",
          },
          {
            name: "Cloud Run",
            url: "https://cloud.google.com/run",
            note: "containerized services",
          },
          {
            name: "Google Cloud",
            url: "https://cloud.google.com/",
            note: "GCP tooling and APIs",
          },
          {
            name: "Oracle Cloud",
            url: "https://www.oracle.com/cloud/",
            note: "OCI Generative AI Professional, certified",
          },
        ],
      },
    ],
    languages: [
      {
        name: "Python",
        url: "https://www.python.org/",
        note: "",
      },
      {
        name: "TypeScript",
        url: "https://www.typescriptlang.org/",
        note: "type-safe end to end",
      },
      {
        name: "C",
        url: "https://en.cppreference.com/w/c",
        note: "OS internals",
      },
    ],
  },
  projects: [
    {
      title: "Leadly",
      tagline: "Turn Reddit conversations into revenue",
      matte: "#991b3b",
      lightText: true,
      description:
        "A lead-generation app that monitors Reddit communities, identifies buying intent using LLMs, and drafts relevant replies that match subreddit rules.",
      architecture:
        "Next.js frontend with an Express worker pool. Reddit streams are ingested through BullMQ queues on Redis to stay under API rate limits. LLM calls run in parallel. Dodo Payments webhooks handle subscription upgrades and usage quotas.",
      highlights: [
        "Scans Reddit threads continuously across targeted keywords and subreddits",
        "Two-pass intent classification scoring lead readiness from 0 to 100",
        "BullMQ and Redis worker queues",
        "Dodo Payments webhook handling for automated tier provisioning and token limits",
      ],
      roleAndDecisions:
        "Built the full app and deployment pipeline. I moved all LLM calls into background BullMQ jobs so the frontend never hangs on inference, and used Redis locks with exponential backoff to prevent Reddit API rate limit bans during traffic spikes. Also handled authorization, authentication from scratch.",
      link: "http://leadly.live",
      tags: ["Next.js", "Express", "BullMQ", "Gemini AI", "Prisma", "Docker", "Redis"],
      gallery: [
        "/images/projects/leadly-dashboard.webp",
        "/images/projects/leadly-dashboard-dark.webp",
        "/images/projects/leadly-growth.webp",
      ],
      imageSm: "/images/projects/leadly-dashboard-sm.webp",
    },
    {
      title: "Emilia Bot",
      tagline: "Group administration and moderation bot",
      matte: "#1e295d",
      lightText: true,
      description:
        "Telegram management bot running across 5,000+ groups with 900,000+ users. Includes 73 modular plugins for administration, spam filtering, custom triggers, and cross-chat ban federation.",
      architecture:
        "Runs Telethon and Pyrogram on uvloop. An in-memory WriteBuffer flushes user telemetry to MongoDB in unordered bulk operations every 5 seconds, cutting write operations by 95%. Chat permissions and settings use an in-process LRU cache backed by Redis with Pub/Sub invalidation across workers.",
      highlights: [
        "Handles updates across 900,000+ users and 5,000+ groups without MTProto connection drops",
        "Modular plugin structure with 73 plugins for moderation, filters, and federation",
        "Fast conversational responses via Groq API with automatic fallback between models",
        "In-memory write buffer cutting MongoDB IOPS by 95%",
        "Federation network that propagates ban lists across connected groups instantly",
      ],
      roleAndDecisions:
        "Rewrote the bot from single-threaded asyncio to uvloop with multi-worker concurrency. When high-volume chat traffic exhausted MongoDB connections, I built an in-memory batch buffer that reduced database writes by 95% and added a two-tier LRU plus Redis cache to eliminate read bottlenecks on permission lookups.",
      link: "https://github.com/metarsh/Emilia",
      botLink: "https://t.me/Elf_Robot",
      tags: ["Python", "MongoDB", "Pyrogram", "Telethon", "Redis", "Groq AI"],
      icon: "Bot",
      image: "/images/projects/emilia.webp",
      imageSm: "/images/projects/emilia-sm.webp",
      gallery: ["/images/projects/emilia.webp"],
    },
  ],
  publications: [
    {
      title: "Reconstructing Global Models from Federated Client Weights",
      venue: "IC2E3 2026 · NIT Uttarakhand",
      matte: "#175263",
      result:
        "Learned aggregation of 4 non-IID MentalBERT classifiers: 93.50% on 4,432 test (FedAvg 83.98%, centralized 94.04%), R² = 0.953.",
      links: [
        {
          label: "Training",
          href: "https://www.kaggle.com/code/arshjaved/novel",
        },
        {
          label: "Colab",
          href: "https://colab.research.google.com/drive/1payoClo_d_W9OL1qw9Ar8Asx4hvxhILo",
        },
        {
          label: "Model",
          href: "https://huggingface.co/arshjaved/Final-FL",
        },
        {
          label: "Certificate",
          href: "https://files.arshjaved.in/u/bvRCSx.pdf",
        },
      ],
    },
    {
      title: "Framing, Sentiment, and Agenda-Setting Bias in News Coverage",
      venue: "IEEE INDISCON 2026, MNIT Jaipur",
      matte: "#8e4a5b",
      result:
        "Analysis of 58,289 articles across 5 outlets using RoBERTa, BART, spaCy, and BERTopic with nonparametric validation.",
      links: [
        {
          label: "Dataset + Code",
          href: "https://www.kaggle.com/datasets/arshjaved/political-bias-analysis",
        },
      ],
    },
  ],
  research: {
    image: "/images/illustrations/research.jpg",
    imageAlt: "Research companion illustration",
    badge: "first-author ×2",
  },
  experiences: [
    {
      role: "Undergraduate ML Researcher",
      company: "Graphic Era University",
      timeframe: "Jul 2026 – Aug 2026",
      matte: "#175263",
      bullets: [
        "Fine tuned open source LLM on domain specific task.",
        [
          "Compared different quantization techniques like LoRA and QLoRA and uploaded the tuned model on",
          {
            text: "HuggingFace Hub",
            href: "https://huggingface.co/arshcypherz",
            icon: "HuggingFace",
          },
          ".",
        ],
      ],
      stack: ["PyTorch", "Transformers", "HuggingFace"],
    },
    {
      role: "SDE Intern",
      company: "TBI GEU",
      timeframe: "Jul 2024 – Oct 2024",
      matte: "#b07d2b",
      bullets: [
        "Shipped REST APIs in Python + Flask powering internal tooling.",
        "Designed MongoDB + SQLite hybrid persistence with automated migrations and proper indexes.",
        "Wrote API documentation with cURL examples and Postman collections.",
      ],
      stack: ["Python", "Flask", "MongoDB"],
    },
    {
      role: "Open Source Maintainer",
      company: "Emilia Bot",
      timeframe: "2023 – Present",
      matte: "#8e4a5b",
      bullets: [
        [
          "Built and maintain ",
          {
            text: "Emilia Bot",
            href: "https://t.me/Elf_Robot",
            icon: "Telegram",
          },
          ", a Telegram bot serving 900,000+ users across 5,000+ group chats with 73+ feature modules.",
        ],
        "Built dual-client architecture with MongoDB and Redis async caching, supporting bot cloning across 80 concurrent instances.",
      ],
      stack: ["Python", "MongoDB", "Docker"],
    },
  ],
  experience: {
    image: "/images/illustrations/experience.jpg",
    imageAlt: "Engineering snapshots",
  },
  credentials: [
    {
      title: "Google GenAI Exchange Hackathon 2025",
      issuer: "Google",
      category: "Hackathon",
      issuedLabel: "Jan 2026",
      issuedOn: "2026-01-15",
      summary: "Reached the semi-final stage of Google's GenAI Exchange Hackathon 2025 edition.",
      result: "Semi-Finalist",
    },
    {
      title: "AICrew",
      issuer: "Unstop",
      category: "Hackathon",
      issuedLabel: "Jan 2026",
      issuedOn: "2026-01-10",
      summary: "Hackathon credential issued via the Unstop platform.",
    },
    {
      title: "Hack4Delhi",
      issuer: "Netaji Subhas University of Technology (NSUT), Delhi",
      category: "Hackathon",
      issuedLabel: "Jan 2026",
      issuedOn: "2026-01-05",
      summary: "Hackathon hosted by NSUT Delhi focused on building solutions for Delhi.",
    },
    {
      title: "Quiz-A-Thon 1.1",
      issuer: "QuizCred",
      category: "Hackathon",
      issuedLabel: "Jan 2026",
      issuedOn: "2026-01-01",
      summary: "Technical quiz competition credential from QuizCred.",
    },
    {
      title: "HackFest 2025",
      issuer: "GDG Cloud New Delhi",
      category: "Hackathon",
      issuedLabel: "Nov 2025",
      issuedOn: "2025-11-20",
      summary: "Hackathon credential from GDG Cloud New Delhi's HackFest 2025.",
    },
    {
      title: "Glb-Hackathon 4.0",
      issuer: "GL Bajaj Institute of Technology and Management",
      category: "Hackathon",
      issuedLabel: "Oct 2025",
      issuedOn: "2025-10-15",
      summary: "Hackathon credential from Glb-Hackathon 4.0 hosted by GL Bajaj.",
    },
    {
      title: "CBIT Hackathon",
      issuer: "Chaitanya Bharathi Institute Of Technology",
      category: "Hackathon",
      issuedLabel: "Nov 2025",
      issuedOn: "2025-11-01",
      summary: "Institute hackathon credential issued by CBIT for the November 2025 build sprint.",
    },
    {
      title: "Google Solution Challenge - 2024",
      issuer: "Hack2skill",
      category: "Hackathon",
      issuedLabel: "Aug 2025",
      issuedOn: "2025-08-01",
      summary: "Issued for the Google Solution Challenge 2024 cohort managed by Hack2skill.",
    },
    {
      title: "Walmart - Sparkathon",
      issuer: "Walmart",
      category: "Hackathon",
      issuedLabel: "Jul 2025",
      issuedOn: "2025-07-01",
      summary: "Corporate innovation challenge run by Walmart's Sparkathon program.",
    },
    {
      title: "Hack-O-Holic 3.0",
      issuer: "Co-Dev Club",
      category: "Hackathon",
      issuedLabel: "May 2025",
      issuedOn: "2025-05-20",
      summary: "Achieved finalist position at the 12 hour national Hack-O-Holic 3.0 sprint.",
      result: "Finalist",
    },
    {
      title: "TechSprint Hackathon",
      issuer: "Graphic Era Deemed to be University",
      category: "Hackathon",
      issuedLabel: "May 2025",
      issuedOn: "2025-05-10",
      summary: "Credential for the TechSprint Hackathon hosted at Graphic Era University.",
    },
    {
      title: "The Neural Nexus: An AI-Model Challenge",
      issuer: "Graphic Era Deemed to be University",
      category: "Hackathon",
      issuedLabel: "May 2025",
      issuedOn: "2025-05-05",
      summary: "Cleared two ML coding rounds to reach the final showdown of Neural Nexus.",
      result: "Finalist",
    },
    {
      title: "AMUHacks4.0",
      issuer: "Computer Science Society (CSS)",
      category: "Hackathon",
      issuedLabel: "Apr 2025",
      issuedOn: "2025-04-15",
      summary: "Recognition from the Computer Science Society for AMUHacks4.0 participation.",
    },
    {
      title: "Vihaan 8.0 Hackathon",
      issuer: "Delhi Technological University (DTU)",
      category: "Hackathon",
      issuedLabel: "Apr 2025",
      issuedOn: "2025-04-01",
      summary: "Cleared PPT round and received onsite invite for Vihaan 8.0 at DTU.",
      result: "Onsite Invite",
    },
    {
      title: "BuildwithIndia Hackathon",
      issuer: "HackwithIndia",
      category: "Hackathon",
      issuedLabel: "Mar 2025",
      issuedOn: "2025-03-20",
      summary: "National BuildwithIndia Hackathon credential.",
    },
    {
      title: "DuHacks 4.0",
      issuer: "GDG DDU",
      category: "Hackathon",
      issuedLabel: "Mar 2025",
      issuedOn: "2025-03-10",
      summary: "Certificate from GDG DDU's DuHacks 4.0 edition.",
    },
    {
      title: "WeHack Hackathon",
      issuer: "WeHack",
      category: "Hackathon",
      issuedLabel: "Mar 2025",
      issuedOn: "2025-03-01",
      summary: "Onsite build sprint credential from the WeHack Hackathon.",
    },
    {
      title: "EnCode 2025 - Code to Innovate",
      issuer: "Indian Institute of Technology, Guwahati",
      category: "Hackathon",
      issuedLabel: "Jan 2025",
      issuedOn: "2025-01-15",
      summary: "Secured 1st place for building a low-latency WebRTC AI phone agent.",
      result: "Winner",
    },
    {
      title: "Google GenAI Exchange Hackathon",
      issuer: "Google",
      category: "Hackathon",
      issuedLabel: "Dec 2024",
      issuedOn: "2024-12-05",
      summary: "Awarded to the top five teams at Google's GenAI Exchange Hackathon.",
      result: "Top 5",
    },
    {
      title: "Evolumin (Hackathon)",
      issuer: "ACM Student Chapter, Amrita Amritapuri",
      category: "Hackathon",
      issuedLabel: "Nov 2024",
      issuedOn: "2024-11-10",
      summary: "Cleared PPT and final rounds, placing among the top ten teams nationally.",
      result: "Top 10",
    },
    {
      title: "Oracle Cloud Infrastructure - Generative AI Professional",
      issuer: "Oracle",
      category: "Certification",
      issuedLabel: "Aug 2024",
      issuedOn: "2024-08-15",
      summary: "Professional certification covering OCI's Generative AI services and tooling.",
      expiresLabel: "Expires Aug 2026",
    },
    {
      title: "Workshop on Prompt Engineering",
      issuer: "IEEE",
      category: "Workshop",
      issuedLabel: "May 2024",
      issuedOn: "2024-05-20",
      summary: "Hands-on IEEE workshop focused on prompt engineering best practices.",
    },
    {
      title: "Code Crusade (Hackathon)",
      issuer: "IEEE",
      category: "Hackathon",
      issuedLabel: "Mar 2024",
      issuedOn: "2024-03-15",
      summary: "Advanced through every stage and reached the final rounds of Code Crusade.",
      result: "Final Round",
    },
    {
      title: "Introduction to IoT and Digital Transformation",
      issuer: "Cisco Networking Academy",
      category: "Course",
      issuedLabel: "Feb 2024",
      issuedOn: "2024-02-10",
      summary: "Cisco Networking Academy course on IoT foundations and digital transformation.",
    },
    {
      title: "FSD Development with Python: API Development in Flask",
      issuer: "Infosys",
      category: "Course",
      issuedLabel: "Jan 2024",
      issuedOn: "2024-01-10",
      summary: "Infosys full-stack development module centered on Flask API design.",
    },
    {
      title: "Python (HackerRank)",
      issuer: "HackerRank",
      category: "Certification",
      issuedLabel: "Dec 2023",
      issuedOn: "2023-12-05",
      summary: "HackerRank skill certification assessing intermediate Python competency.",
    },
    {
      title: "Optimizing Website Performance",
      issuer: "IEEE",
      category: "Workshop",
      issuedLabel: "Sep 2023",
      issuedOn: "2023-09-15",
      summary: "IEEE workshop certificate focused on front-end performance tuning.",
    },
  ],
  credentialsLink: "https://www.linkedin.com/in/arsh-javed/details/certifications/",
  socials: [
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com/metarsh",
      icon: "github",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://linkedin.com/in/arsh-javed",
      icon: "linkedin",
    },
    {
      id: "telegram",
      label: "Telegram",
      href: "https://t.me/halalneko",
      icon: "telegram",
    },
    {
      id: "huggingface",
      label: "Hugging Face",
      href: "https://huggingface.co/arshjaved",
      icon: "huggingface",
    },
    {
      id: "kaggle",
      label: "Kaggle",
      href: "https://www.kaggle.com/arshjaved",
      icon: "kaggle",
    },
  ],
  contact: {
    // Replace with your own Formcarry endpoint, or leave empty for an email link.
    formEndpoint: templateFormEndpoint,
    // Public reCAPTCHA v3 site key. The secret key belongs only in Formcarry's settings.
    recaptchaSiteKey: templateRecaptchaSiteKey,
    successMessage: "Thanks for reaching out. I'll get back to you within 24 hours.",
    image: "/images/illustrations/shark.jpeg",
    imageAlt: "Gawr Gura mascot illustration",
    ditherImage: "/images/illustrations/shark-dither.webp",
    imageCaption: "say hi 🦈",
    footerNote: "☕ Always up for coffee & code",
  },
  pet: {
    enabled: true,
    sprite: "/images/pet/oneko.png",
    label: "Companion cat (click to pet)",
  },
  insight: {
    title: "Building Emilia for Telegram communities",
    summary:
      "The engineering behind sharing a ban across groups, keeping music requests responsive, and hosting someone else's bot.",
    introduction:
      "I built Emilia around requests from the people using it. Features like shared bans and hosted bots each brought their own problems with permissions and concurrent work.",
    date: "Jan 2026",
    readingTime: "7 min read",
    tags: ["Python", "Telegram", "MongoDB", "Redis", "Docker"],
    links: [
      {
        label: "Emilia source",
        href: "https://github.com/metarsh/Emilia",
      },
      {
        label: "Open @Elf_Robot",
        href: "https://t.me/Elf_Robot",
      },
    ],
  },
};
