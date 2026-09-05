const fs=require("fs");
const path=require("path");
const vm=require("vm");

const STATIC_PROVIDER_FILES=[
  "data/providers.js",
  "data/tokyo-english-directory.js",
  "data/tokyo-verified-clinics.js"
];

function validProvider(p){
  return p&&typeof p==="object"&&typeof p.id==="string"&&typeof p.name==="string";
}

function loadStaticProviders(){
  const sandbox={window:{PROVIDERS:[]}};
  for(const relativePath of STATIC_PROVIDER_FILES){
    const filePath=path.join(process.cwd(),relativePath);
    const source=fs.readFileSync(filePath,"utf8");
    vm.runInNewContext(source,sandbox,{filename:relativePath,timeout:1000});
  }
  return (sandbox.window.PROVIDERS||[]).filter(validProvider);
}

async function loadCloudProviders(){
  const base=(process.env.SUPABASE_URL||"").replace(/\/$/,"");
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY||"";
  if(!base||!key)return null;

  const response=await fetch(`${base}/rest/v1/providers?select=id,data&active=eq.true&order=id.asc`,{
    headers:{
      apikey:key,
      Authorization:`Bearer ${key}`,
      Accept:"application/json"
    }
  });
  if(!response.ok)throw new Error(`Provider database request failed (${response.status})`);
  const rows=await response.json();
  const providers=rows.map(row=>row?.data).filter(validProvider);
  if(!providers.length)throw new Error("Provider database returned no usable records");
  return providers;
}

function send(res,status,body,contentType){
  res.statusCode=status;
  res.setHeader("Content-Type",contentType);
  res.setHeader("Cache-Control","public, max-age=60, s-maxage=300, stale-while-revalidate=86400");
  res.end(body);
}

module.exports=async function handler(req,res){
  if(req.method!=="GET"){
    res.setHeader("Allow","GET");
    return send(res,405,JSON.stringify({error:"Method not allowed"}),"application/json; charset=utf-8");
  }

  let providers,source="static-fallback",cloudError=null;
  try{
    providers=await loadCloudProviders();
    if(providers)source="supabase";
  }catch(err){
    cloudError=err.message;
  }

  if(!providers){
    try{providers=loadStaticProviders();}
    catch(err){
      return send(res,500,JSON.stringify({error:"Provider data unavailable"}),"application/json; charset=utf-8");
    }
  }

  const meta={source,count:providers.length,cloudConfigured:Boolean(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY)};
  const url=new URL(req.url||"/api/providers","http://localhost");
  if(url.searchParams.get("format")==="js"){
    const js=`window.PROVIDERS=${JSON.stringify(providers)};window.JAPAN_HEALTH_DATA_META=${JSON.stringify(meta)};`;
    return send(res,200,js,"application/javascript; charset=utf-8");
  }

  const payload={providers,meta};
  if(cloudError&&process.env.NODE_ENV!=="production")payload.meta.cloudError=cloudError;
  return send(res,200,JSON.stringify(payload),"application/json; charset=utf-8");
};
