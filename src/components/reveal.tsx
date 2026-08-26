"use client";

import { useEffect, useRef } from "react";

/**
 * Reveals its children once they scroll into view.
 *
 * The existing `.reveal` class animates on page load, which is right for the
 * hero and wrong for everything below the fold — by the time a section is
 * scrolled to, its animation finished long ago and the page arrives inert.
 *
 * Two deliberate choices:
 *
 * The hidden state is applied by the effect (`data-armed`), never in the
 * server-rendered markup. If the script fails or never runs, the content
 * renders plainly instead of staying invisible; a reveal is not worth risking a
 * blank page over.
 *
 * The attributes are written straight to the node rather than held in React
 * state. Nothing else depends on whether a section has appeared, so putting it
 * in state would re-render the subtree to change one attribute — and setting
 * state from an effect is exactly what `react-hooks/set-state-in-effect` warns
 * about.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    node.dataset.armed = "true";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-shown", "true");
            observer.disconnect();
          }
        }
      },
      // Fires a little before the section reaches the fold, so the movement has
      // settled by the time it is properly in view rather than during reading.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
