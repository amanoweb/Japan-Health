(()=>{
  const $=id=>document.getElementById(id);
  const human=v=>({yes:"Yes",no:"No",partial:"Partial",limited:"Limited",available:"Available",required:"Required",recommended:"Recommended",optional:"Optional",unknown:"Needs verification",varies:"Varies by pathway",external:"External arrangement",high:"Higher transparency",medium:"Some published visibility",low:"Limited visibility"}[v]||v||"Needs verification");

  function provider(){return (window.PROVIDERS||[]).find(p=>p.id===$("leadProvider")?.value)}
  function ensure(){
    if($("leadReview"))return $("leadReview");
    const consent=$("leadConsent")?.closest("label");if(!consent)return null;
    const box=document.createElement("section");box.id="leadReview";box.className="lead-review";box.setAttribute("aria-live","polite");box.innerHTML='<div class="lead-review-title"><b>Before you send</b><span>Coordination context only</span></div><div id="leadReviewBody"></div>';
    consent.before(box);return box;
  }
  function update(){
    if(!ensure())return;
    const p=provider(),body=$("leadReviewBody");if(!body)return;
    const audience=$("leadAudience")?.selectedOptions?.[0]?.textContent||"Not selected";
    const city=$("leadCity")?.value||"Not selected",need=$("leadNeed")?.value?.trim()||"Not specified",timing=$("leadTimeframe")?.selectedOptions?.[0]?.textContent||"Flexible / exploring";
    const provenance=p?(p.recordStatus==="official-source-verified"?"Official-source checked provider record":"DEMO · UNVERIFIED provider record"):"No provider selected";
    const providerFacts=p?`<div class="lead-review-grid"><div><small>PROVIDER</small><b>${p.name}</b><span>${provenance}</span></div><div><small>LANGUAGE ACCESS</small><b>Doctor: ${human(p.doctorEnglish)}</b><span>Interpreter: ${human(p.interpreter)}</span></div><div><small>BOOKING FRICTION</small><b>Referral: ${human(p.referral)}</b><span>Coordinator: ${human(p.coordinator)}</span></div><div><small>COST VISIBILITY</small><b>${human(p.priceTransparency)}</b><span>Unknown components still require confirmation.</span></div></div>`:'<p class="lead-review-empty">No specific provider is attached. The partner will receive your pathway, city, care need and finder constraints.</p>';
    body.innerHTML=`<p><strong>Routing:</strong> Japan Health → downstream coordination partner (AMECA route in the current handoff). This does not request diagnosis or treatment advice.</p><div class="lead-review-summary"><span>${audience}</span><span>${city}</span><span>${timing}</span></div><p><strong>Care request:</strong> ${need}</p>${providerFacts}<p class="lead-review-foot">Provider access fields reflect the current record only. They are not guarantees of availability, eligibility, language ability, price, outcomes or clinical quality.</p>`;
  }
  const original=window.openLeadModal;
  if(typeof original==="function")window.openLeadModal=(id="")=>{original(id);setTimeout(update,0)};
  $("leadForm")?.addEventListener("input",update);$("leadForm")?.addEventListener("change",update);
  update();
})();
