# Portrait homepage hero

`PortraitHero.tsx` introduces the portfolio on `/`. The existing specialization, projects, stack, activity, about and contact sections follow it. `/preview/portrait` redirects to the homepage.

## Particle scene

The dynamically loaded WebGL 2 engine in `particles/particle-scene.js` reads the original photo point cloud from `public/portrait/portrait.bin`. The colors remain intact, including the red shirt. `public/portrait/fallback.png` supplies the initial image and remains visible when WebGL 2 is unavailable.

Scroll over the canvas, swipe vertically on it, or focus it and use arrow keys to cycle Portrait, Orbit, Sphere, Helix, Torus, Heart, Wave and Galaxy. Escape restores Portrait. Scrolling elsewhere moves through the page normally. Clicking the current shape or pressing Space disperses the particles; each particle stays within 0.75 scene units of its animated target and gradually reforms. Horizontal dragging tilts the scene.

The pause control stops animation. The engine respects reduced motion, pauses offscreen and in hidden tabs, aborts pending requests, and releases graphics resources on unmount.

## Link interactions

View projects rolls its label and arrow on desktop hover or keyboard focus. Résumé draws an underline and lifts its arrow diagonally. Selected Work links reveal individually as they enter the viewport and replay on return.

`HeroTapLink.tsx` adds distinct touch feedback: a spring press for View projects, an arrow launch for Résumé, a ripple for RunbookOS, a sweep for CodeShift AI, and a rotating arrow for LoopOS. Project feedback begins on pointer down and cancels during a swipe. Résumé plays its launch on a confirmed click or tap, then opens the destination after the animation finishes. Reduced motion uses brief feedback. Mobile link targets are at least 44 pixels tall.

`useAnimatedNavigation` also coordinates the contact email, footer résumé buttons, navigation résumé links and GitHub profile link. It waits for their finite CSS/Web Animations, guards repeated clicks and cancels pending navigation on unmount. Ctrl/Cmd/Shift/Alt clicks retain native browser behavior. If a delayed new tab is blocked, the destination opens in the current tab after the animation.

## Local verification

Run `npm run dev` and open `http://localhost:3000/`. Check desktop hover, keyboard navigation, mobile taps, shape changes, normal page scrolling, reduced motion and the static image fallback. Run `npx tsc --noEmit` and lint the changed components before committing.
