// Hovering a story's image or title highlights its pair.
document.querySelectorAll<HTMLElement>('.group [data-i]').forEach((el) => {
  const pair = () => document.querySelectorAll(`.group [data-i="${el.dataset.i}"]`);
  el.addEventListener('mouseenter', () => pair().forEach((p) => p.classList.add('hl')));
  el.addEventListener('mouseleave', () => pair().forEach((p) => p.classList.remove('hl')));
});
