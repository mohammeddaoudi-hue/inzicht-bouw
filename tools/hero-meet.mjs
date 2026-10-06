// Meet per kandidaat IN DE BROWSER: hero-helderheid (gemiddelde) en wit-contrast op de echte pixels onder de kop
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const rq=createRequire('C:/Users/Mohammed/pixelperfect-photo-painter/package.json'); const puppeteer=rq('puppeteer-core'); const sharp=rq('sharp');
const ROOT='C:/Users/Mohammed/NORVO-DEMOS/inzichtbouw'; const SP='C:/Users/Mohammed/AppData/Local/Temp/claude/C--Users-Mohammed/70ff0404-d5ec-4808-b4fb-e353d1d7c35c/scratchpad/inzicht';
const kand=JSON.parse(process.argv[2]);
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(ROOT,p);fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream','cache-control':'no-store'});r.end(b)})});
await new Promise(r=>srv.listen(0,'127.0.0.1',r)); const url=`http://127.0.0.1:${srv.address().port}/`;
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:'new',args:['--hide-scrollbars']});
const L=c=>{c/=255;return c<=.03928?c/12.92:((c+.055)/1.055)**2.4};
for(const k of kand){
  const [f,top,h,br]=k; const base=sharp(path.join(SP,'wp',f)).extract({left:0,top,width:1920,height:h}).modulate({brightness:br});
  await base.clone().jpeg({quality:82}).toFile(ROOT+'/img/hero-vol.jpg'); await base.clone().webp({quality:80}).toFile(ROOT+'/img/hero-vol.webp');
  const m=sharp(path.join(SP,'wp',f)).extract({left:0,top,width:1920,height:h}).modulate({brightness:br}).resize(900,1400,{fit:'cover'});
  await m.clone().jpeg({quality:82}).toFile(ROOT+'/img/hero-vol-m.jpg'); await m.clone().webp({quality:80}).toFile(ROOT+'/img/hero-vol-m.webp');
  const out=[];
  for(const w of [1440,390]){const p=await browser.newPage();await p.setViewport({width:w,height:w<600?844:900});await p.goto(url+'?k='+Date.now(),{waitUntil:'networkidle0'});
    await p.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('is-zichtbaar'))});await p.evaluate(()=>Promise.all([...document.querySelectorAll(".hero img")].map(i=>i.complete&&i.naturalWidth?i.decode().catch(()=>{}):new Promise(r=>{i.onload=i.onerror=()=>r()}))));await new Promise(r=>setTimeout(r,400));
    const hb=await (await p.$('.hero')).boundingBox();const shot=await p.screenshot({clip:{x:0,y:0,width:w,height:Math.round(hb.height)}});const st=await sharp(shot).stats();const mean=st.channels.slice(0,3).reduce((a,c)=>a+c.mean,0)/3;
    const r=await p.$eval('.hero__kop',e=>e.getBoundingClientRect().toJSON());await p.evaluate(()=>{document.querySelector('.hero__tekstblok').style.visibility='hidden'});
    const onder=await p.screenshot({clip:{x:Math.max(0,r.x),y:Math.max(0,r.y),width:Math.min(w-r.x,r.width),height:r.height}});const so=await sharp(onder).stats();
    const lum=.2126*L(so.channels[0].mean)+.7152*L(so.channels[1].mean)+.0722*L(so.channels[2].mean);
    // donkerste 10%-strook onder de kop: contrast op de lichtste plek telt
    const raw=await sharp(onder).raw().toBuffer({resolveWithObject:true});const vals=[];for(let i=0;i<raw.data.length;i+=raw.info.channels*37)vals.push((raw.data[i]+raw.data[i+1]+raw.data[i+2])/3);vals.sort((a,b)=>a-b);const p90=vals[Math.floor(vals.length*.9)];
    out.push(`${w}: gem ${mean.toFixed(0)} | wit op kop ${(1.05/(lum+.05)).toFixed(1)}:1 | lichtste plekken ${(1.05/(L(p90)+.05)).toFixed(1)}:1`);await p.close();}
  console.log(f.slice(0,22).padEnd(22),'x'+br,'→',out.join('  ||  '));
}
await browser.close();srv.close();
