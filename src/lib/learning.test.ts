import { describe, expect, it } from "vitest";
import { calculateProgramPercent, calculateScore, deriveModuleProgress, scorePasses } from "@/lib/learning";

describe("assessment rules", () => {
  it("rounds the score to the nearest whole percent", () => {
    expect(calculateScore(5, 6)).toBe(83);
  });

  it("uses an inclusive pass mark", () => {
    expect(scorePasses(80, 80)).toBe(true);
    expect(scorePasses(79, 80)).toBe(false);
  });

  it("rejects impossible scores and pass marks", () => {
    expect(() => calculateScore(2, 0)).toThrow("Invalid assessment score inputs");
    expect(() => calculateScore(4, 3)).toThrow("Invalid assessment score inputs");
    expect(() => scorePasses(80, 0)).toThrow("Pass mark must be between 1 and 100");
  });
});

describe("sequential module progress", () => {
  const modules = [
    { id: "one", order: 1, lessonIds: ["a", "b"], assessmentPassed: true },
    { id: "two", order: 2, lessonIds: ["c"], assessmentPassed: false },
    { id: "three", order: 3, lessonIds: ["d"], assessmentPassed: false },
  ];

  it("unlocks only the next module after full completion", () => {
    const states = deriveModuleProgress(modules, new Set(["a", "b"]));
    expect(states.map((state) => state.isUnlocked)).toEqual([true, true, false]);
    expect(states[0].isComplete).toBe(true);
  });

  it("weights lesson completion and the checkpoint", () => {
    const states = deriveModuleProgress(modules, new Set(["a", "b"]));
    expect(calculateProgramPercent(states)).toBe(33);
  });

  it("keeps later modules locked when the preceding module is incomplete", () => {
    const states = deriveModuleProgress(modules, new Set(["a"]));
    expect(states.map((state) => state.isUnlocked)).toEqual([true, false, false]);
    expect(states[0].percent).toBe(50);
  });

  it("honors a future module release date", () => {
    const releaseDate = new Date("2027-01-01T00:00:00.000Z");
    const states = deriveModuleProgress(
      [modules[0], { ...modules[1], availableAt: releaseDate }],
      new Set(["a", "b"]),
      new Date("2026-12-31T23:59:59.000Z"),
    );
    expect(states[1].isAvailable).toBe(false);
    expect(states[1].isUnlocked).toBe(false);
  });
});
