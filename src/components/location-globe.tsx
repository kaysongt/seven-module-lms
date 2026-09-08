"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  MoveUpRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  geoDistance,
  geoGraticule10,
  geoOrthographic,
  geoPath,
  type GeoPermissibleObjects,
} from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

export type GlobeLocation = {
  slug: string;
  name: string;
  region: string;
  href: string;
  coordinates: [number, number];
  image: string;
  headline: string;
  caption: string;
};

export function LocationGlobe({ locations }: { locations: GlobeLocation[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [available, setAvailable] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pinsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const engineRef = useRef({
    rotation: [65, -25] as [number, number],
    target: [65, -25] as [number, number],
    active: 0,
    paused: false,
    hovered: false,
    dragging: false,
    lastX: 0,
    lastY: 0,
    reduced: false,
    inView: true,
  });

  function select(index: number, pause = true) {
    const engine = engineRef.current;
    engine.active = index;
    engine.target = [
      -locations[index].coordinates[0],
      -locations[index].coordinates[1] + 12,
    ];
    engine.paused = pause;
    setActive(index);
    setPaused(pause);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !stage || !ctx) return;
    const engine = engineRef.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const controller = new AbortController();
    let disposed = false;
    let frame = 0;
    let size = 700;
    let last = 0;
    let tourElapsed = 0;
    let land: GeoPermissibleObjects | undefined;
    let borders: GeoPermissibleObjects | undefined;
    const grid = geoGraticule10();
    const projection = geoOrthographic().clipAngle(90).precision(0.6);
    const path = geoPath(projection, ctx);

    const resize = () => {
      size = stage.clientWidth;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = size * ratio;
      canvas.height = size * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      projection.scale(size * 0.405).translate([size / 2, size / 2]);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    resize();
    const observer = new IntersectionObserver(([entry]) => {
      engine.inView = entry.isIntersecting;
    });
    observer.observe(stage);
    const motionChange = () => {
      engine.reduced = media.matches;
      if (media.matches) {
        engine.paused = true;
        setPaused(true);
      }
    };
    motionChange();
    media.addEventListener("change", motionChange);

    fetch("/geo/countries-110m.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Globe data unavailable");
        return response.json();
      })
      .then(
        (
          topology: Topology<{
            countries: GeometryCollection;
            land: GeometryCollection;
          }>,
        ) => {
          if (disposed) return;
          land = feature(topology, topology.objects.land);
          borders = mesh(
            topology,
            topology.objects.countries,
            (a, b) => a !== b,
          );
        },
      )
      .catch(() => {
        if (!disposed) setAvailable(false);
      });

    function render(now: number) {
      if (disposed || !ctx || !canvas) return;
      frame = requestAnimationFrame(render);
      const delta = Math.min(now - (last || now), 50);
      if (now - last < 32) return;
      last = now;
      if (document.hidden || !engine.inView) return;
      if (!engine.paused && !engine.hovered && !engine.dragging) {
        tourElapsed += delta;
        engine.target[0] += delta * 0.0018;
        if (tourElapsed > 6500) {
          tourElapsed = 0;
          const index = (engine.active + 1) % locations.length;
          engine.active = index;
          engine.target = [
            -locations[index].coordinates[0],
            -locations[index].coordinates[1] + 12,
          ];
          setActive(index);
        }
      }
      if (!engine.dragging) {
        const distance =
          ((((engine.target[0] - engine.rotation[0] + 180) % 360) + 360) %
            360) -
          180;
        const ease = engine.reduced ? 1 : 0.055;
        engine.rotation[0] += distance * ease;
        engine.rotation[1] += (engine.target[1] - engine.rotation[1]) * ease;
      }
      projection.rotate(engine.rotation);
      const radius = size * 0.405;
      const center = size / 2;
      ctx.clearRect(0, 0, size, size);

      // Natural Earth geography rendered as an orthographic sphere.
      const halo = ctx.createRadialGradient(
        center,
        center,
        radius * 0.92,
        center,
        center,
        radius * 1.16,
      );
      halo.addColorStop(0, "rgba(128,166,222,0)");
      halo.addColorStop(0.48, "rgba(103,140,190,0.13)");
      halo.addColorStop(1, "rgba(103,140,190,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, size, size);
      ctx.beginPath();
      path({ type: "Sphere" });
      const ocean = ctx.createRadialGradient(
        center - radius * 0.4,
        center - radius * 0.5,
        0,
        center,
        center,
        radius * 1.2,
      );
      ocean.addColorStop(0, "#1d3046");
      ocean.addColorStop(0.6, "#0d1827");
      ocean.addColorStop(1, "#050910");
      ctx.fillStyle = ocean;
      ctx.fill();
      ctx.save();
      ctx.clip();

      ctx.beginPath();
      path(grid);
      ctx.strokeStyle = "rgba(138,170,199,0.13)";
      ctx.lineWidth = 0.6;
      ctx.stroke();
      if (land) {
        ctx.beginPath();
        path(land);
        const continents = ctx.createLinearGradient(0, 0, size, size);
        continents.addColorStop(0, "#9b9274");
        continents.addColorStop(0.5, "#586761");
        continents.addColorStop(1, "#243b45");
        ctx.fillStyle = continents;
        ctx.fill();
        ctx.lineWidth = 0.65;
        ctx.strokeStyle = "rgba(213,219,191,0.38)";
        ctx.stroke();
      }
      if (borders) {
        ctx.beginPath();
        path(borders);
        ctx.lineWidth = 0.45;
        ctx.strokeStyle = "rgba(13,24,35,0.45)";
        ctx.stroke();
      }
      // Great-circle connections between the ministry's locations.
      for (const location of locations.slice(1)) {
        ctx.beginPath();
        path({
          type: "LineString",
          coordinates: [locations[0].coordinates, location.coordinates],
        });
        ctx.setLineDash([2, 5]);
        ctx.strokeStyle = "rgba(230,195,136,0.48)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
      }
      const shade = ctx.createRadialGradient(
        center - radius * 0.5,
        center - radius * 0.5,
        radius * 0.15,
        center,
        center,
        radius * 1.05,
      );
      shade.addColorStop(0, "rgba(5,9,16,0)");
      shade.addColorStop(0.65, "rgba(5,9,16,0.1)");
      shade.addColorStop(1, "rgba(5,9,16,0.8)");
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, size, size);
      ctx.restore();
      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.strokeStyle = "rgba(164,191,213,0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();

      for (let index = 0; index < locations.length; index++) {
        const pin = pinsRef.current[index];
        const coordinates = locations[index].coordinates;
        const visible =
          geoDistance(coordinates, [-engine.rotation[0], -engine.rotation[1]]) <
          Math.PI / 2.05;
        const point = projection(coordinates);
        if (!pin || !point) continue;
        pin.style.visibility = visible ? "visible" : "hidden";
        pin.style.transform = `translate(${point[0]}px, ${point[1]}px)`;
        pin.style.zIndex = index === engine.active ? "5" : "3";
        const label = pin.lastElementChild as HTMLElement | null;
        if (label) {
          const rightAligned =
            point[0] > size - 110 ||
            (locations[index].slug === "calgary" && point[0] > 110);
          label.style.left = rightAligned
            ? "auto"
            : locations[index].slug === "dallas"
              ? "20px"
              : "33px";
          label.style.right = rightAligned ? "32px" : "auto";
        }
      }
    }
    frame = requestAnimationFrame(render);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      controller.abort();
      resizeObserver.disconnect();
      observer.disconnect();
      media.removeEventListener("change", motionChange);
    };
  }, [locations]);

  const current = locations[active];
  return (
    <section
      className="globe-experience"
      aria-label="Explore KingsWord locations"
    >
      <div className="globe-copy">
        <p className="kw-kicker">
          <span className="status-dot" /> A global family. A personal welcome.
        </p>
        <h1>
          One Word.
          <br />
          One Spirit.
          <br />
          <em>Everywhere.</em>
        </h1>
        <p className="globe-intro">
          Different cities. One extraordinary family.
          <br />
          Find your place in the KingsWord story.
        </p>
        <a href="#our-locations" className="kw-button kw-button-light">
          Find your community <ArrowUpRight size={18} />
        </a>
      </div>

      <div className="globe-visual">
        <div className="globe-coordinate">
          CONNECTED BY FAITH <span>EST. 1997</span>
        </div>
        <div className="globe-stage" ref={stageRef}>
          <canvas
            ref={canvasRef}
            aria-label="Rotating globe showing KingsWord churches. Use the location buttons below or select a map marker."
            role="img"
            onPointerDown={(event) => {
              const e = engineRef.current;
              e.dragging = true;
              e.lastX = event.clientX;
              e.lastY = event.clientY;
              e.paused = true;
              setPaused(true);
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              const e = engineRef.current;
              if (!e.dragging) return;
              e.rotation[0] += (event.clientX - e.lastX) * 0.3;
              e.rotation[1] = Math.max(
                -65,
                Math.min(65, e.rotation[1] - (event.clientY - e.lastY) * 0.25),
              );
              e.target = [...e.rotation];
              e.lastX = event.clientX;
              e.lastY = event.clientY;
            }}
            onPointerUp={() => {
              engineRef.current.dragging = false;
            }}
            onPointerCancel={() => {
              engineRef.current.dragging = false;
            }}
          />
          {locations.map((location, index) => (
            <Link
              key={location.slug}
              href={location.href}
              ref={(node) => {
                pinsRef.current[index] = node;
              }}
              className={`globe-pin ${active === index ? "is-active" : ""} pin-${location.slug}`}
              aria-label={`Visit KingsWord ${location.name}`}
              onPointerEnter={() => {
                engineRef.current.hovered = true;
              }}
              onPointerLeave={() => {
                engineRef.current.hovered = false;
              }}
              onFocus={() => {
                engineRef.current.hovered = true;
              }}
              onBlur={() => {
                engineRef.current.hovered = false;
              }}
            >
              <span className="globe-pin-dot" />
              <span className="globe-pin-label">
                {location.name}
                <MoveUpRight size={11} />
              </span>
            </Link>
          ))}
          {!available && (
            <p className="globe-fallback">
              Explore our locations using the buttons below.
            </p>
          )}
        </div>
        <div className="globe-tools">
          <span>Drag to explore · Select a location</span>
          <div>
            <button
              aria-label={paused ? "Play globe tour" : "Pause globe tour"}
              onClick={() => {
                engineRef.current.paused = !paused;
                setPaused(!paused);
              }}
            >
              {paused ? <Play size={15} /> : <Pause size={15} />}
            </button>
            <button aria-label="Reset globe view" onClick={() => select(0)}>
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
      </div>

      <div
        className="globe-highlight"
        onPointerEnter={() => {
          engineRef.current.hovered = true;
        }}
        onPointerLeave={() => {
          engineRef.current.hovered = false;
        }}
        onFocus={() => {
          engineRef.current.hovered = true;
        }}
        onBlur={() => {
          engineRef.current.hovered = false;
        }}
      >
        <div className="globe-highlight-image">
          <Image src={current.image} alt={current.caption} fill sizes="100px" />
        </div>
        <div className="globe-highlight-copy">
          <span>In focus · {current.region}</span>
          <h2>{current.name}</h2>
          <p>{current.headline}</p>
          <Link href={current.href}>
            Discover {current.name} <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="globe-location-bar">
        <span className="globe-bar-label">
          EXPLORE OUR WORLD <ArrowRight size={15} />
        </span>
        <div>
          {locations.map((location, index) => (
            <button
              key={location.slug}
              className={active === index ? "is-active" : ""}
              aria-pressed={active === index}
              onClick={() => select(index)}
            >
              <span>0{index + 1}</span>
              {location.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
