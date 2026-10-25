// Header signature: the name is made of dots. They arrive scattered and gather into the name;
// hovering scatters them and they come back together. The real name stays in the page, transparent.
import { select } from 'd3-selection';
import { now, timeout, timer, type Timer } from 'd3-timer';
import { easeCubicInOut, easeCubicOut } from 'd3-ease';
import { nameDots, ROWS } from './dot-letters';

const header = document.querySelector<HTMLElement>('header');
const name = header?.querySelector<HTMLElement>('.name');

if (header && name && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const MOVE = 1500; // every move takes the same time
  const GATHER_AFTER = 1200;
  const phone = matchMedia('(max-width: 720px)');
  const still = matchMedia('(hover: none), (max-width: 720px)').matches; // phones and touch screens: formed, no motion
  const { dots, cols } = nameDots();

  const svg = select(name).append('svg').attr('class', 'dots').attr('aria-hidden', 'true');
  const circles = svg.selectAll('circle').data(dots).join('circle');
  name.classList.add('dotted');

  let step = 0;
  let target: [number, number][] = [];
  let cloud: () => [number, number] = () => [0, 0];
  const layout = () => {
    step = phone.matches ? 3.4 : 4.2;
    const width = cols * step;
    const height = ROWS * step;
    name.style.width = `${width}px`;
    svg.attr('width', width).attr('height', height);
    target = dots.map(([x, y]) => [x * step + step / 2, y * step + step / 2]);
    circles
      .attr('r', step * 0.32)
      .attr('data-tx', (_, i) => target[i][0])
      .attr('data-ty', (_, i) => target[i][1]);
    // a loose cloud around the name
    cloud = () => [-36 + Math.random() * (width + 84), -18 + Math.random() * (height + 36)];
  };
  layout();

  // One value drives everything: spread 0 is the name, 1 a cloud around it.
  let spread = still ? 0 : 1;
  let from = target.map(() => cloud());
  const phase = dots.map(() => Math.random() * 7);
  let tween: { start: number; s0: number; to: number; ease: (k: number) => number } | null = null;
  let loop: Timer | null = null;

  const draw = (t: number) => {
    const e = spread;
    circles
      .attr('cx', (_, i) => {
        const w = (t / 1000) * 0.9 + phase[i]; // gentle hovering while apart
        return target[i][0] + (from[i][0] - target[i][0]) * e + Math.cos(w) * 5 * e;
      })
      .attr('cy', (_, i) => {
        const w = (t / 1000) * 0.9 + phase[i];
        return target[i][1] + (from[i][1] - target[i][1]) * e + Math.sin(w * 1.3) * 3.5 * e;
      });
    svg.attr('opacity', 0.6 + 0.4 * (1 - e));
  };

  const frame = () => {
    const t = now();
    if (tween) {
      const k = Math.min(1, (t - tween.start) / MOVE);
      spread = tween.s0 + (tween.to - tween.s0) * tween.ease(k);
      if (k === 1) {
        if (tween.to === 0) header.dataset.dots = 'formed';
        tween = null;
      }
    }
    draw(t);
    if (!tween && spread === 0) {
      loop?.stop();
      loop = null;
    }
  };

  const go = (to: 0 | 1, ease: (k: number) => number) => {
    tween = { start: now(), s0: spread, to, ease };
    header.dataset.dots = to === 0 ? 'forming' : 'cloud';
    loop ??= timer(frame);
  };

  let gathered = still;
  if (still) {
    header.dataset.dots = 'formed';
    draw(now());
  } else {
    header.dataset.dots = 'cloud';
    loop = timer(frame);
    timeout(() => {
      gathered = true;
      go(0, easeCubicInOut);
    }, GATHER_AFTER);
  }

  // On hover: fly apart at once and stay apart; come back together when the pointer leaves.
  name.addEventListener('pointerenter', (e) => {
    if (still || e.pointerType === 'touch' || !gathered) return;
    if (spread === 0) from = target.map(() => cloud());
    go(1, easeCubicOut);
  });
  name.addEventListener('pointerleave', () => {
    if (!still && gathered && spread > 0) go(0, easeCubicInOut);
  });

  addEventListener('resize', () => {
    layout();
    draw(now());
  });
}
