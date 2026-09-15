import { getVideoEmbedUrl } from "@/lib/video";

// Durations verified against the seven original @tempkingsword teachings.
// Never trust a browser-supplied duration when awarding completion.
const DURATIONS: Record<string, number> = {
  "0IWX-fwHmu0": 4975, "rebnFvX6r_8": 5448, "4CzCbnx0eEU": 4671,
  "2EEpawrfzMM": 4736, "-zxEVgYMbeU": 4476, "zRPiNwnmVbs": 4098, "RLbRya09Mn8": 4920,
};

export function getTrainingVideo(url: string | null | undefined) {
  const embed = getVideoEmbedUrl(url);
  const id = embed?.startsWith("https://www.youtube-nocookie.com/embed/") ? embed.split("/").at(-1) : null;
  return id && DURATIONS[id] ? { id, duration: DURATIONS[id] } : null;
}

export function requiresVideoCompletion(lesson: { kind: string; videoUrl: string | null }) {
  return lesson.kind === "VIDEO" || Boolean(lesson.videoUrl);
}

export function hasVerifiedVideoCompletion(
  lesson: { videoUrl: string | null },
  progress: { videoId: string; completedAt: Date | null } | undefined,
) {
  const video = getTrainingVideo(lesson.videoUrl);
  return Boolean(video && progress?.videoId === video.id && progress.completedAt);
}

export type WatchState = { watchedSeconds: number; budgetSeconds: number; position: number; heartbeatAt: Date };

export function advanceWatch(state: WatchState, position: number, duration: number, now: Date) {
  const elapsed = (now.getTime() - state.heartbeatAt.getTime()) / 1000;
  const delta = position - state.position;
  // Long gaps, seeks, and accelerated playback cannot earn missing watch time.
  const accepted = Number.isFinite(position) && position >= 0 && position <= duration + 1
    && elapsed >= 0 && elapsed <= 20 && delta >= -1 && delta <= elapsed + 1
    && state.position <= state.watchedSeconds + 2;
  const budgetSeconds = accepted ? state.budgetSeconds + elapsed : state.watchedSeconds;
  const watchedSeconds = accepted
    ? Math.min(duration, Math.max(state.watchedSeconds, Math.min(position, budgetSeconds)))
    : state.watchedSeconds;
  return {
    accepted, watchedSeconds, budgetSeconds,
    position: accepted ? Math.min(position, duration) : state.watchedSeconds,
    complete: accepted && watchedSeconds >= duration - 1 && position >= duration - 0.5,
  };
}
