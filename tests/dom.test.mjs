import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {JSDOM} from 'jsdom';
test('synthetic DOM: original scene + scroll open/close, tutorial lifecycle, mode separation and no-wallet error',async()=>{
 const dom=new JSDOM(fs.readFileSync('dist/index.html','utf8'),{url:'https://jijing.test/',runScripts:'outside-only'}),w=dom.window;
 w.matchMedia=()=>({matches:false});w.ResizeObserver=class{observe(){}disconnect(){}};w.requestAnimationFrame=()=>0;w.HTMLCanvasElement.prototype.getContext=()=>null;
 Object.assign(globalThis,{window:w,document:w.document,localStorage:w.localStorage});
 const script=[...w.document.querySelectorAll('script')].find(s=>!s.src).textContent;w.eval(script);
 await import('../src/app.js');const q=s=>w.document.querySelector(s),flush=async()=>{await new Promise(r=>setTimeout(r,25));};
 assert.equal(q('#ij-scroll-panel').hidden,true);q('.ij-open-scroll').click();assert.equal(q('#ij-scroll-panel').hidden,false);assert.equal(q('#ice-jade-sanctuary').dataset.scroll,'open');assert.match(q('#notice').textContent,/离线教程/);
 for(let i=0;i<3;i++){q('#people').children[i].click();await flush();q('#demo-seal').click();await flush();}
 assert.match(q('#demo-content').textContent,/AWAITING_COMPILATION/);q('#demo-compile').click();await flush();assert.match(q('#demo-content').textContent,/BLOCKED/);assert.equal(q('#demo-content [data-waive="C0"]').disabled,true);assert.equal(q('#demo-content [data-waive="C2"]').disabled,false);
 q('#demo-content [data-waive="C2"]').click();await flush();assert.match(q('#demo-content').textContent,/FEASIBLE/);
 for(let i=0;i<3;i++){q('#people').children[i].click();await flush();q('#demo-content [data-approve="3"]').click();await flush();}
 assert.match(q('#demo-content').textContent,/COMMITTED/);assert.match(q('#notice').textContent,/教程完成/);assert.equal(q('#receipt-result').textContent,'尚无交易证据。');
 q('[data-tab=live]').click();assert.equal(q('#demo-view').hidden,true);assert.equal(q('#live-view').hidden,false);assert.equal(q('#deploy').disabled,true);q('#connect-wallet').click();await flush();assert.match(q('#notice').textContent,/本地 Chrome/);
 q('.ij-close').click();assert.equal(q('#ij-scroll-panel').hidden,true);assert.equal(q('#ice-jade-sanctuary').dataset.scroll,'closed');assert.equal(w.document.activeElement,q('.ij-open-scroll'));dom.window.close();
});
