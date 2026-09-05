(()=>{
  const providers=()=>window.PROVIDERS||[];
  const unknown=v=>!String(v||"").trim()||/^(unknown|needs verification|not verified|tbd|n\/a)$/i.test(String(v).trim());
  const components=[
    ["medicalCost","Medical care"],
    ["interpreterCost","Interpreter"],
    ["coordinatorCost","Coordinator"]
  ];
  function summarize(p){
    if(!p)return null;
    const rows=components.map(([key,label])=>{
      const value=p[key];
      return{key,label,state:unknown(value)?"verify":"recorded",value:unknown(value)?"Needs confirmation":String(value)};
    });
    const recorded=rows.filter(x=>x.state==="recorded").length;
    const published=(Array.isArray(p.publishedCosts)?p.publishedCosts:[]).filter(x=>x&&x.label&&x.amount);
    const sourceChecked=p.recordStatus==="official-source-verified";
    return{
      recorded,total:rows.length,rows,
      missing:rows.filter(x=>x.state==="verify").map(x=>x.label),
      publishedCount:published.length,
      sourceChecked,
      provenance:sourceChecked?"Official-source checked provider record":"DEMO · UNVERIFIED provider record",
      completeness:recorded===rows.length?"components-recorded":recorded?"partial":"needs-verification",
      priceTransparency:p.priceTransparency||"unknown"
    };
  }
  function markup(p,compact=false){
    const s=summarize(p);if(!s)return"";
    const questions=s.missing.length?`Before booking, confirm: ${s.missing.join(", ")}.`:"All three structured cost components have a recorded value; a final total still requires provider confirmation.";
    const published=s.publishedCount?`${s.publishedCount} published service-fee example${s.publishedCount===1?"":"s"} captured in this record.`:"No published service-fee example is captured in this record.";
    return `<section class="total-cost-readiness${compact?" compact":""}" aria-label="Total cost visibility"><div class="total-cost-head"><div><small>TOTAL-COST READINESS</small><b>${s.recorded}/${s.total} components recorded</b></div><span class="cost-provenance ${s.sourceChecked?"checked":"demo"}">${s.sourceChecked?"SOURCE CHECKED":"DEMO · UNVERIFIED"}</span></div><div class="total-cost-components">${s.rows.map(r=>`<div class="total-cost-component ${r.state}"><small>${r.label.toUpperCase()}</small><b>${r.state==="recorded"?"Recorded":"Verify"}</b>${compact?"":`<span>${r.value}</span>`}</div>`).join("")}</div><p>${published}</p><p class="cost-question">${questions}</p><p class="cost-disclaimer">Cost readiness describes data completeness only. It is not a price quote, affordability score, total episode estimate, or clinical-quality measure.</p></section>`;
  }
  function ensureStyles(){
    if(document.getElementById("jh-cost-intelligence-styles"))return;
    const s=document.createElement("style");s.id="jh-cost-intelligence-styles";s.textContent=`.total-cost-readiness{margin:12px 0;padding:12px;border:1px solid #dfe7ef;border-radius:12px;background:#fbfcfe}.total-cost-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.total-cost-head small,.total-cost-head b{display:block}.total-cost-head small{font-size:7px;letter-spacing:.06em;color:#718295}.total-cost-head b{font-size:10px;margin-top:3px}.cost-provenance{padding:4px 7px;border-radius:999px;font-size:7px;font-weight:900;white-space:nowrap}.cost-provenance.checked{background:#e8f7f2;color:#176b58}.cost-provenance.demo{background:#fff2df;color:#8a5a18}.total-cost-components{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:9px 0}.total-cost-component{padding:8px;border-radius:9px;border:1px solid #e3eaf1;background:#fff}.total-cost-component small,.total-cost-component b,.total-cost-component span{display:block}.total-cost-component small{font-size:7px;color:#718295}.total-cost-component b{font-size:9px;margin-top:3px}.total-cost-component span{font-size:7px;line-height:1.35;color:#657789;margin-top:3px}.total-cost-component.verify{background:#fffaf0;border-color:#efe0bd}.total-cost-readiness p{font-size:8px;line-height:1.45;color:#607487;margin:6px 0}.total-cost-readiness .cost-question{font-weight:800;color:#455d73}.total-cost-readiness .cost-disclaimer{color:#7b8997}.total-cost-readiness.compact{padding:10px}.total-cost-readiness.compact .total-cost-components{margin-bottom:7px}@media(max-width:650px){.total-cost-head{align-items:flex-start;flex-direction:column}.total-cost-components{grid-template-columns:1fr}.cost-provenance{white-space:normal}}`;
    document.head.appendChild(s);
  }
  function providerForCard(card){
    const name=card.querySelector("h3")?.textContent?.trim();return providers().find(p=>p.name===name);
  }
  function decorateCards(){
    document.querySelectorAll(".provider-card").forEach(card=>{
      if(card.querySelector(".total-cost-readiness"))return;
      const p=providerForCard(card);if(!p)return;
      const costGrid=card.querySelector(".cost-grid");
      if(costGrid)costGrid.insertAdjacentHTML("afterend",markup(p,true));
    });
  }
  function decorateDetail(){
    const root=document.getElementById("providerDetail");if(!root||root.querySelector(".total-cost-readiness"))return;
    const title=[...root.querySelectorAll("h3")].find(h=>h.textContent.trim()==="Cost visibility");
    const p=providers().find(x=>x.name===root.querySelector("h2")?.textContent?.trim());
    if(title&&p){const grid=title.nextElementSibling;grid?.insertAdjacentHTML("afterend",markup(p,false));}
  }
  function snapshotForId(id){return summarize(providers().find(p=>p.id===id));}
  window.JapanHealthCost={summarize,markup,snapshotForId};
  ensureStyles();decorateCards();decorateDetail();
  const grid=document.getElementById("providerGrid");if(grid)new MutationObserver(()=>requestAnimationFrame(decorateCards)).observe(grid,{childList:true});
  const detail=document.getElementById("providerDetail");if(detail)new MutationObserver(()=>requestAnimationFrame(decorateDetail)).observe(detail,{childList:true,subtree:true});
  const nativeFetch=window.fetch.bind(window);
  window.fetch=(input,init={})=>{
    try{
      const url=typeof input==="string"?input:input?.url;
      if(url==="/api/lead"&&String(init.method||"GET").toUpperCase()==="POST"&&typeof init.body==="string"){
        const body=JSON.parse(init.body),snap=snapshotForId(body.providerId);
        if(snap)body.costSnapshot={recorded:snap.recorded,total:snap.total,missing:snap.missing,publishedCount:snap.publishedCount,completeness:snap.completeness,priceTransparency:snap.priceTransparency,provenance:snap.sourceChecked?"official-source-checked":"demo-unverified"};
        init={...init,body:JSON.stringify(body)};
      }
    }catch(_){/* preserve original request on enrichment failure */}
    return nativeFetch(input,init);
  };
})();
