module.exports = async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});

  const b=req.body||{};
  const name=String(b.name||"").trim();
  const email=String(b.email||"").trim().toLowerCase();
  const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if(!name||!email) return res.status(400).json({error:"Name and email required"});
  if(!emailOk) return res.status(400).json({error:"Enter a valid email address"});

  const rawConstraints=b.accessConstraints&&typeof b.accessConstraints==="object"?b.accessConstraints:{};
  const accessConstraints={
    query:String(rawConstraints.q||"").slice(0,300),
    audience:String(rawConstraints.audience||"all").slice(0,30),
    city:String(rawConstraints.city||"all").slice(0,100),
    language:String(rawConstraints.language||"all").slice(0,30),
    coordinator:String(rawConstraints.coordinator||"all").slice(0,30),
    referral:String(rawConstraints.referral||"all").slice(0,30)
  };

  const requestId=`jh_${Date.now()}_${Math.random().toString(36).slice(2,10)}`;
  const lead={
    requestId,
    name:name.slice(0,150),
    email:email.slice(0,320),
    audience:String(b.audience||"").slice(0,50),
    city:String(b.city||"").slice(0,100),
    need:String(b.need||"").slice(0,500),
    notes:String(b.notes||"").slice(0,5000),
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
      console.log("DEMO QUALIFIED LEAD",lead);
      return res.status(200).json({ok:true,forwarded:false,demo:true,requestId});
    }
    return res.status(503).json({
      error:"Coordinator handoff is temporarily unavailable. Please try again later.",
      requestId
    });
  }

  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),8000);

  try{
    const r=await fetch(endpoint,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "User-Agent":"Japan-Health-Lead-Handoff/1.0"
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
      requestId
    });
  }catch(e){
    console.error("PARTNER HANDOFF FAILED",{requestId,message:e&&e.message?e.message:"unknown"});
    return res.status(502).json({
      error:"Coordinator handoff failed. Please try again later.",
      requestId
    });
  }finally{
    clearTimeout(timeout);
  }
};
