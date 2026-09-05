(()=>{
  const $=id=>document.getElementById(id);
  const providers=()=>window.PROVIDERS||[];
  const humanAudience=v=>v==="resident"?"Resident":v==="medical-travel"?"Major medical travel":"Visitor";
  const humanLanguage=v=>v==="direct"?"Direct physician English":v==="interpreter"?"Interpreter pathway acceptable":"Any documented communication pathway";
  const known=v=>{const s=String(v||"").trim().toLowerCase();return Boolean(s)&&!s.includes("unknown")&&!s.includes("needs verification");};
  const scenario=()=>{const q=new URLSearchParams(location.search);return{audience:q.get("audience")||"visitor",care:q.get("care")||"general",language:q.get("language")||"all",area:q.get("area")||"all"};};
  const selectedProvider=()=>{const name=$("detailTitle")?.textContent?.trim();return providers().find(p=>p.name===name)||null;};
  const providerByCard=card=>{const name=card.querySelector("h3")?.textContent?.trim();return providers().find(p=>p.name===name)||null;};

  function mountConstraintLedger(){
    const summary=$("resultSummary"); if(!summary)return;
    let el=$("demoConstraintLedger");
    if(!el){el=document.createElement("section");el.id="demoConstraintLedger";el.className="demo-constraint-ledger";el.setAttribute("aria-label","Applied search constraints");summary.insertAdjacentElement("afterend",el);}
    const s=scenario();
    el.innerHTML=`<div class="demo-ledger-head"><div><small>APPLIED CONSTRAINTS</small><b>Hard filters are separated from access-score ordering.</b></div><span>Japan Health does not silently relax these constraints.</span></div><div class="demo-ledger-grid"><div><small>PATIENT CONTEXT</small><b>${humanAudience(s.audience)}</b><span>Used as an access-path constraint</span></div><div><small>CARE NEED</small><b>${String(s.care).replace(/-/g," ")}</b><span>Matched to recorded specialty / evidence terms</span></div><div><small>COMMUNICATION</small><b>${humanLanguage(s.language)}</b><span>${s.language==="all"?"Any documented route accepted":"Required before score ordering"}</span></div><div><small>AREA</small><b>${s.area==="all"?"Any Tokyo area":s.area}</b><span>${s.area==="all"?"No area restriction":"Required before score ordering"}</span></div></div><p>After hard constraints are applied, International Access Score summarizes documented logistics friction only. It does not rank clinical quality or predict acceptance, availability, outcomes or affordability.</p>`;
  }

  function decorateCardGaps(){
    document.querySelectorAll("#demoResults .demo-provider").forEach(card=>{
      card.querySelector(".demo-gap-summary")?.remove();
      const p=providerByCard(card); if(!p)return;
      const gaps=[];
      if(!known(p.medicalCost))gaps.push("medical cost");
      if(!known(p.interpreterCost))gaps.push("interpreter cost");
      if(!known(p.coordinatorCost))gaps.push("coordinator cost");
      if(!known(p.referral))gaps.push("referral");
      if(!known(p.coordinator))gaps.push("coordinator");
      const el=document.createElement("div"); el.className="demo-gap-summary";
      el.innerHTML=`<small>OPEN DATA GAPS</small><b>${gaps.length?`${gaps.length} item${gaps.length===1?"":"s"} need verification`:"No tracked gap in these fields"}</b><span>${gaps.length?gaps.slice(0,4).join(" · "):"Still confirm current availability and case acceptance directly."}</span>`;
      card.querySelector(".actions")?.insertAdjacentElement("beforebegin",el);
    });
  }

  function costLedger(){
    const body=$("detailBody"),p=selectedProvider(); if(!body||!p)return;
    body.querySelector(".demo-cost-ledger")?.remove();
    const items=[["Medical cost",p.medicalCost],["Interpreter cost",p.interpreterCost],["Coordinator cost",p.coordinatorCost]];
    const recorded=items.filter(([,v])=>known(v)).length;
    const el=document.createElement("section");el.className="demo-cost-ledger";el.setAttribute("aria-label","Total cost visibility");
    el.innerHTML=`<div class="demo-ledger-head"><div><small>TOTAL-COST VISIBILITY</small><b>${recorded}/3 components recorded</b></div><span>Visibility only — not a quote or affordability score.</span></div><div class="demo-cost-grid">${items.map(([label,v])=>`<div><small>${label.toUpperCase()}</small><b>${known(v)?"Recorded":"Needs verification"}</b><span>${known(v)?String(v):"No usable value in the current record"}</span></div>`).join("")}</div><p>Japan Health keeps medical, interpreter and coordinator charges separate so missing components remain visible instead of being implied.</p>`;
    const warning=body.querySelector(".demo-warning"); warning?.insertAdjacentElement("beforebegin",el);
  }

  function verificationChecklist(){
    const handoff=$("handoffPreview"),p=selectedProvider(); if(!handoff||!p)return;
    let box=$("demoVerificationChecklist");
    if(!box){box=document.createElement("section");box.id="demoVerificationChecklist";box.className="demo-verification-checklist";handoff.insertAdjacentElement("afterend",box);}
    const s=scenario(),checks=[]; const add=(label,value,status)=>checks.push({label,value,status});
    add("Current availability","Confirm with provider / coordinator","open");
    add("Case acceptance","Confirm for this specific patient","open");
    if(s.language==="direct")add("Direct physician English",p.doctorEnglish==="yes"?"Recorded in current provider data":"Needs verification",p.doctorEnglish==="yes"?"recorded":"open");
    if(s.language==="interpreter")add("Interpreter route",["yes","available","external"].includes(p.interpreter)?"Recorded in current provider data":"Needs verification",["yes","available","external"].includes(p.interpreter)?"recorded":"open");
    add("Referral requirement",known(p.referral)?String(p.referral):"Needs verification",known(p.referral)?"recorded":"open");
    add("Coordinator requirement",known(p.coordinator)?String(p.coordinator):"Needs verification",known(p.coordinator)?"recorded":"open");
    const costMissing=[p.medicalCost,p.interpreterCost,p.coordinatorCost].filter(v=>!known(v)).length;
    add("Total-cost components",costMissing?`${costMissing}/3 still need verification`:"3/3 tracked fields recorded",costMissing?"open":"recorded");
    box.innerHTML=`<div class="demo-ledger-head"><div><small>OPEN VERIFICATION CHECKLIST</small><b>What a human coordinator still needs to confirm</b></div><span>Structured logistics context only</span></div><div class="demo-check-grid">${checks.map(x=>`<div class="${x.status}"><span aria-hidden="true">${x.status==="recorded"?"✓":"○"}</span><div><b>${x.label}</b><small>${x.value}</small></div></div>`).join("")}</div><p>Recorded means the current Japan Health record contains a value; it does not guarantee the information is still current. AMECA remains only a downstream placeholder.</p>`;
  }

  function refresh(){mountConstraintLedger();decorateCardGaps();costLedger();verificationChecklist();}
  const observer=new MutationObserver(()=>requestAnimationFrame(refresh));
  [$("demoResults"),$("detailBody"),$("handoffPreview"),document.querySelector("main")].filter(Boolean).forEach(el=>observer.observe(el,{childList:true,subtree:true,attributes:true,attributeFilter:["class"]}));
  const style=document.createElement("style");style.id="demo-decision-transparency-styles";style.textContent=`.demo-constraint-ledger,.demo-cost-ledger,.demo-verification-checklist{margin:0 0 12px;padding:12px;border:1px solid #dce6ef;border-radius:13px;background:#fff}.demo-ledger-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.demo-ledger-head small,.demo-ledger-head b{display:block}.demo-ledger-head small{font-size:7px;font-weight:900;letter-spacing:.06em;color:#718295}.demo-ledger-head b{font-size:10px;color:#173c5f;margin-top:2px}.demo-ledger-head>span{font-size:7px;color:#718295;text-align:right;max-width:270px}.demo-ledger-grid,.demo-cost-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:9px}.demo-cost-grid{grid-template-columns:repeat(3,1fr)}.demo-ledger-grid>div,.demo-cost-grid>div{padding:8px;border:1px solid #e4ebf2;border-radius:9px;background:#fbfdff}.demo-ledger-grid small,.demo-ledger-grid b,.demo-ledger-grid span,.demo-cost-grid small,.demo-cost-grid b,.demo-cost-grid span{display:block}.demo-ledger-grid small,.demo-cost-grid small{font-size:6px;color:#718295}.demo-ledger-grid b,.demo-cost-grid b{font-size:8px;color:#24455f;margin:2px 0;text-transform:capitalize}.demo-ledger-grid span,.demo-cost-grid span{font-size:6px;line-height:1.35;color:#7a8b9b}.demo-constraint-ledger>p,.demo-cost-ledger>p,.demo-verification-checklist>p{font-size:7px;line-height:1.45;color:#718295;margin:9px 0 0}.demo-gap-summary{padding:8px 9px;border:1px solid #e4ebf2;border-radius:9px;background:#fbfdff;margin-top:8px}.demo-gap-summary small,.demo-gap-summary b,.demo-gap-summary span{display:block}.demo-gap-summary small{font-size:6px;color:#718295;font-weight:900}.demo-gap-summary b{font-size:8px;color:#24455f;margin:2px 0}.demo-gap-summary span{font-size:7px;line-height:1.35;color:#718295}.demo-check-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:9px}.demo-check-grid>div{display:flex;gap:8px;align-items:flex-start;padding:8px;border:1px solid #e4ebf2;border-radius:9px;background:#fbfdff}.demo-check-grid>div>span{font-size:12px;line-height:1;color:#718295}.demo-check-grid>div.recorded>span{color:#176b58}.demo-check-grid b,.demo-check-grid small{display:block}.demo-check-grid b{font-size:8px;color:#24455f}.demo-check-grid small{font-size:7px;line-height:1.35;color:#718295;margin-top:2px}@media(max-width:760px){.demo-ledger-head{flex-direction:column}.demo-ledger-head>span{text-align:left}.demo-ledger-grid{grid-template-columns:1fr 1fr}.demo-cost-grid,.demo-check-grid{grid-template-columns:1fr}}@media(max-width:480px){.demo-ledger-grid{grid-template-columns:1fr}}`;document.head.appendChild(style);
  refresh();
})();