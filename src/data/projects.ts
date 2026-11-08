export const CATEGORIES = [
  "Websites",
  "Web Applications",
  "AI & Automation",
  "Branding",
  "Digital Products",
  "UI/UX",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type Pattern = "bands" | "radial" | "steps" | "noise" | "split";

export interface Project {
  slug: string;
  name: string;
  kind: string;
  categories: Category[];
  status: string;
  pattern: Pattern;
  /** [dot colour, background, second dot colour] for the generated placeholder cover */
  palette: [string, string, string];
  /** Cover screenshot, e.g. "/assets/husn-cover.jpg". null shows the generated placeholder. */
  image: string | null;
  /** Gallery screenshots, e.g. ["/assets/husn-1.jpg"]. Empty shows placeholder frames. */
  gallery: string[];
  intro: string;
  challenge: string;
  direction: string | null;
  process: string[];
  stack: string[];
  /** True when the stack list is known to be incomplete. */
  stackIncomplete?: boolean;
  implementation: string;
  /** A real, verified result. null shows a "To add" note. Never invent this. */
  outcome: string | null;
}

/**
 * Add real screenshots to /public/assets and set `image` and `gallery`.
 * Entries below come from what the studio has shared so far; remove any you do not want public.
 */
export const PROJECTS: Project[] = [
  {
    slug: "husn",
    name: "Husn",
    kind: "Ladies clothing e-commerce",
    categories: ["Websites", "Digital Products"],
    status: "In deployment",
    pattern: "bands",
    palette: ["#F2D3D6", "#FBF5EA", "#B98188"],
    image: null,
    gallery: [],
    intro: "A luxury-feeling clothing storefront with its own admin panel, built for buyers in Pakistan.",
    challenge:
      "Sell clothing online with a soft, premium feel, support the payment flows people in Pakistan use alongside Stripe, and keep pricing and checkout logic safe from tampering.",
    direction:
      "A cream, ivory and baby-pink palette with Cormorant Garamond for display and Jost for text. A custom cursor and Framer Motion keep the movement slow and soft.",
    process: [
      "Next.js storefront and admin panel on Supabase.",
      "Stripe plus domestic Pakistani payment flows.",
      "Hardening: server-side price validation, rate limiting, Zod validation and security headers.",
    ],
    stack: ["Next.js", "Supabase", "Stripe", "Framer Motion", "Zod"],
    implementation: "A full storefront and an admin panel for managing the catalogue and orders.",
    outcome: null,
  },
  {
    slug: "island",
    name: "3D Island Portfolio",
    kind: "Interactive portfolio",
    categories: ["Websites", "UI/UX"],
    status: "Built",
    pattern: "radial",
    palette: ["#7CCBE8", "#F3EEE1", "#2C5D3F"],
    image: null,
    gallery: [],
    intro: "A portfolio you drive through instead of scrolling: arcade car physics on a floating island.",
    challenge:
      "Make a portfolio people want to play with, while keeping each of the five ventures easy to find.",
    direction:
      "A floating island world with five content zones, one for each real venture, in the spirit of Bruno Simon's driving portfolio.",
    process: ["Built as a single HTML file.", "Arcade-style car physics for driving between zones."],
    stack: ["Single-file HTML"],
    stackIncomplete: true,
    implementation: "A playable island with five zones.",
    outcome: null,
  },
  {
    slug: "pipeline",
    name: "Sales Pipeline Agents",
    kind: "AI web app",
    categories: ["Web Applications", "AI & Automation"],
    status: "Built",
    pattern: "steps",
    palette: ["#FFE135", "#14120D", "#4A463B"],
    image: null,
    gallery: [],
    intro: "A React app where four AI agents run a sales pipeline for pitching digital services.",
    challenge: "Pitch digital services to a lot of prospects without doing every step by hand.",
    direction: null,
    process: [
      "Four cooperating agents, each owning one stage of the pipeline.",
      "Runs autonomously from lead to pitch.",
    ],
    stack: ["React"],
    stackIncomplete: true,
    implementation: "A working four-agent pipeline in the browser.",
    outcome: null,
  },
  {
    slug: "awareness",
    name: "Breast Cancer Awareness Platform",
    kind: "Multilingual education site",
    categories: ["Websites", "Web Applications"],
    status: "Phase 1 planning",
    pattern: "noise",
    palette: ["#E7A1B6", "#FFF4F6", "#7C2E4B"],
    image: null,
    gallery: [],
    intro:
      "A global, multilingual education site with a doctor video portal where every upload needs admin approval.",
    challenge:
      "Share trustworthy awareness content across many languages, including right-to-left ones, keep contributed videos moderated, and stay on the right side of privacy and accessibility rules.",
    direction: null,
    process: [
      "Phase 1 first, with a Supabase backend added later.",
      "Planned features: quiz, myth vs fact, support directory and an admin dashboard.",
    ],
    stack: ["Next.js", "TypeScript", "Supabase (planned)"],
    implementation: "Phase 1 is being planned.",
    outcome: null,
  },
  {
    slug: "identity",
    name: "PixelateBanana Identity",
    kind: "Brand and website",
    categories: ["Branding", "UI/UX"],
    status: "In progress",
    pattern: "split",
    palette: ["#14120D", "#FFE135", "#F3EEE1"],
    image: null,
    gallery: [],
    intro:
      "The studio's own identity: a banana built from square pixels, a variable-width type system and a palette where yellow is a signal.",
    challenge: "Give a studio with a playful name a look that reads as precise, not childish.",
    direction:
      "Yellow as signal, black and warm off-white as the ground. Anybody for display type that changes width, Geist for text and IBM Plex Mono for technical labels.",
    process: [
      "The mark is constructed on a pixel grid, so it scales from favicon to hero canvas.",
      "Page transitions reuse the same grid.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP"],
    implementation: "This site.",
    outcome: null,
  },
];

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
export const nextProject = (slug: string) => {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return PROJECTS[(i + 1) % PROJECTS.length];
};
