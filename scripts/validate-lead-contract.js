const assert=require("assert");
const crypto=require("crypto");

function mockResponse(){
  return {statusCode:200,headers:{},body:null,setHeader(k,v){this.headers[k]=v;},status(n){this.statusCode=n;return this;},json(v){this.body=v;return this;}};
}

async function run(){
  process.env.AMECA_LEAD_WEBHOOK_URL="https://example.test/lead";
  process.env.PARTNER_WEBHOOK_SECRET="test-secret";
  delete process.env.GENERAL_PARTNER_WEBHOOK_URL;
  delete process.env.ALLOW_DEMO_LEADS;

  let outbound;
  global.fetch=async(url,options)=>{outbound={url,options};return{ok:true,status:200};};
  delete require.cache[require.resolve("../api/lead.js")];
  const handler=require("../api/lead.js");
  const req={method:"POST",body:{name:"Demo User",email:"DEMO@example.com",audience:"visitor",city:"Tokyo",need:"Second opinion coordination",timeframe:"within-1-month",contactPreference:"email",partnerConsent:true,providerId:"demo-neuro-center",providerName:"Demo Advanced Neuro Center",accessConstraints:{q:"Movement Disorders",audience:"visitor",city:"Tokyo",language:"interpreter",coordinator:"required",referral:"required"},sourcePage:"/?audience=visitor"}};
  const res=mockResponse();
  await handler(req,res);
  assert.equal(res.statusCode,200);
  assert.equal(res.body.forwarded,true);
  assert.ok(res.body.requestId.startsWith("jh_"));
  assert.equal(outbound.url,process.env.AMECA_LEAD_WEBHOOK_URL);

  const event=JSON.parse(outbound.options.body);
  assert.equal(event.schemaVersion,"2.1");
  assert.equal(event.destination,"ameca");
  assert.equal(event.lead.email,"demo@example.com");
  assert.equal(event.lead.providerSelection.provenance,"client-supplied-unverified-context");
  assert.ok(event.lead.routingTags.includes("language:interpreter"));
  assert.ok(event.lead.routingTags.includes("coordinator:required"));
  assert.ok(event.lead.routingTags.includes("referral:required"));

  const ts=outbound.options.headers["X-Japan-Health-Timestamp"];
  const sig=outbound.options.headers["X-Japan-Health-Signature"];
  assert.ok(/^\d+$/.test(ts));
  const expected="sha256="+crypto.createHmac("sha256",process.env.PARTNER_WEBHOOK_SECRET).update(`${ts}.${outbound.options.body}`).digest("hex");
  assert.equal(sig,expected);

  const noConsent=mockResponse();
  await handler({method:"POST",body:{name:"Demo User",email:"demo@example.com"}},noConsent);
  assert.equal(noConsent.statusCode,400);
  assert.match(noConsent.body.error,/consent/i);
  console.log("Lead contract validation passed");
}

run().catch(err=>{console.error(err);process.exit(1);});
