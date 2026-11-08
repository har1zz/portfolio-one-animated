import { z } from "zod";

export const PROJECT_TYPES = ["Website", "Web app", "AI & automation", "Branding", "Digital product", "Not sure yet"] as const;
export const BUDGETS = ["Under $1k", "$1k to $3k", "$3k to $10k", "$10k and up", "Not sure yet"] as const;
export const TIMELINES = ["As soon as possible", "Within 1 to 2 months", "3 months or more", "Flexible"] as const;

const link = (l: string) => {
  try {
    const u = new URL(/^https?:\/\//i.test(l) ? l : "https://" + l);
    return u.hostname.includes(".");
  } catch {
    return false;
  }
};

export const briefSchema = z.object({
  name: z.string().trim().min(1, "Add your name.").max(120),
  email: z.string().trim().min(1, "Add your email.").max(200).regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Use an address like name@company.com."),
  company: z.string().trim().max(160).optional().default(""),
  ptype: z.enum(PROJECT_TYPES, { message: "Pick the closest project type." }),
  budget: z.string().trim().max(60).optional().default(""),
  timeline: z.string().trim().max(60).optional().default(""),
  desc: z.string().trim().min(20, "Tell us a little more: at least 20 characters.").max(4000),
  links: z
    .string()
    .max(2000)
    .optional()
    .default("")
    .refine((v) => v.split(/\n+/).map((s) => s.trim()).filter(Boolean).every(link), "Use full links, one per line."),
  /** honeypot: must stay empty */
  site: z.string().max(0).optional().default(""),
});
export type Brief = z.infer<typeof briefSchema>;

export function briefText(b: Brief) {
  return [
    "PixelateBanana project brief",
    `Name: ${b.name}`,
    `Email: ${b.email}`,
    `Company: ${b.company || "-"}`,
    `Project type: ${b.ptype}`,
    `Budget: ${b.budget || "-"}`,
    `Timeline: ${b.timeline || "-"}`,
    `Links: ${b.links.trim().replace(/\n+/g, ", ") || "-"}`,
    "",
    "What we are making:",
    b.desc,
  ].join("\n");
}
