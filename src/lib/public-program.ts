import { db } from "@/lib/db";
import { SEED_MODULES, SITE_CONFIG } from "@/lib/site-config";

export type PublicProgramModule = {
  order: number;
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  lessons: Array<{ title: string; slug: string; estimatedMinutes: number }>;
};

export type PublicProgram = {
  name: string;
  shortName: string;
  eyebrow: string;
  tagline: string;
  description: string;
  passMark: number;
  modules: PublicProgramModule[];
};

const fallbackProgram: PublicProgram = {
  name: SITE_CONFIG.name,
  shortName: SITE_CONFIG.shortName,
  eyebrow: SITE_CONFIG.eyebrow,
  tagline: SITE_CONFIG.tagline,
  description: SITE_CONFIG.description,
  passMark: SITE_CONFIG.passMark,
  modules: SEED_MODULES.map((module) => ({
    order: module.order,
    slug: module.slug,
    eyebrow: module.eyebrow,
    title: module.title,
    summary: module.summary,
    estimatedMinutes: module.lessons.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0),
    lessons: module.lessons.map((lesson) => ({ title: lesson.title, slug: lesson.slug, estimatedMinutes: lesson.estimatedMinutes })),
  })),
};

export async function getPublicProgram(): Promise<PublicProgram> {
  try {
    const program = await db.program.findFirst({
      where: { slug: SITE_CONFIG.slug, isPublished: true },
      include: {
        modules: {
          where: { status: "PUBLISHED" },
          orderBy: { order: "asc" },
          include: {
            lessons: {
              where: { status: "PUBLISHED" },
              orderBy: { order: "asc" },
              select: { title: true, slug: true, estimatedMinutes: true },
            },
          },
        },
      },
    });
    if (!program || program.modules.length !== 7) return fallbackProgram;
    return {
      name: program.name,
      shortName: program.shortName,
      eyebrow: program.eyebrow,
      tagline: program.tagline,
      description: program.description,
      passMark: program.passMark,
      modules: program.modules,
    };
  } catch {
    return fallbackProgram;
  }
}
