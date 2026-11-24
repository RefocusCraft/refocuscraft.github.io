(() => {
  'use strict';
  const fps = 24000 / 1001;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const allButton = document.getElementById('toggle-all');
  const speed = document.getElementById('playback-speed');
  const players = [];
  const updateAllButton = () => {
    allButton.textContent = players.length && players.every(p => !p.video.paused) ? 'Pause all' : 'Play all';
  };
  document.querySelectorAll('.comparison').forEach(card => {
    const video = card.querySelector('video');
    const canvas = card.querySelector('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    const stage = card.querySelector('.comparison-stage');
    const wipe = card.querySelector('.wipe-slider');
    const frames = card.querySelector('.frame-slider');
    const count = card.querySelector('.frame-count');
    const toggle = card.querySelector('.clip-toggle');
    const enlarge = card.querySelector('.enlarge');
    const poster = new Image();
    let posterReady = false;
    let ready = false;
    let resumeAfterSeek = false;
    let isScrubbing = false;
    let split = 0.5;
    let rafId = null;
    const n = card.dataset.example;
    const draw = () => {
      const frame = ready && video.readyState >= 2 ? video : posterReady ? poster : null;
      if (!frame || !ctx) return;
      ctx.drawImage(frame, 0, 0, 512, 512, 0, 0, 512, 512);
      ctx.save();
      ctx.beginPath();
      ctx.rect(split * 512, 0, (1 - split) * 512, 512);
      ctx.clip();
      ctx.drawImage(frame, 512, 0, 512, 512, 0, 0, 512, 512);
      ctx.restore();
      const idx = Math.max(0, Math.min(24, Math.floor(video.currentTime * fps + 0.001)));
      if (!isScrubbing) frames.value = String(idx);
      frames.setAttribute('aria-valuetext', `Frame ${idx + 1} of 25`);
      count.value = `${String(idx + 1).padStart(2, '0')} / 25`;
    };
    const tick = () => { draw(); if (!video.paused && !('requestVideoFrameCallback' in video)) rafId = requestAnimationFrame(tick); };
    const updateButton = () => {
      toggle.textContent = video.paused ? 'Play' : 'Pause';
      toggle.setAttribute('aria-label', `${video.paused ? 'Play' : 'Pause'} example ${n}`);
      updateAllButton();
    };
    const play = async () => {
      try { await video.play(); } catch (_) { updateButton(); }
    };
    poster.onload = () => { posterReady = true; draw(); };
    poster.src = `media/teaser-${n}/poster.webp`;
    video.muted = true;
    video.playbackRate = Number(speed.value);
    video.addEventListener('loadeddata', () => {
      ready = true; draw();
      if (!reduceMotion) play();
    });
    video.addEventListener('play', () => { if (rafId !== null) cancelAnimationFrame(rafId); tick(); updateButton(); });
    video.addEventListener('pause', () => { if (rafId !== null) cancelAnimationFrame(rafId); rafId = null; draw(); updateButton(); });
    video.addEventListener('seeked', draw);
    video.addEventListener('timeupdate', draw);
    video.addEventListener('error', () => { card.querySelector('.media-error').hidden = false; });
    if ('requestVideoFrameCallback' in video) {
      const onFrame = () => { draw(); video.requestVideoFrameCallback(onFrame); };
      video.requestVideoFrameCallback(onFrame);
    }
    wipe.addEventListener('input', () => {
      split = Number(wipe.value) / 100;
      stage.style.setProperty('--split', `${Number(wipe.value)}%`);
      stage.querySelector('.source-label').style.opacity = split > 0.13 ? '1' : '0';
      stage.querySelector('.result-label').style.opacity = split < 0.74 ? '1' : '0';
      wipe.setAttribute('aria-valuetext', `${Math.round(split * 100)} percent Source, ${Math.round((1 - split) * 100)} percent RefocusCraft`);
      draw();
    });
    toggle.addEventListener('click', () => video.paused ? play() : video.pause());
    const beginScrub = () => {
      if (isScrubbing) return;
      resumeAfterSeek = !video.paused;
      isScrubbing = true;
      video.pause();
    };
    const endScrub = () => {
      if (!isScrubbing) return;
      isScrubbing = false;
      draw();
      if (resumeAfterSeek) play();
      resumeAfterSeek = false;
    };
    frames.addEventListener('pointerdown', beginScrub);
    frames.addEventListener('input', () => {
      beginScrub();
      video.currentTime = (Number(frames.value) + 0.1) / fps;
    });
    frames.addEventListener('change', endScrub);
    frames.addEventListener('pointercancel', endScrub);
    frames.addEventListener('blur', endScrub);
    window.addEventListener('pointerup', endScrub);
    const updateEnlarge = () => {
      const active = document.fullscreenElement === card;
      enlarge.textContent = active ? 'Exit' : 'Enlarge';
      enlarge.setAttribute('aria-label', `${active ? 'Exit enlarged' : 'Enlarge'} example ${n}`);
    };
    enlarge.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else if (card.requestFullscreen) await card.requestFullscreen();
      } catch (_) { /* Inline comparison remains available. */ }
    });
    document.addEventListener('fullscreenchange', updateEnlarge);
    players.push({ video, play });
  });
  allButton.addEventListener('click', () => {
    if (players.every(p => !p.video.paused)) players.forEach(p => p.video.pause());
    else players.forEach(p => p.play());
  });
  speed.addEventListener('change', () => players.forEach(p => { p.video.playbackRate = Number(speed.value); }));
  const dialog = document.getElementById('method-dialog');
  document.querySelector('.method-zoom').addEventListener('click', () => dialog.showModal());
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
})();
