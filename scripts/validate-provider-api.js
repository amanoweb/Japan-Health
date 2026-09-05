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

async function run(){
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;

  const jsonRes=mockResponse();
  await handler({method:"GET",url:"/api/providers",headers:{}},jsonRes);
  assert.equal(jsonRes.statusCode,200);
  assert.match(jsonRes.headers["Content-Type"],/application\/json/);
  assert.match(jsonRes.headers.ETag,/^"[a-f0-9]{24}"$/);
  const payload=JSON.parse(jsonRes.body);
  assert.equal(payload.meta.source,"static-fallback");
  assert.ok(payload.providers.length>0);
  assert.ok(payload.providers.every(p=>p&&typeof p.id==="string"&&typeof p.name==="string"));
  assert.equal(payload.meta.count,payload.providers.length);
  assert.equal(payload.meta.dataVersion,jsonRes.headers.ETag.replaceAll('"',''));

  const cachedRes=mockResponse();
  await handler({method:"GET",url:"/api/providers",headers:{"if-none-match":jsonRes.headers.ETag}},cachedRes);
  assert.equal(cachedRes.statusCode,304);
  assert.equal(cachedRes.body,"");
  assert.equal(cachedRes.headers.ETag,jsonRes.headers.ETag);

  const jsRes=mockResponse();
  await handler({method:"GET",url:"/api/providers?format=js",headers:{}},jsRes);
  assert.equal(jsRes.statusCode,200);
  assert.match(jsRes.headers["Content-Type"],/application\/javascript/);
  assert.match(jsRes.body,/window\.PROVIDERS=/);
  assert.match(jsRes.body,/window\.JAPAN_HEALTH_DATA_META=/);
  assert.equal(jsRes.headers.ETag,jsonRes.headers.ETag);

  const postRes=mockResponse();
  await handler({method:"POST",url:"/api/providers",headers:{}},postRes);
  assert.equal(postRes.statusCode,405);
  console.log(`Provider API validation passed for ${payload.providers.length} records with ETag caching.`);
}

run().catch(err=>{console.error(err);process.exit(1);});
