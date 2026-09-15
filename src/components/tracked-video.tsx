"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pause, Play, RotateCcw, CheckCircle2 } from "lucide-react";
import { beginVideo, recordVideo } from "@/app/dashboard/video-actions";

type Player = {
  playVideo(): void; pauseVideo(): void; seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number; getPlayerState(): number; setPlaybackRate(rate: number): void;
  getIframe(): HTMLIFrameElement; destroy(): void;
};
type YouTubeWindow = Window & { onYouTubeIframeAPIReady?: () => void; YT?: { Player: new (element: HTMLElement, options: {
  videoId: string; host: string; playerVars: Record<string, string | number>;
  events: { onReady(): void; onStateChange(event: { data: number }): void; onError(): void };
}) => Player } };

function time(seconds: number) {
  const value = Math.floor(seconds);
  return Math.floor(value / 60) + ":" + String(value % 60).padStart(2, "0");
}

export function TrackedVideo({ lessonId, videoId, duration, title, initialWatched, initialComplete }: {
  lessonId: string; videoId: string; duration: number; title: string; initialWatched: number; initialComplete: boolean;
}) {
  const router = useRouter();
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef<{ play(rewind?: boolean): Promise<void>; pause(): void } | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [watched, setWatched] = useState(initialWatched);
  const [complete, setComplete] = useState(initialComplete);
  const [message, setMessage] = useState("Watch this teaching to unlock the next lesson. Your progress saves automatically.");

  useEffect(() => {
    let player: Player | undefined;
    let disposed = false;
    let sessionId: string | null = null;
    let saved = initialWatched;
    let finished = initialComplete;
    let saving = false;
    let saveAgain = false;
    let starting = false;
    let lastSave = 0;
    let lastPosition = initialWatched;
    let lastSample = performance.now();
    let tick: ReturnType<typeof setInterval> | undefined;
    const startedAt = performance.now();
    const youtubeWindow = window as YouTubeWindow;
    const previousReady = youtubeWindow.onYouTubeIframeAPIReady;
    const onApiReady = () => { previousReady?.(); };
    youtubeWindow.onYouTubeIframeAPIReady = onApiReady;

    async function save() {
      if (!player || !sessionId || starting || finished || disposed) return;
      if (saving) { saveAgain = true; return; }
      saving = true;
      lastSave = performance.now();
      try {
        const result = await recordVideo({ lessonId, sessionId, position: player.getCurrentTime() });
        if (disposed) return;
        saved = result.watchedSeconds;
        setWatched(saved);
        if (!result.accepted) {
          player.seekTo(result.position, true);
          lastPosition = result.position;
          setMessage("Resumed from your last saved point. Watch in order to continue.");
        }
        if (result.complete) {
          finished = true;
          setComplete(true);
          setMessage("Teaching complete. You can now continue to the next lesson.");
          router.refresh();
        }
      } catch {
        if (disposed) return;
        sessionId = null;
        player.pauseVideo();
        setMessage("Progress could not be saved. Check your connection, then press Resume. Keep only one lesson tab open.");
      } finally { saving = false; if (saveAgain) { saveAgain = false; void save(); } }
    }

    async function play(rewind = false) {
      if (!player || starting || saving || disposed) return;
      if (finished) { if (rewind) player.seekTo(0, true); player.playVideo(); return; }
      starting = true;
      setBusy(true);
      player.pauseVideo();
      try {
        const result = await beginVideo(lessonId, rewind ? Math.max(0, Math.min(saved, player.getCurrentTime()) - 10) : undefined);
        if (disposed) return;
        sessionId = result.sessionId;
        saved = result.watchedSeconds;
        finished = result.complete;
        setWatched(saved);
        setComplete(finished);
        lastPosition = result.position;
        lastSample = performance.now();
        lastSave = performance.now();
        player.seekTo(result.position, true);
        player.setPlaybackRate(1);
        setMessage("Progress saves as you watch. You can pause and return whenever you need.");
        player.playVideo();
      } catch {
        if (!disposed) setMessage("Unable to start tracking. Check your connection and sign-in, then press Resume.");
      } finally { starting = false; if (!disposed) setBusy(false); }
    }

    const pause = () => { player?.pauseVideo(); void save(); };
    controls.current = { play, pause };
    const visibility = () => { if (document.hidden) pause(); };
    document.addEventListener("visibilitychange", visibility);

    const setup = setInterval(() => {
      const api = (window as YouTubeWindow).YT;
      if (!api?.Player || !host.current) {
        if (performance.now() - startedAt > 20000) setMessage("The video is taking longer to load. Check your connection or reload this page.");
        return;
      }
      clearInterval(setup);
      const mount = document.createElement("div");
      host.current.appendChild(mount);
      player = new api.Player(mount, {
        videoId, host: "https://www.youtube-nocookie.com",
        playerVars: { controls: 0, disablekb: 1, playsinline: 1, rel: 0, fs: 1, origin: window.location.origin },
        events: {
          onReady() {
            if (disposed || !player) return;
            player.getIframe().title = title;
            setReady(true);
          },
          onStateChange(event) {
            if (disposed || !player) return;
            setPlaying(event.data === 1);
            if (event.data === 1 && !sessionId && !finished) { player.pauseVideo(); void play(); }
            if (event.data === 1 && document.hidden) pause();
            if (event.data === 0 || event.data === 2) void save();
          },
          onError() { if (!disposed) setMessage("This video could not load. Reload to retry, or contact your instructor if it remains unavailable."); },
        },
      });
      tick = setInterval(() => {
        if (!player || disposed) return;
        const now = performance.now();
        const position = player.getCurrentTime();
        if (player.getPlayerState() === 1 && !finished && sessionId) {
          if (position > Math.max(saved, lastPosition + (now - lastSample) / 1000) + 1.5) {
            player.seekTo(saved, true);
            lastPosition = saved;
            setMessage("Skipping ahead is disabled. Continue watching from your saved point.");
          } else lastPosition = position;
          player.setPlaybackRate(1);
          if (now - lastSave >= 5000) void save();
        } else lastPosition = position;
        lastSample = now;
      }, 250);
    }, 250);

    return () => {
      disposed = true;
      if (youtubeWindow.onYouTubeIframeAPIReady === onApiReady) youtubeWindow.onYouTubeIframeAPIReady = previousReady;
      clearInterval(setup);
      if (tick) clearInterval(tick);
      document.removeEventListener("visibilitychange", visibility);
      controls.current = null;
      player?.destroy();
    };
  }, [lessonId, videoId, duration, title, initialWatched, initialComplete, router]);

  const percent = complete ? 100 : Math.min(99, Math.floor(watched / duration * 100));
  return <section className="mt-8 overflow-hidden rounded-2xl border border-[var(--line)] bg-white/60" aria-label="Teaching video">
    <Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive" onError={() => setMessage("Video loading failed. Check your connection and reload to retry.")} />
    <div ref={host} className="aspect-video min-h-[200px] bg-[#102138] [&_iframe]:h-full [&_iframe]:w-full" />
    <div className="space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button type="button" className="button-primary !min-h-10 !px-4" disabled={!ready || busy} onClick={() => playing ? controls.current?.pause() : void controls.current?.play()}>
            {playing ? <Pause size={16} /> : <Play size={16} />}{busy ? "Connecting…" : playing ? "Pause" : watched > 0 ? "Resume" : "Play teaching"}
          </button>
          <button type="button" className="button-secondary !min-h-10 !px-3" disabled={!ready || busy} onClick={() => void controls.current?.play(true)}><RotateCcw size={16} />{complete ? "Replay" : "Back 10 sec"}</button>
        </div>
        <span className="text-xs font-bold text-[var(--ink-soft)]">{complete ? <span className="inline-flex items-center gap-1"><CheckCircle2 size={16} /> Complete</span> : time(watched) + " / " + time(duration) + " watched · " + percent + "%"}</span>
      </div>
      <div role="progressbar" aria-label="Teaching watched" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} className="h-1.5 overflow-hidden rounded-full bg-black/10"><div className="h-full rounded-full bg-[var(--forest)] transition-all" style={{ width: percent + "%" }} /></div>
      <p role="status" className="text-sm leading-6 text-[var(--ink-soft)]">{message}</p>
    </div>
  </section>;
}
