const fs=require("fs");
const index=fs.readFileSync("index.html","utf8");
const match=index.match(/<script>window\.PROVIDERS\s*=\s*(\[[\s\S]*?\]);<\/script>/);
if(!match)throw new Error("Could not find embedded window.PROVIDERS dataset in index.html");
let providers;
try{providers=JSON.parse(match[1]);}catch(error){throw new Error(`Embedded provider dataset is not valid JSON: ${error.message}`)}
if(!Array.isArray(providers)||providers.length===0)throw new Error("Provider dataset must be a non-empty array");
const required=["id","name","city","area","audience","specialties","doctorEnglish","receptionEnglish","interpreter","coordinator","selfPay","referral","source","verified","notes"];
const evidenceTypes=new Set(["disease_focus","procedure","specialist_clinic","second_opinion","service","research_focus"]);
const errors=[];
for(const [i,p] of providers.entries()){
  const where=`provider[${i}] ${p&&p.id?`(${p.id})`:""}`;
  if(!p||typeof p!=="object"){errors.push(`${where}: must be an object`);continue}
  for(const key of required)if(p[key]===undefined||p[key]===null||p[key]==="")errors.push(`${where}: missing ${key}`);
  if(!Array.isArray(p.audience)||!p.audience.length)errors.push(`${where}: audience must be a non-empty array`);
  if(!Array.isArray(p.specialties)||!p.specialties.length)errors.push(`${where}: specialties must be a non-empty array`);
  if(!Array.isArray(p.expertiseEvidence))errors.push(`${where}: expertiseEvidence must be an array`);
  if("clinicalQuality" in p||"qualityRank" in p||"medicalQualityScore" in p)errors.push(`${where}: clinical-quality rankings are not allowed`);
  const demo=String(p.id||"").startsWith("demo-");
  if(demo){
    if(!String(p.name||"").startsWith("Demo "))errors.push(`${where}: demo provider name must begin with "Demo "`);
    if(!String(p.source||"").toLowerCase().includes("demo record"))errors.push(`${where}: demo source must remain visibly labeled as a demo record`);
    if(p.verified!=="Not verified")errors.push(`${where}: demo verified value must remain "Not verified"`);
    for(const value of p.expertiseEvidence||[])if(!String(value).toLowerCase().includes("demo"))errors.push(`${where}: demo expertise evidence must be visibly labeled as demo`);
    for(const key of ["medicalCost","interpreterCost","coordinatorCost"])if(p[key]!==undefined&&p[key]!=="Unknown")errors.push(`${where}: ${key} must remain Unknown for current demo records`);
  }else{
    if(!/^https:\/\//i.test(String(p.source||"")))errors.push(`${where}: production provider source must be an https URL`);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(String(p.verified||"")))errors.push(`${where}: production provider verified must be an explicit YYYY-MM-DD date`);
  }
  if(p.expertiseEvidenceStructured!==undefined){
    if(!Array.isArray(p.expertiseEvidenceStructured))errors.push(`${where}: expertiseEvidenceStructured must be an array`);
    else for(const [j,e] of p.expertiseEvidenceStructured.entries()){
      if(!e||typeof e!=="object"){errors.push(`${where}: structured evidence ${j} must be an object`);continue}
      if(!evidenceTypes.has(e.type))errors.push(`${where}: structured evidence ${j} has unsupported type`);
      if(!String(e.label||"").trim())errors.push(`${where}: structured evidence ${j} needs a label`);
      if(demo&&e.demo!==true)errors.push(`${where}: structured demo evidence ${j} must set demo:true`);
      if(!demo&&!/^https:\/\//i.test(String(e.sourceUrl||"")))errors.push(`${where}: production structured evidence ${j} needs an https sourceUrl`);
    }
  }
}
if(errors.length){console.error("Provider data validation failed:\n- "+errors.join("\n- "));process.exit(1)}
console.log(`Provider data validation passed for ${providers.length} records (${providers.filter(p=>String(p.id).startsWith("demo-")).length} demo).`);
