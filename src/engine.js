
export const canvas = document.querySelector("canvas");
export const keys = {};
export const ctx = canvas.getContext("2d");
// Input
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
window.addEventListener("mouseup", (e) => {
  keys["mouse"] = false;
});
window.addEventListener("mousedown", (e) => {
  keys["mouse"] = true;
});
window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Timing
let last = performance.now();
export let gameframe = 0;
export function img(url) {
  const img = new Image();
  img.src = url
  return img
}
export function init(update, draw) {
  function loop(now) {
    const dt = (now - last) / 1000;
    last = now;
    update(dt);
    draw();
    gameframe++;
    requestAnimationFrame(loop);
  }

  // Start
  requestAnimationFrame(loop);
}
