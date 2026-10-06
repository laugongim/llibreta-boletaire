// Generat per build_pwa.py. Versió f290949b57
const CACHE='boletaire-f290949b57', FONTS='boletaire-fonts', PHOTOS='boletaire-fotos-4d84fc7414', PHOTOS_FILE="fotos-4d84fc7414.js", BIG="boletaire-grans-5763252711";
const FILES=["./", "index.html", "privacitat.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png", "icons/icon.svg"];
self.addEventListener('install', e=>{
  e.waitUntil((async()=>{
    // cache:'reload': sempre del servidor, mai de la memòria del navegador (GitHub Pages la guarda 10 minuts
    // i, si no, es podia desar la pàgina antiga dins de la versió nova)
    const fresh=f=>new Request(f,{cache:'reload'});
    const c=await caches.open(CACHE); await c.addAll(FILES.map(fresh));
    const p=await caches.open(PHOTOS); if(!(await p.match(PHOTOS_FILE))) await p.add(fresh(PHOTOS_FILE));
    try{ const f=await caches.open(FONTS); if(!(await f.match("https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Caveat:wght@500;700&family=Kalam:wght@300;400;700&family=Special+Elite&display=swap"))) await f.add("https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Caveat:wght@500;700&family=Kalam:wght@300;400;700&family=Special+Elite&display=swap"); }catch(err){}
    self.skipWaiting();
  })());
});
self.addEventListener('message', e=>{ if(e.data==='skip') self.skipWaiting(); });
self.addEventListener('activate', e=>{
  e.waitUntil((async()=>{
    for(const k of await caches.keys()) if(k!==CACHE && k!==FONTS && k!==PHOTOS && k!==BIG) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  // tipus de lletra i el SDK de Firebase: es guarden el primer cop perquè l'app arrenqui sense connexió
  if(u.host==='fonts.googleapis.com' || u.host==='fonts.gstatic.com' || (u.host==='www.gstatic.com' && u.pathname.startsWith('/firebasejs/'))){
    e.respondWith(caches.open(FONTS).then(async c=>{ const hit=await c.match(r); if(hit) return hit;
      const res=await fetch(r); if(res.ok||res.type==='opaque') c.put(r,res.clone()); return res; }));
    return;
  }
  if(u.origin!==location.origin) return;
  // fotos grans de les fitxes: es guarden el primer cop que s'obren
  if(u.pathname.includes('/fotos/')){
    e.respondWith(caches.open(BIG).then(async c=>{ const hit=await c.match(r); if(hit) return hit;
      const res=await fetch(r); if(res.ok) c.put(r,res.clone()); return res; }));
    return;
  }
  e.respondWith((async()=>{
    const c=await caches.open(CACHE);
    const hit=await c.match(r,{ignoreSearch:true}) || await (await caches.open(PHOTOS)).match(r,{ignoreSearch:true}); if(hit) return hit;
    // pàgines que no són a la memòria cau (p. ex. presentacio.html): de la xarxa; sense connexió, l'app
    try{ return await fetch(r); }catch(err){ if(r.mode==='navigate') return c.match('index.html'); throw err; }
  })());
});
