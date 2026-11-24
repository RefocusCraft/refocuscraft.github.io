(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.result-row').forEach(row => {
    const video = row.querySelector('.result-video');
    const fps = Number(row.dataset.fps);
    const number = row.dataset.case;
    const cells = Array.from(row.querySelectorAll('.result-cell'));
    const views = cells.map(cell => cell.querySelector('canvas').getContext('2d', { alpha:false }));
    const seek = row.querySelector('.result-seek');
    const frameLabel = row.querySelector('.result-frame');
    const toggle = row.querySelector('.result-toggle');
    const speed = row.querySelector('.result-speed');
    const poster = new Image();
    let posterReady = false;
    let ready = false;
    let scrubbing = false;
    let resume = false;
    let raf = null;
    const draw = () => {
      const frame = ready && video.readyState >= 2 ? video : posterReady ? poster : null;
      if (!frame) return;
      views.forEach((ctx,index) => { if (ctx) ctx.drawImage(frame,index*512,0,512,512,0,0,512,512); });
      const idx = Math.max(0,Math.min(24,Math.floor(video.currentTime*fps+0.001)));
      if (!scrubbing) seek.value = String(idx);
      seek.setAttribute('aria-valuetext',`Frame ${idx+1} of 25`);
      frameLabel.value = `${String(idx+1).padStart(2,'0')} / 25`;
    };
    const updateToggle = () => {
      toggle.textContent = video.paused ? 'Play' : 'Pause';
      toggle.setAttribute('aria-label',`${video.paused ? 'Play' : 'Pause'} comparison case ${number}`);
    };
    const play = async () => { try { await video.play(); } catch (_) { updateToggle(); } };
    const tick = () => { draw(); if (!video.paused) raf = requestAnimationFrame(tick); };
    poster.onload = () => { posterReady = true; draw(); };
    poster.src = `media/fig6-case-${number}/poster.webp`;
    video.muted = true;
    video.addEventListener('loadeddata',() => { ready = true; draw(); if (!reducedMotion) play(); });
    video.addEventListener('play',() => { updateToggle(); if (!('requestVideoFrameCallback' in video)) { if (raf!==null) cancelAnimationFrame(raf); tick(); } });
    video.addEventListener('pause',() => { if (raf!==null) cancelAnimationFrame(raf); raf=null; draw(); updateToggle(); });
    video.addEventListener('seeked',draw);
    video.addEventListener('timeupdate',draw);
    video.addEventListener('error',() => { row.querySelector('.result-error').hidden=false; });
    if ('requestVideoFrameCallback' in video) {
      const callback = () => { draw(); video.requestVideoFrameCallback(callback); };
      video.requestVideoFrameCallback(callback);
    }
    toggle.addEventListener('click',() => video.paused ? play() : video.pause());
    const startSeek = () => { if (scrubbing) return; resume=!video.paused; scrubbing=true; video.pause(); };
    const endSeek = () => { if (!scrubbing) return; scrubbing=false; draw(); if (resume) play(); resume=false; };
    seek.addEventListener('pointerdown',startSeek);
    seek.addEventListener('input',() => { startSeek(); video.currentTime=(Number(seek.value)+0.1)/fps; });
    seek.addEventListener('change',endSeek);
    seek.addEventListener('pointercancel',endSeek);
    seek.addEventListener('blur',endSeek);
    window.addEventListener('pointerup',endSeek);
    speed.addEventListener('change',() => { video.playbackRate = speed.value==='slow' ? 8/fps : 1; });
    cells.forEach(cell => {
      const button=cell.querySelector('.result-enlarge');
      const label=cell.querySelector('figcaption').textContent;
      button.addEventListener('click',async () => {
        try { if (document.fullscreenElement) await document.exitFullscreen(); else if (cell.requestFullscreen) await cell.requestFullscreen(); } catch (_) { /* The full row remains available. */ }
      });
      document.addEventListener('fullscreenchange',() => {
        button.setAttribute('aria-label',`${document.fullscreenElement===cell?'Exit enlarged':'Enlarge'} ${label}, comparison case ${number}`);
      });
    });
  });
})();
