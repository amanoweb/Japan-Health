const fs=require("fs");
const vm=require("vm");

const files=[
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
  "data/service-access-promotions-2026-09-05.js",
  "data/provider-service-access-batch-2026-09-05.js"
];
const sandbox={window:{PROVIDERS:[]}};
for(const file of files)vm.runInNewContext(fs.readFileSync(file,"utf8"),sandbox,{filename:file,timeout:1000});
const byId=id=>sandbox.window.PROVIDERS.find(p=>p&&p.id===id);
const errors=[];
const required=[
  "ncc-hospital-tsukiji-international",
  "tokyo-teishin-cardiology-orthopedics-international",
  "asahi-ladies-clinic-akihabara"
];
for(const id of required)if(!byId(id))errors.push(`${id}: missing from provider set`);

function serviceEvidence(p,pattern){return (p?.expertiseEvidence||[]).find(e=>pattern.test(String(e?.label||"")));}
function checkServiceAccess(e,label){
  const a=e?.serviceAccess;
  if(!a)errors.push(`${label}: missing serviceAccess`);
  else{
    if(a.evidenceStatus!=="official-source-verified")errors.push(`${label}: serviceAccess must be official-source-verified`);
    if(!/^https:\/\//i.test(String(a.sourceUrl||"")))errors.push(`${label}: serviceAccess needs https sourceUrl`);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(String(a.verifiedDate||"")))errors.push(`${label}: serviceAccess needs verifiedDate`);
  }
}

const ncc=byId(required[0]);
if(ncc){
  if(ncc.interpreter!=="external")errors.push("NCC: interpreter must remain external, not hospital-provided");
  if(ncc.coordinator!=="required")errors.push("NCC: foreign-patient coordinator requirement must remain explicit");
  checkServiceAccess(serviceEvidence(ncc,/second-opinion pathway for foreign patients/i),"NCC second opinion");
}

const teishin=byId(required[1]);
if(teishin){
  if(teishin.doctorEnglish!=="unknown")errors.push("Tokyo Teishin: Tokyo department-language listing must not be promoted to physician English");
  if(teishin.interpreter!=="external")errors.push("Tokyo Teishin: hospital instruction to bring a medical interpreter must remain explicit");
  checkServiceAccess(serviceEvidence(teishin,/Cardiovascular medicine listed with English/i),"Tokyo Teishin cardiology");
  checkServiceAccess(serviceEvidence(teishin,/Orthopedic Surgery listed with English/i),"Tokyo Teishin orthopedics");
}

const asahi=byId(required[2]);
if(asahi){
  if(asahi.doctorEnglish!=="unknown")errors.push("Asahi Ladies Clinic: language-support listing must not be promoted to physician English");
  checkServiceAccess(serviceEvidence(asahi,/Assisted reproductive technology including IVF/i),"Asahi ART");
  checkServiceAccess(serviceEvidence(asahi,/Gynecology, contraception/i),"Asahi gynecology");
}

for(const id of required){
  const p=byId(id);if(!p)continue;
  if(p.recordStatus!=="official-source-verified")errors.push(`${id}: record must be official-source-verified`);
  for(const forbidden of ["qualityScore","qualityRank","outcomeScore","bestProvider","recommendedTreatment"]){
    if(Object.prototype.hasOwnProperty.call(p,forbidden))errors.push(`${id}: forbidden clinical-quality field ${forbidden}`);
  }
}

if(errors.length){console.error("Specialty service-access batch validation failed:\n- "+errors.join("\n- "));process.exit(1);}
console.log("Specialty service-access batch validation passed for NCC, Tokyo Teishin, and Asahi Ladies Clinic.");
