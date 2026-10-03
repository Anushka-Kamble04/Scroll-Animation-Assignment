# ShopNest Festival Sale: Scroll-Driven Hero Section

A hero section for a fictional e-commerce sale. A delivery van drives across the screen as you scroll, filling in the headline and revealing the offer cards one by one.

## Live Demo

[Live demo](https://anushka-kamble04.github.io/Scroll-Animation-Assignment/)

## Features

- Letter-spaced "FESTIVAL SALE" headline with four offer cards below it.
- Intro animation on load: the top bar and headline letters fade and rise in with a stagger.
- Scroll-driven van built as an inline SVG. Its position follows scroll progress, with smoothing from ScrollTrigger's `scrub`.
- Headline letters fill with colour as the van passes, and a trail grows behind it.
- Offer cards start hidden, then swipe up and fade in one by one (and reverse when scrolling back).
- Responsive layout, and the scroll position resets on refresh.

## Tech Stack

HTML, CSS, JavaScript and [GSAP](https://gsap.com/) (with ScrollTrigger). No build step.

## Project Structure

```
├── index.html   # Page structure
├── style.css    # Styling and layout
├── script.js    # GSAP animations
└── README.md
```

## Run Locally

Open `index.html` in a browser (an internet connection is needed to load GSAP and the font).

## Performance Notes

- Only `transform` and `opacity` are animated, which avoids layout reflows.
- Element positions are measured once (and on resize), not on every scroll event.
- Classes and tweens change only when a state actually changes.
