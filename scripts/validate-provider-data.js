const fs=require("fs");
const vm=require("vm");

function loadProviders(){
  const code=fs.readFileSync("data/providers.js","utf8");
  const sandbox={window:{}};
  vm.runInNewContext(code,sandbox,{filename:"data/providers.js"});
  return sandbox.window.PROVIDERS;
}

const providers=loadProviders();
if(!Array.isArray(providers)||providers.length===0)throw new Error("Provider dataset must be a non-empty array");

const required=["id","name","city","area","audience","specialties","doctorEnglish","receptionEnglish","interpreter","coordinator","selfPay","referral","recordStatus","source","verified","notes","expertiseEvidence"];
const evidenceTypes=new Set(["disease_focus","procedure","specialist_clinic","second_opinion","service","research_focus"]);
const recordStatuses=new Set(["demo","official-source-verified"]);
const errors=[];

for(const [i,p] of providers.entries()){
  const where=`provider[${i}] ${p&&p.id?`(${p.id})`:""}`;
  if(!p||typeof p!=="object"){errors.push(`${where}: must be an object`);continue}
  for(const key of required)if(p[key]===undefined||p[key]===null||p[key]==="")errors.push(`${where}: missing ${key}`);
  if(!recordStatuses.has(p.recordStatus))errors.push(`${where}: unsupported recordStatus ${p.recordStatus}`);
  if(!Array.isArray(p.audience)||!p.audience.length)errors.push(`${where}: audience must be a non-empty array`);
  if(!Array.isArray(p.specialties)||!p.specialties.length)errors.push(`${where}: specialties must be a non-empty array`);
  if(!Array.isArray(p.expertiseEvidence))errors.push(`${where}: expertiseEvidence must be an array`);
  for(const forbidden of ["clinicalQuality","qualityRank","medicalQualityScore","outcomeScore","bestProvider","recommendedTreatment"]){
    if(Object.prototype.hasOwnProperty.call(p,forbidden))errors.push(`${where}: ${forbidden} is not allowed`);
  }

  const demo=p.recordStatus==="demo";
  if(demo){
    if(!String(p.id||"").startsWith("demo-"))errors.push(`${where}: demo id must begin with demo-`);
    if(!String(p.name||"").startsWith("Demo "))errors.push(`${where}: demo provider name must begin with "Demo "`);
    if(!String(p.source||"").toLowerCase().includes("demo record"))errors.push(`${where}: demo source must remain visibly labeled as a demo record`);
    if(p.verified!=="Not verified")errors.push(`${where}: demo verified value must remain "Not verified"`);
    for(const key of ["medicalCost","interpreterCost","coordinatorCost"])if(p[key]!==undefined&&p[key]!=="Unknown")errors.push(`${where}: ${key} must remain Unknown for demo records`);
  }else{
    if(String(p.id||"").startsWith("demo-"))errors.push(`${where}: verified records cannot use demo- ids`);
    if(!/^https:\/\//i.test(String(p.source||"")))errors.push(`${where}: verified provider source must be an https URL`);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(String(p.verified||"")))errors.push(`${where}: verified provider must have YYYY-MM-DD checked date`);
  }

  if(Array.isArray(p.expertiseEvidence)){
    for(const [j,e] of p.expertiseEvidence.entries()){
      const ew=`${where} expertiseEvidence[${j}]`;
      if(!e||typeof e!=="object"){errors.push(`${ew}: must be a typed object; legacy strings are not allowed`);continue}
      if(!evidenceTypes.has(e.type))errors.push(`${ew}: unsupported type ${e.type}`);
      if(!String(e.label||"").trim())errors.push(`${ew}: label is required`);
      if(demo){
        if(e.evidenceStatus!=="demo")errors.push(`${ew}: demo provider evidence must set evidenceStatus=demo`);
        if(!String(e.label||"").toLowerCase().includes("demo"))errors.push(`${ew}: demo evidence label must stay visibly labeled demo`);
      }else{
        if(e.evidenceStatus!=="official-source-verified")errors.push(`${ew}: verified provider evidence must be official-source-verified`);
        if(!/^https:\/\//i.test(String(e.sourceUrl||"")))errors.push(`${ew}: verified evidence requires https sourceUrl`);
        if(!/^\d{4}-\d{2}-\d{2}$/.test(String(e.verifiedDate||"")))errors.push(`${ew}: verified evidence requires YYYY-MM-DD verifiedDate`);
      }
    }
  }

  if(p.publishedCosts!==undefined){
    if(!Array.isArray(p.publishedCosts))errors.push(`${where}: publishedCosts must be an array`);
    else for(const [j,c] of p.publishedCosts.entries()){
      const cw=`${where} publishedCosts[${j}]`;
      if(demo)errors.push(`${cw}: demo records may not publish real prices`);
      if(!c||typeof c!=="object"){errors.push(`${cw}: must be an object`);continue}
      if(!String(c.label||"").trim()||!String(c.amount||"").trim())errors.push(`${cw}: label and amount are required`);
      if(!/^https:\/\//i.test(String(c.sourceUrl||"")))errors.push(`${cw}: published cost requires https sourceUrl`);
      if(!/^\d{4}-\d{2}-\d{2}$/.test(String(c.verifiedDate||"")))errors.push(`${cw}: published cost requires YYYY-MM-DD verifiedDate`);
    }
  }
}

const ids=providers.map(p=>p.id);
if(new Set(ids).size!==ids.length)errors.push("Provider ids must be unique");

if(errors.length){
  console.error("Provider data validation failed:\n- "+errors.join("\n- "));
  process.exit(1);
}
console.log(`Provider data validation passed for ${providers.length} records (${providers.filter(p=>p.recordStatus==="demo").length} demo, ${providers.filter(p=>p.recordStatus==="official-source-verified").length} official-source checked).`);
