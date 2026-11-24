(() => {
  'use strict';
  const data=window.REFOCUS_EVIDENCE;
  if (!data) return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const attachVisibility=(node,video,shouldPlay) => {
    if (!('IntersectionObserver' in window)) return { visible:true };
    const state={visible:false};
    const observer=new IntersectionObserver(entries => {
      state.visible=entries[0].isIntersecting;
      if (!state.visible) video.pause();
      else if (shouldPlay()) video.play().catch(()=>{});
    },{rootMargin:'120px 0px'});
    observer.observe(node);return state;
  };
  class CropPlayer {
    constructor(node,item) {
      this.node=node;this.video=node.querySelector('video');this.context=node.querySelector('.evidence-context-image');
      this.title=node.querySelector('.evidence-case-title');this.note=node.querySelector('.evidence-note');this.toggle=node.querySelector('.evidence-toggle');this.seek=node.querySelector('.evidence-seek');this.output=node.querySelector('.evidence-frame');
      this.canvases=Array.from(node.querySelectorAll('canvas'));this.contexts=this.canvases.map(c=>c.getContext('2d',{alpha:false}));
      this.item=item;this.ready=false;this.posterReady=false;this.intent=!reduced;this.scrubbing=false;this.resume=false;this.raf=null;this.token=0;this.poster=new Image();
      this.visibility=attachVisibility(node,this.video,()=>this.intent&&this.ready&&!this.scrubbing);
      this.video.muted=true;
      this.video.addEventListener('loadeddata',()=>{this.ready=true;this.video.currentTime=Math.min(this.pendingTime||0,4.8);this.draw();if(this.intent&&this.visibility.visible)this.play();});
      this.video.addEventListener('play',()=>{this.update();if(!('requestVideoFrameCallback' in this.video)){if(this.raf!==null)cancelAnimationFrame(this.raf);this.tick();}});
      this.video.addEventListener('pause',()=>{if(this.raf!==null)cancelAnimationFrame(this.raf);this.raf=null;this.draw();this.update();});
      this.video.addEventListener('seeked',()=>this.draw());this.video.addEventListener('timeupdate',()=>this.draw());
      this.video.addEventListener('error',()=>{node.querySelector('.evidence-error').hidden=false;});
      if('requestVideoFrameCallback' in this.video){const frame=()=>{this.draw();this.video.requestVideoFrameCallback(frame);};this.video.requestVideoFrameCallback(frame);}
      this.toggle.addEventListener('click',()=>{this.intent=this.video.paused;if(this.intent)this.play();else this.video.pause();});
      const start=()=>{if(this.scrubbing)return;this.resume=!this.video.paused;this.scrubbing=true;this.video.pause();};
      const end=()=>{if(!this.scrubbing)return;this.scrubbing=false;this.draw();if(this.resume)this.play();this.resume=false;};
      this.seek.addEventListener('pointerdown',start);this.seek.addEventListener('input',()=>{start();this.video.currentTime=(Number(this.seek.value)+.1)/5;});
      this.seek.addEventListener('change',end);this.seek.addEventListener('blur',end);this.seek.addEventListener('pointercancel',end);window.addEventListener('pointerup',end);
      node.querySelectorAll('.evidence-cell').forEach((cell,index)=>{
        const button=cell.querySelector('button');button.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await cell.requestFullscreen();}catch(_){}});
        document.addEventListener('fullscreenchange',()=>button.setAttribute('aria-label',`${document.fullscreenElement===cell?'Exit enlarged':'Enlarge'} ${data.methods[index]} crop`));
      });
      this.load(item,false);
    }
    play(){this.video.play().catch(()=>this.update());}
    update(){this.toggle.textContent=this.video.paused?'Play':'Pause';this.toggle.setAttribute('aria-label',`${this.video.paused?'Play':'Pause'} ${this.node.dataset.evidencePlayer} comparison`);}
    tick(){this.draw();if(!this.video.paused)this.raf=requestAnimationFrame(()=>this.tick());}
    load(item,keepTime=true){
      const time=keepTime?(this.ready?this.video.currentTime:(this.pendingTime||0)):0;this.ready=false;this.posterReady=false;this.item=item;this.pendingTime=time;this.video.pause();this.video.src=item.video;this.video.load();
      this.context.src=item.context;this.title.textContent=item.title;this.note.textContent=item.description+' Click a crop to enlarge.';
      this.canvases.forEach(c=>{c.width=item.crop;c.height=item.crop;});
      const token=++this.token;const poster=new Image();this.poster=poster;poster.onload=()=>{if(token!==this.token)return;this.posterReady=true;this.draw();};poster.src=item.poster;
      this.node.querySelector('.evidence-error').hidden=true;
    }
    draw(){
      const frame=this.ready&&this.video.readyState>=2?this.video:this.posterReady?this.poster:null;if(!frame)return;
      this.contexts.forEach((ctx,index)=>{if(ctx)ctx.drawImage(frame,index*this.item.crop,0,this.item.crop,this.item.crop,0,0,this.item.crop,this.item.crop);});
      const n=Math.max(0,Math.min(24,Math.floor(this.video.currentTime*5+.001)));if(!this.scrubbing)this.seek.value=String(n);
      this.seek.setAttribute('aria-valuetext',`Frame ${n+1} of 25`);this.output.value=`${String(n+1).padStart(2,'0')} / 25`;
    }
  }
  const details=new CropPlayer(document.querySelector('[data-evidence-player="details"]'),data.details[0]);
  new CropPlayer(document.querySelector('[data-evidence-player="temporal"]'),data.temporal);
  document.querySelectorAll('[data-detail]').forEach(button=>button.addEventListener('click',()=>{
    const item=data.details.find(x=>x.id===button.dataset.detail);details.load(item);
    document.querySelectorAll('[data-detail]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  }));
  const lab=document.querySelector('.focus-lab'),video=document.getElementById('focus-control-video'),slider=document.getElementById('blur-strength'),label=document.getElementById('strength-label'),stateLabel=document.getElementById('focus-state');
  let focus='near',strength=1,pending=0,ready=false,intent=!reduced,programmatic=false;
  const vis=attachVisibility(lab,video,()=>intent&&ready);
  video.muted=true;
  video.addEventListener('loadeddata',()=>{ready=true;video.currentTime=Math.min(pending,4.8);programmatic=false;if(intent&&vis.visible)video.play().catch(()=>{});});
  video.addEventListener('play',()=>{if(!programmatic)intent=true;});
  video.addEventListener('pause',()=>{if(!programmatic&&vis.visible&&ready)intent=false;});
  const updateControl=()=>{
    if(ready){pending=Number.isFinite(video.currentTime)?video.currentTime:pending;if(vis.visible)intent=!video.paused;}programmatic=true;ready=false;video.pause();
    const item=data.control.variants.find(x=>x.focus===focus&&x.strength===strength);const row=data.control.focusRows.find(x=>x.id===focus);const level=data.control.strengths[strength];
    video.poster=item.poster;video.src=item.video;video.load();label.value=level.label;slider.setAttribute('aria-valuetext',`${level.label} blur strength`);stateLabel.textContent=`${row.label} focus · ${level.label} blur`;
    lab.querySelectorAll('.lab-focus-marker').forEach(marker=>{marker.style.left=`${row.focus_xy[0]/512*100}%`;marker.style.top=`${row.focus_xy[1]/512*100}%`;});
    document.querySelectorAll('[data-focus]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.focus===focus)));
  };
  document.querySelectorAll('[data-focus]').forEach(button=>button.addEventListener('click',()=>{focus=button.dataset.focus;updateControl();}));
  slider.addEventListener('input',()=>{strength=Number(slider.value);updateControl();});
  updateControl();
})();
