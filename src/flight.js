export function setupFlight(root){
 const win=root.ownerDocument.defaultView,doc=root.ownerDocument;
 const canvas=root.querySelector('#sword-trails'),sword=root.querySelector('#jade-sword'),mount=root.querySelector('#flight-sword');
 const ctx=canvas.getContext('2d'),reduced=win.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let width=1,height=1,active=false,x=0,y=0,targetX=0,targetY=0,angle=-.35,lastTime=0,lastTrail=0,flightStart=null,hidden=doc.hidden;
 const trail=[],collected=new Set(),streaks=Array.from({length:48},(_,i)=>({angle:i*2.39996,radius:.2+(i%7)/9,speed:.45+(i%5)*.13}));
 const cap=(v,a,b)=>Math.max(a,Math.min(b,v));
 function resize(){const rect=root.getBoundingClientRect();width=rect.width||win.innerWidth;height=rect.height||win.innerHeight;const dpr=Math.min(win.devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);}
 resize();const observer=new win.ResizeObserver(resize);observer.observe(root);
 root.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;const rect=root.getBoundingClientRect();targetX=event.clientX-rect.left;targetY=event.clientY-rect.top;if(!active){x=targetX;y=targetY;}active=true;});
 root.addEventListener('pointerleave',()=>{active=false;});
 root.addEventListener('jijing:flight',()=>{flightStart=win.performance.now();root.dataset.flight='active';root.dataset.flightCount=String(Number(root.dataset.flightCount||0)+1);});
 doc.addEventListener('visibilitychange',()=>{hidden=doc.hidden;if(hidden){active=false;trail.length=0;flightStart=null;delete root.dataset.flight;mount.style.opacity='0';sword.style.opacity='0';ctx?.clearRect(0,0,width,height);}});
 root.querySelectorAll('[data-echo]').forEach(button=>button.addEventListener('click',()=>{
  const n=Number(button.dataset.echo);if(collected.has(n))return;collected.add(n);button.dataset.collected='true';button.setAttribute('aria-pressed','true');
  root.querySelector('#echo-count').textContent=collected.size+' / 3';root.querySelector('[data-echo-copy]').textContent=collected.size===3?'三音已合 · 再御剑一程':'寻三缕玉音';root.querySelector('#reset-echoes').hidden=collected.size!==3;
  root.dataset.echoes=String(collected.size);root.dispatchEvent(new win.CustomEvent('jijing:resonance'));
 }));
 root.querySelector('#reset-echoes').addEventListener('click',()=>{collected.clear();root.dataset.echoes='0';root.querySelector('#echo-count').textContent='0 / 3';root.querySelector('[data-echo-copy]').textContent='寻三缕玉音';root.querySelector('#reset-echoes').hidden=true;root.querySelectorAll('[data-echo]').forEach(b=>{delete b.dataset.collected;b.setAttribute('aria-pressed','false');});});
 function draw(now){
  if(!root.isConnected){observer.disconnect();return;}win.requestAnimationFrame(draw);if(hidden)return;
  const dt=Math.min(.05,Math.max(0,(now-lastTime)/1000));lastTime=now;const panelOpen=root.dataset.scroll==='open';
  const dx=targetX-x,dy=targetY-y;x+=dx*Math.min(1,dt*15);y+=dy*Math.min(1,dt*15);
  if(Math.hypot(dx,dy)>1){const desired=Math.atan2(dy,dx)+Math.PI/2;angle+=Math.atan2(Math.sin(desired-angle),Math.cos(desired-angle))*Math.min(1,dt*9);}
  sword.style.opacity=active&&!panelOpen?'1':'0';sword.style.transform=`translate3d(${x+14}px,${y+18}px,0) rotate(${angle}rad)`;
  if(ctx){ctx.clearRect(0,0,width,height);if(active&&!panelOpen&&!reduced&&now-lastTrail>16){trail.push({x:x+14,y:y+18,born:now});lastTrail=now;}while(trail.length&&(now-trail[0].born>540||trail.length>32))trail.shift();
   if(trail.length>1&&!panelOpen){ctx.save();ctx.lineCap='round';for(let i=1;i<trail.length;i++){const a=trail[i-1],b=trail[i],fade=Math.max(0,1-(now-b.born)/540);ctx.strokeStyle=`rgba(205,254,237,${fade*.48})`;ctx.lineWidth=fade*2;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}ctx.restore();}
  }
  if(flightStart===null)return;
  const t=cap((now-flightStart)/(reduced?240:2000),0,1),ease=1-Math.pow(1-t,3),cx=width*.68,cy=height*.42;
  if(reduced){mount.style.opacity='0';}else{
   const sx=width*.48+(cx-width*.48)*ease,sy=height*.94+(cy-height*.94)*ease,scale=2.8*(1-ease)+.12;
   mount.style.transform=`translate3d(${sx}px,${sy}px,0) rotate(18deg) scale(${scale})`;mount.style.opacity=String(Math.sin(Math.PI*t)*Math.min(1,(1-t)*6));
   if(ctx&&!panelOpen){ctx.save();const intensity=Math.sin(Math.PI*t);for(const line of streaks){const a=line.angle,rad=((line.radius+t*line.speed*2)%1.25),r=rad*Math.max(width,height)*.8,l=(32+rad*160)*intensity;const ox=Math.cos(a),oy=Math.sin(a)*.72;ctx.strokeStyle=`rgba(222,255,242,${intensity*.45*rad})`;ctx.lineWidth=.4+rad*1.4;ctx.beginPath();ctx.moveTo(cx+ox*r,cy+oy*r);ctx.lineTo(cx+ox*(r+l),cy+oy*(r+l));ctx.stroke();}ctx.strokeStyle=`rgba(205,254,237,${intensity*.25})`;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(cx,cy,width*(.1+t*.7),height*(.18+t*.8),-.1,0,Math.PI*2);ctx.stroke();ctx.restore();}
  }
  if(t>=1){flightStart=null;delete root.dataset.flight;mount.style.opacity='0';}
 }
 win.requestAnimationFrame(draw);root.dataset.swordReady='true';
 return {get collected(){return collected.size;}};
}
