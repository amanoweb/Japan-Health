(()=>{
  const providers=window.PROVIDERS||[];
  const grid=document.getElementById("providerGrid");
  if(!grid)return;

  const known=v=>v!==undefined&&v!==null&&v!==""&&v!=="unknown";
  const providerForCard=card=>providers.find(p=>p.name===card.querySelector("h3")?.textContent?.trim());
  const selectedAudience=()=>document.getElementById("audience")?.value||"all";

  function costEvidence(p){
    const published=Array.isArray(p.publishedCosts)&&p.publishedCosts.length>0;
    const medical=known(p.medicalCost)&&!/^(unknown|varies)$/i.test(String(p.medicalCost));
    return published||medical||["medium","high"].includes(p.priceTransparency);
  }

  function dimensions(p){
    const communication=[p.doctorEnglish,p.receptionEnglish,p.interpreter,p.englishDocs].some(known);
    const booking=known(p.referral)&&known(p.coordinator);
    const eligibility=Array.isArray(p.audience)&&p.audience.length>0&&!p.audience.includes("unknown")&&known(p.selfPay);
    const cost=costEvidence(p);
    return{communication,booking,eligibility,cost};
  }

  function providerLevelEvidence(p){
    if(!p||p.recordStatus!=="official-source-verified"||p.discoveryStatus==="directory-only")return false;
    const source=String(p.source||"");
    if(/^https:\/\//i.test(source)&&!/jnto\.go\.jp|hokeniryo\.metro\.tokyo\.lg\.jp/i.test(source))return true;
    return (p.expertiseEvidence||[]).some(e=>e&&e.evidenceStatus==="official-source-verified"&&/^https:\/\//i.test(e.sourceUrl||"")&&!/jnto\.go\.jp|hokeniryo\.metro\.tokyo\.lg\.jp/i.test(e.sourceUrl||""));
  }

  function audienceState(p){
    const audience=selectedAudience();
    if(audience==="all")return"not-selected";
    if(!Array.isArray(p.audience)||!p.audience.length||p.audience.includes("unknown"))return"unknown";
    return p.audience.includes(audience)?"confirmed":"not-listed";
  }

  function scoreReady(p){
    if(!providerLevelEvidence(p))return false;
    const d=dimensions(p);
    return d.communication&&d.booking&&d.eligibility;
  }

  function missingDimensions(p){
    const d=dimensions(p);
    return Object.entries(d).filter(([,v])=>!v).map(([k])=>({communication:"communication",booking:"booking rules",eligibility:"visitor/resident eligibility",cost:"total-cost data"}[k]||k);
  }

  function coverageText(p){
    const d=dimensions(p),count=Object.values(d).filter(Boolean).length;
    return `${count}/4 access dimensions evidenced`;
  }

  function confidenceLabel(p){
    if(!providerLevelEvidence(p))return"Directory-level evidence only";
    const count=Object.values(dimensions(p)).filter(Boolean).length;
    return count===4?"High access-data coverage":count===3?"Moderate access-data coverage":"Limited access-data coverage";
  }

  function neutralizeCard(card,p){
    if(!p)return;
    const ready=scoreReady(p),aState=audienceState(p),missing=missingDimensions(p);
    card.dataset.scoreConfidence=ready?"ready":"pending";
    card.dataset.audienceConfidence=aState;
    let note=card.querySelector(".access-confidence-note");
    if(!note){
      note=document.createElement("div");
      note.className="access-confidence-note";
      const score=card.querySelector(".score-row");
      if(score)score.insertAdjacentElement("afterend",note);
      else card.querySelector(".badge-row")?.insertAdjacentElement("afterend",note);
    }
    if(note){
      const audienceNote=aState==="confirmed"?" · Selected audience pathway confirmed in this record":aState==="not-listed"?" · Selected audience pathway is not listed in this record":aState==="unknown"?" · Selected audience eligibility still needs verification":"";
      const missingNote=missing.length?` · Missing: ${missing.join(", ")}`:"";
      note.innerHTML=ready
        ?`<b>${confidenceLabel(p)}</b><span>${coverageText(p)}${audienceNote}${missingNote} · Numeric score summarizes access friction only, not clinical quality.</span>`
        :`<b>Access Score pending</b><span>${confidenceLabel(p)} · ${coverageText(p)}${audienceNote}${missingNote}. Unknown fields are not converted into a low or high score.</span>`;
    }

    if(ready)return;
    const score=card.querySelector(".score-row");
    if(score&&!score.classList.contains("directory-baseline-score")){
      const value=score.querySelector(".score-ring b"),suffix=score.querySelector(".score-ring small"),label=score.querySelector("strong"),desc=score.querySelector("span");
      if(value)value.textContent="—";
      if(suffix)suffix.textContent="";
      if(label)label.textContent="Not enough provider-level access data";
      if(desc)desc.textContent="Unknown fields are not scored.";
    }
    const breakdown=card.querySelector(".score-breakdown");
    if(breakdown)breakdown.hidden=true;
  }

  function reorderForConfidence(){
    const sort=document.getElementById("sort");
    if(!sort||sort.value!=="fit")return;
    const cards=[...grid.querySelectorAll(".provider-card")];
    cards.forEach((card,i)=>{
      const p=providerForCard(card);
      if(!p)return;
      const aState=audienceState(p);
      const bucket=scoreReady(p)?(aState==="not-listed"?1:0):(aState==="not-listed"?3:2);
      card.style.order=String(bucket*10000+i);
    });
  }

  function annotate(){
    [...grid.querySelectorAll(".provider-card")].forEach(card=>neutralizeCard(card,providerForCard(card)));
    reorderForConfidence();
    const sort=document.getElementById("sort");
    const fit=sort&&[...sort.options].find(o=>o.value==="fit");
    if(fit)fit.textContent="Best access fit · provider-level evidence first";
  }

  function neutralizeDetail(){
    const detail=document.getElementById("providerDetail");
    if(!detail)return;
    const p=providers.find(x=>x.name===detail.querySelector("h2")?.textContent?.trim());
    if(!p)return;
    const ready=scoreReady(p),missing=missingDimensions(p),aState=audienceState(p);
    if(!ready){
      detail.querySelectorAll(".detail-grid>div").forEach(cell=>{
        if(cell.querySelector("small")?.textContent?.trim()==="Access Score"){
          const b=cell.querySelector("b");
          if(b)b.textContent="Pending verification";
        }
      });
      detail.querySelectorAll("h3").forEach(h=>{
        if(h.textContent.trim()==="Access Score breakdown"){
          h.hidden=true;
          if(h.nextElementSibling?.classList.contains("score-breakdown"))h.nextElementSibling.hidden=true;
        }
      });
    }
    let n=detail.querySelector(".detail-confidence-note");
    if(!n){
      n=document.createElement("div");
      n.className="detail-confidence-note";
      detail.querySelector(".provider-meta")?.insertAdjacentElement("afterend",n);
    }
    if(n){
      const audienceNote=aState==="confirmed"?" Selected audience pathway is confirmed in this record.":aState==="not-listed"?" Selected audience pathway is not listed in this record.":aState==="unknown"?" Selected audience eligibility still needs verification.":"";
      const missingNote=missing.length?` Missing access dimensions: ${missing.join(", ")}.`:"";
      n.innerHTML=`<b>${ready?confidenceLabel(p):"Why there is no numeric score yet"}</b><span>${coverageText(p)}.${audienceNote}${missingNote} Japan Health uses provider-level access evidence for numeric scoring and does not score clinical quality.</span>`;
    }
  }

  const style=document.createElement("style");
  style.textContent='.access-confidence-note,.detail-confidence-note{margin:9px 0;padding:9px 10px;border:1px solid #dfe7ef;border-radius:10px;background:#fbfcfe}.access-confidence-note b,.access-confidence-note span,.detail-confidence-note b,.detail-confidence-note span{display:block}.access-confidence-note b,.detail-confidence-note b{font-size:8px;color:#334b63}.access-confidence-note span,.detail-confidence-note span{font-size:8px;line-height:1.45;color:#6a7c8e;margin-top:3px}.provider-card[data-audience-confidence="not-listed"] .access-confidence-note{border-color:#efd7b1;background:#fffaf1}';
  document.head.appendChild(style);

  new MutationObserver(()=>queueMicrotask(annotate)).observe(grid,{childList:true});
  const detail=document.getElementById("providerDetail");
  if(detail)new MutationObserver(()=>queueMicrotask(neutralizeDetail)).observe(detail,{childList:true});
  document.getElementById("sort")?.addEventListener("input",()=>queueMicrotask(annotate));
  document.getElementById("audience")?.addEventListener("input",()=>queueMicrotask(()=>{annotate();neutralizeDetail();}));
  annotate();
})();