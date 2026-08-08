import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
const root=process.cwd();const out=join(root,"docs");
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
await cp(join(root,"dist","client"),out,{recursive:true});await cp(join(root,"public"),out,{recursive:true});
const server=await import(`../dist/server/index.js?static=${Date.now()}`);
const worker=server.default;
const fetchHandler=
  typeof worker?.fetch === "function" ? worker.fetch.bind(worker) :
  typeof server.fetch === "function" ? server.fetch.bind(server) :
  typeof worker === "function" ? worker : null;
if(!fetchHandler)throw new TypeError(`Static server has no fetch handler (exports: ${Object.keys(server).join(", ")})`);
const response=await fetchHandler(new Request("https://example.invalid/"),{ASSETS:{fetch:async()=>new Response("Not found",{status:404})}},{waitUntil(){},passThroughOnException(){}});
if(!response.ok)throw new Error(`Static render failed: ${response.status}`);
let html=await response.text();html=html.replace(/(src|href)="\//g,'$1="./');
await writeFile(join(out,"index.html"),html,"utf8");await writeFile(join(out,".nojekyll"),"","utf8");
console.log("GitHub Pages bundle created in docs/");
