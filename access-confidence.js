(()=>{
  const providers=window.PROVIDERS||[];
  const grid=document.getElementById("providerGrid");
  if(!grid)return;

  const known=v=>v!==undefined&&v!==null&&v!==""&&v!=="unknown";
  const providerForCard=card=>providers.find(p=>p.name===card.querySelector("h3")?.textContent?.trim());

  function dimensions(p){
    const communication=[p.doctorEnglish,p.receptionEnglish,p.interpreter,p.englishDocs].some(known);
    const booking=known(p.referral)&&known(p.coordinator);
    const eligibility=Array.isArray(p.audience)&&p.audience.length>0&&!p.audience.includes("unknown")&&known(p.selfPay);
    const cost=known(p.priceTransparency);
    return{communication,booking,eligibility,cost};
  }

  function scoreReady(p){
    if(!p||p.directoryBasis==="Tokyo Metropolitan Government foreign-patient list")return false;
    const d=dimensions(p);
    return d.communication&&d.booking&&d.eligibility;
  }

  function coverageText(p){
    const d=dimensions(p),count=Object.values(d).filter(Boolean).length;
    return `${count}/4 access dimensions evidenced`;
  }

  function neutralizeCard(card,p){
    if(!p)return;
    const ready=scoreReady(p);
    card.dataset.scoreConfidence=ready?"ready":"pending";
    let note=card.querySelector(".access-confidence-note");
    if(!note){
      note=document.createElement("div");
      note.className="access-confidence-note";
      const score=card.querySelector(".score-row");
      if(score)score.insertAdjacentElement("afterend",note);
      else card.querySelector(".badge-row")?.insertAdjacentElement("afterend",note);
    }
    if(note)note.innerHTML=ready
      ?`<b>Score evidence coverage</b><span>${coverageText(p)} · Numeric score summarizes access friction only, not clinical quality.</span>`
      :`<b>Access Score pending</b><span>${coverageText(p)} · Missing communication, booking or eligibility facts are not converted into a low or high score.</span>`;

    if(ready)return;
    const score=card.querySelector(".score-row");
    if(score&&!score.classList.contains("directory-baseline-score")){
      const value=score.querySelector(".score-ring b"),suffix=score.querySelector(".score-ring small"),label=score.querySelector("strong"),desc=score.querySelector("span");
      if(value)value.textContent="—";
      if(suffix)suffix.textContent="";
      if(label)label.textContent="Not enough verified access data";
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
      card.style.order=scoreReady(p)?String(i):String(10000+i);
    });
  }

  function annotate(){
    [...grid.querySelectorAll(".provider-card")].forEach(card=>neutralizeCard(card,providerForCard(card)));
    reorderForConfidence();
    const sort=document.getElementById("sort");
    const fit=sort&&[...sort.options].find(o=>o.value==="fit");
    if(fit)fit.textContent="Best access fit · verified-data scores first";
  }

  function neutralizeDetail(){
    const detail=document.getElementById("providerDetail");
    if(!detail)return;
    const p=providers.find(x=>x.name===detail.querySelector("h2")?.textContent?.trim());
    if(!p||scoreReady(p))return;
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
    if(!detail.querySelector(".detail-confidence-note")){
      const n=document.createElement("div");
      n.className="detail-confidence-note";
      n.innerHTML=`<b>Why there is no numeric score yet</b><span>${coverageText(p)}. Japan Health waits for enough provider-level communication, booking and eligibility evidence rather than scoring unknown fields.</span>`;
      detail.querySelector(".provider-meta")?.insertAdjacentElement("afterend",n);
    }
  }

  const style=document.createElement("style");
  style.textContent='.access-confidence-note,.detail-confidence-note{margin:9px 0;padding:9px 10px;border:1px solid #dfe7ef;border-radius:10px;background:#fbfcfe}.access-confidence-note b,.access-confidence-note span,.detail-confidence-note b,.detail-confidence-note span{display:block}.access-confidence-note b,.detail-confidence-note b{font-size:8px;color:#334b63}.access-confidence-note span,.detail-confidence-note span{font-size:8px;line-height:1.45;color:#6a7c8e;margin-top:3px}';
  document.head.appendChild(style);

  new MutationObserver(()=>queueMicrotask(annotate)).observe(grid,{childList:true});
  const detail=document.getElementById("providerDetail");
  if(detail)new MutationObserver(()=>queueMicrotask(neutralizeDetail)).observe(detail,{childList:true});
  document.getElementById("sort")?.addEventListener("input",()=>queueMicrotask(annotate));
  annotate();
})();