module.exports = async function handler(req,res){
  if(req.method!=="GET") return res.status(405).json({ok:false,error:"Method not allowed"});

  const amecaConfigured=Boolean(process.env.AMECA_LEAD_WEBHOOK_URL);
  const fallbackConfigured=Boolean(process.env.GENERAL_PARTNER_WEBHOOK_URL);
  const demoMode=String(process.env.ALLOW_DEMO_LEADS||"").toLowerCase()==="true";

  const route=amecaConfigured?"ameca":fallbackConfigured?"general-partner":demoMode?"demo":null;
  const operational=Boolean(route);

  res.setHeader("Cache-Control","no-store");
  return res.status(operational?200:503).json({
    ok:operational,
    service:"japan-health-lead-handoff",
    route,
    productionReady:Boolean(amecaConfigured||fallbackConfigured),
    demoMode,
    checkedAt:new Date().toISOString()
  });
};
