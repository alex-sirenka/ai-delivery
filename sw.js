const C='aidm-academy-v3';const F=['./','index.html','curriculum.js','curriculum-extra.js','learning-core.js','app.js','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x==='aidm-v2'||(x.startsWith('aidm-academy-')&&x!==C)).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
  const network=fetch(e.request);
  e.waitUntil(network.then(r=>r.ok?caches.open(C).then(c=>c.put(e.request,r.clone())):undefined).catch(error=>console.error('Cache update failed',error)));
  e.respondWith(network.catch(()=>caches.open(C).then(c=>c.match(e.request)).then(r=>r||Response.error())));
});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window'}).then(w=>w.length?w[0].focus():clients.openWindow('./')));});
