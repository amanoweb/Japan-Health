function cleanWords(q){
  const stop = new Set(["device","system","medical","patient","patients","clinical","software","analysis","support","using","used","use","with","from","that","this","japan","japanese","parkinson","disease","adults"]);
  return String(q||"").toLowerCase().replace(/[^a-z0-9\s-]/g," ").split(/\s+/)
    .filter(x => x.length >= 4 && !stop.has(x)).filter((x,i,a)=>a.indexOf(x)===i).slice(0,6);
}

async function getJSON(url){
  const r = await fetch(url,{headers:{"User-Agent":"FDA-Readiness-MVP/0.1"}});
  if(r.status===404) return {results:[]};
  if(!r.ok) throw new Error("openFDA "+r.status);
  return await r.json();
}

async function queryClassification(code, words){
  if(code){
    const u=`https://api.fda.gov/device/classification.json?search=product_code:${encodeURIComponent(code)}&limit=15`;
    return (await getJSON(u)).results || [];
  }
  let out=[];
  for(const word of words.slice(0,4)){
    try{
      const u=`https://api.fda.gov/device/classification.json?search=device_name:${encodeURIComponent(word)}&limit=15`;
      const r=(await getJSON(u)).results || [];
      out.push(...r);
    }catch(e){}
    if(out.length>=15) break;
  }
  const seen=new Set();
  return out.filter(x=>{const k=x.product_code||x.device_name;if(seen.has(k))return false;seen.add(k);return true}).slice(0,15);
}

async function query510(code, words){
  const tries=[];
  if(code) tries.push(`product_code:${code}`);
  for(const w of words.slice(0,3)) tries.push(`device_name:${w}`);
  let out=[];
  for(const search of tries){
    try{
      const u=`https://api.fda.gov/device/510k.json?search=${encodeURIComponent(search)}&limit=20`;
      const r=(await getJSON(u)).results || [];
      out.push(...r);
    }catch(e){}
    if(out.length>=20) break;
  }
  const seen=new Set();
  return out.filter(x=>{const k=x.k_number;if(!k||seen.has(k))return false;seen.add(k);return true}).slice(0,20);
}

async function queryPMA(code, words){
  const tries=[];
  if(code) tries.push(`product_code:${code}`);
  for(const w of words.slice(0,2)) tries.push(`generic_name:${w}`);
  let out=[];
  for(const search of tries){
    try{
      const u=`https://api.fda.gov/device/pma.json?search=${encodeURIComponent(search)}&limit=10`;
      const r=(await getJSON(u)).results || [];
      out.push(...r);
    }catch(e){}
    if(out.length>=10) break;
  }
  const seen=new Set();
  return out.filter(x=>{const k=(x.pma_number||"")+"|"+(x.supplement_number||"");if(!x.pma_number||seen.has(k))return false;seen.add(k);return true}).slice(0,10);
}

module.exports = async function handler(req,res){
  if(req.method!=="GET") return res.status(405).json({error:"Method not allowed"});
  try{
    const q=String(req.query.q||"");
    let code=String(req.query.code||"").trim().toUpperCase();
    if(code && !/^[A-Z0-9]{3}$/.test(code)) code="";
    const words=cleanWords(q);
    const classifications=await queryClassification(code,words);
    const inferredCode=code || classifications[0]?.product_code || "";
    const [k510,pmas]=await Promise.all([
      query510(inferredCode,words),
      queryPMA(inferredCode,words)
    ]);
    res.setHeader("Cache-Control","s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json({
      query:{q,code,words,inferredCode},
      classifications,
      k510,
      pmas,
      source:"openFDA"
    });
  }catch(e){
    return res.status(500).json({error:e.message||"FDA search failed"});
  }
}
