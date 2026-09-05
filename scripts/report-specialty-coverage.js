const fs=require("fs");
const path=require("path");
const vm=require("vm");

const STATIC_PROVIDER_FILES=[
  "data/providers.js",
  "data/tokyo-english-directory.js",
  "data/tokyo-verified-clinics.js",
  "data/drive-provider-handoff.js",
  "data/provider-promotions-2026-09-05.js",
  "data/provider-promotions-batch-2.js",
  "data/provider-promotions-batch-3.js",
  "data/provider-promotions-batch-4.js",
  "data/provider-promotions-batch-5.js"
];

const TARGETS=[
  ["Internal Medicine",/internal medicine|general medicine|general practice|primary care/i],
  ["Dentistry",/dentistry|dental|oral surgery|oral health/i],
  ["Dermatology",/dermatology|skin/i],
  ["Gynecology / Women's Health",/gynecology|obstetrics|women's health|women’s health|ob-gyn/i],
  ["Pediatrics",/pediatrics|children's health|children’s health|pediatric/i],
  ["Ophthalmology",/ophthalmology|eye/i],
  ["ENT",/\bent\b|otorhinolaryngology|ear nose|head and neck/i],
  ["Orthopedics",/orthopedic|orthopaedic|orthopedics/i],
  ["Mental Health",/psychiatry|psychosomatic|mental health/i],
  ["Neurology",/neurology|movement disorders|parkinson/i],
  ["Urology",/urology/i],
  ["Health Screening",/health screening|health checkup|medical examination|medical checkup|preventive health|ningen dock/i],
  ["Travel Medicine",/travel medicine|travel health|travel clinic|travel vaccination|vaccination|immunization/i],
  ["Cosmetic / Aesthetic",/cosmetic|aesthetic|plastic surgery/i]
];

function normalizeName(value){
  return String(value||"").toLowerCase().replace(/[^a-z0-9]/g,"");
}

function loadProviders(){
  const sandbox={window:{PROVIDERS:[]}};
  for(const relativePath of STATIC_PROVIDER_FILES){
    const source=fs.readFileSync(path.join(process.cwd(),relativePath),"utf8");
    vm.runInNewContext(source,sandbox,{filename:relativePath,timeout:1000});
  }
  const byName=new Map();
  for(const provider of sandbox.window.PROVIDERS||[]){
    if(!provider||provider.city!=="Tokyo")continue;
    const key=normalizeName(provider.name)||provider.id;
    byName.set(key,provider);
  }
  return [...byName.values()];
}

function providerText(provider){
  return [provider.name,...(provider.specialties||[])].join(" | ");
}

const providers=loadProviders();
const rows=TARGETS.map(([category,pattern])=>{
  const matches=providers.filter(p=>pattern.test(providerText(p)));
  const verified=matches.filter(p=>p.recordStatus==="official-source-verified").length;
  return {category,total:matches.length,verified,names:matches.map(p=>p.name)};
});

console.log(`Tokyo specialty coverage audit — ${providers.length} unique Tokyo providers loaded`);
console.log("Target: at least 5 provider options per routine-care category. Counts are access-directory coverage, not clinical-quality rankings.\n");
for(const row of rows){
  const status=row.total>=5?"OK":"GAP";
  console.log(`${status.padEnd(3)} ${row.category.padEnd(30)} ${String(row.total).padStart(3)} total · ${String(row.verified).padStart(3)} source-checked`);
}

const gaps=rows.filter(r=>r.total<5);
if(gaps.length){
  console.log("\nCoverage gaps (<5):");
  for(const gap of gaps)console.log(`- ${gap.category}: ${gap.total} (${gap.names.join(", ")||"none"})`);
  process.exitCode=2;
}else{
  console.log("\nAll tracked routine-care categories have at least 5 Tokyo provider options.");
}
