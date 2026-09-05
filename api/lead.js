const crypto=require("crypto");
const ALLOWED={
  audience:new Set(["visitor","resident","medical-travel","unknown"]),
  language:new Set(["all","direct","interpreter"]),
  coordinator:new Set(["all","required","not-required"]),
  referral:new Set(["all","required","no"]),
  timeframe:new Set(["flexible","within-2-weeks","within-1-month","within-3-months","urgent-access-question"]),
  contactPreference:new Set(["email","either"]),
  evidenceType:new Set(["disease_focus","procedure","specialist_clinic","second_opinion","service","research_focus","legacy"]),
  evidenceStatus:new Set(["demo","verified","unverified"])
};
const MAX_BODY_BYTES=16000;
function enumValue(value,allowed,fallback){const normalized=String(value||"").trim();return allowed.has(normalized)?normalized:fallback;}
function text(value,max){return String(value||"").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g," ").trim().slice(0,max);}
function requestId(){return `jh_${Date.now()}_${Math.random().toString(36).slice(2,10)}`;}
function finiteScore(value){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(100,Math.round(n))):null;}
function sanitizeProviderContext(raw){if(!raw||typeof raw!=="object")return null;const evidence=Array.isArray(raw.evidence)?raw.evidence.slice(0,12).map(e=>({type:enumValue(e&&e.type,ALLOWED.evidenceType,"legacy"),label:text(e&&e.label,300),status:enumValue(e&&e.status,ALLOWED.evidenceStatus,"unverified")})).filter(e=>e.label):[];const s=raw.accessSnapshot&&typeof raw.accessSnapshot==="object"?raw.accessSnapshot:{};const b=s.breakdown&&typeof s.breakdown==="object"?s.breakdown:{};return{provenance:"client-supplied-unverified-context",evidence,accessSnapshot:{score:finiteScore(s.score),breakdown:{communication:finiteScore(b.communication),booking:finiteScore(b.booking),eligibility:finiteScore(b.eligibility),cost:finiteScore(b.cost)},priceTransparency:text(s.priceTransparency||"unknown",30)},disclaimer:"Access matching context only; not clinical quality or medical advice."};}
function routingTags(lead){const tags=[`audience:${lead.audience}`,`timeframe:${lead.timeframe}`,`contact:${lead.contactPreference}`];if(lead.audience==="medical-travel")tags.push("journey:major-medical-travel");const c=lead.accessConstraints;if(c.language!=="all")tags.push(`language:${c.language}`);if(c.coordinator!=="all")tags.push(`coordinator:${c.coordinator}`);if(c.referral!=="all")tags.push(`referral:${c.referral}`);if(lead.providerContext&&lead.providerContext.evidence.length)tags.push("provider-context:present");return tags;}
function signedHeaders(body,id){const secret=process.env.PARTNER_WEBHOOK_SECRET;if(!secret)return{};const timestamp=Math.floor(Date.now()/1000).toString();const signature=crypto.createHmac("sha256",secret).update(`${timestamp}.${body}`).digest("hex");return{"X-Japan-Health-Timestamp":timestamp,"X-Japan-Health-Signature":`sha256=${signature}`,"X-Request-Id":id};}
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
  const amecaWebhook=process.env.AMECA_LEAD_WEBHOOK_URL,fallbackWebhook=process.env.GENERAL_PARTNER_WEBHOOK_URL,endpoint=amecaWebhook||fallbackWebhook;
  const destination=amecaWebhook?"ameca":fallbackWebhook?"general-partner":"unconfigured";
  const lead={schemaVersion:"2.3",requestId:id,name,email,audience:enumValue(b.audience,ALLOWED.audience,"unknown"),city:text(b.city||"unknown",100),need:text(b.need,500),notes:text(b.notes,5000),timeframe:enumValue(b.timeframe,ALLOWED.timeframe,"flexible"),contactPreference:enumValue(b.contactPreference,ALLOWED.contactPreference,"email"),providerSelection:b.providerId||b.providerName?{id:b.providerId?text(b.providerId,150):null,name:b.providerName?text(b.providerName,300):null,provenance:"client-supplied-unverified-context"}:null,providerContext:sanitizeProviderContext(b.providerContext),sourcePage:text(b.sourcePage,500),partnerRoute:destination,accessConstraints,consentScope:"coordination-inquiry-partner-sharing",consentRecorded:true,consentRecordedAt:new Date().toISOString(),createdAt:new Date().toISOString()};
  lead.routingTags=routingTags(lead);
  const allowDemoLeads=String(process.env.ALLOW_DEMO_LEADS||"").toLowerCase()==="true";
  if(!endpoint){if(allowDemoLeads){console.log("DEMO QUALIFIED LEAD",{requestId:id,audience:lead.audience,city:lead.city,need:lead.need,timeframe:lead.timeframe,contactPreference:lead.contactPreference,providerSelection:lead.providerSelection&&lead.providerSelection.id,accessConstraints:lead.accessConstraints,routingTags:lead.routingTags});return res.status(200).json({ok:true,forwarded:false,demo:true,requestId:id});}res.setHeader("Retry-After","300");return res.status(503).json({error:"Coordinator handoff is temporarily unavailable. Please try again later.",requestId:id});}
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),8000);
  try{const event={event:"qualified_healthcare_lead",schemaVersion:"2.3",platform:"japan-health",destination,lead},body=JSON.stringify(event);const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json","User-Agent":"Japan-Health-Lead-Handoff/2.3","X-Request-Id":id,"X-Japan-Health-Schema":"2.3",...signedHeaders(body,id)},body,signal:controller.signal});if(!r.ok)throw new Error(`Partner webhook returned ${r.status}`);return res.status(200).json({ok:true,forwarded:true,requestId:id});}
  catch(e){console.error("PARTNER HANDOFF FAILED",{requestId:id,destination,message:e&&e.message?e.message:"unknown"});return res.status(502).json({error:"Coordinator handoff failed. Please try again later.",requestId:id});}
  finally{clearTimeout(timeout);}
};