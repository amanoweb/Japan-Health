const assert=require("assert");
const handler=require("../api/providers.js");

function mockResponse(){
  return{
    statusCode:200,
    headers:{},
    body:"",
    setHeader(k,v){this.headers[k]=v;},
    end(v){this.body=v||"";}
  };
}

function normalizeName(value){
  return String(value||"").toLowerCase().replace(/[^a-z0-9]/g,"");
}

const driveVerified=[
  "NCNP Hospital — International Patient Pathway",
  "Tokyo Medical University Hospital — International Medical Care",
  "Yanagisawa Clinic",
  "eHealth Clinic Shinjuku",
  "Tokyo Business Clinic — Yaesu North Exit",
  "International Health Care Clinic",
  "Tokyo Medical and Surgical Clinic",
  "Shimbashi Hibiya Clinic"
];

const driveCandidates=[
  "KISHI CLINICA FEMINA",
  "Akasaka Hitotsugidori Clinic",
  "Azabu Clinic",
  "Garden Clinic Hiroo",
  "American Clinic Tokyo",
  "Ogimoto Clinic",
  "Tomita Minoru EYE Clinic Ginza",
  "Minamiaoyama Eye Clinic",
  "Ohtsuka Clinic",
  "Tatsuno Clinic",
  "Kumada Clinic",
  "Wada Otorhinolaryngology",
  "Azabu Orthopaedic Clinic",
  "Mima Ladies Clinic",
  "Dental Studio STOD",
  "Nakano Dental"
];

async function run(){
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;

  const res=mockResponse();
  await handler({method:"GET",url:"/api/providers",headers:{}},res);
  assert.equal(res.statusCode,200);
  const payload=JSON.parse(res.body);
  const providers=payload.providers||[];
  const byName=new Map(providers.map(p=>[normalizeName(p.name),p]));
  const expected=[...driveVerified,...driveCandidates];
  const missing=expected.filter(name=>!byName.has(normalizeName(name)));
  assert.deepEqual(missing,[],`Drive handoff providers missing from final API output: ${missing.join(", ")}`);

  const normalized=providers.map(p=>normalizeName(p.name)).filter(Boolean);
  assert.equal(new Set(normalized).size,normalized.length,"Final provider API output must remain deduplicated by normalized name");

  for(const name of driveCandidates){
    const p=byName.get(normalizeName(name));
    assert.ok(p,`${name} must be present`);
    assert.equal(p.city,"Tokyo",`${name} must remain Tokyo-scoped`);
    if(p.discoveryStatus==="directory-only"){
      assert.match(String(p.source||""),/jnto\.go\.jp/i,`${name} directory-only record must retain JNTO provenance`);
      assert.equal(p.doctorEnglish,"unknown",`${name} directory-only record must not infer physician English`);
      assert.equal(p.receptionEnglish,"unknown",`${name} directory-only record must not infer reception English`);
    }
  }

  console.log(`Drive provider handoff validation passed: ${driveVerified.length} verified-source records + ${driveCandidates.length} candidate clinics are present after dedupe/promotions.`);
}

run().catch(err=>{console.error(err);process.exit(1);});
