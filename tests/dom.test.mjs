import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
const manifest=JSON.parse(fs.readFileSync('dist/asset-manifest.json','utf8'));
const html=fs.readFileSync('dist/index.html','utf8');
function page(){
 const dom=new JSDOM(html,{url:'https://jijing.test/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,frames=[];
 w.matchMedia=()=>({matches:false});w.ResizeObserver=class{observe(){}disconnect(){}};
 w.requestAnimationFrame=cb=>(frames.push(cb),frames.length);w.HTMLCanvasElement.prototype.getContext=()=>null;
 w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;w.structuredClone=structuredClone;
 Object.defineProperty(w.crypto,'subtle',{value:crypto.subtle});
 w.fetch=()=>{throw Error('Unexpected network call during UI initialization');};
 const scene=[...w.document.querySelectorAll('script')].find(s=>!s.src&&s.type!=='application/json');w.eval(scene.textContent);
 return {dom,w,frames,q:s=>w.document.querySelector(s),flush:()=>new Promise(r=>setTimeout(r,25)),frame:now=>{const callbacks=frames.splice(0);callbacks.forEach(cb=>cb(now));}};
}
test('served browser bundles: English before scripts; independent language UI; complete negotiation; no Node globals',async()=>{
 const {dom,w,q,flush}=page();
 // This evaluates the shipped bundles in the DOM's browser realm, not Node imports.
 assert.equal(w.Buffer,undefined);assert.equal(w.process,undefined);
 assert.equal(w.document.documentElement.lang,'en');assert.match(q('.ij-open-scroll').textContent,/Open workspace/);
 w.localStorage.setItem('jijing-language','zh'); // obsolete preference must not override the new default
 w.eval(fs.readFileSync('dist/'+manifest.ui,'utf8'));
 assert.equal(q('#ice-jade-sanctuary').dataset.uiReady,'true');
 q('.scene-language [data-language=zh]').click();assert.equal(w.document.documentElement.lang,'zh-CN');assert.match(q('.ij-open-scroll').textContent,/展卷/);
 q('.scene-language [data-language=en]').click();assert.equal(w.document.documentElement.lang,'en');
 // Wallet SDK has not loaded yet; language controls already work.
 w.eval(fs.readFileSync('dist/'+manifest.app,'utf8'));await flush();
 assert.equal(q('#ij-scroll-panel').hidden,true);q('.ij-open-scroll').click();assert.equal(q('#ij-scroll-panel').hidden,false);
 assert.match(q('#notice').textContent,/Offline playground/);assert.match(q('#panel-title').textContent,/A space for agreement/);
 q('[data-language=zh]').click();assert.match(q('#notice').textContent,/离线教程/);
 for(let i=0;i<3;i++){q('#people').children[i].click();await flush();q('#demo-seal').click();await flush();}
 assert.match(q('#demo-content').textContent,/AWAITING_COMPILATION/);q('#demo-compile').click();await flush();assert.match(q('#demo-content').textContent,/BLOCKED/);
 const before=q('#demo-content').textContent;q('[data-language=en]').click();assert.match(q('#demo-content').textContent,/No shared plan/);assert.match(q('#demo-content').textContent,/Include a night session/);
 assert.equal(/[\u3400-\u9fff]/.test(q('#demo-content').textContent),false,q('#demo-content').textContent);
 q('[data-language=zh]').click();assert.equal(q('#demo-content').textContent,before);
 assert.equal(q('[data-waive="C0"]').disabled,true);assert.equal(q('[data-waive="C2"]').disabled,false);
 q('[data-waive="C2"]').click();await flush();assert.match(q('#demo-content').textContent,/FEASIBLE/);
 for(let i=0;i<3;i++){q('#people').children[i].click();await flush();q('[data-approve="3"]').click();await flush();}
 assert.match(q('#demo-content').textContent,/COMMITTED/);assert.match(q('#notice').textContent,/教程完成/);
 q('[data-tab=live]').click();assert.equal(q('#demo-view').hidden,true);assert.equal(q('#deploy').disabled,true);
 q('#connect-wallet').click();await flush();assert.match(q('#notice').textContent,/本地 Chrome/);
 q('[data-language=en]').click();assert.match(q('#notice').textContent,/local Chrome/);
 q('#condition-input').value='必须保留我的原文';q('#tx-budget').value='8';q('#scope-ack').checked=true;
 const raw=w.document.createElement('span');raw.dataset.userContent='';raw.textContent='必须安排夜间场，即 x 等于 1。';q('#live-result').append(raw);
 const receipt='{"condition":"必须保留回执原文"}';q('#receipt-result').dataset.userContent='';q('#receipt-result').textContent=receipt;
 let requests=0;w.ethereum={request(){requests++;throw Error('No signing during language changes');}};
 const domain=q('#domain-input').value;
 for(const language of ['zh','en']){
  q('[data-language='+language+']').click();assert.equal(q('#condition-input').value,'必须保留我的原文');assert.equal(q('#tx-budget').value,'8');
  assert.equal(q('#scope-ack').checked,true);assert.equal(q('#domain-input').value,domain);assert.equal(q('#deploy').disabled,true);
 }
 assert.equal(requests,0);assert.equal(raw.textContent,'必须安排夜间场，即 x 等于 1。');assert.equal(q('#receipt-result').textContent,receipt);
 assert.equal(w.localStorage.getItem('jijing-language-v3'),'en');
 const text=q('#live-view').textContent.replace(receipt,'').replace(raw.textContent,'');assert.equal(/[\u3400-\u9fff]/.test(text),false,text);
 const style=w.document.createElement('style');style.textContent=fs.readFileSync('dist/'+manifest.scene,'utf8')+'\n'+fs.readFileSync('dist/'+manifest.product,'utf8');w.document.head.append(style);
 const panelStyle=w.getComputedStyle(q('#ij-scroll-panel'));assert.equal(panelStyle.position,'fixed');assert.equal(panelStyle.transform,'none');assert.equal(panelStyle.fontSize,'17px');assert.equal(panelStyle.maxWidth,'1600px');
 assert.equal(q('[data-product-css]').previousElementSibling.getAttribute('href'),'./'+manifest.scene);
 q('.ij-close').click();assert.equal(q('#ij-scroll-panel').hidden,true);assert.equal(w.document.activeElement,q('.ij-open-scroll'));dom.window.close();
});
test('served scene bundle: sword follows, flight terminates, echoes replay and UI opens independently of SDK',async()=>{
 const {dom,w,q,flush,frame}=page();w.eval(fs.readFileSync('dist/'+manifest.ui,'utf8'));
 const root=q('#ice-jade-sanctuary');root.dispatchEvent(new w.MouseEvent('pointermove',{clientX:500,clientY:300,bubbles:true}));frame(w.performance.now()+20);
 assert.equal(q('#jade-sword').style.opacity,'1');assert.match(q('#jade-sword').style.transform,/translate3d/);
 const start=w.performance.now();q('.ij-enter').click();await flush();assert.equal(root.dataset.realm,'inner');assert.equal(root.dataset.flightCount,'1');
 frame(start+900);assert.notEqual(q('#flight-sword').style.opacity,'0');frame(start+2400);assert.equal(root.dataset.flight,undefined);assert.equal(q('#flight-sword').style.opacity,'0');
 for(let n=0;n<3;n++)q('[data-echo="'+n+'"]').click();await flush();assert.equal(root.dataset.echoes,'3');assert.equal(q('#echo-count').textContent,'3 / 3');assert.equal(q('#reset-echoes').hidden,false);
 q('[data-echo="0"]').click();assert.equal(q('#echo-count').textContent,'3 / 3');q('#reset-echoes').click();assert.equal(root.dataset.echoes,'0');assert.equal(q('#reset-echoes').hidden,true);
 q('.ij-open-scroll').click();frame(start+2600);assert.equal(q('#ij-scroll-panel').hidden,false);assert.equal(q('#jade-sword').style.opacity,'0');q('.ij-close').click();assert.equal(q('#ij-scroll-panel').hidden,true);dom.window.close();
});
