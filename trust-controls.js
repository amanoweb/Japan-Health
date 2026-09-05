(()=>{
  const providers=window.PROVIDERS||[];
  const grid=document.getElementById("providerGrid");
  const toggle=document.getElementById("verifiedOnly");
  const note=document.getElementById("verificationSummary");
  if(!grid||!toggle)return;

  const params=new URLSearchParams(location.search);
  toggle.checked=params.get("verifiedOnly")==="1";

  const ageInDays=date=>{
    if(!/^\d{4}-\d{2}-\d{2}$/.test(String(date||"")))return null;
    const checked=new Date(`${date}T00:00:00Z`);
    return Math.max(0,Math.floor((Date.now()-checked.getTime())/86400000));
  };

  function setUrlFlag(){
    const p=new URLSearchParams(location.search);
    if(toggle.checked)p.set("verifiedOnly","1");else p.delete("verifiedOnly");
    history.replaceState(null,"",`${location.pathname}${p.size?`?${p}`:""}${location.hash}`);
  }

  function annotateAndFilter(){
    const cards=[...grid.querySelectorAll(".provider-card")];
    let visible=0,verified=0;
    cards.forEach(card=>{
      const name=card.querySelector("h3")?.textContent?.trim();
      const provider=providers.find(p=>p.name===name);
      if(!provider)return;
      const isVerified=provider.recordStatus==="official-source-verified";
      if(isVerified)verified++;
      card.hidden=Boolean(toggle.checked&&!isVerified);
      if(!card.hidden)visible++;

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

    if(note){
      note.textContent=toggle.checked
        ?`Showing ${visible} official-source checked option${visible===1?"":"s"}. Source checks support the displayed access facts only; confirm current acceptance before booking.`
        :`${verified} of ${cards.length} displayed options are official-source checked. Demo records remain clearly labeled and are not recommendations.`;
    }
  }

  function syncToggle(){
    setUrlFlag();
    annotateAndFilter();
  }

  function applySearch({query,audience,language}={}){
    const q=document.getElementById("q"),aud=document.getElementById("audience"),lang=document.getElementById("language");
    if(query!==undefined&&q)q.value=query;
    if(audience&&aud)aud.value=audience;
    if(language&&lang)lang.value=language;
    if(typeof window.render==="function")window.render();
    if(typeof window.syncUrl==="function")window.syncUrl();
    setUrlFlag();
    location.hash="find";
  }

  function injectConsumerEntry(){
    if(document.getElementById("careStarter"))return;
    const hero=document.querySelector(".hero");
    if(!hero)return;

    const copy=hero.querySelector(".hero-copy");
    const heading=copy?.querySelector("h1");
    const intro=copy?.querySelector("p");
    if(heading)heading.innerHTML='Find care in Japan that <span>works for you.</span>';
    if(intro)intro.textContent="Start with what you need, whether you live in Japan or are visiting, and how you want to communicate. Japan Health then narrows the options without guessing missing access details.";

    const starter=document.createElement("section");
    starter.id="careStarter";
    starter.className="care-starter";
    starter.setAttribute("aria-labelledby","careStarterTitle");
    starter.innerHTML=`
      <div class="care-starter-head">
        <div class="eyebrow dark">START WITH WHAT YOU NEED</div>
        <h2 id="careStarterTitle">You don’t need to know the medical specialty.</h2>
        <p>Choose the closest match. We’ll turn it into a care search.</p>
      </div>
      <div class="care-starter-grid">
        <button type="button" data-friendly-query="Internal Medicine"><span>🩺</span><b>Feeling sick</b><small>Fever, cough, stomach issues & general care</small></button>
        <button type="button" data-friendly-query="Dermatology"><span>✨</span><b>Skin problem</b><small>Rashes, allergies & dermatology</small></button>
        <button type="button" data-friendly-query="OB-GYN"><span>🌷</span><b>Women’s health</b><small>Gynecology & women’s care</small></button>
        <button type="button" data-friendly-query="Dentistry"><span>🦷</span><b>Dental care</b><small>Routine or urgent dental needs</small></button>
        <button type="button" data-friendly-query="Orthopedics"><span>🦴</span><b>Pain or injury</b><small>Orthopedics, aches & minor injuries</small></button>
        <button type="button" data-friendly-query="Health Screening"><span>🧪</span><b>Health checkup</b><small>Screening, checkups & certificates</small></button>
        <button type="button" data-friendly-query="Travel Health"><span>✈️</span><b>Travel health</b><small>Vaccines, travel medicine & documents</small></button>
        <button type="button" data-friendly-query="Neurology"><span>🏥</span><b>Specialist care</b><small>Complex care and hospital pathways</small></button>
      </div>
      <div class="journey-shortcuts" aria-label="Choose your situation">
        <button type="button" data-journey="resident"><span>🏠</span><b>I live in Japan</b><small>Insurance, repeat visits and nearby care</small></button>
        <button type="button" data-journey="visitor"><span>🧳</span><b>I’m visiting Japan</b><small>Short stays, self-pay and access from abroad</small></button>
        <button type="button" data-language-shortcut="direct"><span>💬</span><b>I want an English-speaking doctor</b><small>Only show records with documented physician English</small></button>
      </div>`;
    hero.insertAdjacentElement("afterend",starter);

    starter.querySelectorAll("[data-friendly-query]").forEach(btn=>btn.addEventListener("click",()=>applySearch({query:btn.dataset.friendlyQuery})));
    starter.querySelectorAll("[data-journey]").forEach(btn=>btn.addEventListener("click",()=>applySearch({audience:btn.dataset.journey})));
    starter.querySelectorAll("[data-language-shortcut]").forEach(btn=>btn.addEventListener("click",()=>applySearch({language:btn.dataset.languageShortcut})));
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

  toggle.addEventListener("change",syncToggle);
  ["q","audience","city","language","coord","referral","sort"].forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.addEventListener("input",()=>queueMicrotask(setUrlFlag));
  });
  new MutationObserver(annotateAndFilter).observe(grid,{childList:true});
  injectConsumerEntry();
  injectMobileCta();
  annotateAndFilter();
})();
