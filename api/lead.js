module.exports = async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const b=req.body||{};
  if(!b.name||!b.email) return res.status(400).json({error:"Name and email required"});

  const lead={
    name:String(b.name).slice(0,150),
    email:String(b.email).slice(0,320),
    audience:String(b.audience||"").slice(0,50),
    city:String(b.city||"").slice(0,100),
    need:String(b.need||"").slice(0,500),
    notes:String(b.notes||"").slice(0,5000),
    providerId:b.providerId?String(b.providerId).slice(0,150):null,
    providerName:b.providerName?String(b.providerName).slice(0,300):null,
    sourcePage:String(b.sourcePage||"").slice(0,500),
    partnerRoute:"ameca",
    createdAt:new Date().toISOString()
  };

  const amecaWebhook=process.env.AMECA_LEAD_WEBHOOK_URL;
  const fallbackWebhook=process.env.GENERAL_PARTNER_WEBHOOK_URL;
  const endpoint=amecaWebhook || fallbackWebhook;

  if(endpoint){
    try{
      const r=await fetch(endpoint,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          event:"qualified_healthcare_lead",
          platform:"japan-health",
          destination:amecaWebhook?"ameca":"general-partner",
          lead
        })
      });
      if(!r.ok) throw new Error("Webhook "+r.status);
      return res.status(200).json({ok:true,forwarded:true,destination:amecaWebhook?"ameca":"general-partner"});
    }catch(e){
      return res.status(502).json({error:"Partner forwarding failed"});
    }
  }

  console.log("DEMO QUALIFIED LEAD",lead);
  return res.status(200).json({ok:true,forwarded:false});
}
