const crypto=require("crypto");
const ALLOWED={
  audience:new Set(["visitor","resident","medical-travel","unknown"]),
  language:new Set(["all","direct","interpreter"]),
  coordinator:new Set(["all","required","not-required"]),
  referral:new Set(["all","required","no"]),
  timeframe:new Set(["flexible","within-2-weeks","within-1-month","within-3-months","urgent-access-question"]),
  contactPreference:new Set(["email","either"]),
  evidenceType:new Set(["disease_focus","procedure","specialist_clinic","second_opinion","service","research_focus","legacy"]),
  evidenceStatus:new Set(["demo","verified","official-source-verified","unverified"]),
  costCompleteness:new Set(["components-recorded","partial","needs-verification"]),
  costProvenance:new Set(["official-source-checked","demo-unverified","unknown"]),
  specialistEvidenceState:new Set(["source-backed","record-only","specialty-only","no-match","no-query"]),
  serviceAccessState:new Set(["service-level-confirmed","provider-level-only","service-level-unverified","needs-verification"]),
  accessRoute:new Set(["direct-physician-english","interpreter","external-interpreter","language-support","partial-or-limited-english","no-documented-route"]),
  serviceReferral:new Set(["required","recommended","not-required","conditional","varies","unknown"]),
  serviceCoordinator:new Set(["required","conditional","not-required","unknown"]),
  serviceAudience:new Set(["visitor","resident","unknown"])
};
const MAX_BODY_BYTES=18000;
const SCHEMA_VERSION="2.7";
function enumValue(value,allowed,fallback){const normalized=String(value||"").trim();return allowed.has(normalized)?normalized:fallback;}
function text(value,max){return String(value||"").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g," ").trim().slice(0,max);}
function safeUrl(value){const v=text(value,1000);if(!v)return null;try{const u=new URL(v);return u.protocol==="https:"?u.toString():null;}catch{return null;}}
function requestId(){return `jh_${Date.now()}_${Math.random().toString(36).slice(2,10)}`;}
function finiteScore(value){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(100,Math.round(n))):null;}
function boundedInt(value,min,max,fallback=0){const n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,Math.floor(n))):fallback;}
function scoreBand(value){const n=finiteScore(value);if(n===null)return null;return n>=80?"lower-friction":n>=65?"relatively-lower-friction":n>=50?"moderate-friction":"higher-friction";}
function sanitizeSourcePage(value){const raw=text(value,700);if(!raw)return"";try{const u=new URL(raw,"https://japan-health.local");return `${u.pathname}${u.search}${u.hash}`.slice(0,700);}catch{return raw.startsWith("/")?raw:"";}}
function finderContext(sourcePage){if(!sourcePage)return{area:null,verifiedOnly:false};try{const u=new URL(sourcePage,"https://japan-health.local");return{area:text(u.searchParams.get("area"),100)||null,verifiedOnly:u.searchParams.get("verifiedOnly")==="1"};}catch{return{area:null,verifiedOnly:false};}}
function sanitizeProviderContext(raw){
  if(!raw||typeof raw!=="object")return null;
  const evidence=Array.isArray(raw.evidence)?raw.evidence.slice(0,12).map(e=>({
    type:enumValue(e&&e.type,ALLOWED.evidenceType,"legacy"),
    label:text(e&&e.label,300),
    status:enumValue(e&&e.status,ALLOWED.evidenceStatus,"unverified"),
    sourceUrl:safeUrl(e&&e.sourceUrl),
    verifiedDate:text(e&&e.verifiedDate,30)||null
  })).filter(e=>e.label):[];
  const s=raw.accessSnapshot&&typeof raw.accessSnapshot==="object"?raw.accessSnapshot:{};
  const b=s.breakdown&&typeof s.breakdown==="object"?s.breakdown:{};
  const score=finiteScore(s.score),priceTransparency=text(s.priceTransparency||"unknown",30);
  return{
    provenance:"client-supplied-unverified-context",
    evidence,
    accessSnapshot:{score,scoreBand:scoreBand(score),breakdown:{communication:finiteScore(b.communication),booking:finiteScore(b.booking),eligibility:finiteScore(b.eligibility),cost:finiteScore(b.cost)},priceTransparency},
    disclaimer:"Access matching context only; source URLs and verification labels are client-supplied context for partner re-checking, not clinical quality or medical advice."
  };
}
function sanitizeCostSnapshot(raw){
  if(!raw||typeof raw!=="object")return null;
  const total=boundedInt(raw.total,1,3,3),recorded=boundedInt(raw.recorded,0,total,0);
  const missing=Array.isArray(raw.missing)?raw.missing.slice(0,3).map(x=>text(x,80)).filter(Boolean):[];
  return{
    recorded,total,missing,
    publishedCount:boundedInt(raw.publishedCount,0,50,0),
    completeness:enumValue(raw.completeness,ALLOWED.costCompleteness,recorded===total?"components-recorded":recorded?"partial":"needs-verification"),
    priceTransparency:text(raw.priceTransparency||"unknown",30),
    provenance:enumValue(raw.provenance,ALLOWED.costProvenance,"unknown"),
    disclaimer:"Cost-readiness context only. Recorded components and published examples are not a price quote, affordability score, or guaranteed total; partners must re-check current fees."
  };
}
function sanitizeServiceBookingRequirements(raw){
  if(!raw||typeof raw!=="object")return null;
  const audience=Array.isArray(raw.audience)?raw.audience.slice(0,3).map(x=>enumValue(x,ALLOWED.serviceAudience,"unknown")):[];
  return{
    audience:[...new Set(audience)],
    audienceDetail:text(raw.audienceDetail,600)||null,
    referral:enumValue(raw.referral,ALLOWED.serviceReferral,"unknown"),
    referralDetail:text(raw.referralDetail,700)||null,
    bookingStart:text(raw.bookingStart,1000)||null,
    coordinator:enumValue(raw.coordinator,ALLOWED.serviceCoordinator,"unknown"),
    coordinatorDetail:text(raw.coordinatorDetail,700)||null,
    sourceUrl:safeUrl(raw.sourceUrl),
    verifiedDate:text(raw.verifiedDate,30)||null
  };
}
function sanitizeSpecialistAccessSnapshot(raw){
  if(!raw||typeof raw!=="object")return null;
  const matches=Array.isArray(raw.matches)?raw.matches.slice(0,8).map(e=>({
    type:enumValue(e&&e.type,ALLOWED.evidenceType,"legacy"),
    label:text(e&&e.label,300),
    status:enumValue(e&&e.status,ALLOWED.evidenceStatus,"unverified"),
    sourceUrl:safeUrl(e&&e.sourceUrl),
    verifiedDate:text(e&&e.verifiedDate,30)||null,
    accessRequirements:sanitizeServiceBookingRequirements(e&&e.accessRequirements)
  })).filter(e=>e.label):[];
  const s=raw.serviceAccess&&typeof raw.serviceAccess==="object"?raw.serviceAccess:{};
  return{
    query:text(raw.query,300),
    evidenceState:enumValue(raw.evidenceState,ALLOWED.specialistEvidenceState,"no-match"),
    sourceBackedCount:boundedInt(raw.sourceBackedCount,0,8,0),
    matches,
    providerAccessRoute:enumValue(raw.providerAccessRoute,ALLOWED.accessRoute,"no-documented-route"),
    providerAccessRouteVerified:raw.providerAccessRouteVerified===true,
    serviceAccess:{
      state:enumValue(s.state,ALLOWED.serviceAccessState,"needs-verification"),
      route:enumValue(s.route,ALLOWED.accessRoute,"no-documented-route"),
      sourceUrl:safeUrl(s.sourceUrl),
      verifiedDate:text(s.verifiedDate,30)||null,
      evidenceLabel:text(s.evidenceLabel,300)||null
    },
    serviceBookingRequirements:sanitizeServiceBookingRequirements(raw.serviceBookingRequirements),
    provenance:enumValue(raw.provenance,ALLOWED.costProvenance,"unknown"),
    disclaimer:"Specialist evidence, service-language and booking-path context only. Provider-wide access is not proof that a specific specialist service offers the same route; partners must re-check current access. Not medical advice or clinical-quality ranking."
  };
}
function coordinationSummary(lead){
  const c=lead.accessConstraints,needs=[];
  if(c.language==="interpreter")needs.push("interpreter-pathway");
  if(c.coordinator==="required")needs.push("coordinator-required");
  if(c.referral==="required")needs.push("referral-required");
  if(lead.finderContext.verifiedOnly)needs.push("provider-source-checked-only");
  const specialist=lead.specialistAccessSnapshot;
  if(specialist&&["provider-level-only","service-level-unverified","needs-verification"].includes(specialist.serviceAccess.state))needs.push("service-language-verification");
  const booking=specialist?.serviceBookingRequirements;
  if(booking?.referral==="required"&&!needs.includes("referral-required"))needs.push("referral-required");
  if(booking?.coordinator==="required"&&!needs.includes("coordinator-required"))needs.push("coordinator-required");
  if(booking?.coordinator==="conditional")needs.push("coordinator-condition-check");
  if(booking&&booking.audience.includes("unknown"))needs.push("service-audience-verification");
  const snap=lead.costSnapshot,priceTransparency=lead.providerContext?.accessSnapshot?.priceTransparency||snap?.priceTransparency||"unknown";
  let costVisibility=["medium","high"].includes(priceTransparency)?"partial-or-better":"needs-verification";
  if(snap?.completeness==="components-recorded")costVisibility="components-recorded-final-total-unconfirmed";
  else if(snap?.completeness==="partial")costVisibility="partial-components-need-confirmation";
  else if(snap?.completeness==="needs-verification")costVisibility="components-need-verification";
  const classification=lead.audience==="medical-travel"?"complex-cross-border":needs.length>=2?"assisted-access":"standard-access";
  return{
    classification,
    needs,
    costVisibility,
    disclaimer:"Logistics classification only; not medical urgency, clinical quality, outcomes, or treatment advice. Cost visibility is data completeness, not a quote."
  };
}
function routingTags(lead){
  const tags=[`audience:${lead.audience}`,`timeframe:${lead.timeframe}`,`contact:${lead.contactPreference}`];
  if(lead.audience==="medical-travel")tags.push("journey:major-medical-travel");
  const c=lead.accessConstraints;
  if(c.language!=="all")tags.push(`language:${c.language}`);
  if(c.coordinator!=="all")tags.push(`coordinator:${c.coordinator}`);
  if(c.referral!=="all")tags.push(`referral:${c.referral}`);
  if(lead.finderContext.area)tags.push(`area:${lead.finderContext.area.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,80)}`);
  if(lead.finderContext.verifiedOnly)tags.push("finder:provider-source-checked-only");
  if(lead.providerContext&&lead.providerContext.evidence.length){
    tags.push("provider-context:present");
    if(lead.providerContext.evidence.some(e=>e.status==="official-source-verified"))tags.push("provider-evidence:official-source-verified");
    if(lead.providerContext.evidence.some(e=>e.sourceUrl))tags.push("provider-evidence:source-link-present");
  }
  if(lead.providerContext?.accessSnapshot?.scoreBand)tags.push(`access-friction:${lead.providerContext.accessSnapshot.scoreBand}`);
  const pt=lead.providerContext?.accessSnapshot?.priceTransparency;
  if(pt&&pt!=="unknown")tags.push(`price-transparency:${pt}`);
  if(lead.specialistAccessSnapshot){
    const s=lead.specialistAccessSnapshot;
    tags.push("specialist-context:present");
    tags.push(`specialist-evidence:${s.evidenceState}`);
    tags.push(`service-access:${s.serviceAccess.state}`);
    tags.push(`service-route:${s.serviceAccess.route}`);
    if(s.serviceAccess.sourceUrl)tags.push("service-access:source-link-present");
    const b=s.serviceBookingRequirements;
    if(b){
      tags.push("service-booking:present");
      tags.push(`service-referral:${b.referral}`);
      tags.push(`service-coordinator:${b.coordinator}`);
      for(const audience of b.audience)tags.push(`service-audience:${audience}`);
      if(b.sourceUrl)tags.push("service-booking:source-link-present");
    }
  }
  if(lead.costSnapshot){
    tags.push(`cost-components:${lead.costSnapshot.recorded}-of-${lead.costSnapshot.total}`);
    tags.push(`cost-context:${lead.costSnapshot.provenance}`);
    if(lead.costSnapshot.publishedCount)tags.push("cost:published-example-present");
    for(const item of lead.costSnapshot.missing)tags.push(`cost-missing:${item.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)}`);
  }
  if(lead.coordinationSummary){
    tags.push(`coordination-class:${lead.coordinationSummary.classification}`);
    tags.push(`total-cost:${lead.coordinationSummary.costVisibility}`);
    for(const need of lead.coordinationSummary.needs)tags.push(`access-need:${need}`);
  }
  return tags;
}
function signedHeaders(body,id){const secret=process.env.PARTNER_WEBHOOK_SECRET;if(!secret)return{};const timestamp=Math.floor(Date.now()/1000).toString();const signature=crypto.createHmac("sha256",secret).update(`${timestamp}.${body}`).digest("hex");return{"X-Japan-Health-Timestamp":timestamp,"X-Japan-Health-Signature":`sha256=${signature}`,"X-Request-Id":id};}
async function postPartner(endpoint,destination,lead,id,signal){const event={event:"qualified_healthcare_lead",schemaVersion:SCHEMA_VERSION,platform:"japan-health",destination,lead:{...lead,partnerRoute:destination}},body=JSON.stringify(event);const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json","User-Agent":`Japan-Health-Lead-Handoff/${SCHEMA_VERSION}`,"X-Request-Id":id,"X-Japan-Health-Schema":SCHEMA_VERSION,...signedHeaders(body,id)},body,signal});if(!r.ok)throw new Error(`Partner webhook returned ${r.status}`);return{destination};}
module.exports=async function handler(req,res){
  res.setHeader("Cache-Control","no-store");res.setHeader("Allow","POST");
  if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
  const b=req.body&&typeof req.body==="object"?req.body:{};
  if(Buffer.byteLength(JSON.stringify(b),"utf8")>MAX_BODY_BYTES)return res.status(413).json({error:"Coordination inquiry is too large. Please shorten the additional context."});
  const name=text(b.name,150),email=text(b.email,320).toLowerCase();
  if(!name||!email)return res.status(400).json({error:"Name and email required"});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({error:"Enter a valid email address"});
  if(b.partnerConsent!==true)return res.status(400).json({error:"Partner-sharing consent is required for a coordination inquiry"});
  const rawConstraints=b.accessConstraints&&typeof b.accessConstraints==="object"?b.accessConstraints:{};
  const accessConstraints={query:text(rawConstraints.q,300),audience:enumValue(rawConstraints.audience,ALLOWED.audience,"unknown"),city:text(rawConstraints.city||"all",100),language:enumValue(rawConstraints.language,ALLOWED.language,"all"),coordinator:enumValue(rawConstraints.coordinator,ALLOWED.coordinator,"all"),referral:enumValue(rawConstraints.referral,ALLOWED.referral,"all")};
  const id=requestId();res.setHeader("X-Request-Id",id);
  const sourcePage=sanitizeSourcePage(b.sourcePage),pageContext=finderContext(sourcePage);
  const lead={schemaVersion:SCHEMA_VERSION,requestId:id,name,email,audience:enumValue(b.audience,ALLOWED.audience,"unknown"),city:text(b.city||"unknown",100),need:text(b.need,500),notes:text(b.notes,5000),timeframe:enumValue(b.timeframe,ALLOWED.timeframe,"flexible"),contactPreference:enumValue(b.contactPreference,ALLOWED.contactPreference,"email"),providerSelection:b.providerId||b.providerName?{id:b.providerId?text(b.providerId,150):null,name:b.providerName?text(b.providerName,300):null,provenance:"client-supplied-unverified-context"}:null,providerContext:sanitizeProviderContext(b.providerContext),costSnapshot:sanitizeCostSnapshot(b.costSnapshot),specialistAccessSnapshot:sanitizeSpecialistAccessSnapshot(b.specialistAccessSnapshot),sourcePage,finderContext:pageContext,partnerRoute:"unconfigured",accessConstraints,consentScope:"coordination-inquiry-partner-sharing",consentRecorded:true,consentRecordedAt:new Date().toISOString(),createdAt:new Date().toISOString()};
  lead.coordinationSummary=coordinationSummary(lead);
  lead.routingTags=routingTags(lead);
  const amecaWebhook=process.env.AMECA_LEAD_WEBHOOK_URL,fallbackWebhook=process.env.GENERAL_PARTNER_WEBHOOK_URL;
  const allowDemoLeads=String(process.env.ALLOW_DEMO_LEADS||"").toLowerCase()==="true";
  if(!amecaWebhook&&!fallbackWebhook){if(allowDemoLeads){console.log("DEMO QUALIFIED LEAD",{requestId:id,audience:lead.audience,city:lead.city,need:lead.need,timeframe:lead.timeframe,contactPreference:lead.contactPreference,providerSelection:lead.providerSelection&&lead.providerSelection.id,accessConstraints:lead.accessConstraints,finderContext:lead.finderContext,costSnapshot:lead.costSnapshot,specialistAccessSnapshot:lead.specialistAccessSnapshot,coordinationSummary:lead.coordinationSummary,routingTags:lead.routingTags});return res.status(200).json({ok:true,forwarded:false,demo:true,requestId:id});}res.setHeader("Retry-After","300");return res.status(503).json({error:"Coordinator handoff is temporarily unavailable. Please try again later.",requestId:id});}
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),8000);
  try{
    if(amecaWebhook){try{const sent=await postPartner(amecaWebhook,"ameca",lead,id,controller.signal);return res.status(200).json({ok:true,forwarded:true,destination:sent.destination,requestId:id});}catch(e){console.error("AMECA HANDOFF FAILED",{requestId:id,message:e&&e.message?e.message:"unknown"});if(!fallbackWebhook||fallbackWebhook===amecaWebhook)throw e;}}
    if(fallbackWebhook){const sent=await postPartner(fallbackWebhook,"general-partner",lead,id,controller.signal);return res.status(200).json({ok:true,forwarded:true,destination:sent.destination,requestId:id});}
    throw new Error("No partner endpoint available");
  }catch(e){console.error("PARTNER HANDOFF FAILED",{requestId:id,message:e&&e.message?e.message:"unknown"});return res.status(502).json({error:"Coordinator handoff failed. Please try again later.",requestId:id});
  }
  finally{clearTimeout(timeout);}
};