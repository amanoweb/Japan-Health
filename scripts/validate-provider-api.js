const assert=require("assert");
const handler=require("../api/providers.js");

function mockResponse(){return{statusCode:200,headers:{},body:"",setHeader(k,v){this.headers[k]=v;},end(v){this.body=v||"";}};}
function normalizeName(value){return String(value||"").toLowerCase().replace(/[^a-z0-9]/g,"");}

async function run(){
  delete process.env.SUPABASE_URL; delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  const jsonRes=mockResponse(); await handler({method:"GET",url:"/api/providers",headers:{}},jsonRes);
  assert.equal(jsonRes.statusCode,200); assert.match(jsonRes.headers["Content-Type"],/application\/json/); assert.match(jsonRes.headers.ETag,/^"[a-f0-9]{24}"$/);
  const payload=JSON.parse(jsonRes.body); assert.equal(payload.meta.source,"static-fallback"); assert.ok(payload.providers.length>0); assert.ok(payload.providers.every(p=>p&&typeof p.id==="string"&&typeof p.name==="string")); assert.equal(payload.meta.count,payload.providers.length); assert.equal(payload.meta.dataVersion,jsonRes.headers.ETag.replaceAll('"',''));
  const ids=payload.providers.map(p=>p.id); assert.equal(new Set(ids).size,ids.length,"provider API must not return duplicate IDs");
  const names=payload.providers.map(p=>normalizeName(p.name)).filter(Boolean); assert.equal(new Set(names).size,names.length,"provider API must not return duplicate normalized names");
  for(const id of ["jn-handoff-american-clinic-tokyo","jn-handoff-kishi-clinica-femina","jn-handoff-minamiaoyama-eye","jn-handoff-tatsuno-clinic","jn-handoff-kumada-clinic"]){const p=payload.providers.find(x=>x.id===id);assert.ok(p,`${id} must be present after provider promotion`);assert.equal(p.discoveryStatus,"provider-level-verified");assert.equal(p.recordStatus,"official-source-verified");assert.ok(/^https:\/\//.test(p.source));assert.ok(Array.isArray(p.expertiseEvidence)&&p.expertiseEvidence.length>0);}
  const american=payload.providers.find(p=>p.id==="jn-handoff-american-clinic-tokyo"); assert.equal(american.doctorEnglish,"yes"); assert.equal(american.insurance,"self-pay"); assert.equal(american.priceTransparency,"high"); assert.ok(Array.isArray(american.publishedCosts)&&american.publishedCosts.length>=3);
  const kishi=payload.providers.find(p=>p.id==="jn-handoff-kishi-clinica-femina"); assert.equal(kishi.doctorEnglish,"yes","Official clinic site explicitly states English medical treatment is available"); assert.equal(kishi.receptionEnglish,"yes","Official clinic site states all staff can respond in English"); assert.equal(kishi.insurance,"both"); assert.ok(kishi.expertiseEvidence.some(e=>e.type==="second_opinion"));
  const eye=payload.providers.find(p=>p.id==="jn-handoff-minamiaoyama-eye"); assert.ok(eye.specialties.includes("ICL")); assert.match(eye.notes,/Foreign residents/i);
  const tatsuno=payload.providers.find(p=>p.id==="jn-handoff-tatsuno-clinic"); assert.ok(tatsuno.specialties.includes("Cardiology")); assert.equal(tatsuno.doctorEnglish,"unknown","Official Japanese clinic site does not establish physician English"); assert.match(tatsuno.source,/tatsuno-clinic\.com/);
  const kumada=payload.providers.find(p=>p.id==="jn-handoff-kumada-clinic"); assert.ok(kumada.specialties.includes("Voice and Speech Medicine")); assert.equal(kumada.selfPay,"yes"); assert.match(kumada.notes,/appointments are required/i); assert.equal(kumada.doctorEnglish,"unknown","English website alone must not be converted into physician fluency");
  const directoryOnly=payload.providers.find(p=>p.id==="jn-handoff-ohtsuka-clinic"); if(directoryOnly){assert.equal(directoryOnly.discoveryStatus,"directory-only");assert.equal(directoryOnly.doctorEnglish,"unknown");assert.equal(directoryOnly.receptionEnglish,"unknown");}
  const cachedRes=mockResponse(); await handler({method:"GET",url:"/api/providers",headers:{"if-none-match":jsonRes.headers.ETag}},cachedRes); assert.equal(cachedRes.statusCode,304); assert.equal(cachedRes.body,""); assert.equal(cachedRes.headers.ETag,jsonRes.headers.ETag);
  const jsRes=mockResponse(); await handler({method:"GET",url:"/api/providers?format=js",headers:{}},jsRes); assert.equal(jsRes.statusCode,200); assert.match(jsRes.headers["Content-Type"],/application\/javascript/); assert.match(jsRes.body,/window\.PROVIDERS=/); assert.match(jsRes.body,/window\.JAPAN_HEALTH_DATA_META=/); assert.equal(jsRes.headers.ETag,jsonRes.headers.ETag);
  const postRes=mockResponse(); await handler({method:"POST",url:"/api/providers",headers:{}},postRes); assert.equal(postRes.statusCode,405);
  console.log(`Provider API validation passed for ${payload.providers.length} records with dedupe, promotions and ETag caching.`);
}
run().catch(err=>{console.error(err);process.exit(1);});
