(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const deferred = [...document.querySelectorAll('video[data-src]')];
  const owner = video => video.closest('.comparison, .result-row') || video;
  const load = video => {
    if (!video.dataset.src) return;
    video.src = video.dataset.src;
    delete video.dataset.src;
    video.preload = 'auto';
    video.load();
  };

  // Preserve the original canvas players, but fetch their video only near view.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('video[data-src]').forEach(load);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '400px 0px' });
    new Set(deferred.map(owner)).forEach(group => observer.observe(group));
  } else {
    deferred.forEach(load);
  }

  // Loading from a button remains reliable even before the observer runs.
  document.addEventListener('click', event => {
    event.target.closest('.comparison, .result-row')?.querySelectorAll('video[data-src]').forEach(load);
  }, true);

  const groups = [...document.querySelectorAll('.comparison, .result-row, .focus-motion-card')];
  if ('IntersectionObserver' in window) {
    const visibility = new Map(groups.map(group => [group, false]));
    const resume = new WeakSet();
    const videos = groups.flatMap(group => [...group.querySelectorAll('video')]);
    videos.forEach(video => {
      video.addEventListener('loadeddata', () => {
        const group = owner(video).matches('.focus-motion-card') ? owner(video) : video.closest('.comparison, .result-row, .focus-motion-card');
        if (group && !visibility.get(group) && !video.paused) {
          resume.add(video);
          video.pause();
        }
      });
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        visibility.set(entry.target, entry.isIntersecting);
        entry.target.querySelectorAll('video').forEach(video => {
          if (!entry.isIntersecting && !video.paused) {
            resume.add(video);
            video.pause();
          } else if (entry.isIntersecting && resume.has(video) && !reducedMotion) {
            resume.delete(video);
            video.play().catch(() => {});
          }
        });
      });
    }, { threshold: 0.02 });
    groups.forEach(group => observer.observe(group));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) videos.forEach(video => video.pause());
    });
  }

  // Account for the main video being unavailable without a blank player.
  const hero = document.querySelector('.project-video');
  hero?.addEventListener('error', () => {
    const caption = document.querySelector('.project-video-caption');
    if (caption) {
      caption.textContent = 'The video could not load. ';
      const link = document.createElement('a');
      link.href = 'RefocusCraft.mp4';
      link.textContent = 'Open the video directly';
      caption.append(link);
    }
  });
})();
