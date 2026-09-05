(()=>{
  const providers=window.PROVIDERS||[];
  const grid=document.getElementById("providerGrid");
  const toggle=document.getElementById("verifiedOnly");
  const note=document.getElementById("verificationSummary");
  if(!grid||!toggle)return;

  const params=new URLSearchParams(location.search);
  toggle.checked=params.get("verifiedOnly")==="1";

  const isTokyoDirectory=p=>Boolean(p&&p.directoryBasis==="Tokyo Metropolitan Government foreign-patient list");
  const isDirectoryOnly=p=>Boolean(p&&(p.discoveryStatus==="directory-only"||isTokyoDirectory(p)));
  const isProviderVerified=p=>Boolean(p&&p.recordStatus==="official-source-verified"&&!isDirectoryOnly(p));
  const providerForCard=card=>providers.find(p=>p.name===card.querySelector("h3")?.textContent?.trim());
  const ageInDays=date=>{
    if(!/^\d{4}-\d{2}-\d{2}$/.test(String(date||"")))return null;
    const checked=new Date(`${date}T00:00:00Z`);
    return Math.max(0,Math.floor((Date.now()-checked.getTime())/86400000));
  };

  const accessFields=[
    ["doctorEnglish","doctor English"],["receptionEnglish","reception English"],["interpreter","interpreter pathway"],
    ["referral","referral rule"],["coordinator","coordinator requirement"],["insurance","insurance pathway"],
    ["selfPay","self-pay pathway"],["priceTransparency","price transparency"]
  ];
  const unresolvedAccessFacts=p=>accessFields.filter(([key])=>!p?.[key]||p[key]==="unknown").map(([,label])=>label);
  const accessCoverage=p=>{
    const unresolved=unresolvedAccessFacts(p);
    return{known:accessFields.length-unresolved.length,total:accessFields.length,unresolved};
  };
  const unresolvedCostComponents=p=>[
    ["medicalCost","medical total"],["interpreterCost","interpreter cost"],["coordinatorCost","coordinator cost"]
  ].filter(([key])=>!p?.[key]||/^unknown$/i.test(String(p[key]))).map(([,label])=>label);

  function injectTransparencyStyles(){
    if(document.getElementById("jh-transparency-styles"))return;
    const s=document.createElement("style");
    s.id="jh-transparency-styles";
    s.textContent=`.access-coverage,.cost-visibility{margin:9px 0;padding:9px 10px;border:1px solid #dfe7ef;border-radius:9px;background:#fbfcfe;font-size:8px;line-height:1.5;color:#5d7084}.access-coverage b,.cost-visibility b{display:block;font-size:9px;color:#34495e;margin-bottom:2px}.access-coverage span,.cost-visibility span{display:block}.access-coverage .coverage-warning{color:#7b5b24}.cost-visibility .cost-warning{color:#7b5b24}.provider-card[aria-label]{scroll-margin-top:90px}.journey-audience-context{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:14px 0 0;padding:10px 12px;border:1px solid #cfe0f3;border-radius:12px;background:#f4f8fd;color:#35536f;font-size:9px;line-height:1.45}.journey-audience-context b{font-size:10px;color:#173c5f}.journey-audience-context button{border:0;background:transparent;color:#176df0;font-weight:800;cursor:pointer;padding:4px}.journey-audience-context[hidden]{display:none}@media(max-width:650px){.access-coverage,.cost-visibility{font-size:9px}.journey-audience-context{align-items:flex-start;flex-direction:column}.journey-audience-context button{padding-left:0}}`;
    document.head.appendChild(s);
  }

  function coverageMarkup(provider){
    const c=accessCoverage(provider);
    const suffix=c.unresolved.length?`Still unverified: ${c.unresolved.join(", ")}.`:"All structured access fields in this record have a stated value.";
    return `<div class="access-coverage"><b>ACCESS DATA COVERAGE · ${c.known}/${c.total} structured fields</b><span class="${c.unresolved.length?"coverage-warning":""}">${suffix}</span><span>The International Access Score is a logistics-friction summary, not a clinical-quality score; lower coverage means more uncertainty around the number.</span></div>`;
  }

  function costVisibilityMarkup(provider){
    const published=Array.isArray(provider?.publishedCosts)?provider.publishedCosts.length:0;
    const unresolved=unresolvedCostComponents(provider);
    const publishedText=published?`${published} provider-published service fee${published===1?"":"s"} captured.`:"No provider-published service fee captured yet.";
    const unresolvedText=unresolved.length?`Unresolved components: ${unresolved.join(", ")}.`:"Medical, interpreter and coordinator cost fields all have stated values.";
    return `<div class="cost-visibility"><b>TOTAL-COST VISIBILITY</b><span>${publishedText}</span><span class="${unresolved.length?"cost-warning":""}">${unresolvedText}</span><span>Published service fees are examples from cited sources and are not a guaranteed total episode estimate.</span></div>`;
  }

  function addTransparency(card,provider){
    if(!provider||isDirectoryOnly(provider))return;
    if(!card.querySelector(".access-coverage")){
      const score=card.querySelector(".score-breakdown")||card.querySelector(".score-row");
      score?.insertAdjacentHTML("afterend",coverageMarkup(provider));
    }
    if(!card.querySelector(".cost-visibility")){
      const cost=card.querySelector(".cost-grid");
      cost?.insertAdjacentHTML("afterend",costVisibilityMarkup(provider));
    }
  }

  function addDetailTransparency(detail,provider){
    if(!detail||!provider||isDirectoryOnly(provider))return;
    if(!detail.querySelector(".access-coverage")){
      const breakdown=detail.querySelector(".score-breakdown");
      breakdown?.insertAdjacentHTML("afterend",coverageMarkup(provider));
    }
    if(!detail.querySelector(".cost-visibility")){
      const costHeading=[...detail.querySelectorAll("h3")].find(h=>h.textContent.trim()==="Cost visibility");
      const costGrid=costHeading?.nextElementSibling;
      costGrid?.insertAdjacentHTML("afterend",costVisibilityMarkup(provider));
    }
  }

  function improveFinderA11y(){
    const labels={audience:"Patient pathway",city:"City",area:"Tokyo area",language:"Language access requirement",coord:"Coordinator requirement",referral:"Referral requirement",sort:"Sort care options"};
    Object.entries(labels).forEach(([id,label])=>document.getElementById(id)?.setAttribute("aria-label",label));
    const count=document.getElementById("resultCount");
    if(count){count.setAttribute("role","status");count.setAttribute("aria-live","polite");count.setAttribute("aria-atomic","true");}
    note?.setAttribute("aria-atomic","true");
    grid.setAttribute("aria-label","Care finder results");
    grid.querySelectorAll(".provider-card").forEach(card=>{
      const name=card.querySelector("h3")?.textContent?.trim();
      if(name)card.setAttribute("aria-label",`${name} access record`);
      card.querySelectorAll("button").forEach(button=>{if(name&&!button.getAttribute("aria-label"))button.setAttribute("aria-label",`${button.textContent.trim()} for ${name}`);});
    });
  }

  let areaSelect=null;

  function setUrlState(){
    const p=new URLSearchParams(location.search);
    if(toggle.checked)p.set("verifiedOnly","1");else p.delete("verifiedOnly");
    if(areaSelect&&areaSelect.value!=="all")p.set("area",areaSelect.value);else p.delete("area");
    history.replaceState(null,"",`${location.pathname}${p.size?`?${p}`:""}${location.hash}`);
  }

  function neutralizeDirectoryScore(card,provider){
    if(!isDirectoryOnly(provider))return;
    const badgeRow=card.querySelector(".badge-row");
    if(badgeRow&&!badgeRow.querySelector(".directory-language-badge")){
      const badge=document.createElement("span");badge.className="badge directory-language-badge";
      badge.textContent=isTokyoDirectory(provider)?`Official Tokyo list · ${provider.languagesListed||"English listed"}`:"JNTO directory candidate · English listed";badgeRow.prepend(badge);
    }
    const state=card.querySelector(".record-state");
    if(state){state.className="record-state demo directory-only-state";state.textContent="DIRECTORY LISTING ONLY · PROVIDER DETAILS NOT YET VERIFIED";}
    card.querySelector(".freshness-note")?.remove();
    const source=card.querySelector(".source-line");
    if(source&&!source.dataset.directoryLabeled){source.dataset.directoryLabeled="1";source.prepend("Directory discovery source only · ");}
    const score=card.querySelector(".score-row");
    if(score){
      score.classList.add("directory-baseline-score");
      const value=score.querySelector(".score-ring b"),suffix=score.querySelector(".score-ring small"),label=score.querySelector("strong"),desc=score.querySelector("span");
      if(value)value.textContent="—";if(suffix)suffix.textContent="";if(label)label.textContent="Access score pending";
      if(desc)desc.textContent=isTokyoDirectory(provider)?"English is listed by Tokyo; physician/reception/interpreter details are not yet verified.":"JNTO directory discovery is confirmed; provider-level communication and booking details are not yet verified.";
    }
    const breakdown=card.querySelector(".score-breakdown");if(breakdown)breakdown.hidden=true;
  }

  function applyAreaOrder(card,provider){
    if(!provider)return;
    const sort=document.getElementById("sort")?.value;
    if(sort==="area"){
      const areas=[...new Set(providers.filter(p=>p.city==="Tokyo").map(p=>p.area).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
      card.style.order=String(Math.max(0,areas.indexOf(provider.area)));
    }else card.style.order="";
  }

  function annotateAndFilter(){
    const cards=[...grid.querySelectorAll(".provider-card")],selectedArea=areaSelect?.value||"all";
    let visible=0,verifiedVisible=0,directoryVisible=0;
    cards.forEach(card=>{
      const provider=providerForCard(card);if(!provider)return;
      const isVerified=isProviderVerified(provider),directoryOnly=isDirectoryOnly(provider),areaMatch=selectedArea==="all"||provider.area===selectedArea;
      card.hidden=Boolean((toggle.checked&&!isVerified)||!areaMatch);
      if(!card.hidden){visible++;if(isVerified)verifiedVisible++;if(directoryOnly)directoryVisible++;}
      neutralizeDirectoryScore(card,provider);addTransparency(card,provider);applyAreaOrder(card,provider);
      const badge=card.querySelector(".record-state.verified");
      if(isVerified&&badge&&!card.querySelector(".freshness-note")){
        const days=ageInDays(provider.verified);
        if(days!==null){const freshness=document.createElement("span");freshness.className=`freshness-note ${days>180?"stale":"current"}`;freshness.textContent=days>180?`Source check is ${days} days old — reconfirm before booking`:`Source checked ${days} day${days===1?"":"s"} ago`;badge.insertAdjacentElement("afterend",freshness);}
      }
    });
    const count=document.getElementById("resultCount");
    if(count)count.textContent=`${visible} options · ${verifiedVisible} provider-source checked${directoryVisible?` · ${directoryVisible} directory-only`:""}`;
    if(note){
      const areaText=selectedArea==="all"?"Tokyo":selectedArea;
      note.textContent=toggle.checked?`Showing ${visible} provider-source checked option${visible===1?"":"s"} in ${areaText}. Directory-only discovery records are excluded; confirm current acceptance before booking.`:`${visible} option${visible===1?"":"s"} shown in ${areaText}; ${verifiedVisible} have provider-level source checks and ${directoryVisible} are directory-only discovery records. Unknown language roles are not treated as poor English.`;
    }
    improveFinderA11y();
  }

  function syncToggle(){setUrlState();annotateAndFilter();}

  function injectAreaControl(){
    if(document.getElementById("area")){areaSelect=document.getElementById("area");return;}
    const filters=document.querySelector(".filters"),city=document.getElementById("city");if(!filters)return;
    areaSelect=document.createElement("select");areaSelect.id="area";areaSelect.setAttribute("aria-label","Tokyo area");
    const areas=[...new Set(providers.filter(p=>p.city==="Tokyo").map(p=>p.area).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    areaSelect.innerHTML=`<option value="all">All Tokyo areas</option>${areas.map(a=>`<option value="${a}">${a}</option>`).join("")}`;
    const requested=new URLSearchParams(location.search).get("area");if(requested&&areas.includes(requested))areaSelect.value=requested;
    city?.insertAdjacentElement("afterend",areaSelect);areaSelect.addEventListener("input",()=>{setUrlState();annotateAndFilter();});
  }

  function enhanceSort(){
    const sort=document.getElementById("sort");if(!sort||[...sort.options].some(o=>o.value==="area"))return;
    const opt=document.createElement("option");opt.value="area";opt.textContent="Area A–Z";sort.appendChild(opt);sort.addEventListener("input",()=>queueMicrotask(annotateAndFilter));
  }

  function neutralizeDirectoryDetail(){
    const detail=document.getElementById("providerDetail");if(!detail)return;
    const name=detail.querySelector("h2")?.textContent?.trim(),provider=providers.find(p=>p.name===name);if(!provider)return;
    addDetailTransparency(detail,provider);if(!isDirectoryOnly(provider))return;
    const state=detail.querySelector(".record-state");if(state){state.className="record-state demo directory-only-state";state.textContent="DIRECTORY LISTING ONLY · PROVIDER DETAILS NOT YET VERIFIED";}
    detail.querySelector(".freshness-note")?.remove();
    detail.querySelectorAll(".detail-grid>div").forEach(cell=>{if(cell.querySelector("small")?.textContent?.trim()==="Access Score"){const b=cell.querySelector("b");if(b)b.textContent="Not scored yet";}});
    detail.querySelectorAll("h3").forEach(h=>{if(h.textContent.trim()==="Access Score breakdown"){h.hidden=true;if(h.nextElementSibling?.classList.contains("score-breakdown"))h.nextElementSibling.hidden=true;}});
    detail.querySelectorAll("p.muted").forEach(p=>{if(/score summarizes international-access friction/i.test(p.textContent||""))p.textContent="This directory-discovery record is not assigned a numeric International Access Score until provider-level communication and booking facts are verified. Unknown is not treated as poor access.";});
    if(!detail.querySelector(".directory-detail-note")){
      const n=document.createElement("div");n.className="directory-detail-note";
      const label=isTokyoDirectory(provider)?(provider.languagesListed||"English listed"):"English listed in JNTO Medical Institution Search";
      n.innerHTML=`<b>Official directory discovery evidence</b><span>${label}</span><small>This confirms directory discovery only; it does not establish physician fluency, reception fluency, interpreter availability, insurance, self-pay rules, prices or current acceptance.</small>`;
      detail.querySelector(".provider-meta")?.insertAdjacentElement("afterend",n);
    }
  }

  function applySearch({query,audience,language}={}){
    const q=document.getElementById("q"),aud=document.getElementById("audience"),lang=document.getElementById("language");
    if(query!==undefined&&q)q.value=query;if(audience&&aud)aud.value=audience;if(language&&lang)lang.value=language;
    if(typeof window.render==="function")window.render();if(typeof window.syncUrl==="function")window.syncUrl();setUrlState();location.hash="find";
  }

  function syncLeadAudience(){
    const audience=document.getElementById("audience"),leadAudience=document.getElementById("leadAudience");
    if(!audience||!leadAudience)return;
    if(audience.value==="visitor"||audience.value==="resident")leadAudience.value=audience.value;
  }

  function updateAudienceContext(){
    const audience=document.getElementById("audience"),context=document.getElementById("journeyAudienceContext");
    if(!audience||!context)return;
    if(audience.value!=="visitor"&&audience.value!=="resident"){context.hidden=true;return;}
    const visitor=audience.value==="visitor";
    context.hidden=false;
    context.querySelector("b").textContent=visitor?"Visitor pathway active":"Resident pathway active";
    context.querySelector("span").textContent=visitor?"Results are limited to records that explicitly include visitor access. Unknown eligibility is not silently treated as accepted.":"Results are limited to records that explicitly include resident access. Insurance details still remain source-dependent.";
  }

  function injectAudienceContext(){
    if(document.getElementById("journeyAudienceContext"))return;
    const head=document.querySelector(".finder-head>div")||document.querySelector(".finder-head");if(!head)return;
    const context=document.createElement("div");context.id="journeyAudienceContext";context.className="journey-audience-context";context.setAttribute("role","status");context.setAttribute("aria-live","polite");context.hidden=true;
    context.innerHTML='<div><b></b><br/><span></span></div><button type="button">Show Visitor + Resident</button>';
    context.querySelector("button")?.addEventListener("click",()=>{
      const audience=document.getElementById("audience");if(!audience)return;
      audience.value="all";audience.dispatchEvent(new Event("input",{bubbles:true}));updateAudienceContext();
    });
    head.appendChild(context);updateAudienceContext();
  }

  function setJourneyAudience(value){
    const audience=document.getElementById("audience");if(!audience)return;
    audience.value=value;audience.dispatchEvent(new Event("input",{bubbles:true}));syncLeadAudience();updateAudienceContext();
  }

  function wireJourneyPersonalization(){
    [["visitor","visitor"],["resident","resident"]].forEach(([id,value])=>{
      const card=document.getElementById(id);if(!card)return;
      card.addEventListener("click",event=>{
        if(event.target.closest("button,a"))setJourneyAudience(value);
      },true);
    });
    const audience=document.getElementById("audience");
    audience?.addEventListener("input",()=>{syncLeadAudience();updateAudienceContext();});
    const originalOpenLead=window.openLeadModal;
    if(typeof originalOpenLead==="function")window.openLeadModal=(...args)=>{syncLeadAudience();return originalOpenLead(...args);};
    syncLeadAudience();updateAudienceContext();
  }

  function injectConsumerEntry(){if(document.getElementById("journeys")||document.getElementById("careStarter"))return;}

  function injectCoordinatorDirectory(){
    const section=document.getElementById("coordinators");if(!section||document.getElementById("coordinatorDirectory"))return;
    const directory=document.createElement("div");directory.id="coordinatorDirectory";directory.className="coordinator-directory";
    directory.innerHTML=`
      <div class="coordinator-directory-head"><div><span class="mini">SOURCE-BACKED COORDINATION OPTIONS</span><h3>Compare access credentials, not clinical quality.</h3></div><p>Government registration and coordination accreditation can support visa, language and logistics decisions. They do not mean one company provides better medical care.</p></div>
      <div class="coordinator-cards">
        <article><span class="coord-credential">MEJ AMTAC · MOFA registered guarantor</span><h4>JMHC / JTB Corp.</h4><p>MOFA lists Japanese, Chinese, Korean, English and Vietnamese. JMHC publishes medical coordination, interpretation/translation, medical-stay visa guarantor and travel-support services.</p><div class="coord-links"><a href="https://www.mofa.go.jp/j_info/visit/visa/medical_stay3.html" target="_blank" rel="noopener noreferrer">MOFA source ↗</a><a href="https://medicalexcellencejapan.org/en/amtac_Inquiry/" target="_blank" rel="noopener noreferrer">MEJ AMTAC ↗</a></div></article>
        <article><span class="coord-credential">MEJ AMTAC · MOFA registered coordinator</span><h4>Emergency Assistance Japan</h4><p>MOFA lists English, Japanese, Chinese, Vietnamese, Korean, Russian and other language support. MEJ lists the company as an Accredited Medical Travel Assistance Company.</p><div class="coord-links"><a href="https://www.mofa.go.jp/j_info/visit/visa/medical_stay2.html" target="_blank" rel="noopener noreferrer">MOFA source ↗</a><a href="https://medicalexcellencejapan.org/en/amtac_Inquiry/" target="_blank" rel="noopener noreferrer">MEJ AMTAC ↗</a></div></article>
        <article><span class="coord-credential">MOFA registered coordinator</span><h4>SMC Co., Ltd.</h4><p>MOFA lists an International Medical Coordination Department and multilingual support including English, Russian, Korean, Vietnamese and Spanish. No clinical-quality claim is inferred.</p><div class="coord-links"><a href="https://www.mofa.go.jp/j_info/visit/visa/medical_stay2.html" target="_blank" rel="noopener noreferrer">MOFA source ↗</a></div></article>
        <article class="coord-partner"><span class="coord-credential partner">Japan Health downstream partner</span><h4>AMECA</h4><p>AMECA's own site publishes Tokyo contact routes in Chinese, English, Japanese and Korean. This card does not assert MOFA guarantor or MEJ AMTAC status because that credential has not been established in this dataset.</p><div class="coord-links"><a href="https://ameca.jp/" target="_blank" rel="noopener noreferrer">AMECA source ↗</a><button type="button" data-ameca-handoff>Ask Japan Health</button></div></article>
      </div>`;
    section.appendChild(directory);directory.querySelector("[data-ameca-handoff]")?.addEventListener("click",()=>window.openLeadModal?.());
  }

  function injectMobileCta(){
    if(document.getElementById("mobileFindCta"))return;
    const bar=document.createElement("div");bar.id="mobileFindCta";bar.className="mobile-find-cta";bar.innerHTML='<a href="#find">Find care</a><button type="button">Ask a coordinator</button>';
    bar.querySelector("button")?.addEventListener("click",()=>window.openLeadModal?.());document.body.appendChild(bar);
  }

  injectTransparencyStyles();injectAreaControl();enhanceSort();injectAudienceContext();wireJourneyPersonalization();
  toggle.addEventListener("change",syncToggle);
  ["q","audience","city","language","coord","referral","sort"].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener("input",()=>queueMicrotask(()=>{setUrlState();annotateAndFilter();}));});
  new MutationObserver(()=>queueMicrotask(annotateAndFilter)).observe(grid,{childList:true});
  const detail=document.getElementById("providerDetail");if(detail)new MutationObserver(()=>queueMicrotask(neutralizeDirectoryDetail)).observe(detail,{childList:true});
  injectConsumerEntry();injectCoordinatorDirectory();injectMobileCta();improveFinderA11y();annotateAndFilter();
})();