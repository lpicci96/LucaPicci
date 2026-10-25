// Types each phrase, holds it, deletes it, then moves on. Static first phrase with reduced motion.
const el = document.querySelector<HTMLElement>('.typed');

if (el && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const phrases: string[] = JSON.parse(el.dataset.phrases ?? '[]');
  let p = 0;
  let n = phrases[0].length;
  let deleting = false;
  const tick = (): void => {
    const text = phrases[p];
    if (!deleting && n === text.length) {
      deleting = true;
      setTimeout(tick, 2400);
      return;
    }
    if (deleting && n === 0) {
      deleting = false;
      p = (p + 1) % phrases.length;
      setTimeout(tick, 350);
      return;
    }
    n += deleting ? -1 : 1;
    el.textContent = phrases[p].slice(0, n);
    setTimeout(tick, deleting ? 28 : 55 + Math.random() * 60);
  };
  setTimeout(tick, 2400);
}
