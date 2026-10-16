import fs from 'node:fs';import crypto from 'node:crypto';
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const expected='f99a6395f539c718027f2b6ab39801ccc22c2c0197fb7cbc27307b64563e886f';
for(const p of ['contracts/accord_space.py','dist/contracts/accord_space.py'])if(hash(p)!==expected)throw Error('canonical source mismatch: '+p);
if(hash('assets/ice-jade-environment.webp')!=='54d26deb5c9ec229a56ab7cfb4d5f6a71a4d43213d1c1bb7a9741b0c516a87f4')throw Error('Original scene mismatch');
if(hash('src/visual-original.html')!=='82928eeb9ea59e1f3c2fbe8f981f5e7c07a5e57c8f3eb0732c5724305f6a69ae')throw Error('Original reference changed');
const manifest=JSON.parse(fs.readFileSync('dist/asset-manifest.json','utf8')),html=fs.readFileSync('dist/index.html','utf8');
for(const name of Object.values(manifest)){if(!name.includes(hash('dist/'+name).slice(0,12)))throw Error('Asset fingerprint mismatch: '+name);if(!html.includes(name))throw Error('Unreferenced asset: '+name);}
const app=fs.readFileSync('dist/'+manifest.app,'utf8'),scene=fs.readFileSync('dist/'+manifest.scene,'utf8');
for(const text of ['ij-landscape','ij-particles','compile_session','jade-original.ttf','aria-modal="true"'])if(!(html+app+scene).includes(text))throw Error('Missing '+text);
if(html.includes('CUTLINE')||html.includes('class="ij-condense'))throw Error('Historical product copy remains');
if(!html.includes('>Open workspace</button>')||!html.includes('jijing-copy-seed'))throw Error('English static UI missing');
console.log('PASS canonical contract, immutable reference, original assets, fingerprinted resources, English HTML and complete product.');
