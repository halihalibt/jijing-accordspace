import {swordMarkup,swordNames} from './sword-forms.js';
export function setupFlight(root){
 const win=root.ownerDocument.defaultView,doc=root.ownerDocument,q=s=>root.querySelector(s);
 const canvas=q('#sword-trails'),sword=q('#jade-sword'),mount=q('#flight-sword'),mega=q('#cosmic-blade');
 const ctx=canvas.getContext('2d'),reduced=win.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let width=1,height=1,active=false,x=0,y=0,targetX=0,targetY=0,angle=-.35,lastTime=0,lastTrail=0,flightStart=null,cutsceneStart=null,toastUntil=0,hidden=doc.hidden,gravity=0,rainUntil=0,impactSent=false,world='jade',hiddenAt=null;
 const trail=[],collected=new Set(),streaks=Array.from({length:90},(_,i)=>({angle:i*2.39996,radius:.16+(i%9)/11,speed:.4+(i%7)*.15}));
 const cap=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
 const time=()=>win.performance.now(),signal=(name,detail={})=>root.dispatchEvent(new win.CustomEvent('jijing:'+name,{detail}));
 root.dataset.swordLevel='0';root.dataset.world='jade';root.dataset.echoes='0';
 function resize(){const rect=root.getBoundingClientRect();width=rect.width||win.innerWidth;height=rect.height||win.innerHeight;const dpr=Math.min(win.devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);}
 resize();const observer=new win.ResizeObserver(resize);observer.observe(root);
 function setLevel(level){root.dataset.swordLevel=String(level);sword.innerHTML=swordMarkup(level,'cursor-level-'+level);mount.innerHTML=swordMarkup(level,'flight-level-'+level);}
 setLevel(0);
 function reset(){
  cutsceneStart=null;flightStart=null;impactSent=false;rainUntil=0;world='jade';gravity=0;collected.clear();trail.length=0;
  for(const key of ['catPhase','shattered','flight','flightPhase','hitstop'])delete root.dataset[key];
  root.dataset.world='jade';root.dataset.echoes='0';root.style.setProperty('--shake-x','0px');root.style.setProperty('--shake-y','0px');root.style.setProperty('--rush','1');root.style.setProperty('--cosmic-tilt','0deg');
  q('#echo-count').textContent='0 / 3';q('[data-echo-copy]').textContent='三枚玉音 · 三次进化';q('#reset-echoes').hidden=true;
  q('#cataclysm-copy').classList.remove('visible');q('#upgrade-toast').classList.remove('visible');mega.style.opacity='0';mount.style.opacity='0';setLevel(0);
  root.querySelectorAll('[data-echo]').forEach(b=>{delete b.dataset.collected;b.setAttribute('aria-pressed','false');});
 }
 function arrive(){
  world='cosmic';root.dataset.world='cosmic';root.dataset.shattered='true';root.dataset.catPhase='arrived';delete root.dataset.hitstop;delete root.dataset.flight;
  cutsceneStart=null;flightStart=null;mega.style.opacity='0';mount.style.opacity='0';root.style.setProperty('--shake-x','0px');root.style.setProperty('--shake-y','0px');root.style.setProperty('--rush','1');q('#cataclysm-copy').classList.remove('visible');q('#reset-echoes').hidden=false;
  signal('arrival');
 }
 root.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;const rect=root.getBoundingClientRect();targetX=event.clientX-rect.left;targetY=event.clientY-rect.top;if(!active){x=targetX;y=targetY;}active=true;root.style.setProperty('--cosmic-pan-x',((targetX/width-.5)*-22)+'px');root.style.setProperty('--cosmic-pan-y',((targetY/height-.5)*-14)+'px');});
 root.addEventListener('pointerleave',()=>{active=false;});
 root.addEventListener('jijing:flight',()=>{
  if(cutsceneStart!==null)return;
  flightStart=time();root.dataset.flight='active';root.dataset.flightCount=String(Number(root.dataset.flightCount||0)+1);
  if(world==='cosmic')rainUntil=time()+2200;
 });
 doc.addEventListener('visibilitychange',()=>{hidden=doc.hidden;if(hidden){hiddenAt=time();active=false;trail.length=0;sword.style.opacity='0';ctx?.clearRect(0,0,width,height);}else{const pause=hiddenAt===null?0:time()-hiddenAt;if(cutsceneStart!==null)cutsceneStart+=pause;if(flightStart!==null)flightStart+=pause;toastUntil+=pause;rainUntil+=pause;hiddenAt=null;lastTime=time();}});
 root.querySelectorAll('[data-echo]').forEach(button=>button.addEventListener('click',()=>{
  const n=Number(button.dataset.echo);if(collected.has(n)||world!=='jade'||cutsceneStart!==null)return;
  collected.add(n);button.dataset.collected='true';button.setAttribute('aria-pressed','true');const level=collected.size;setLevel(level);
  root.dataset.echoes=String(level);q('#echo-count').textContent=level+' / 3';q('[data-echo-copy]').textContent=['','双刃觉醒 · 再寻一音','剑阵就位 · 最后一音','禁制解除 · 退后亿点'][level];
  q('#upgrade-name').textContent=swordNames[level];q('.upgrade-index').textContent='0'+level+' / ASCENSION';
  q('#upgrade-description').textContent=['','一把不够，那就长出两把。','让剑绕着剑公转。','此剑的尺寸已经违反常识。'][level];q('#upgrade-toast').classList.add('visible');toastUntil=time()+2100;
  signal('resonance');signal('power',{level});
  if(level<3){flightStart=time();root.dataset.flight='active';}else{
   cutsceneStart=time();flightStart=null;impactSent=false;root.dataset.catPhase='charging';root.dataset.cataclysmCount=String(Number(root.dataset.cataclysmCount||0)+1);q('#cataclysm-copy').classList.add('visible');
  }
 }));
 q('#reset-echoes').addEventListener('click',reset);q('#return-jade').addEventListener('click',reset);q('#skip-cataclysm').addEventListener('click',arrive);
 q('#invert-gravity').addEventListener('click',()=>{if(world!=='cosmic')return;gravity+=180;root.style.setProperty('--cosmic-tilt',gravity+'deg');root.dataset.gravity=String(gravity);signal('power',{level:2});});
 q('#sword-rain').addEventListener('click',()=>{if(world!=='cosmic')return;rainUntil=time()+3600;root.dataset.swordRainCount=String(Number(root.dataset.swordRainCount||0)+1);signal('power',{level:3});});
 function trailPaint(now,level,panelOpen){
  if(!ctx)return;ctx.clearRect(0,0,width,height);if(active&&!panelOpen&&!reduced&&now-lastTrail>16){trail.push({x:x+14,y:y+18,born:now});lastTrail=now;}while(trail.length&&(now-trail[0].born>650||trail.length>38))trail.shift();
  if(trail.length>1&&!panelOpen){ctx.save();ctx.lineCap='round';const colors=['205,254,237','130,246,255','205,173,255','255,212,233'];
   for(let ribbon=0;ribbon<=level;ribbon++)for(let i=1;i<trail.length;i++){const a=trail[i-1],b=trail[i],fade=Math.max(0,1-(now-b.born)/650),off=level?Math.sin(i*.55+now*.006+ribbon*2.3)*(ribbon+1)*4:0;ctx.strokeStyle=`rgba(${colors[level]},${fade*(.45+level*.12)})`;ctx.lineWidth=fade*(1.5+level*.9);ctx.beginPath();ctx.moveTo(a.x+off,a.y-off);ctx.lineTo(b.x+off,b.y-off);ctx.stroke();}
   if(level>=2){const count=level===3?9:4;for(let i=0;i<count;i++){const a=now*.003+i*Math.PI*2/count,r=34+level*8,sx=x+Math.cos(a)*r,sy=y+Math.sin(a)*r*.5;ctx.save();ctx.translate(sx,sy);ctx.rotate(a+.8);ctx.fillStyle=level===3?'#fff2d1':'#d7d1ff';ctx.beginPath();ctx.moveTo(0,-17);ctx.lineTo(3,7);ctx.lineTo(0,12);ctx.lineTo(-3,7);ctx.closePath();ctx.fill();ctx.restore();}}
   ctx.restore();
  }
  if(world==='cosmic'&&!panelOpen&&!reduced){ctx.save();for(let i=0;i<24;i++){const px=((i*.173*width+now*.01*(1+i%3))%width),py=((i*.371*height+Math.sin(now*.0006+i)*18)%height);ctx.fillStyle=i%2?'#ffe8dcaa':'#e8e2ffb0';ctx.fillRect(px,py,i%3+1,i%3+1);}ctx.restore();}
  if(now<rainUntil&&!panelOpen&&!reduced){ctx.save();for(let i=0;i<45;i++){const z=((now*.0015+i*.113)%1),sx=(i*.223%1)*width,sy=z*(height+180)-90;ctx.strokeStyle=`rgba(${level===3?'255,213,233':'205,250,255'},${Math.sin(Math.PI*z)*.85})`;ctx.lineWidth=1+i%3;ctx.beginPath();ctx.moveTo(sx+90,sy-130);ctx.lineTo(sx,sy);ctx.stroke();ctx.fillStyle='#fff7e6';ctx.beginPath();ctx.moveTo(sx-5,sy-8);ctx.lineTo(sx,sy+17);ctx.lineTo(sx+5,sy-8);ctx.fill();}ctx.restore();}
 }
 function tunnel(now,power,cx=width*.68,cy=height*.42){
  if(!ctx||reduced)return;ctx.save();
  for(const line of streaks){const rad=(line.radius+now*.001*line.speed*power)%1.3,r=rad*Math.max(width,height)*.9,len=(55+rad*240)*power,ox=Math.cos(line.angle),oy=Math.sin(line.angle)*.7;ctx.strokeStyle=`rgba(225,250,255,${Math.min(.85,power*.4*rad)})`;ctx.lineWidth=.6+rad*2;ctx.beginPath();ctx.moveTo(cx+ox*r,cy+oy*r);ctx.lineTo(cx+ox*(r+len),cy+oy*(r+len));ctx.stroke();}
  ctx.restore();
 }
 function cinematic(now){
  if(cutsceneStart===null)return;const elapsed=(now-cutsceneStart)*(reduced?10:1);
  const phase=elapsed<650?'charging':elapsed<1150?'windup':elapsed<1370?'slash':elapsed<1540?'hitstop':elapsed<3000?'fracture':elapsed<4800?'transit':'arrived';
  root.dataset.catPhase=phase;root.dataset.hitstop=String(phase==='hitstop');
  if(elapsed>=1370&&!impactSent){impactSent=true;signal('impact');}
  if(elapsed>=1540)root.dataset.shattered='true';
  const g=cap(elapsed/650,0,1);mega.style.opacity=elapsed<3000?'1':'0';
  if(phase==='charging'){mega.style.transform=`translate3d(${width*.82}px,${height*.34}px,0) rotate(-31deg) scale(${lerp(.15,1.08,g)})`;}
  else if(phase==='windup'){const p=(elapsed-650)/500;mega.style.transform=`translate3d(${width*(.82+p*.14)}px,${height*(.34-p*.22)}px,0) rotate(${-31-p*22}deg) scale(${1.08+p*.2})`;}
  else if(phase==='slash'){const p=Math.pow((elapsed-1150)/220,2.7);mega.style.transform=`translate3d(${lerp(width*.96,width*.4,p)}px,${lerp(height*.12,height*.6,p)}px,0) rotate(${lerp(-53,-135,p)}deg) scale(1.28)`;}
  else if(phase==='hitstop'){mega.style.transform=`translate3d(${width*.4}px,${height*.6}px,0) rotate(-135deg) scale(1.28)`;}
  else{const p=cap((elapsed-1540)/850,0,1);mega.style.transform=`translate3d(${lerp(width*.4,-width*.7,p)}px,${lerp(height*.6,height*1.7,p)}px,0) rotate(-135deg) scale(1.28)`;mega.style.opacity=String(1-p);}
  if(elapsed>=1370&&elapsed<2400&&!reduced){const force=(1-(elapsed-1370)/1030)*21;root.style.setProperty('--shake-x',Math.sin(elapsed*.097)*force+'px');root.style.setProperty('--shake-y',Math.cos(elapsed*.127)*force*.7+'px');}else{root.style.setProperty('--shake-x','0px');root.style.setProperty('--shake-y','0px');}
  root.style.setProperty('--rush',String(phase==='windup'?.98:phase==='slash'||phase==='hitstop'?1.09:1));
  if(phase==='transit')tunnel(now,1.9);
  if(ctx&&!reduced&&elapsed>=1150&&elapsed<2200){const alpha=elapsed<1540?1:1-(elapsed-1540)/660;ctx.save();ctx.globalAlpha=alpha;ctx.lineCap='round';ctx.strokeStyle='#bbdcff';ctx.lineWidth=48;ctx.beginPath();ctx.moveTo(width*1.05,-height*.05);ctx.lineTo(-width*.05,height*1.05);ctx.stroke();ctx.strokeStyle='#fff9ea';ctx.lineWidth=9;ctx.stroke();ctx.strokeStyle='#f7e7ff';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(width*.68,height*.42,(elapsed-1150)*.8+20,(elapsed-1150)*.35+10,-.4,0,Math.PI*2);ctx.stroke();ctx.restore();}
  if(elapsed>=4800)arrive();
 }
 function flight(now,level){
  if(flightStart===null)return;const t=cap((now-flightStart)/(reduced?180:1050),0,1),cx=width*.68,cy=height*.42;
  if(!reduced){let sx,sy,scale,rotation;
   if(t<.22){const p=t/.22;sx=width*(.43-.04*p);sy=height*(.78+.13*p);scale=4.6+p*1.3+level*.4;rotation=-20-p*16;root.dataset.flightPhase='anticipation';}
   else if(t<.57){const p=Math.pow((t-.22)/.35,3.3);sx=lerp(width*.39,cx,p);sy=lerp(height*.91,cy,p);scale=lerp(5.9+level*.4,.08,p);rotation=lerp(-36,23,p);root.dataset.flightPhase='burst';tunnel(now,1.3+level*.45);}
   else{sx=cx;sy=cy;scale=.08;rotation=23;root.dataset.flightPhase='impact';if(ctx){ctx.save();ctx.strokeStyle=level>1?'#edcaff':'#dbfff0';ctx.lineWidth=3;ctx.globalAlpha=1-(t-.57)/.43;ctx.beginPath();ctx.ellipse(cx,cy,30+(t-.57)*width,20+(t-.57)*height*.7,0,0,Math.PI*2);ctx.stroke();ctx.restore();}}
   mount.style.transform=`translate3d(${sx}px,${sy}px,0) rotate(${rotation}deg) scale(${scale})`;mount.style.opacity=t<.59?'1':'0';
   const force=t>.54&&t<.78?(1-(t-.54)/.24)*(8+level*3):0;root.style.setProperty('--shake-x',Math.sin(now*.1)*force+'px');root.style.setProperty('--shake-y',Math.cos(now*.09)*force*.6+'px');root.style.setProperty('--rush',t>.22&&t<.6?'1.07':'1');
  }
  if(t>=1){flightStart=null;delete root.dataset.flight;delete root.dataset.flightPhase;mount.style.opacity='0';root.style.setProperty('--shake-x','0px');root.style.setProperty('--shake-y','0px');root.style.setProperty('--rush','1');}
 }
 function draw(now){
  if(!root.isConnected){observer.disconnect();return;}win.requestAnimationFrame(draw);if(hidden)return;
  const dt=Math.min(.05,Math.max(0,(now-lastTime)/1000));lastTime=now;const panelOpen=root.dataset.scroll==='open',level=collected.size;
  const dx=targetX-x,dy=targetY-y;x+=dx*Math.min(1,dt*19);y+=dy*Math.min(1,dt*19);
  if(Math.hypot(dx,dy)>1){const desired=Math.atan2(dy,dx)+Math.PI/2;angle+=Math.atan2(Math.sin(desired-angle),Math.cos(desired-angle))*Math.min(1,dt*12);}
  sword.style.opacity=active&&!panelOpen&&cutsceneStart===null?'1':'0';sword.style.transform=`translate3d(${x+14}px,${y+18}px,0) rotate(${angle}rad)`;
  if(now>toastUntil)q('#upgrade-toast').classList.remove('visible');trailPaint(now,level,panelOpen);
  if(cutsceneStart!==null)cinematic(now);else flight(now,level);
 }
 win.requestAnimationFrame(draw);root.dataset.swordReady='true';return {get collected(){return collected.size;}};
}
