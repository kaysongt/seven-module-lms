/* eslint-disable @next/next/no-assign-module-variable */
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";
import { SEED_MODULES, SITE_CONFIG } from "../src/lib/site-config";

const db = new PrismaClient();

function assessmentQuestions(moduleTitle: string) {
  return [
    {
      order: 1,
      prompt: `What is the best first response to the central practice in ${moduleTitle}?`,
      options: ["Move quickly without reflection", "Observe carefully and name the purpose", "Wait for someone else to decide", "Focus only on appearing confident"],
      correctIndex: 1,
      explanation: "The course consistently begins with careful observation and a clear purpose before action.",
    },
    {
      order: 2,
      prompt: "Which habit best supports durable learning?",
      options: ["One intense session with no review", "Collecting notes without application", "A repeatable rhythm of learning, practice, and reflection", "Avoiding questions until the end"],
      correctIndex: 2,
      explanation: "Durable learning depends on a sustainable cycle of learning, practice, and honest reflection.",
    },
    {
      order: 3,
      prompt: "What should happen after a practice attempt?",
      options: ["Hide what did not work", "Review the evidence and choose the next adjustment", "Repeat it without reflection", "Judge success only by intention"],
      correctIndex: 1,
      explanation: "Reflective review uses evidence to identify a concrete next adjustment.",
    },
  ];
}

async function main() {
  const program = await db.program.upsert({
    where: { slug: SITE_CONFIG.slug },
    update: {
      name: SITE_CONFIG.name,
      shortName: SITE_CONFIG.shortName,
      eyebrow: SITE_CONFIG.eyebrow,
      tagline: SITE_CONFIG.tagline,
      description: SITE_CONFIG.description,
      passMark: SITE_CONFIG.passMark,
      certificateLabel: SITE_CONFIG.certificateLabel,
    },
    create: {
      slug: SITE_CONFIG.slug,
      name: SITE_CONFIG.name,
      shortName: SITE_CONFIG.shortName,
      eyebrow: SITE_CONFIG.eyebrow,
      tagline: SITE_CONFIG.tagline,
      description: SITE_CONFIG.description,
      passMark: SITE_CONFIG.passMark,
      certificateLabel: SITE_CONFIG.certificateLabel,
      isPublished: true,
    },
  });

  for (const moduleSeed of SEED_MODULES) {
    const module = await db.module.upsert({
      where: { programId_order: { programId: program.id, order: moduleSeed.order } },
      update: {
        slug: moduleSeed.slug,
        eyebrow: moduleSeed.eyebrow,
        title: moduleSeed.title,
        summary: moduleSeed.summary,
        description: moduleSeed.description,
        objectives: moduleSeed.objectives,
      },
      create: {
        programId: program.id,
        order: moduleSeed.order,
        slug: moduleSeed.slug,
        eyebrow: moduleSeed.eyebrow,
        title: moduleSeed.title,
        summary: moduleSeed.summary,
        description: moduleSeed.description,
        objectives: moduleSeed.objectives,
        estimatedMinutes: moduleSeed.lessons.reduce((total, lesson) => total + lesson.estimatedMinutes, 0),
        status: "PUBLISHED",
      },
    });

    for (const [index, lessonSeed] of moduleSeed.lessons.entries()) {
      await db.lesson.upsert({
        where: { moduleId_order: { moduleId: module.id, order: index + 1 } },
        update: { ...lessonSeed, status: "PUBLISHED" },
        create: {
          moduleId: module.id,
          order: index + 1,
          ...lessonSeed,
          status: "PUBLISHED",
        },
      });
    }

    const assessment = await db.assessment.upsert({
      where: { moduleId: module.id },
      update: { passMark: program.passMark },
      create: {
        moduleId: module.id,
        title: `${moduleSeed.title} Checkpoint`,
        instructions: "Answer each question. You may retake this checkpoint after reviewing the module.",
        passMark: program.passMark,
        status: "PUBLISHED",
      },
    });

    for (const question of assessmentQuestions(moduleSeed.title)) {
      await db.assessmentQuestion.upsert({
        where: { assessmentId_order: { assessmentId: assessment.id, order: question.order } },
        update: question,
        create: { assessmentId: assessment.id, ...question },
      });
    }
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL?.toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    await db.user.upsert({
      where: { email: adminEmail },
      update: { role: "ADMIN", fullName: "Program Administrator", passwordHash: await hashPassword(adminPassword) },
      create: { email: adminEmail, fullName: "Program Administrator", role: "ADMIN", passwordHash: await hashPassword(adminPassword) },
    });
  }

  const studentEmail = process.env.SEED_STUDENT_EMAIL?.toLowerCase();
  const studentPassword = process.env.SEED_STUDENT_PASSWORD;
  if (studentEmail && studentPassword) {
    const student = await db.user.upsert({
      where: { email: studentEmail },
      update: { fullName: "Demo Student", passwordHash: await hashPassword(studentPassword) },
      create: { email: studentEmail, fullName: "Demo Student", passwordHash: await hashPassword(studentPassword) },
    });
    await db.enrollment.upsert({
      where: { userId_programId: { userId: student.id, programId: program.id } },
      update: { status: "ACTIVE" },
      create: { userId: student.id, programId: program.id, status: "ACTIVE" },
    });
  }
}

main()
  .then(() => db.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
