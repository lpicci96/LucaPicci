// Hovering a story's image or title with a mouse highlights the title. Taps don't, so nothing sticks on touch screens.
document.querySelectorAll<HTMLElement>('.group [data-i]').forEach((el) => {
  const pair = el.closest('.group')!.querySelectorAll(`[data-i="${el.dataset.i}"]`);
  el.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse') pair.forEach((p) => p.classList.add('hl'));
  });
  el.addEventListener('pointerleave', () => pair.forEach((p) => p.classList.remove('hl')));
});
