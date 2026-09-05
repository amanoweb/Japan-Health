(()=>{
  const $=id=>document.getElementById(id);
  const human=v=>({yes:"Yes",no:"No",partial:"Partial",limited:"Limited",available:"Available",required:"Required",recommended:"Recommended",optional:"Optional",unknown:"Needs verification",varies:"Varies by pathway",external:"External arrangement",high:"Higher transparency",medium:"Some published visibility",low:"Limited visibility"}[v]||v||"Needs verification");
  const stateLabel={match:"Confirmed",unknown:"Needs verification",mismatch:"Conflicts"};

  function provider(){return (window.PROVIDERS||[]).find(p=>p.id===$("leadProvider")?.value)}
  function finderConstraints(){return{audience:$("audience")?.value||"all",city:$("city")?.value||"all",language:$("language")?.value||"all",coordinator:$("coord")?.value||"all",referral:$("referral")?.value||"all"}}
  function classify(p){
    if(!p)return[];
    const c=finderConstraints(),out=[],add=(label,state,detail)=>out.push({label,state,detail});
    if(c.audience!=="all")add(c.audience==="visitor"?"Visitor pathway":"Resident pathway",Array.isArray(p.audience)?(p.audience.includes(c.audience)?"match":"mismatch"):"unknown",Array.isArray(p.audience)?"Audience pathway is present in the provider record.":"Audience pathway is not documented.");
    if(c.city!=="all")add(c.city,p.city?(p.city===c.city?"match":"mismatch"):"unknown",p.city?`Recorded city: ${p.city}.`:"City is not documented.");
    if(c.language==="direct")add("Physician English",p.doctorEnglish==="yes"?"match":["no","partial","limited"].includes(p.doctorEnglish)?"mismatch":"unknown",p.doctorEnglish==="yes"?"Current record supports physician-level English.":p.doctorEnglish?`Current record says: ${human(p.doctorEnglish)}.`:"Physician-level English is not verified.");
    if(c.language==="interpreter")add("Interpreter access",["yes","available"].includes(p.interpreter)?"match":p.interpreter==="no"?"mismatch":"unknown",p.interpreter==="external"?"External interpreter arrangement is recorded; on-site/hospital support is not confirmed.":p.interpreter?`Current record says: ${human(p.interpreter)}.`:"Interpreter support is not verified.");
    if(c.referral==="required")add("Referral required",p.referral==="required"?"match":p.referral==="no"?"mismatch":"unknown",p.referral?`Current record says: ${human(p.referral)}.`:"Referral rule is not verified.");
    if(c.referral==="no")add("No referral required",p.referral==="no"?"match":p.referral==="required"?"mismatch":"unknown",p.referral==="varies"?"Referral rule varies and needs confirmation.":p.referral?`Current record says: ${human(p.referral)}.`:"Referral rule is not verified.");
    if(c.coordinator==="required")add("Coordinator required",p.coordinator==="required"?"match":["no","optional"].includes(p.coordinator)?"mismatch":"unknown",p.coordinator?`Current record says: ${human(p.coordinator)}.`:"Coordinator requirement is not verified.");
    if(c.coordinator==="not-required")add("No required coordinator",["no","optional"].includes(p.coordinator)?"match":p.coordinator==="required"?"mismatch":"unknown",["varies","recommended"].includes(p.coordinator)?"The record does not confirm that coordination can be skipped.":p.coordinator?`Current record says: ${human(p.coordinator)}.`:"Coordinator requirement is not verified.");
    return out;
  }
  function ensure(){
    if($("leadReview"))return $("leadReview");
    const consent=$("leadConsent")?.closest("label");if(!consent)return null;
    const box=document.createElement("section");box.id="leadReview";box.className="lead-review";box.setAttribute("aria-live","polite");box.innerHTML='<div class="lead-review-title"><b>Before you send</b><span>Coordination context only</span></div><div id="leadReviewBody"></div>';
    consent.before(box);return box;
  }
  function ensureStyles(){
    if($("lead-review-audit-styles"))return;
    const s=document.createElement("style");s.id="lead-review-audit-styles";s.textContent='.lead-constraint-audit{margin:10px 0;padding:10px;border:1px solid #e1e8ef;border-radius:10px;background:#fbfcfe}.lead-constraint-audit h4{margin:0 0 7px;font-size:9px}.lead-constraint-row{display:grid;grid-template-columns:auto 1fr;gap:7px;align-items:start;margin:5px 0}.lead-constraint-state{padding:4px 6px;border-radius:999px;font-size:7px;font-weight:900}.lead-constraint-state.match{background:#e8f7f2;color:#176b58}.lead-constraint-state.unknown{background:#eef3f8;color:#536679}.lead-constraint-state.mismatch{background:#fdecec;color:#9b3636}.lead-constraint-copy b,.lead-constraint-copy span{display:block}.lead-constraint-copy b{font-size:8px}.lead-constraint-copy span{font-size:7px;line-height:1.4;color:#718295;margin-top:2px}.handoff-cost-note{font-size:8px;line-height:1.45;color:#526579;margin:8px 0;font-weight:800}';document.head.appendChild(s);
  }
  function fallbackCostMarkup(p){
    const keys=[["medicalCost","Medical care"],["interpreterCost","Interpreter"],["coordinatorCost","Coordinator"]],known=v=>String(v||"").trim()&&!/^unknown$/i.test(String(v).trim());
    const missing=keys.filter(([k])=>!known(p[k])).map(([,label])=>label),recorded=keys.length-missing.length;
    return `<div class="lead-constraint-audit"><h4>Total-cost readiness · ${recorded}/${keys.length} components recorded</h4><div class="lead-constraint-copy"><span>${missing.length?`Confirm before booking: ${missing.join(", ")}.`:"All structured cost components have recorded values; final total still needs provider confirmation."}</span><span>This is data completeness only, not a price quote or affordability score.</span></div></div>`;
  }
  function update(){
    if(!ensure())return;
    ensureStyles();
    const p=provider(),body=$("leadReviewBody");if(!body)return;
    const audience=$("leadAudience")?.selectedOptions?.[0]?.textContent||"Not selected";
    const city=$("leadCity")?.value||"Not selected",need=$("leadNeed")?.value?.trim()||"Not specified",timing=$("leadTimeframe")?.selectedOptions?.[0]?.textContent||"Flexible / exploring";
    const provenance=p?(p.recordStatus==="official-source-verified"?"Official-source checked provider record":"DEMO · UNVERIFIED provider record"):"No provider selected";
    const audit=classify(p),counts={match:0,unknown:0,mismatch:0};audit.forEach(x=>counts[x.state]++);
    const auditMarkup=p&&audit.length?`<div class="lead-constraint-audit"><h4>Finder constraint evidence · ${counts.match} confirmed · ${counts.unknown} verify${counts.mismatch?` · ${counts.mismatch} conflict`:""}</h4>${audit.map(x=>`<div class="lead-constraint-row"><span class="lead-constraint-state ${x.state}">${stateLabel[x.state]}</span><div class="lead-constraint-copy"><b>${x.label}</b><span>${x.detail}</span></div></div>`).join("")}</div>`:p?'<div class="lead-constraint-audit"><h4>No finder constraints selected</h4><div class="lead-constraint-copy"><span>The provider record will still be sent with its provenance and access fields.</span></div></div>':"";
    const costMarkup=p?(window.JapanHealthCost?.markup?.(p,true)||fallbackCostMarkup(p)):"";
    const providerFacts=p?`<div class="lead-review-grid"><div><small>PROVIDER</small><b>${p.name}</b><span>${provenance}</span></div><div><small>LANGUAGE ACCESS</small><b>Doctor: ${human(p.doctorEnglish)}</b><span>Interpreter: ${human(p.interpreter)}</span></div><div><small>BOOKING FRICTION</small><b>Referral: ${human(p.referral)}</b><span>Coordinator: ${human(p.coordinator)}</span></div><div><small>COST VISIBILITY</small><b>${human(p.priceTransparency)}</b><span>Unknown components still require confirmation.</span></div></div>${auditMarkup}${costMarkup}<p class="handoff-cost-note">The downstream partner receives this cost-readiness snapshot as coordination context so missing fee components can be re-checked before booking.</p>`:'<p class="lead-review-empty">No specific provider is attached. The partner will receive your pathway, city, care need and finder constraints.</p>';
    body.innerHTML=`<p><strong>Routing:</strong> Japan Health → downstream coordination partner (AMECA route in the current handoff). This does not request diagnosis or treatment advice.</p><div class="lead-review-summary"><span>${audience}</span><span>${city}</span><span>${timing}</span></div><p><strong>Care request:</strong> ${need}</p>${providerFacts}<p class="lead-review-foot">Unknown or variable access fields are not treated as matches. Provider fields reflect the current record only and are not guarantees of availability, eligibility, language ability, price, outcomes or clinical quality.</p>`;
  }
  const original=window.openLeadModal;
  if(typeof original==="function")window.openLeadModal=(id="")=>{original(id);setTimeout(update,0)};
  $("leadForm")?.addEventListener("input",update);$("leadForm")?.addEventListener("change",update);
  update();
})();
