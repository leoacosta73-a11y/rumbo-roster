const VERSION="crew-roster-offline-v1-20260817-new-brand";
const SHELL=`${VERSION}-shell`;
const RUNTIME=`${VERSION}-runtime`;
const scoped=path=>new URL(path,self.registration.scope).toString();

async function cacheAppShell(){
  const cache=await caches.open(SHELL);
  const home=scoped("./");
  const response=await fetch(home,{cache:"no-store"});
  if(!response.ok)throw new Error("No se pudo preparar CrewRoster offline");
  await cache.put(home,response.clone());
  const html=await response.text();
  const assets=new Set([scoped("./manifest.webmanifest"),scoped("./icon-192.png"),scoped("./icon-512.png"),scoped("./apple-touch-icon.png"),scoped("./crewroster-logo.jpeg")]);
  for(const match of html.matchAll(/(?:src|href)=["']([^"'#]+)["']/g)){
    const asset=new URL(match[1],home);
    if(asset.origin===self.location.origin)assets.add(asset.toString());
  }
  await Promise.allSettled([...assets].map(async asset=>{
    const item=await fetch(asset);
    if(item.ok)await cache.put(asset,item);
  }));
}

self.addEventListener("install",event=>event.waitUntil(cacheAppShell().then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil((async()=>{
  const keys=await caches.keys();
  const oldKeys=keys.filter(key=>(key.startsWith("rumbo-")||key.startsWith("crew-roster-"))&&!key.startsWith(VERSION));
  await Promise.all(oldKeys.map(key=>caches.delete(key)));
  await self.clients.claim();
  if(oldKeys.length){
    const clients=await self.clients.matchAll({type:"window"});
    clients.forEach(client=>client.postMessage({type:"CREW_ROSTER_UPDATE_READY"}));
  }
})()));

self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET")return;
  const requestUrl=new URL(request.url);
  if(request.mode==="navigate"){
    event.respondWith(fetch(request,{cache:"no-store"}).then(async response=>{
      if(response.ok)(await caches.open(SHELL)).put(scoped("./"),response.clone());
      return response;
    }).catch(()=>caches.match(scoped("./"))));
    return;
  }
  if(requestUrl.origin===self.location.origin){
    event.respondWith(caches.match(request).then(cached=>{
      const fresh=fetch(request).then(async response=>{
        if(response.ok)(await caches.open(RUNTIME)).put(request,response.clone());
        return response;
      }).catch(()=>cached);
      return cached||fresh;
    }));
    return;
  }
  if(["unpkg.com","tiles.openfreemap.org"].includes(requestUrl.hostname)){
    event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(async response=>{
      (await caches.open(RUNTIME)).put(request,response.clone());
      return response;
    })));
  }
});
