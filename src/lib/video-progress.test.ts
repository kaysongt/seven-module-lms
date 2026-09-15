import { describe, expect, it } from "vitest";
import { advanceWatch, getTrainingVideo, hasVerifiedVideoCompletion } from "@/lib/video-progress";
import { SEED_MODULES } from "@/lib/site-config";

const now = new Date("2026-09-15T00:00:00Z");
const initial = { watchedSeconds: 0, budgetSeconds: 0, position: 0, heartbeatAt: now };
const later = (seconds: number) => new Date(now.getTime() + seconds * 1000);

describe("verified video progress", () => {
  it("has trusted durations for all seven supplied videos", () => {
    expect(SEED_MODULES).toHaveLength(7);
    for (const learningModule of SEED_MODULES) expect(getTrainingVideo(learningModule.lessons[0].videoUrl)?.duration).toBeGreaterThan(3600);
    expect(getTrainingVideo("https://youtube.com/watch?v=notapproved")).toBeNull();
  });
  it("credits normal playback without completing early", () => {
    expect(advanceWatch(initial, 5, 60, later(5))).toMatchObject({ accepted: true, watchedSeconds: 5, complete: false });
  });
  it("rejects seeking straight to the end, accelerated playback, and stale heartbeats", () => {
    for (const [position, elapsed] of [[60, 5], [10, 5], [60, 90]]) {
      expect(advanceWatch(initial, position, 60, later(elapsed))).toMatchObject({ accepted: false, watchedSeconds: 0, complete: false });
    }
  });
  it("never credits more time than elapsed, even with repeated small jumps", () => {
    let state = initial;
    for (let i = 1; i <= 9; i++) {
      const next = advanceWatch(state, i * 5.8, 60, later(i * 5));
      expect(next.watchedSeconds).toBeLessThanOrEqual(i * 5);
      state = { ...next, heartbeatAt: later(i * 5) };
    }
  });
  it("handles network jitter without accumulating lost time", () => {
    let state = initial;
    for (let i = 1; i <= 120; i++) {
      const heartbeatAt = later(i * 5 + (i % 2 ? 0.2 : 0));
      const next = advanceWatch(state, i * 5, 600, heartbeatAt);
      expect(next.accepted).toBe(true);
      state = { ...next, heartbeatAt };
    }
    expect(state.watchedSeconds).toBe(600);
  });
  it("only completes when verified progress reaches the end", () => {
    expect(advanceWatch({ ...initial, watchedSeconds: 55, budgetSeconds: 55, position: 55 }, 60, 60, later(5))).toMatchObject({ complete: true, watchedSeconds: 60 });
    expect(advanceWatch(initial, 60, 60, later(5)).complete).toBe(false);
  });
  it("allows replay without awarding duplicate progress", () => {
    expect(advanceWatch({ ...initial, watchedSeconds: 40, budgetSeconds: 40, position: 10 }, 15, 60, later(5)).watchedSeconds).toBe(40);
  });
  it("rejects invalid positions and resets after a long offline gap", () => {
    for (const position of [NaN, Infinity, -1, 100]) expect(advanceWatch(initial, position, 60, later(5)).accepted).toBe(false);
    expect(advanceWatch({ ...initial, watchedSeconds: 20, budgetSeconds: 20, position: 20 }, 50, 60, later(90)).position).toBe(20);
  });
  it("does not treat manual or different-video completions as verified", () => {
    const lesson = { videoUrl: "https://youtube.com/watch?v=0IWX-fwHmu0" };
    expect(hasVerifiedVideoCompletion(lesson, undefined)).toBe(false);
    expect(hasVerifiedVideoCompletion(lesson, { videoId: "rebnFvX6r_8", completedAt: now })).toBe(false);
    expect(hasVerifiedVideoCompletion(lesson, { videoId: "0IWX-fwHmu0", completedAt: now })).toBe(true);
  });
});
