import manualCurriculum from "@/content/manual-curriculum.json";

export const SITE_CONFIG = {
  organization: "KingsWord Training Institute",
  name: "Believers Training",
  shortName: "Believers Training",
  // Keep the original internal slug so existing enrollments remain attached after reseeding.
  slug: "formation-path",
  eyebrow: "Seven modules for rooted Christian living",
  tagline: "Know the truth. Live from identity. Serve with purpose.",
  description:
    "Believers Training is a guided, seven-module journey through covenant, identity, Scripture, the Holy Spirit, prayer, purpose, and missional stewardship.",
  certificateLabel: "Believers Training Certificate of Completion",
  supportEmail: "kti@kingsword.org",
  passMark: 80,
  sessionDays: 30,
  invitationDays: 7,
} as const;

export type SeedLesson = {
  title: string;
  slug: string;
  summary: string;
  body: string;
  kind: "READING" | "ASSIGNMENT";
  resourceUrl: string;
  estimatedMinutes: number;
};

export type SeedModule = {
  order: number;
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  objectives: string[];
  sourceTitle: string;
  sourceUrl: string;
  lessons: SeedLesson[];
};

export const SEED_MODULES = manualCurriculum as SeedModule[];

export const PUBLIC_OUTCOMES = [
  "A grounded understanding of the New Covenant and your identity in Christ",
  "Practical habits for living by the Word and depending on the Holy Spirit",
  "Greater confidence in prayer, spiritual authority, purpose, and calling",
  "A faithful approach to stewardship, generosity, influence, and everyday mission",
] as const;
