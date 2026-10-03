// Generat per build_pwa.py. Versió 2f6f0a02de
const CACHE='boletaire-2f6f0a02de', FONTS='boletaire-fonts';
const FILES=["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png"];
self.addEventListener('install', e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(CACHE); await c.addAll(FILES);
    try{ const f=await caches.open(FONTS); if(!(await f.match("https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Caveat:wght@500;700&family=Kalam:wght@300;400;700&family=Special+Elite&display=swap"))) await f.add("https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Caveat:wght@500;700&family=Kalam:wght@300;400;700&family=Special+Elite&display=swap"); }catch(err){}
    self.skipWaiting();
  })());
});
self.addEventListener('activate', e=>{
  e.waitUntil((async()=>{
    for(const k of await caches.keys()) if(k!==CACHE && k!==FONTS) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(u.host==='fonts.googleapis.com' || u.host==='fonts.gstatic.com'){
    e.respondWith(caches.open(FONTS).then(async c=>{ const hit=await c.match(r); if(hit) return hit;
      const res=await fetch(r); if(res.ok||res.type==='opaque') c.put(r,res.clone()); return res; }));
    return;
  }
  if(u.origin!==location.origin) return;
  e.respondWith((async()=>{
    const c=await caches.open(CACHE);
    const hit=await c.match(r,{ignoreSearch:true}) || (r.mode==='navigate' && await c.match('index.html'));
    return hit || fetch(r);
  })());
});
