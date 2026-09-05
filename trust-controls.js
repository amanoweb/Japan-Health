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
    const p=new URLSearchParams(location.search);
    if(toggle.checked)p.set("verifiedOnly","1");else p.delete("verifiedOnly");
    history.replaceState(null,"",`${location.pathname}${p.size?`?${p}`:""}${location.hash}`);
    annotateAndFilter();
  }

  toggle.addEventListener("change",syncToggle);
  new MutationObserver(annotateAndFilter).observe(grid,{childList:true});
  annotateAndFilter();
})();
