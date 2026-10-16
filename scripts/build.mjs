import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {primeEnglish} from '../src/i18n.js';
import {enhanceScene} from './enhance-scene.mjs';
const hash=s=>createHash('sha256').update(s).digest('hex').slice(0,12);
await fs.rm('dist',{recursive:true,force:true});await fs.mkdir('dist',{recursive:true});
for(const d of ['assets','contracts','docs'])await fs.cp(d,'dist/'+d,{recursive:true});
let v=enhanceScene(await fs.readFile('src/visual-original.html','utf8'));
v=v.replace(/  <section class="ij-scroll"[\s\S]*?<\/section>/,await fs.readFile('src/panel.html','utf8'));
v=v.replace(/    q\('\.ij-condense'\)\.addEventListener\('click',[\s\S]*?(?=    world\.addEventListener)/,'');
v=v.replace(' / CUTLINE',' / ACCORDSPACE').replace('>展卷</button>','>展卷 · 共议</button>').replace('视觉交互样片<br>未连接 GenLayer','离线可玩 · 真实会话待部署<br>STABLE STUDIONET / 61999');
v=v.replace('  <header class="ij-header">','  <aside class="first-visit" id="first-visit"><b>初至此境</b>先收集空中的三枚玉音。每一枚都会进化你的飞剑。第三枚会打破这方天地。<br><button id="dismiss-guide">知晓 · 开始探索</button></aside>\n  <header class="ij-header">');
v=v.replace('    <button type="button" class="ij-audio','    <div class="ij-header-actions"><div class="scene-language language-switch" role="group" aria-label="Language"><button type="button" data-language="en" aria-pressed="true">EN</button><button type="button" data-language="zh" aria-pressed="false">中文</button></div><button type="button" class="ij-audio');
v=v.replace('  </header>','    </div>\n  </header>');
const styles={scene:v.match(/<style>([\s\S]*?)<\/style>/)[1],product:await fs.readFile('src/product.css','utf8')};v=v.replace(/<style>[\s\S]*?<\/style>/,'');
const manifest={};for(const [name,css]of Object.entries(styles)){manifest[name]=name+'.'+hash(css)+'.css';await fs.writeFile('dist/'+manifest[name],css);}
const summaries={};
for(const [name,entry]of [['ui','src/bootstrap.js'],['app','src/app.js']]){
 const result=await build({entryPoints:[entry],bundle:true,format:'iife',platform:'browser',target:['es2022'],minify:true,legalComments:'eof',metafile:true,write:false});
 const bytes=result.outputFiles[0].contents;manifest[name]=name+'.'+hash(bytes)+'.js';await fs.writeFile('dist/'+manifest[name],bytes);
 summaries[name]={bytes:bytes.length,entry,source_inputs:Object.keys(result.metafile.inputs).filter(p=>p.startsWith('src/'))};
}
await fs.writeFile('dist/asset-manifest.json',JSON.stringify(manifest,null,2));
const markup='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#548c9e"><meta name="description" content="An ice-jade world of sword flight, resonant echoes and shared agreement."><title>Jijing · The Jade Between</title><link rel="icon" href="./assets/favicon.svg"><link rel="stylesheet" data-scene-css href="./'+manifest.scene+'"><link rel="stylesheet" data-product-css href="./'+manifest.product+'"></head><body><a class="skip" href="#ij-scroll-panel" id="skip-to-app">进入协商玉简</a>'+v+'<script defer src="./'+manifest.ui+'"></script><script defer src="./'+manifest.app+'"></script></body></html>';
const dom=new JSDOM(markup);primeEnglish(dom.window.document);await fs.writeFile('dist/index.html',dom.serialize());dom.window.close();
await fs.writeFile('evidence/bundle-meta.json',JSON.stringify({format:'fingerprinted-browser-bundles-v4',manifest,bundles:summaries},null,2));
console.log('Built English-first HTML, independent scene UI, fingerprinted CSS/JS, enhanced flight and canonical contract.');
