import { describe, expect, it } from "vitest";
import { MANUAL_ASSESSMENTS } from "@/content/manual-assessments";
import { SEED_MODULES, SITE_CONFIG } from "@/lib/site-config";

describe("manual curriculum", () => {
  it("maps all seven manuals into complete module sequences", () => {
    expect(SEED_MODULES).toHaveLength(7);
    expect(SEED_MODULES.map((module) => module.order)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(SEED_MODULES.map((module) => module.title)).toEqual([
      "The New Covenant",
      "Identity in Christ",
      "The Word: The Agent of Change",
      "The Ministry of the Holy Spirit",
      "Spiritual Authority and Prayer",
      "Purpose and Calling",
      "Stewardship and Missional Lifestyle",
    ]);

    for (const courseModule of SEED_MODULES) {
      expect(courseModule.objectives).toHaveLength(10);
      expect(courseModule.lessons).toHaveLength(11);
      // Lesson 1 carries the module's recorded lecture; lessons 2-10 are the
      // written reading; lesson 11 is always the module's assignment.
      expect(courseModule.lessons[0]?.kind).toBe("VIDEO");
      expect(courseModule.lessons[0]?.videoUrl).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=/);
      expect(courseModule.lessons.slice(1, 10).every((lesson) => lesson.kind === "READING")).toBe(true);
      expect(courseModule.lessons.at(-1)?.kind).toBe("ASSIGNMENT");
      expect(courseModule.sourceUrl).toMatch(/^https:\/\/docs\.google\.com\/document\/d\//);
      expect(courseModule.lessons.every((lesson) => lesson.resourceUrl === courseModule.sourceUrl)).toBe(true);
      expect(courseModule.lessons.every((lesson) => !lesson.body.includes("Replace this working copy"))).toBe(true);
      expect(new Set(courseModule.lessons.map((lesson) => lesson.slug)).size).toBe(courseModule.lessons.length);
    }
  });

  it("uses five manual-specific questions so four correct answers meet the pass mark", () => {
    expect(SITE_CONFIG.passMark).toBe(80);
    for (const courseModule of SEED_MODULES) {
      const questions = MANUAL_ASSESSMENTS[courseModule.order];
      expect(questions).toHaveLength(5);
      expect(questions.map((question) => question.order)).toEqual([1, 2, 3, 4, 5]);
      expect(questions.every((question) => question.options.length === 4)).toBe(true);
      expect(questions.every((question) => question.correctIndex >= 0 && question.correctIndex < 4)).toBe(true);
    }
    expect((4 / 5) * 100).toBe(SITE_CONFIG.passMark);
  });

  it("preserves reflections and creates a review assignment for every module", () => {
    for (const courseModule of SEED_MODULES) {
      for (const lesson of courseModule.lessons.slice(0, 10)) {
        expect(lesson.body).toContain("## Key Scriptures");
        expect(lesson.body).toContain("## Key Truth");
        expect(lesson.body).toContain("## Student Reflection");
      }
      const review = courseModule.lessons.at(-1);
      expect(review?.body).toContain("## Review Questions");
      expect(review?.body).toContain("## Personal Integration Questions");
      expect(review?.body).toContain("## Module Conclusion");
    }
  });
});
