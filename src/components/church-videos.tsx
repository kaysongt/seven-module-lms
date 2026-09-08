"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Play, X } from "lucide-react";
import type { ChurchVideo } from "@/lib/location-media";

export function ChurchVideos({ videos }: { videos: ChurchVideo[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<ChurchVideo | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);

  function close() {
    dialog.current?.close();
    setSelected(null);
    trigger.current?.focus();
  }

  return (
    <>
      <div
        className={`kw-video-grid ${videos.length === 1 ? "single-video" : ""}`}
      >
        {videos.map((video) => (
          <article className="kw-video-card" key={video.id}>
            <button
              className="kw-video-poster"
              aria-label={`Play ${video.title}`}
              onClick={(event) => {
                trigger.current = event.currentTarget;
                setSelected(video);
                dialog.current?.showModal();
              }}
            >
              <Image
                src={`/media/video-${video.id}.jpg`}
                alt={`${video.title} — ${video.channel}`}
                fill
                sizes="(max-width: 650px) 90vw, 45vw"
              />
              <span className="kw-play">
                <Play size={22} fill="currentColor" />
              </span>
              <span className="kw-video-label">WATCH & EXPERIENCE</span>
            </button>
            <div className="kw-video-info">
              <p>{video.category}</p>
              <h3>{video.title}</h3>
              <span>{video.channel}</span>
            </div>
          </article>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="kw-video-dialog"
        aria-label={selected?.title ?? "KingsWord video"}
        onCancel={close}
        onClose={() => {
          setSelected(null);
          trigger.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === dialog.current) close();
        }}
      >
        {selected && (
          <div className="kw-video-dialog-inner">
            <div className="kw-video-dialog-heading">
              <h2>{selected.title}</h2>
              <button aria-label="Close video" onClick={close}>
                <X size={22} />
              </button>
            </div>
            <div className="kw-video-frame">
              <iframe
                key={selected.id}
                src={`https://www.youtube-nocookie.com/embed/${selected.id}?autoplay=1&rel=0`}
                title={`${selected.title} — ${selected.channel}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <p>
              {selected.channel}
              <a
                href={`https://www.youtube.com/watch?v=${selected.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open on YouTube <ArrowUpRight size={14} />
              </a>
            </p>
          </div>
        )}
      </dialog>
    </>
  );
}
