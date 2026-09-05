(()=>{
  const providers=window.PROVIDERS||[];
  const grid=document.getElementById("providerGrid");
  const toggle=document.getElementById("verifiedOnly");
  const note=document.getElementById("verificationSummary");
  if(!grid||!toggle)return;

  const params=new URLSearchParams(location.search);
  toggle.checked=params.get("verifiedOnly")==="1";

  const isTokyoDirectory=p=>Boolean(p&&p.directoryBasis==="Tokyo Metropolitan Government foreign-patient list");
  const providerForCard=card=>providers.find(p=>p.name===card.querySelector("h3")?.textContent?.trim());
  const ageInDays=date=>{
    if(!/^\d{4}-\d{2}-\d{2}$/.test(String(date||"")))return null;
    const checked=new Date(`${date}T00:00:00Z`);
    return Math.max(0,Math.floor((Date.now()-checked.getTime())/86400000));
  };

  let areaSelect=null;

  function setUrlState(){
    const p=new URLSearchParams(location.search);
    if(toggle.checked)p.set("verifiedOnly","1");else p.delete("verifiedOnly");
    if(areaSelect&&areaSelect.value!=="all")p.set("area",areaSelect.value);else p.delete("area");
    history.replaceState(null,"",`${location.pathname}${p.size?`?${p}`:""}${location.hash}`);
  }

  function neutralizeDirectoryScore(card,provider){
    if(!isTokyoDirectory(provider))return;
    const badgeRow=card.querySelector(".badge-row");
    if(badgeRow&&!badgeRow.querySelector(".directory-language-badge")){
      const badge=document.createElement("span");
      badge.className="badge directory-language-badge";
      badge.textContent=`Official Tokyo list · ${provider.languagesListed||"English listed"}`;
      badgeRow.prepend(badge);
    }

    const score=card.querySelector(".score-row");
    if(score){
      score.classList.add("directory-baseline-score");
      const value=score.querySelector(".score-ring b"),suffix=score.querySelector(".score-ring small"),label=score.querySelector("strong"),desc=score.querySelector("span");
      if(value)value.textContent="—";
      if(suffix)suffix.textContent="";
      if(label)label.textContent="Access score pending";
      if(desc)desc.textContent="English is listed by Tokyo; physician/reception/interpreter details are not yet verified.";
    }
    const breakdown=card.querySelector(".score-breakdown");
    if(breakdown)breakdown.hidden=true;
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
    const cards=[...grid.querySelectorAll(".provider-card")];
    const selectedArea=areaSelect?.value||"all";
    let visible=0,verifiedVisible=0;
    cards.forEach(card=>{
      const provider=providerForCard(card);
      if(!provider)return;
      const isVerified=provider.recordStatus==="official-source-verified";
      const areaMatch=selectedArea==="all"||provider.area===selectedArea;
      card.hidden=Boolean((toggle.checked&&!isVerified)||!areaMatch);
      if(!card.hidden){
        visible++;
        if(isVerified)verifiedVisible++;
      }

      neutralizeDirectoryScore(card,provider);
      applyAreaOrder(card,provider);

      const badge=card.querySelector(".record-state.verified");
      if(badge&&!card.querySelector(".freshness-note")){
        const days=ageInDays(provider.verified);
        if(days!==null){
          const freshness=document.createElement("span");
          freshness.className=`freshness-note ${days>180?"stale":"current"}`;
          freshness.textContent=days>180?`Source check is ${days} days old — reconfirm before booking`:`Source checked ${days} day${days===1?"":"s"} ago`;
          badge.insertAdjacentElement("afterend",freshness);
        }
      }
    });

    const count=document.getElementById("resultCount");
    if(count)count.textContent=`${visible} options · ${verifiedVisible} official-source checked`;
    if(note){
      const areaText=selectedArea==="all"?"Tokyo":selectedArea;
      note.textContent=toggle.checked
        ?`Showing ${visible} official-source checked option${visible===1?"":"s"} in ${areaText}. Source checks support only the displayed access facts; confirm current acceptance before booking.`
        :`${visible} option${visible===1?"":"s"} shown in ${areaText}; ${verifiedVisible} are official-source checked. Unknown language roles are not treated as poor English.`;
    }
  }

  function syncToggle(){
    setUrlState();
    annotateAndFilter();
  }

  function injectAreaControl(){
    if(document.getElementById("area")){
      areaSelect=document.getElementById("area");
      return;
    }
    const filters=document.querySelector(".filters");
    const city=document.getElementById("city");
    if(!filters)return;
    areaSelect=document.createElement("select");
    areaSelect.id="area";
    areaSelect.setAttribute("aria-label","Tokyo area");
    const areas=[...new Set(providers.filter(p=>p.city==="Tokyo").map(p=>p.area).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    areaSelect.innerHTML=`<option value="all">All Tokyo areas</option>${areas.map(a=>`<option value="${a}">${a}</option>`).join("")}`;
    const requested=new URLSearchParams(location.search).get("area");
    if(requested&&areas.includes(requested))areaSelect.value=requested;
    city?.insertAdjacentElement("afterend",areaSelect);
    areaSelect.addEventListener("input",()=>{setUrlState();annotateAndFilter();});
  }

  function enhanceSort(){
    const sort=document.getElementById("sort");
    if(!sort||[...sort.options].some(o=>o.value==="area"))return;
    const opt=document.createElement("option");
    opt.value="area";
    opt.textContent="Area A–Z";
    sort.appendChild(opt);
    sort.addEventListener("input",()=>queueMicrotask(annotateAndFilter));
  }

  function neutralizeDirectoryDetail(){
    const detail=document.getElementById("providerDetail");
    if(!detail)return;
    const name=detail.querySelector("h2")?.textContent?.trim();
    const provider=providers.find(p=>p.name===name);
    if(!isTokyoDirectory(provider))return;

    detail.querySelectorAll(".detail-grid>div").forEach(cell=>{
      if(cell.querySelector("small")?.textContent?.trim()==="Access Score"){
        const b=cell.querySelector("b");
        if(b)b.textContent="Not scored yet";
      }
    });
    detail.querySelectorAll("h3").forEach(h=>{
      if(h.textContent.trim()==="Access Score breakdown"){
        h.hidden=true;
        if(h.nextElementSibling?.classList.contains("score-breakdown"))h.nextElementSibling.hidden=true;
      }
    });
    detail.querySelectorAll("p.muted").forEach(p=>{
      if(/score summarizes international-access friction/i.test(p.textContent||""))p.textContent="This baseline record is not assigned a numeric International Access Score until provider-level communication and booking facts are verified. Unknown is not treated as poor access.";
    });
    if(!detail.querySelector(".directory-detail-note")){
      const n=document.createElement("div");
      n.className="directory-detail-note";
      n.innerHTML=`<b>Official Tokyo language evidence</b><span>${provider.languagesListed||"English listed"}</span><small>This confirms the government directory listing only; it does not establish physician fluency, reception fluency or interpreter availability.</small>`;
      detail.querySelector(".provider-meta")?.insertAdjacentElement("afterend",n);
    }
  }

  function applySearch({query,audience,language}={}){
    const q=document.getElementById("q"),aud=document.getElementById("audience"),lang=document.getElementById("language");
    if(query!==undefined&&q)q.value=query;
    if(audience&&aud)aud.value=audience;
    if(language&&lang)lang.value=language;
    if(typeof window.render==="function")window.render();
    if(typeof window.syncUrl==="function")window.syncUrl();
    setUrlState();
    location.hash="find";
  }

  function injectConsumerEntry(){
    // Tokyo now has a first-class three-path journey in index.html. Do not re-inject
    // the older Japan-wide starter or overwrite the Tokyo hero copy.
    if(document.getElementById("journeys")||document.getElementById("careStarter"))return;
  }

  function injectCoordinatorDirectory(){
    const section=document.getElementById("coordinators");
    if(!section||document.getElementById("coordinatorDirectory"))return;
    const directory=document.createElement("div");
    directory.id="coordinatorDirectory";
    directory.className="coordinator-directory";
    directory.innerHTML=`
      <div class="coordinator-directory-head">
        <div><span class="mini">SOURCE-BACKED COORDINATION OPTIONS</span><h3>Compare access credentials, not clinical quality.</h3></div>
        <p>Government registration and coordination accreditation can support visa, language and logistics decisions. They do not mean one company provides better medical care.</p>
      </div>
      <div class="coordinator-cards">
        <article><span class="coord-credential">MEJ AMTAC · MOFA registered guarantor</span><h4>JMHC / JTB Corp.</h4><p>MOFA lists Japanese, Chinese, Korean, English and Vietnamese. JMHC publishes medical coordination, interpretation/translation, medical-stay visa guarantor and travel-support services.</p><div class="coord-links"><a href="https://www.mofa.go.jp/j_info/visit/visa/medical_stay3.html" target="_blank" rel="noopener noreferrer">MOFA source ↗</a><a href="https://medicalexcellencejapan.org/en/amtac_Inquiry/" target="_blank" rel="noopener noreferrer">MEJ AMTAC ↗</a></div></article>
        <article><span class="coord-credential">MEJ AMTAC · MOFA registered coordinator</span><h4>Emergency Assistance Japan</h4><p>MOFA lists English, Japanese, Chinese, Vietnamese, Korean, Russian and other language support. MEJ lists the company as an Accredited Medical Travel Assistance Company.</p><div class="coord-links"><a href="https://www.mofa.go.jp/j_info/visit/visa/medical_stay2.html" target="_blank" rel="noopener noreferrer">MOFA source ↗</a><a href="https://medicalexcellencejapan.org/en/amtac_Inquiry/" target="_blank" rel="noopener noreferrer">MEJ AMTAC ↗</a></div></article>
        <article><span class="coord-credential">MOFA registered coordinator</span><h4>SMC Co., Ltd.</h4><p>MOFA lists an International Medical Coordination Department and multilingual support including English, Russian, Korean, Vietnamese and Spanish. No clinical-quality claim is inferred.</p><div class="coord-links"><a href="https://www.mofa.go.jp/j_info/visit/visa/medical_stay2.html" target="_blank" rel="noopener noreferrer">MOFA source ↗</a></div></article>
        <article class="coord-partner"><span class="coord-credential partner">Japan Health downstream partner</span><h4>AMECA</h4><p>AMECA's own site publishes Tokyo contact routes in Chinese, English, Japanese and Korean. This card does not assert MOFA guarantor or MEJ AMTAC status because that credential has not been established in this dataset.</p><div class="coord-links"><a href="https://ameca.jp/" target="_blank" rel="noopener noreferrer">AMECA source ↗</a><button type="button" data-ameca-handoff>Ask Japan Health</button></div></article>
      </div>`;
    section.appendChild(directory);
    directory.querySelector("[data-ameca-handoff]")?.addEventListener("click",()=>window.openLeadModal?.());
  }

  function injectMobileCta(){
    if(document.getElementById("mobileFindCta"))return;
    const bar=document.createElement("div");
    bar.id="mobileFindCta";
    bar.className="mobile-find-cta";
    bar.innerHTML='<a href="#find">Find care</a><button type="button">Ask a coordinator</button>';
    bar.querySelector("button")?.addEventListener("click",()=>window.openLeadModal?.());
    document.body.appendChild(bar);
  }

  injectAreaControl();
  enhanceSort();
  toggle.addEventListener("change",syncToggle);
  ["q","audience","city","language","coord","referral","sort"].forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.addEventListener("input",()=>queueMicrotask(()=>{setUrlState();annotateAndFilter();}));
  });
  new MutationObserver(()=>queueMicrotask(annotateAndFilter)).observe(grid,{childList:true});
  const detail=document.getElementById("providerDetail");
  if(detail)new MutationObserver(()=>queueMicrotask(neutralizeDirectoryDetail)).observe(detail,{childList:true,subtree:true});
  injectConsumerEntry();
  injectCoordinatorDirectory();
  injectMobileCta();
  annotateAndFilter();
})();
