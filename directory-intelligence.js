(()=>{
  const $=id=>document.getElementById(id);
  const grid=$("providerGrid");
  const audience=()=>$("audience")?.value||"all";
  const label=v=>({direct:"Verified physician English",interpreter:"Interpreter-supported",required:"Required",no:"No referral required","not-required":"No confirmed coordinator requirement",visitor:"Visitor",resident:"Resident",Tokyo:"Tokyo",Osaka:"Osaka"}[v]||v);
  const stateLabel={match:"Confirmed match",unknown:"Needs verification",mismatch:"Conflicts"};

  function activeConstraints(){
    const parts=[];
    const ids=[["audience","Audience"],["city","City"],["language","Language"],["coord","Coordinator"],["referral","Referral"]];
    ids.forEach(([id,key])=>{const el=$(id);if(el&&el.value&&el.value!=="all")parts.push(`${key}: ${label(el.value)}`)});
    const q=$("q")?.value?.trim();if(q)parts.unshift(`Need: ${q}`);
    if($("verifiedOnly")?.checked)parts.push("Official-source checked only");
    return parts;
  }

  function classify(p){
    const out=[];
    const add=(key,text,state,detail)=>out.push({key,text,state,detail});
    const a=$("audience")?.value||"all",city=$("city")?.value||"all",language=$("language")?.value||"all",coord=$("coord")?.value||"all",referral=$("referral")?.value||"all";
    if(a!=="all")add("audience",a==="visitor"?"Visitor pathway":"Resident pathway",Array.isArray(p.audience)?(p.audience.includes(a)?"match":"mismatch"):"unknown",Array.isArray(p.audience)?"Provider record has an audience pathway field.":"Audience pathway is not documented in this record.");
    if(city!=="all")add("city",city,p.city?(p.city===city?"match":"mismatch"):"unknown",p.city?`Recorded city: ${p.city}.`:"City is not documented in this record.");
    if(language==="direct")add("language","Physician English",p.doctorEnglish==="yes"?"match":["no","partial","limited"].includes(p.doctorEnglish)?"mismatch":"unknown",p.doctorEnglish==="yes"?"Physician English is supported by the current record.":p.doctorEnglish?`Current record says: ${p.doctorEnglish}.`:"Physician-level English is not verified in this record.");
    if(language==="interpreter")add("language","Interpreter access",["yes","available"].includes(p.interpreter)?"match":p.interpreter==="no"?"mismatch":"unknown",p.interpreter==="external"?"An external interpreter arrangement is recorded, but on-site/hospital interpreter support is not confirmed.":p.interpreter?`Current record says: ${p.interpreter}.`:"Interpreter support is not verified in this record.");
    if(referral==="required")add("referral","Referral required",p.referral==="required"?"match":p.referral==="no"?"mismatch":"unknown",p.referral?`Current record says: ${p.referral}.`:"Referral rule is not verified.");
    if(referral==="no")add("referral","No referral required",p.referral==="no"?"match":p.referral==="required"?"mismatch":"unknown",p.referral==="varies"?"Referral requirement varies by pathway and needs confirmation.":p.referral?`Current record says: ${p.referral}.`:"Referral rule is not verified.");
    if(coord==="required")add("coordinator","Coordinator required",p.coordinator==="required"?"match":["no","optional"].includes(p.coordinator)?"mismatch":"unknown",p.coordinator?`Current record says: ${p.coordinator}.`:"Coordinator requirement is not verified.");
    if(coord==="not-required")add("coordinator","No required coordinator",["no","optional"].includes(p.coordinator)?"match":p.coordinator==="required"?"mismatch":"unknown",["varies","recommended"].includes(p.coordinator)?"The record does not confirm that coordination can be skipped for this pathway.":p.coordinator?`Current record says: ${p.coordinator}.`:"Coordinator requirement is not verified.");
    return out;
  }

  function summary(p){
    const rows=classify(p),counts={match:0,unknown:0,mismatch:0};rows.forEach(r=>counts[r.state]++);
    return{rows,counts,rank:counts.match*4-counts.unknown-counts.mismatch*8};
  }

  function renderContext(){
    const box=$("directoryContext"),text=$("activeConstraintSummary");
    if(box){
      const a=audience();
      if(a==="visitor")box.innerHTML='<b>Visitor pathway</b><span>Confirmed matches are separated from unknown fields. Unknown does not count as a match.</span>';
      else if(a==="resident")box.innerHTML='<b>Resident pathway</b><span>Insurance, referral and language facts stay unknown unless the record supports them.</span>';
      else box.innerHTML='<b>Visitor + Resident view</b><span>Choose a pathway to make eligibility fit explicit. The International Access Score measures access friction only, never clinical quality.</span>';
    }
    if(text){const p=activeConstraints();text.textContent=p.length?`Active constraints: ${p.join(" · ")}. Confirmed, unknown and conflicting facts are shown separately.`:"No extra constraints selected. Results may include both provider-level verified and clearly labeled demo records.";}
  }

  function ensureStyles(){
    if($("constraint-audit-styles"))return;
    const s=document.createElement("style");s.id="constraint-audit-styles";s.textContent='.constraint-audit{margin:10px 0;padding:10px;border:1px solid #e1e8ef;border-radius:10px;background:#fff}.constraint-audit-head{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:7px}.constraint-audit-head small{font-size:8px;font-weight:900;color:#607284}.constraint-audit-counts{display:flex;gap:5px;flex-wrap:wrap}.constraint-state{display:inline-flex;padding:4px 6px;border-radius:999px;font-size:7px;font-weight:900}.constraint-state.match{background:#e8f7f2;color:#176b58}.constraint-state.unknown{background:#eef3f8;color:#536679}.constraint-state.mismatch{background:#fdecec;color:#9b3636}.constraint-audit-list{display:grid;gap:5px}.constraint-audit-row{display:grid;grid-template-columns:auto 1fr;gap:7px;align-items:start;font-size:8px;color:#526579}.constraint-audit-row b{font-size:8px}.constraint-audit-note{font-size:7px;color:#718295;line-height:1.4}.constraint-ranking-note{font-size:8px;color:#657789;margin:8px 0 0}@media(max-width:650px){.constraint-audit-head{align-items:flex-start;flex-direction:column}}';document.head.appendChild(s);
  }

  function applyCardAudits(){
    if(!grid)return;
    const providerMap=new Map((window.PROVIDERS||[]).map(p=>[p.name,p]));
    const cards=[...grid.querySelectorAll(":scope > .provider-card")];
    cards.forEach(card=>{
      const p=providerMap.get(card.querySelector("h3")?.textContent?.trim());if(!p)return;
      const s=summary(p);card.dataset.constraintRank=String(s.rank);
      let audit=card.querySelector(".constraint-audit");if(!audit){audit=document.createElement("div");audit.className="constraint-audit";const matchPanel=card.querySelector(".match-panel");(matchPanel||card.querySelector("h3"))?.after(audit)}
      if(!s.rows.length){audit.innerHTML='<div class="constraint-ranking-note">Select access constraints to see confirmed matches, unknown fields and conflicts.</div>';return}
      audit.innerHTML=`<div class="constraint-audit-head"><small>CONSTRAINT EVIDENCE</small><div class="constraint-audit-counts"><span class="constraint-state match">${s.counts.match} confirmed</span><span class="constraint-state unknown">${s.counts.unknown} verify</span>${s.counts.mismatch?`<span class="constraint-state mismatch">${s.counts.mismatch} conflict</span>`:""}</div></div><div class="constraint-audit-list">${s.rows.map(r=>`<div class="constraint-audit-row"><span class="constraint-state ${r.state}">${stateLabel[r.state]}</span><div><b>${r.text}</b><div class="constraint-audit-note">${r.detail}</div></div></div>`).join("")}</div><div class="constraint-ranking-note">Constraint evidence affects ordering only. It does not rank medical quality.</div>`;
    });
    const sort=$("sort")?.value||"fit";
    if(sort==="fit"&&cards.length>1){
      const ordered=[...cards].sort((a,b)=>(Number(b.dataset.constraintRank)||0)-(Number(a.dataset.constraintRank)||0));
      const changed=ordered.some((card,i)=>cards[i]!==card);
      if(changed)ordered.forEach(card=>grid.appendChild(card));
    }
    const count=$("resultCount"),audited=cards.map(card=>providerMap.get(card.querySelector("h3")?.textContent?.trim())).filter(Boolean).map(summary);
    if(count&&audited.length&&activeConstraints().length){
      const confirmed=audited.filter(x=>x.rows.length&&x.counts.unknown===0&&x.counts.mismatch===0).length,verify=audited.filter(x=>x.counts.unknown>0).length;
      const base=count.textContent.replace(/ · \d+ fully confirmed · \d+ need verification$/,'');
      count.textContent=`${base} · ${confirmed} fully confirmed · ${verify} need verification`;
    }
  }

  function refresh(){renderContext();requestAnimationFrame(applyCardAudits)}
  function setFilter(id,value){const el=$(id);if(!el)return;el.value=value;el.dispatchEvent(new Event("input",{bubbles:true}));refresh()}
  document.querySelectorAll("[data-directory-filter]").forEach(btn=>btn.addEventListener("click",()=>{const [id,value]=btn.dataset.directoryFilter.split(":");if(id==="verifiedOnly"){const el=$("verifiedOnly");if(el){el.checked=value==="1";el.dispatchEvent(new Event("change",{bubbles:true}));el.dispatchEvent(new Event("input",{bubbles:true}))}refresh();return}setFilter(id,value)}));
  document.querySelectorAll("#q,#audience,#city,#language,#coord,#referral,#verifiedOnly,#sort").forEach(el=>{el?.addEventListener("input",refresh);el?.addEventListener("change",refresh)});
  $("resetFilters")?.addEventListener("click",()=>setTimeout(refresh,0));
  if(grid)new MutationObserver(()=>requestAnimationFrame(applyCardAudits)).observe(grid,{childList:true});
  ensureStyles();refresh();
})();
