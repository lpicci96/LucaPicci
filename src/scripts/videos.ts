// Demo videos play silently while at least 40% on screen; with reduced motion they stay on their poster.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const video = e.target as HTMLVideoElement;
        if (e.isIntersecting) video.play().catch(() => {});
        else video.pause();
      }),
    { threshold: 0.4 },
  );
  document.querySelectorAll('video[data-autoplay]').forEach((v) => io.observe(v));
}
