import { redirect, notFound } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { db } from "@/lib/db";
import { SITE_CONFIG } from "@/lib/site-config";

// Called only after requireUser has authenticated the account on learning pages.
export async function redirectStaffToCourse(role: UserRole, moduleSlug?: string, lessonSlug?: string, assessment = false) {
  if (role === "STUDENT") return;
  if (!moduleSlug) redirect("/admin/course");
  const learningModule = await db.module.findFirst({ where: { slug: moduleSlug, program: { slug: SITE_CONFIG.slug } }, select: { id: true, lessons: { select: { id: true, slug: true } } } });
  if (!learningModule) notFound();
  const lesson = lessonSlug ? learningModule.lessons.find((item) => item.slug === lessonSlug) : null;
  if (lessonSlug && !lesson) notFound();
  redirect("/admin/course/" + learningModule.id + (lesson ? "?lesson=" + lesson.id + "#lesson-" + lesson.id : assessment ? "#checkpoint" : ""));
}
