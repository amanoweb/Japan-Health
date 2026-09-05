(()=>{
  const $=id=>document.getElementById(id),providers=()=>window.PROVIDERS||[];
  const escapeHtml=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function provider(){return providers().find(p=>p.id===$("leadProvider")?.value)}
  function query(){return $("q")?.value?.trim()||""}
  function ensureReview(){
    let box=$("specialistHandoffReview");if(box)return box;
    const consent=$("leadConsent")?.closest("label");if(!consent)return null;
    box=document.createElement("section");box.id="specialistHandoffReview";box.className="specialist-handoff-review";box.setAttribute("aria-live","polite");consent.before(box);return box;
  }
  function ensureStyles(){
    if($("jh-specialist-handoff-styles"))return;
    const s=document.createElement("style");s.id="jh-specialist-handoff-styles";s.textContent=`.specialist-handoff-review{margin:10px 0;padding:11px;border:1px solid #dce6ef;border-radius:11px;background:#f9fbfd}.specialist-handoff-review small,.specialist-handoff-review b,.specialist-handoff-review span{display:block}.specialist-handoff-review>small{font-size:7px;letter-spacing:.06em;color:#718295;font-weight:900}.specialist-handoff-review>b{font-size:10px;margin:4px 0}.specialist-handoff-review span{font-size:8px;line-height:1.45;color:#607487}.specialist-handoff-review .handoff-evidence-list{display:grid;gap:4px;margin:7px 0}.specialist-handoff-review .handoff-evidence-list a,.specialist-handoff-review .handoff-evidence-list span{font-size:8px;line-height:1.4}.specialist-handoff-review .handoff-evidence-list a{color:#176df0;font-weight:800}.specialist-handoff-review .handoff-caution{margin-top:7px;color:#7b8997}`;document.head.appendChild(s);
  }
  function render(){
    const box=ensureReview(),p=provider(),q=query(),api=window.JapanHealthSpecialistAccess;if(!box)return;
    if(!p||!q||!api){box.hidden=true;return}box.hidden=false;
    const snap=api.snapshot(p,q),matches=snap.matches||[];
    const list=matches.length?matches.map(e=>e.sourceBacked&&e.source?`<a href="${escapeHtml(e.source)}" target="_blank" rel="noopener noreferrer">${escapeHtml(e.label)} · official source ↗</a>`:`<span>${escapeHtml(e.label)} · source verification still needed</span>`).join(""):"<span>No specific disease/procedure evidence in this provider record matched the current search.</span>";
    box.innerHTML=`<small>SPECIALIST HANDOFF CONTEXT</small><b>Search: ${escapeHtml(q)}</b><span>${escapeHtml(snap.route.label)}. ${snap.sourceBackedCount} source-backed expertise match${snap.sourceBackedCount===1?"":"es"} will be prioritized for partner re-checking.</span><div class="handoff-evidence-list">${list}</div><span class="handoff-caution">Japan Health is passing evidence and access context only. AMECA or another downstream partner must re-check that the provider accepts this case and that the language pathway applies to the requested specialist service. This is not medical advice or a clinical-quality ranking.</span>`;
  }
  const original=window.openLeadModal;if(typeof original==="function")window.openLeadModal=(id="")=>{original(id);setTimeout(render,0)};
  $("leadForm")?.addEventListener("input",render);$("leadForm")?.addEventListener("change",render);
  ensureStyles();render();
  const nativeFetch=window.fetch.bind(window);
  window.fetch=(input,init={})=>{
    try{
      const url=typeof input==="string"?input:input?.url;
      if(url==="/api/lead"&&String(init.method||"GET").toUpperCase()==="POST"&&typeof init.body==="string"){
        const body=JSON.parse(init.body),q=String(body?.accessConstraints?.q||"").trim(),p=providers().find(x=>x.id===body.providerId),api=window.JapanHealthSpecialistAccess;
        if(p&&q&&api){
          const snap=api.snapshot(p,q),matched=(snap.matches||[]).map(e=>({type:e.type,label:e.label,status:e.status,sourceUrl:e.sourceBacked?e.source:null}));
          const existing=Array.isArray(body?.providerContext?.evidence)?body.providerContext.evidence:[],seen=new Set(matched.map(e=>`${e.type}|${e.label}`.toLowerCase()));
          const rest=existing.filter(e=>{const k=`${e?.type||"legacy"}|${e?.label||""}`.toLowerCase();if(seen.has(k))return false;seen.add(k);return true});
          if(body.providerContext&&typeof body.providerContext==="object")body.providerContext.evidence=[...matched,...rest].slice(0,12);
          init={...init,body:JSON.stringify(body)};
        }
      }
    }catch(_){/* preserve original lead request if enrichment fails */}
    return nativeFetch(input,init);
  };
})();
