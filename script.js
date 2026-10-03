gsap.registerPlugin(ScrollTrigger);

// Always start at the top so the van and cards begin in their starting state
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
ScrollTrigger.clearScrollMemory("manual");
window.addEventListener("beforeunload", () => window.scrollTo(0, 0));
window.scrollTo(0, 0);

const road = document.getElementById("road");
const van = document.getElementById("van");
const trail = document.getElementById("trail");
const letters = gsap.utils.toArray(".ch");
const stats = gsap.utils.toArray(".stat");

/* Intro animation (time-based, runs once on load) */
const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
intro
  .from(letters, { y: 50, opacity: 0, duration: 0.9, stagger: 0.05 })
  .from(".topbar", { y: -20, opacity: 0, duration: 0.7 }, 0)
  .from(road, { opacity: 0, duration: 0.8 }, 0.4);

/*  2. Scroll-driven animation */
// Measurements are taken once (and on resize), never inside the scroll loop.
let vanW = 0,
  endX = 0,
  roadW = 0;
let letterX = [],
  revealAt = []; // revealAt = van progress (0 to 1) at which each card appears
const litState = new Array(letters.length).fill(false);
const onState = new Array(stats.length).fill(false);

// One paused "swipe up + fade in" tween per card. It plays when the van reaches
// the card and reverses when the user scrolls back. Cards start fully hidden.
const statTweens = stats.map((el) =>
  gsap.fromTo(
    el,
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", paused: true },
  ),
);

function measure() {
  const r = road.getBoundingClientRect();
  roadW = r.width;
  vanW = van.getBoundingClientRect().width;
  endX = Math.max(0, roadW - vanW); // the van starts fully visible at the left and parks at the right edge
  // x-centre of each letter / stat, relative to the road's left edge
  letterX = letters.map((el) => {
    const b = el.getBoundingClientRect();
    return b.left + b.width / 2 - r.left;
  });
  // Cards appear one by one, in order, after the van has passed them.
  // Never before 14% progress, so no card shows at the start.
  let prev = 0.08;
  revealAt = stats.map((el) => {
    const b = el.getBoundingClientRect();
    const cx = b.left + b.width / 2 - r.left;
    const raw = (cx - vanW * 0.5) / (endX + vanW * 0.5);
    prev = Math.min(0.95, Math.max(raw, prev + 0.06));
    return prev;
  });
}

const setTrail = gsap.quickSetter(trail, "scaleX");

function update() {
  const x = gsap.getProperty(van, "x");
  const p = endX > 0 ? Math.min(1, Math.max(0, x / endX)) : 0; // van progress, 0 to 1
  // Pointer moves from the van's centre (start) to its front (end), so the
  // headline is fully coloured when the van parks at the right edge.
  const noseX = x + vanW * (0.5 + 0.5 * p);
  setTrail(Math.max(0, Math.min(1, noseX / roadW)));
  // Toggle classes only when a state actually changes (cheap per frame)
  for (let i = 0; i < letters.length; i++) {
    const hit = noseX >= letterX[i];
    if (hit !== litState[i]) {
      litState[i] = hit;
      letters[i].classList.toggle("lit", hit);
    }
  }
  for (let i = 0; i < stats.length; i++) {
    const hit = p >= revealAt[i];
    if (hit !== onState[i]) {
      onState[i] = hit;
      hit ? statTweens[i].play() : statTweens[i].reverse();
    }
  }
}

measure();

gsap.fromTo(
  van,
  { x: 0 },
  {
    x: () => endX,
    immediateRender: true,
    ease: "none",
    onUpdate: update,
    scrollTrigger: {
      trigger: "#scroll",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2, // smooth catch-up: the van eases toward the scroll position
      invalidateOnRefresh: true,
      onRefresh: () => {
        measure();
        update();
      },
    },
  },
);

// Gentle suspension bob and tilt while moving, tied to scroll progress too
gsap.to(van, {
  y: 3,
  rotation: 0.6,
  ease: "sine.inOut",
  yoyo: true,
  repeat: 9,
  scrollTrigger: {
    trigger: "#scroll",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.2,
  },
});
