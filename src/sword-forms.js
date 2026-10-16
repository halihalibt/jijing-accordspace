// Four materially different silhouettes; every level has its own geometry.
export const swordNames=['初醒 · 一线玉锋','雪魄 · 双生寒刃','月轮 · 九霄剑阵','宇宙无敌大飞剑'];
export function swordMarkup(level,id='blade'){
 const colors=[['#eaffee','#74a8bc'],['#f7fff3','#59d8e6'],['#fff4ff','#b79bff'],['#fffce7','#e9b5ef']][level];
 const wing=level>=1?'<path d="M-5-28-13-13-8 14-4 6M5-28 13-13 8 14 4 6" fill="none" stroke="'+colors[0]+'" stroke-width="1.5"/>':'';
 const moon=level>=2?'<circle cy="0" r="22" fill="none" stroke="'+colors[0]+'" stroke-width=".7"/><path d="M-24-4-9-11M24-4 9-11M-25 12-10 9M25 12 10 9" stroke="'+colors[0]+'" stroke-width="2"/>':'';
 const galaxy=level===3?'<path d="M0-52-7-34-18-21-10 15-25 23-4 19 0 27 4 19 25 23 10 15 18-21 7-34Z" fill="url(#'+id+')" stroke="#fff7e0"/><path d="M-28-18Q0-39 28-18M-28 2Q0-19 28 2M-20 32Q0 44 20 32" fill="none" stroke="#ffe7fd" stroke-width="1"/><circle cy="-8" r="7" fill="#fff5e1"/><path d="M0-48V-18M0 2V24" stroke="#8f6eae" stroke-width="1.4"/>':'';
 return '<svg viewBox="-34 -56 68 112" aria-hidden="true"><defs><linearGradient id="'+id+'"><stop stop-color="'+colors[1]+'"/><stop offset=".48" stop-color="'+colors[0]+'"/><stop offset=".53" stop-color="'+colors[1]+'"/><stop offset="1" stop-color="'+colors[0]+'"/></linearGradient></defs>'+moon+wing+'<path d="M0-49 6-28 4 18 0 25-4 18-6-28Z" fill="url(#'+id+')" stroke="'+colors[0]+'"/><path d="M0-42V19" stroke="white" stroke-width=".7"/>'+galaxy+'<path d="M-16 22Q0 15 16 22L12 26Q0 22-12 26Z" fill="'+colors[0]+'"/><path d="M-2 25H2V42L0 47-2 42Z" fill="'+colors[1]+'" stroke="'+colors[0]+'"/><path d="M0 45Q10 48 3 54" fill="none" stroke="'+colors[0]+'"/></svg>';
}
