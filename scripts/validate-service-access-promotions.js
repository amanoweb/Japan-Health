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
  "data/service-access-promotions-2026-09-05.js"
];
const sandbox={window:{PROVIDERS:[]}};
for(const file of files)vm.runInNewContext(fs.readFileSync(file,"utf8"),sandbox,{filename:file,timeout:1000});
const providers=sandbox.window.PROVIDERS||[];
const byId=id=>providers.find(p=>p&&p.id===id);
const errors=[];

const jihs=byId("jihs-center-hospital-icc");
if(!jihs)errors.push("JIHS provider missing");
else{
  const secondOpinion=(jihs.expertiseEvidence||[]).find(e=>e&&e.type==="second_opinion"&&/online second opinion/i.test(String(e.label||"")));
  const access=secondOpinion?.serviceAccess;
  if(!access)errors.push("JIHS online second opinion missing serviceAccess");
  else{
    if(access.route!=="interpreter")errors.push("JIHS online second opinion route must remain interpreter");
    if(access.evidenceStatus!=="official-source-verified")errors.push("JIHS online second opinion access must remain official-source-verified");
    if(!/^https:\/\//i.test(String(access.sourceUrl||"")))errors.push("JIHS online second opinion access needs https sourceUrl");
    if(!/^\d{4}-\d{2}-\d{2}$/.test(String(access.verifiedDate||"")))errors.push("JIHS online second opinion access needs verifiedDate");
  }
  const parkinson=(jihs.expertiseEvidence||[]).find(e=>/Parkinson/i.test(String(e?.label||"")));
  if(parkinson?.serviceAccess)errors.push("JIHS Parkinson evidence must not inherit online-second-opinion service access");
}

const utokyo=byId("utokyo-international-neurology");
if(!utokyo)errors.push("University of Tokyo international neurology provider missing");
else{
  if(utokyo.interpreter!=="available")errors.push("UTokyo provider-level interpreter availability should remain recorded");
  if(utokyo.englishDocs!=="yes")errors.push("UTokyo English-document availability should remain recorded");
  const overseas=(utokyo.expertiseEvidence||[]).find(e=>e&&e.label==="Overseas patient pathway through the International Medical Center");
  if(!overseas?.serviceAccess)errors.push("UTokyo overseas-patient pathway missing serviceAccess");
  else if(overseas.serviceAccess.route!=="interpreter")errors.push("UTokyo overseas-patient pathway route must remain interpreter");
  const parkinson=(utokyo.expertiseEvidence||[]).filter(e=>/Parkinson/i.test(String(e?.label||"")));
  if(parkinson.some(e=>e.serviceAccess))errors.push("UTokyo Parkinson evidence must remain provider-level-only / service-specific unconfirmed");
}

if(errors.length){console.error("Service-access promotion validation failed:\n- "+errors.join("\n- "));process.exit(1);}
console.log("Service-access promotion validation passed for JIHS and University of Tokyo evidence boundaries.");
