(()=>{
  const $=id=>document.getElementById(id);
  const providers=()=>window.PROVIDERS||[];
  const scenario=()=>{const q=new URLSearchParams(location.search);return{audience:q.get("audience")||"visitor",care:q.get("care")||"general",language:q.get("language")||"all",area:q.get("area")||"all"};};
  const directoryAudience=()=>scenario().audience==="medical-travel"?"visitor":scenario().audience;
  const human=v=>({yes:"Yes",no:"No",partial:"Partial",limited:"Limited",available:"Available",required:"Required",recommended:"Recommended",optional:"Optional",unknown:"Needs verification",varies:"Varies by pathway",external:"External arrangement",low:"Low",medium:"Medium",high:"High"}[v]||v||"Needs verification");
  const providerForCard=card=>{const name=card.querySelector("h3")?.textContent?.trim();return providers().find(p=>p.name===name)||null;};
  const knownCost=v=>{const s=String(v||"").trim().toLowerCase();return Boolean(s)&&!s.includes("unknown")&&!s.includes("needs verification");};

  function scoreBreakdown(p){
    const direct={yes:100,partial:70,limited:35}[p?.doctorEnglish]||20;
    const interp=["yes","available"].includes(p?.interpreter)?90:p?.interpreter==="external"?45:25;
    const reception=p?.receptionEnglish==="yes"?100:p?.receptionEnglish==="partial"?65:30;
    const docs=p?.englishDocs==="yes"?100:p?.englishDocs==="partial"?65:30;
    const communication=Math.round(direct*.45+interp*.30+reception*.15+docs*.10);
    const booking=Math.max(0,Math.min(100,85-(p?.referral==="required"?30:p?.referral==="varies"?12:0)-(p?.coordinator==="required"?25:p?.coordinator==="recommended"?10:p?.coordinator==="varies"?8:0)));
    let eligibility=50+(p?.selfPay==="yes"?20:0);
    const audience=directoryAudience();
    eligibility+=(Array.isArray(p?.audience)&&p.audience.includes(audience))?30:-35;
    eligibility=Math.max(0,Math.min(100,eligibility));
    const cost=({high:100,medium:70,low:35}[p?.priceTransparency]||25);
    return{communication,booking,eligibility,cost};
  }
  function accessScore(p){
    const b=scoreBreakdown(p);
    return{score:Math.round(b.communication*.4+b.booking*.25+b.eligibility*.2+b.cost*.15),breakdown:b};
  }
  const band=n=>n>=80?"Lower access friction":n>=65?"Relatively lower friction":n>=50?"Moderate access friction":"Higher access friction";
  function costVisibility(p){const values=[p?.medicalCost,p?.interpreterCost,p?.coordinatorCost];return values.filter(knownCost).length;}
  function scoreMarkup(p){
    const s=accessScore(p),b=s.breakdown;
    return `<section class="demo-access-score" aria-label="International Access Score"><div class="demo-score-head"><div><small>INTERNATIONAL ACCESS SCORE</small><b>${s.score}/100 · ${band(s.score)}</b><span>Logistics-friction summary only — not clinical quality, outcomes or physician skill.</span></div><div class="demo-score-ring" aria-label="International Access Score ${s.score} out of 100">${s.score}</div></div><div class="demo-score-factors"><div><small>COMMUNICATION · 40%</small><b>${b.communication}/100</b><span>Doctor / interpreter / reception / documents</span></div><div><small>BOOKING · 25%</small><b>${b.booking}/100</b><span>Referral and coordinator friction</span></div><div><small>ELIGIBILITY · 20%</small><b>${b.eligibility}/100</b><span>${directoryAudience()==="resident"?"Resident":"Visitor"} pathway + self-pay record</span></div><div><small>COST DATA · 15%</small><b>${b.cost}/100</b><span>Visibility only, never affordability</span></div></div></section>`;
  }
  function decorateCards(){
    document.querySelectorAll("#demoResults .demo-provider").forEach(card=>{
      card.querySelector(".demo-access-score")?.remove();
      const p=providerForCard(card);if(!p)return;
      const actions=card.querySelector(".actions");
      actions?.insertAdjacentHTML("beforebegin",scoreMarkup(p));
    });
  }
  function decorateDetail(){
    const body=$("detailBody");if(!body)return;
    body.querySelector(".demo-access-score")?.remove();
    const name=$("detailTitle")?.textContent?.trim(),p=providers().find(x=>x.name===name);if(!p)return;
    body.insertAdjacentHTML("afterbegin",scoreMarkup(p));
  }
  function comparison(){
    const grid=$("demoResults"),summary=$("resultSummary");if(!grid||!summary)return;
    let wrap=$("demoScoreComparison");
    const cards=[...grid.querySelectorAll(":scope > .demo-provider")].slice(0,3);
    if(!cards.length){wrap?.remove();return;}
    if(!wrap){wrap=document.createElement("section");wrap.id="demoScoreComparison";wrap.className="demo-score-comparison";summary.insertAdjacentElement("afterend",wrap);}
    const rows=cards.map(card=>{const p=providerForCard(card);if(!p)return"";const s=accessScore(p),b=s.breakdown;return `<div class="demo-compare-row"><div><b>${p.name}</b><span>${p.recordStatus==="official-source-verified"?"Official-source checked":"DEMO · UNVERIFIED"}</span></div><strong>${s.score}/100</strong><span>Communication ${b.communication}</span><span>Booking ${b.booking}</span><span>Cost visibility ${costVisibility(p)}/3</span></div>`;}).join("");
    wrap.innerHTML=`<div class="demo-compare-head"><div><small>TRANSPARENT ACCESS COMPARISON</small><b>Compare the top visible results on logistics only.</b></div><span>Same 40/25/20/15 weighting as the directory International Access Score</span></div>${rows}<p>Score differences summarize documented access friction. They do not rank medical quality or predict treatment outcomes, case acceptance or current availability.</p>`;
  }
  function refresh(){decorateCards();decorateDetail();comparison();}
  const observer=new MutationObserver(()=>requestAnimationFrame(refresh));
  [$("demoResults"),$("detailBody"),document.querySelector("main")].filter(Boolean).forEach(el=>observer.observe(el,{childList:true,subtree:true,attributes:true,attributeFilter:["class"]}));
  const style=document.createElement("style");style.id="demo-access-score-styles";style.textContent=`.demo-access-score{margin:10px 0;padding:11px;border:1px solid #dce6ef;border-radius:12px;background:#fbfdff}.demo-score-head{display:flex;justify-content:space-between;gap:10px;align-items:center}.demo-score-head small,.demo-score-head b,.demo-score-head span{display:block}.demo-score-head small{font-size:7px;font-weight:900;letter-spacing:.06em;color:#718295}.demo-score-head b{font-size:10px;color:#173c5f;margin:2px 0}.demo-score-head span{font-size:7px;line-height:1.4;color:#718295}.demo-score-ring{width:42px;height:42px;display:grid;place-items:center;border:5px solid #d8e8f7;border-radius:50%;font-size:11px;font-weight:900;color:#173c5f;background:#fff;flex:0 0 auto}.demo-score-factors{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-top:8px}.demo-score-factors>div{padding:7px;border:1px solid #e3ebf2;border-radius:8px;background:#fff}.demo-score-factors small,.demo-score-factors b,.demo-score-factors span{display:block}.demo-score-factors small{font-size:6px;color:#718295}.demo-score-factors b{font-size:9px;margin:2px 0;color:#24455f}.demo-score-factors span{font-size:6px;line-height:1.35;color:#7a8b9b}.demo-score-comparison{margin:0 0 12px;padding:12px;border:1px solid #dce6ef;border-radius:12px;background:#fff}.demo-compare-head{display:flex;justify-content:space-between;gap:12px;margin-bottom:8px}.demo-compare-head small,.demo-compare-head b{display:block}.demo-compare-head small{font-size:7px;font-weight:900;color:#718295}.demo-compare-head b{font-size:10px;color:#173c5f;margin-top:2px}.demo-compare-head>span{font-size:7px;color:#718295;text-align:right}.demo-compare-row{display:grid;grid-template-columns:minmax(0,1.5fr) .55fr .8fr .7fr .9fr;gap:7px;align-items:center;padding:8px 0;border-top:1px solid #edf1f5;font-size:7px;color:#607487}.demo-compare-row>div b,.demo-compare-row>div span{display:block}.demo-compare-row>div b{font-size:8px;color:#24455f}.demo-compare-row>div span{font-size:6px}.demo-compare-row strong{font-size:10px;color:#173c5f}.demo-score-comparison>p{font-size:7px;line-height:1.45;color:#718295;margin:8px 0 0}@media(max-width:760px){.demo-score-factors{grid-template-columns:1fr 1fr}.demo-compare-head{flex-direction:column}.demo-compare-head>span{text-align:left}.demo-compare-row{grid-template-columns:1fr 1fr}.demo-compare-row>div{grid-column:1/-1}}@media(max-width:480px){.demo-score-factors{grid-template-columns:1fr}}`;
  document.head.appendChild(style);
  refresh();
  window.JapanHealthDemoAccessScore={accessScore,scoreBreakdown};
})();