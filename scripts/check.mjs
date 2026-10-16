import fs from 'node:fs';import crypto from 'node:crypto';
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const expected='f99a6395f539c718027f2b6ab39801ccc22c2c0197fb7cbc27307b64563e886f';
for(const p of ['contracts/accord_space.py','dist/contracts/accord_space.py'])if(hash(p)!==expected)throw Error('canonical source mismatch: '+p);
if(hash('assets/ice-jade-environment.webp')!=='54d26deb5c9ec229a56ab7cfb4d5f6a71a4d43213d1c1bb7a9741b0c516a87f4')throw Error('Original scene mismatch');
const html=fs.readFileSync('dist/index.html','utf8');for(const text of ['ij-landscape','ij-particles','compile_session','jade-original.ttf','aria-modal="true"'])if(!html.includes(text)&&!fs.readFileSync('dist/scene.css','utf8').includes(text)&&!fs.readFileSync('dist/app.js','utf8').includes(text))throw Error('Missing '+text);
if(html.includes('CUTLINE')||html.includes('class="ij-condense'))throw Error('Historical product copy remains');
console.log('PASS exact canonical copy, exact original scene, essential product elements and removed prior CUTLINE copy.');
