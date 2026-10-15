import {readFile,stat} from "node:fs/promises";
import assert from "node:assert/strict";
import {guides,treatments} from "../src/content.mjs";
import {agencies,clinics} from "../src/agencies.mjs";
assert.ok(guides.length>=3);
for (const item of [...guides,...treatments]) {
  assert.ok(item.sections.length>=2,item.slug+" lacks substance");
  assert.ok(item.sources.length>0,item.slug+" lacks references");
  for (const source of item.sources) assert.match(source.url,/^https:\/\//);
  const p = "dist/en/"+(guides.includes(item)?"guides":"treatments")+"/"+item.slug+"/index.html";
  const html = await readFile(p,"utf8");
  assert.ok(html.includes('lang="en"') && html.includes("application/ld+json"));
  assert.ok(html.includes("Sources and verification"));
  assert.ok(!html.includes("undefined"));
}
for (const a of agencies) {
  assert.match(a.source,/^https:\/\/www\.mofa\.go\.jp\//);
  assert.equal(a.sponsored,false,"Do not mark agencies sponsored without a contract");
}
assert.equal(clinics.length,0,"Publish clinics only with reviewed provider-specific evidence");
const home=await readFile("dist/en/index.html","utf8");
assert.ok(home.includes("Healthcare in Japan,"));
const agency=await readFile("dist/en/agencies/index.html","utf8");
assert.ok(agency.includes("There are currently no paid placements"));
const robots=await readFile("dist/robots.txt","utf8");
assert.ok(robots.includes("Allow: /"));
await stat("dist/en/about/index.html");
console.log("PASS: English route rendering, citations, provenance, sponsorship safety, no patient intake.");
