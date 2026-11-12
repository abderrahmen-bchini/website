// =========================
// PROJECT BELT (horizontal carousel)
// =========================
(() => {
  const track = document.getElementById("project-track");
  const prev = document.querySelector(".belt-prev");
  const next = document.querySelector(".belt-next");

  if (!track || !prev || !next) return;

  const cards = Array.from(track.querySelectorAll(".project-card"));
  if (!cards.length) return;

  // Card positions in the track's scroll coordinates. The browser's snap
  // resting offsets can differ from these by a few px (padding/rounding),
  // so navigation is index-based: nearest card -> step -> scroll, and the
  // snap is free to fine-tune the final position.
  const stops = () => {
    const base = cards[0].offsetLeft;
    return cards.map((c) => c.offsetLeft - base);
  };

  function maxScroll() {
    return track.scrollWidth - track.clientWidth;
  }

  function nearestIndex(x, s) {
    let best = 0;
    s.forEach((p, i) => {
      if (Math.abs(p - x) < Math.abs(s[best] - x)) best = i;
    });
    return best;
  }

  // Snap can rest a few px away from the exact edge, so use a tolerance
  // wide enough that an arrow never shows while having nowhere to go.
  function setArrowState(x) {
    prev.disabled = x <= 8;
    next.disabled = x >= maxScroll() - 8;
  }

  function go(direction) {
    const s = stops();
    const i = Math.max(
      0,
      Math.min(nearestIndex(track.scrollLeft, s) + direction, s.length - 1)
    );
    const target = Math.max(0, Math.min(s[i], maxScroll()));

    // No `behavior` here: the track's CSS scroll-behavior decides
    // (smooth normally, auto under prefers-reduced-motion).
    track.scrollTo({ left: target });

    // Reflect the destination immediately so arrows never feel laggy;
    // the scroll listener corrects state during/after the animation.
    setArrowState(target);
  }

  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));

  track.addEventListener("scroll", () => setArrowState(track.scrollLeft), {
    passive: true,
  });
  window.addEventListener("resize", () => setArrowState(track.scrollLeft));

  setArrowState(track.scrollLeft);
})();
