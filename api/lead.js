const ALLOWED={
  audience:new Set(["visitor","resident","unknown"]),
  language:new Set(["all","direct","interpreter"]),
  coordinator:new Set(["all","required","not-required"]),
  referral:new Set(["all","required","no"]),
  timeframe:new Set(["flexible","within-2-weeks","within-1-month","within-3-months","urgent-access-question"]),
  contactPreference:new Set(["email","either"])
};
const MAX_BODY_BYTES=12000;
function enumValue(value,allowed,fallback){const normalized=String(value||"").trim();return allowed.has(normalized)?normalized:fallback;}
function text(value,max){return String(value||"").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g," ").trim().slice(0,max);}
function requestId(){return `jh_${Date.now()}_${Math.random().toString(36).slice(2,10)}`;}
module.exports = async function handler(req,res){
  res.setHeader("Cache-Control","no-store");
  res.setHeader("Allow","POST");
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const b=req.body&&typeof req.body==="object"?req.body:{};
  if(Buffer.byteLength(JSON.stringify(b),"utf8")>MAX_BODY_BYTES) return res.status(413).json({error:"Coordination inquiry is too large. Please shorten the additional context."});
  const name=text(b.name,150),email=text(b.email,320).toLowerCase();
  const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if(!name||!email) return res.status(400).json({error:"Name and email required"});
  if(!emailOk) return res.status(400).json({error:"Enter a valid email address"});
  if(b.partnerConsent!==true) return res.status(400).json({error:"Partner-sharing consent is required for a coordination inquiry"});
  const rawConstraints=b.accessConstraints&&typeof b.accessConstraints==="object"?b.accessConstraints:{};
  const accessConstraints={query:text(rawConstraints.q,300),audience:enumValue(rawConstraints.audience,ALLOWED.audience,"unknown"),city:text(rawConstraints.city||"all",100),language:enumValue(rawConstraints.language,ALLOWED.language,"all"),coordinator:enumValue(rawConstraints.coordinator,ALLOWED.coordinator,"all"),referral:enumValue(rawConstraints.referral,ALLOWED.referral,"all")};
  const id=requestId();res.setHeader("X-Request-Id",id);
  const amecaWebhook=process.env.AMECA_LEAD_WEBHOOK_URL,fallbackWebhook=process.env.GENERAL_PARTNER_WEBHOOK_URL,endpoint=amecaWebhook||fallbackWebhook;
  const destination=amecaWebhook?"ameca":fallbackWebhook?"general-partner":"unconfigured";
  const lead={schemaVersion:"2.0",requestId:id,name,email,audience:enumValue(b.audience,ALLOWED.audience,"unknown"),city:text(b.city||"unknown",100),need:text(b.need,500),notes:text(b.notes,5000),timeframe:enumValue(b.timeframe,ALLOWED.timeframe,"flexible"),contactPreference:enumValue(b.contactPreference,ALLOWED.contactPreference,"email"),providerId:b.providerId?text(b.providerId,150):null,providerName:b.providerName?text(b.providerName,300):null,sourcePage:text(b.sourcePage,500),partnerRoute:destination,accessConstraints,consentScope:"coordination-inquiry-partner-sharing",consentRecorded:true,consentRecordedAt:new Date().toISOString(),createdAt:new Date().toISOString()};
  const allowDemoLeads=String(process.env.ALLOW_DEMO_LEADS||"").toLowerCase()==="true";
  if(!endpoint){
    if(allowDemoLeads){console.log("DEMO QUALIFIED LEAD",{requestId:id,audience:lead.audience,city:lead.city,need:lead.need,timeframe:lead.timeframe,contactPreference:lead.contactPreference,providerId:lead.providerId,accessConstraints:lead.accessConstraints});return res.status(200).json({ok:true,forwarded:false,demo:true,requestId:id});}
    res.setHeader("Retry-After","300");return res.status(503).json({error:"Coordinator handoff is temporarily unavailable. Please try again later.",requestId:id});
  }
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),8000);
  try{
    const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json","User-Agent":"Japan-Health-Lead-Handoff/2.0","X-Request-Id":id,"X-Japan-Health-Schema":"2.0"},body:JSON.stringify({event:"qualified_healthcare_lead",schemaVersion:"2.0",platform:"japan-health",destination,lead}),signal:controller.signal});
    if(!r.ok)throw new Error(`Partner webhook returned ${r.status}`);
    return res.status(200).json({ok:true,forwarded:true,requestId:id});
  }catch(e){console.error("PARTNER HANDOFF FAILED",{requestId:id,destination,message:e&&e.message?e.message:"unknown"});return res.status(502).json({error:"Coordinator handoff failed. Please try again later.",requestId:id});}
  finally{clearTimeout(timeout);}
};
