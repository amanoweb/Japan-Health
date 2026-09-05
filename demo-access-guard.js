(()=>{
  const $=id=>document.getElementById(id);
  const providers=()=>window.PROVIDERS||[];
  const careTerms={
    general:["internal medicine","general practice"],
    dental:["dentistry","dental"],
    screening:["health screening","ningen dock","imaging"],
    cardiology:["cardiology","cardiovascular","arrhythmia","heart failure"],
    cancer:["oncology","cancer","second opinion"],
    womens:["gynecology","women's health","assisted reproductive technology","ivf","icsi"]
  };
  const scenario=()=>{const q=new URLSearchParams(location.search);return{audience:q.get("audience")||"visitor",care:q.get("care")||"general",language:q.get("language")||"all",area:q.get("area")||"all"};};
  const serviceAudience=()=>scenario().audience==="medical-travel"?"visitor":scenario().audience;
  const providerForCard=card=>{const name=card.querySelector("h3")?.textContent?.trim();return providers().find(p=>p.name===name)||null;};
  function serviceRequirement(p){
    const terms=careTerms[scenario().care]||[];
    const candidates=(p?.expertiseEvidence||[]).filter(e=>e&&typeof e==="object"&&e.evidenceStatus==="official-source-verified"&&e.accessRequirements);
    const hit=candidates.find(e=>terms.some(t=>String(e.label||"").toLowerCase().includes(t)));
    if(!hit)return null;
    const r=hit.accessRequirements||{},source=r.sourceUrl||hit.sourceUrl||"";
    if(!/^https:\/\//i.test(source))return null;
    return{audience:Array.isArray(r.audience)?r.audience:[],source,referral:r.referral||"unknown",coordinator:r.coordinator||"unknown",bookingStart:r.bookingStart||"",label:hit.label||"Service access"};
  }
  function audienceState(p){
    const r=serviceRequirement(p),wanted=serviceAudience();
    if(!r)return{state:"provider-only",label:"Service audience not separately documented"};
    if(!r.audience.length||r.audience.includes("unknown"))return{state:"unknown",label:"Service audience needs verification"};
    if(r.audience.includes(wanted))return{state:"confirmed",label:`Service audience confirms ${wanted==="visitor"?"visitor / overseas":"resident"} access`};
    return{state:"conflict",label:`Service-level audience does not include ${wanted==="visitor"?"visitor / overseas":"resident"}`};
  }
  function decorate(){
    const grid=$("demoResults"),summary=$("resultSummary");if(!grid||!summary)return;
    const cards=[...grid.querySelectorAll(":scope > .demo-provider")];if(!cards.length)return;
    let confirmed=0,verify=0,removed=0;
    cards.forEach(card=>{
      card.querySelector(".demo-service-audience")?.remove();
      const p=providerForCard(card);if(!p)return;
      const s=audienceState(p);
      if(s.state==="conflict"){
        card.remove();removed++;return;
      }
      if(s.state==="confirmed")confirmed++;else verify++;
      const chip=document.createElement("div");chip.className=`match demo-service-audience ${s.state==="confirmed"?"good":""}`;chip.textContent=s.label;
      chip.title=s.state==="provider-only"?"Provider-level audience information is not silently treated as service-level eligibility.":s.state==="unknown"?"The cited service record does not clearly separate visitor and resident eligibility.":"The matched service-level access record explicitly covers this audience.";
      card.querySelector(".match-list")?.appendChild(chip);
    });
    const remaining=[...grid.querySelectorAll(":scope > .demo-provider")];
    let note=$("demoServiceAudienceSummary");if(!note){note=document.createElement("div");note.id="demoServiceAudienceSummary";note.className="demo-service-audience-summary";summary.insertAdjacentElement("afterend",note);}
    note.innerHTML=`<b>${remaining.length} shown after service-level audience check.</b><span>${confirmed} have matched service-level audience confirmation · ${verify} still need service-level audience verification${removed?` · ${removed} explicit audience conflict${removed===1?" was":"s were"} excluded`:""}. Provider-wide audience fields are not silently promoted to service eligibility.</span>`;
    if(!remaining.length){
      grid.innerHTML='<div class="demo-warning" style="grid-column:1/-1"><b>No provider remains after the service-level audience check.</b><br>The selected service has no source-backed audience match in the current records. Japan Health did not substitute provider-wide audience data for service eligibility.</div>';
      return;
    }
    let next=$("demoTopAccessFit");if(!next){next=document.createElement("section");next.id="demoTopAccessFit";next.className="demo-top-access-fit";note.insertAdjacentElement("afterend",next);}
    const first=remaining[0],name=first.querySelector("h3")?.textContent?.trim()||"the first access profile";
    next.innerHTML=`<div><small>CONTINUE THE JOURNEY</small><b>Open the top access-evidence fit for these constraints</b><span>${name} appears first because of access-evidence fit only. This is not a clinical recommendation or quality ranking.</span></div><button type="button" class="btn primary">View first access profile →</button>`;
    next.querySelector("button")?.addEventListener("click",()=>first.querySelector("[data-provider]")?.click(),{once:true});
  }
  function shareControl(){
    const bar=$("demoScenarioBar");if(!bar||$("copyDemoScenario"))return;
    const group=document.createElement("div");group.className="demo-scenario-actions";
    const copy=document.createElement("button");copy.type="button";copy.id="copyDemoScenario";copy.className="small-btn";copy.textContent="Copy scenario link";
    copy.addEventListener("click",async()=>{
      try{await navigator.clipboard.writeText(location.href);copy.textContent="Copied";setTimeout(()=>copy.textContent="Copy scenario link",1500);}catch(_){copy.textContent="Copy unavailable";setTimeout(()=>copy.textContent="Copy scenario link",1800);}
    });
    const restart=bar.querySelector('a[href="/demo.html"]');if(restart){restart.remove();group.append(copy,restart);}else group.append(copy);
    bar.appendChild(group);
  }
  function refresh(){decorate();shareControl();}
  const observer=new MutationObserver(()=>requestAnimationFrame(refresh));
  [$("demoResults"),$("demoScenarioBar"),document.querySelector("main")].filter(Boolean).forEach(el=>observer.observe(el,{childList:true,subtree:true}));
  const style=document.createElement("style");style.id="demo-access-guard-styles";style.textContent=`.demo-service-audience-summary{margin:-5px 0 12px;padding:9px 11px;border:1px solid #dce6ef;border-radius:10px;background:#fbfdff;color:#607487}.demo-service-audience-summary b,.demo-service-audience-summary span{display:block}.demo-service-audience-summary b{font-size:9px;color:#173c5f}.demo-service-audience-summary span{font-size:8px;line-height:1.5;margin-top:2px}.demo-top-access-fit{display:flex;justify-content:space-between;align-items:center;gap:14px;margin:0 0 12px;padding:13px 14px;border:1px solid #cfe0f3;border-radius:12px;background:#f4f8fd}.demo-top-access-fit small,.demo-top-access-fit b,.demo-top-access-fit span{display:block}.demo-top-access-fit small{font-size:7px;font-weight:900;letter-spacing:.06em;color:#718295}.demo-top-access-fit b{font-size:10px;color:#173c5f;margin:3px 0}.demo-top-access-fit span{font-size:8px;line-height:1.45;color:#607487}.demo-scenario-actions{display:flex;gap:7px;flex-wrap:wrap}@media(max-width:650px){.demo-top-access-fit{align-items:stretch;flex-direction:column}.demo-top-access-fit .btn,.demo-scenario-actions,.demo-scenario-actions .small-btn{width:100%}.demo-scenario-actions{display:grid}}`;
  document.head.appendChild(style);
  refresh();
})();