const fs=require("fs");
const path=require("path");
const vm=require("vm");
const crypto=require("crypto");

const STATIC_PROVIDER_FILES=[
  "data/providers.js",
  "data/tokyo-english-directory.js",
  "data/tokyo-verified-clinics.js",
  "data/drive-provider-handoff.js",
  "data/provider-promotions-2026-09-05.js",
  "data/provider-promotions-batch-2.js",
  "data/provider-promotions-batch-3.js",
  "data/provider-promotions-batch-4.js",
  "data/provider-promotions-batch-5.js",
  "data/provider-promotions-batch-6.js",
  "data/provider-promotions-batch-7.js",
  "data/provider-promotions-batch-8.js",
  "data/provider-promotions-batch-9.js",
  "data/provider-promotions-batch-10.js",
  "data/service-access-promotions-2026-09-05.js"
];

function validProvider(p){
  return p&&typeof p==="object"&&typeof p.id==="string"&&typeof p.name==="string";
}

function normalizeName(value){
  return String(value||"").toLowerCase().replace(/[^a-z0-9]/g,"");
}

function dedupeProviders(providers){
  const byId=new Map();
  const nameToId=new Map();
  for(const p of providers.filter(validProvider)){
    const nameKey=normalizeName(p.name);
    const conflictingId=nameToId.get(nameKey);
    if(conflictingId&&conflictingId!==p.id)byId.delete(conflictingId);
    byId.set(p.id,p);
    if(nameKey)nameToId.set(nameKey,p.id);
  }
  return [...byId.values()];
}

function loadStaticProviders(){
  const sandbox={window:{PROVIDERS:[]}};
  for(const relativePath of STATIC_PROVIDER_FILES){
    const filePath=path.join(process.cwd(),relativePath);
    const source=fs.readFileSync(filePath,"utf8");
    vm.runInNewContext(source,sandbox,{filename:relativePath,timeout:1000});
  }
  return dedupeProviders(sandbox.window.PROVIDERS||[]);
}

async function loadCloudProviders(){
  const base=(process.env.SUPABASE_URL||"").replace(/\/$/,"");
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY||"";
  if(!base||!key)return null;
  const response=await fetch(`${base}/rest/v1/providers?select=id,data,updated_at&active=eq.true&order=id.asc`,{headers:{apikey:key,Authorization:`Bearer ${key}`,Accept:"application/json"}});
  if(!response.ok)throw new Error(`Provider database request failed (${response.status})`);
  const rows=await response.json();
  const providers=dedupeProviders(rows.map(row=>row?.data));
  if(!providers.length)throw new Error("Provider database returned no usable records");
  const updatedAt=rows.reduce((latest,row)=>row?.updated_at&&row.updated_at>latest?row.updated_at:latest,"");
  return {providers,updatedAt};
}

function mergeProviderSources(cloudProviders,staticProviders){return dedupeProviders([...(cloudProviders||[]),...(staticProviders||[])]);}
function buildEtag(providers,source,updatedAt=""){const fingerprint=JSON.stringify({source,updatedAt,providers});return `\"${crypto.createHash("sha256").update(fingerprint).digest("hex").slice(0,24)}\"`;}
function send(res,status,body,contentType,etag){res.statusCode=status;if(contentType)res.setHeader("Content-Type",contentType);res.setHeader("Cache-Control","public, max-age=60, s-maxage=300, stale-while-revalidate=86400");if(etag)res.setHeader("ETag",etag);res.end(body||"");}

module.exports=async function handler(req,res){
  if(req.method!=="GET"){res.setHeader("Allow","GET");return send(res,405,JSON.stringify({error:"Method not allowed"}),"application/json; charset=utf-8");}
  let staticProviders;try{staticProviders=loadStaticProviders();}catch(err){return send(res,500,JSON.stringify({error:"Provider data unavailable"}),"application/json; charset=utf-8");}
  let providers=staticProviders,source="static-fallback",cloudError=null,updatedAt="";
  try{const cloud=await loadCloudProviders();if(cloud){providers=mergeProviderSources(cloud.providers,staticProviders);updatedAt=cloud.updatedAt;source="supabase+github";}}catch(err){cloudError=err.message;}
  const etag=buildEtag(providers,source,updatedAt);
  const requestEtag=req.headers?.["if-none-match"]||req.headers?.["If-None-Match"];
  if(requestEtag===etag)return send(res,304,"",null,etag);
  const meta={source,count:providers.length,cloudConfigured:Boolean(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY),githubSourceOfTruth:true,dataVersion:etag.replaceAll('"',''),updatedAt:updatedAt||null};
  const url=new URL(req.url||"/api/providers","http://localhost");
  if(url.searchParams.get("format")==="js"){const js=`window.PROVIDERS=${JSON.stringify(providers)};window.JAPAN_HEALTH_DATA_META=${JSON.stringify(meta)};`;return send(res,200,js,"application/javascript; charset=utf-8",etag);}
  const payload={providers,meta};if(cloudError&&process.env.NODE_ENV!=="production")payload.meta.cloudError=cloudError;return send(res,200,JSON.stringify(payload),"application/json; charset=utf-8",etag);
};
