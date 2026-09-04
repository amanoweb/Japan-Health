const fs=require("fs");
const vm=require("vm");

const schema=JSON.parse(fs.readFileSync("data/expertise-evidence.schema.json","utf8"));
const code=fs.readFileSync("data/providers.js","utf8");
const sandbox={window:{}};
vm.runInNewContext(code,sandbox,{filename:"data/providers.js"});
const providers=sandbox.window.PROVIDERS;
const allowed=new Set(schema.properties.type.enum);
const errors=[];

for(const [i,p] of providers.entries()){
  const where=`provider[${i}] ${p.id||""}`;
  if(!Array.isArray(p.expertiseEvidence)){errors.push(`${where}: expertiseEvidence must be an array`);continue}
  for(const [j,e] of p.expertiseEvidence.entries()){
    const ew=`${where} evidence[${j}]`;
    if(!e||typeof e!=="object"){errors.push(`${ew}: must be a typed object`);continue}
    if(!allowed.has(e.type))errors.push(`${ew}: unsupported type ${e.type}`);
    if(!String(e.label||"").trim())errors.push(`${ew}: label is required`);
    if(!["demo","official-source-verified"].includes(e.evidenceStatus))errors.push(`${ew}: evidenceStatus must be demo or official-source-verified`);
    const demo=p.recordStatus==="demo";
    if(demo&&e.evidenceStatus!=="demo")errors.push(`${ew}: demo provider evidence must stay demo`);
    if(!demo&&e.evidenceStatus==="demo")errors.push(`${ew}: verified provider cannot use demo evidence`);
    if(e.evidenceStatus==="official-source-verified"){
      if(!/^https:\/\//i.test(String(e.sourceUrl||"")))errors.push(`${ew}: verified evidence needs an https sourceUrl`);
      if(!/^\d{4}-\d{2}-\d{2}$/.test(String(e.verifiedDate||"")))errors.push(`${ew}: verified evidence needs YYYY-MM-DD verifiedDate`);
    }
    for(const forbidden of ["qualityScore","qualityRank","outcomeScore","bestProvider","recommendedTreatment"]){
      if(Object.prototype.hasOwnProperty.call(e,forbidden))errors.push(`${ew}: ${forbidden} is not allowed in expertise evidence`);
    }
  }
}

if(errors.length){
  console.error("Expertise contract validation failed:\n- "+errors.join("\n- "));
  process.exit(1);
}
console.log(`Expertise contract validation passed for ${providers.length} provider records.`);
