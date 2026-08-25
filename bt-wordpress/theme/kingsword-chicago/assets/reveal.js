/**
 * Scroll-reveal for homepage sections.
 *
 * Anything marked .kw-reveal fades up as it enters the viewport. If the
 * visitor prefers reduced motion, or the browser has no IntersectionObserver,
 * every section is shown immediately instead.
 */
(function () {
  "use strict";

  var targets = document.querySelectorAll(".kw-reveal");
  if (!targets.length) {
    return;
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(targets, function (el) {
      el.classList.add("is-in");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px" }
  );

  Array.prototype.forEach.call(targets, function (el) {
    observer.observe(el);
  });
})();
