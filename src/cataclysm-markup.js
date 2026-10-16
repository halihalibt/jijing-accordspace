import {swordMarkup} from './sword-forms.js';
export function cataclysmMarkup(){
 const perimeter=[[0,0],[25,0],[50,0],[75,0],[100,0],[100,33],[100,66],[100,100],[66,100],[33,100],[0,100],[0,66],[0,33]];
 const shards=perimeter.map((a,i)=>{const b=perimeter[(i+1)%perimeter.length],dx=((a[0]+b[0])/2-68)*2.8,dy=((a[1]+b[1])/2-42)*2.8;return '<div class="reality-shard" style="clip-path:polygon(68% 42%,'+a[0]+'% '+a[1]+'%,'+b[0]+'% '+b[1]+'%);--shard-x:'+dx+'vw;--shard-y:'+dy+'vh;--shard-turn:'+((i%2?1:-1)*(18+i*7))+'deg;--shard-delay:'+(i%3)*35+'ms"></div>';}).join('');
 return `<div class="impossible-world" aria-hidden="true"><img src="./assets/inverted-star-sea.webp" alt="" class="cosmic-landscape" loading="eager" decoding="async"><div class="cosmic-atmosphere"></div><div class="impossible-orbit orbit-one"></div><div class="impossible-orbit orbit-two"></div></div>
 <div id="world-fragments" aria-hidden="true">${shards}</div><div id="reality-scar" aria-hidden="true"></div><div id="cosmic-blade" aria-hidden="true">${swordMarkup(3,'cosmic-blade-jade')}</div><div class="impact-vignette" aria-hidden="true"></div>
 <div id="upgrade-toast" role="status" aria-live="polite"><span class="upgrade-index"></span><strong id="upgrade-name"></strong><span id="upgrade-description"></span></div>
 <div id="cataclysm-copy" aria-hidden="true"><span id="cataclysm-kicker">第三枚玉音 · 禁制解除</span><strong id="cataclysm-title">宇宙无敌大飞剑</strong><span id="cataclysm-subtitle">玉门说：你礼貌吗？</span></div>
 <div class="otherworld-title"><span>ACT II / THE IMPOSSIBLE SEA</span><h2>天碎以后，<br>鱼开始公转。</h2><p>重力只是一个建议。</p></div>
 <div class="cosmic-controls"><button id="invert-gravity">颠倒重力 ↻</button><button id="sword-rain">让天上下剑雨</button><button id="return-jade">假装无事发生 · 返回</button></div><button id="skip-cataclysm">跳过动画 · 直接穿越 ↗</button>`;
}
