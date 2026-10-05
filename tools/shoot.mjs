// Start eigen statische server op vrije poort, check identiteit, maak shots + overflow + console
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module'; const puppeteer = createRequire('C:/Users/Mohammed/pixelperfect-photo-painter/package.json')('puppeteer-core');
const ROOT='C:/Users/Mohammed/NORVO-DEMOS/inzichtbouw'; const OUT=process.argv[2]; const widths=(process.argv[3]||'1440,390').split(',').map(Number);
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(ROOT,p);fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});r.end(b)})});
await new Promise(r=>srv.listen(0,'127.0.0.1',r)); const port=srv.address().port; const url=`http://127.0.0.1:${port}/`;
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:'new',args:['--hide-scrollbars','--font-render-hinting=none']});
for(const w of widths){const p=await browser.newPage();const errs=[];p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('pageerror',e=>errs.push(e.message));p.on('requestfailed',q=>errs.push('FAIL '+q.url()));
await p.setViewport({width:w,height:w<600?844:900,deviceScaleFactor:1});await p.goto(url,{waitUntil:'networkidle0'});
const id=await p.title(); if(!id.includes('INzicht')) throw new Error('verkeerde site: '+id);
await p.evaluate(async()=>{document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');await document.fonts.ready;for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,40))}window.scrollTo(0,0)});
await p.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.complete&&i.naturalWidth?i.decode().catch(()=>{}):new Promise(r=>{i.onload=i.onerror=()=>r()})))});await new Promise(r=>setTimeout(r,600));
const info=await p.evaluate(()=>{const W=document.documentElement.clientWidth;const over=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>W+1||r.left<-1)&&!e.closest('.mob,dialog,svg[aria-hidden],[hidden]')}).slice(0,8).map(e=>e.className||e.tagName);const broken=[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src);return{scrollW:document.documentElement.scrollWidth,W,over,broken,font:document.fonts.check('600 16px "Plus Jakarta Sans"'),h:document.body.scrollHeight}});
console.log(w,JSON.stringify(info),'errors:',errs.length?errs:'0');
await p.screenshot({path:`${OUT}-${w}.png`,fullPage:true});await p.close();}
await browser.close();srv.close();
