const ALLOWED={
  audience:new Set(["visitor","resident","unknown"]),
  city:new Set(["Tokyo","Osaka","Other / flexible","unknown"]),
  language:new Set(["all","direct","interpreter"]),
  coordinator:new Set(["all","required","not-required"]),
  referral:new Set(["all","required","no"])
};

function enumValue(value,allowed,fallback){
  const normalized=String(value||"").trim();
  return allowed.has(normalized)?normalized:fallback;
}

function requestId(){
  return `jh_${Date.now()}_${Math.random().toString(36).slice(2,10)}`;
}

module.exports = async function handler(req,res){
  res.setHeader("Cache-Control","no-store");
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});

  const b=req.body||{};
  const name=String(b.name||"").trim();
  const email=String(b.email||"").trim().toLowerCase();
  const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if(!name||!email) return res.status(400).json({error:"Name and email required"});
  if(!emailOk) return res.status(400).json({error:"Enter a valid email address"});

  const rawConstraints=b.accessConstraints&&typeof b.accessConstraints==="object"?b.accessConstraints:{};
  const accessConstraints={
    query:String(rawConstraints.q||"").trim().slice(0,300),
    audience:enumValue(rawConstraints.audience,ALLOWED.audience,"unknown"),
    city:String(rawConstraints.city||"all").trim().slice(0,100),
    language:enumValue(rawConstraints.language,ALLOWED.language,"all"),
    coordinator:enumValue(rawConstraints.coordinator,ALLOWED.coordinator,"all"),
    referral:enumValue(rawConstraints.referral,ALLOWED.referral,"all")
  };

  const id=requestId();
  res.setHeader("X-Request-Id",id);

  const lead={
    requestId:id,
    name:name.slice(0,150),
    email:email.slice(0,320),
    audience:enumValue(b.audience,ALLOWED.audience,"unknown"),
    city:String(b.city||"unknown").trim().slice(0,100),
    need:String(b.need||"").trim().slice(0,500),
    notes:String(b.notes||"").trim().slice(0,5000),
    providerId:b.providerId?String(b.providerId).slice(0,150):null,
    providerName:b.providerName?String(b.providerName).slice(0,300):null,
    sourcePage:String(b.sourcePage||"").slice(0,500),
    partnerRoute:"ameca",
    accessConstraints,
    consentScope:"coordination-inquiry",
    createdAt:new Date().toISOString()
  };

  const amecaWebhook=process.env.AMECA_LEAD_WEBHOOK_URL;
  const fallbackWebhook=process.env.GENERAL_PARTNER_WEBHOOK_URL;
  const endpoint=amecaWebhook || fallbackWebhook;
  const allowDemoLeads=String(process.env.ALLOW_DEMO_LEADS||"").toLowerCase()==="true";

  if(!endpoint){
    if(allowDemoLeads){
      console.log("DEMO QUALIFIED LEAD",{
        requestId:id,
        audience:lead.audience,
        city:lead.city,
        need:lead.need,
        providerId:lead.providerId,
        accessConstraints:lead.accessConstraints
      });
      return res.status(200).json({ok:true,forwarded:false,demo:true,requestId:id});
    }
    res.setHeader("Retry-After","300");
    return res.status(503).json({
      error:"Coordinator handoff is temporarily unavailable. Please try again later.",
      requestId:id
    });
  }

  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),8000);

  try{
    const r=await fetch(endpoint,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "User-Agent":"Japan-Health-Lead-Handoff/1.1",
        "X-Request-Id":id
      },
      body:JSON.stringify({
        event:"qualified_healthcare_lead",
        platform:"japan-health",
        destination:amecaWebhook?"ameca":"general-partner",
        lead
      }),
      signal:controller.signal
    });

    if(!r.ok) throw new Error(`Partner webhook returned ${r.status}`);

    return res.status(200).json({
      ok:true,
      forwarded:true,
      requestId:id
    });
  }catch(e){
    console.error("PARTNER HANDOFF FAILED",{requestId:id,message:e&&e.message?e.message:"unknown"});
    return res.status(502).json({
      error:"Coordinator handoff failed. Please try again later.",
      requestId:id
    });
  }finally{
    clearTimeout(timeout);
  }
};
