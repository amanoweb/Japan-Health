(()=>{
  const $=id=>document.getElementById(id);
  const providers=()=>window.PROVIDERS||[];
  const careTerms={
    general:["internal medicine","general practice"],
    dental:["dentistry","dental"],
    screening:["health screening","ningen dock","imaging"],
    cardiology:["cardiology","cardiovascular","arrhythmia","heart failure"],
    cancer:["oncology","cancer","second opinion"],
    womens:["gynecology","women's health","assisted reproductive technology","ivf","icsi"]
  };
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const scenario=()=>{const q=new URLSearchParams(location.search);return{care:q.get("care")||"general"};};
  const providerByName=name=>providers().find(p=>p.name===name)||null;
  function matchedEvidence(p){
    const terms=careTerms[scenario().care]||[];
    return (p?.expertiseEvidence||[]).filter(e=>{
      if(typeof e!=="object")return false;
      const label=String(e.label||e.name||"").toLowerCase();
      return terms.some(t=>label.includes(t));
    }).sort((a,b)=>Number(b.evidenceStatus==="official-source-verified")-Number(a.evidenceStatus==="official-source-verified"));
  }
  function evidenceMarkup(p,compact=false){
    const rows=matchedEvidence(p).slice(0,compact?2:6);
    if(!rows.length)return `<section class="demo-evidence-panel ${compact?"compact":""}"><small>SEARCHED EXPERTISE EVIDENCE</small><b>No disease/procedure-level evidence matched this care term.</b><span>Provider-wide specialties are not silently promoted to service-level expertise.</span></section>`;
    const links=rows.map(e=>{
      const verified=e.evidenceStatus==="official-source-verified"&&/^https:\/\//i.test(e.sourceUrl||e.source||"");
      const label=esc(e.label||e.name||"Evidence item");
      if(verified)return `<a class="demo-evidence-chip verified" href="${esc(e.sourceUrl||e.source)}" target="_blank" rel="noopener noreferrer"><span>OFFICIAL SOURCE</span><b>${label}</b></a>`;
      return `<span class="demo-evidence-chip demo"><span>DEMO / UNVERIFIED</span><b>${label}</b></span>`;
    }).join("");
    return `<section class="demo-evidence-panel ${compact?"compact":""}"><small>SEARCHED EXPERTISE EVIDENCE</small><b>${rows.length} matched evidence item${rows.length===1?"":"s"}</b><span>These links support disease/procedure relevance only. They do not rank clinical quality or guarantee case acceptance.</span><div class="demo-evidence-list">${links}</div></section>`;
  }
  function decorateCards(){
    document.querySelectorAll("#demoResults .demo-provider").forEach(card=>{
      card.querySelector(".demo-evidence-panel")?.remove();
      const p=providerByName(card.querySelector("h3")?.textContent?.trim());if(!p)return;
      const actions=card.querySelector(".actions");
      actions?.insertAdjacentHTML("beforebegin",evidenceMarkup(p,true));
    });
  }
  function decorateDetail(){
    const body=$("detailBody");if(!body)return;
    body.querySelector(".demo-evidence-panel")?.remove();
    const p=providerByName($("detailTitle")?.textContent?.trim());if(!p)return;
    const warning=body.querySelector(".demo-warning");
    if(warning)warning.insertAdjacentHTML("beforebegin",evidenceMarkup(p,false));
    else body.insertAdjacentHTML("beforeend",evidenceMarkup(p,false));
  }
  function refresh(){decorateCards();decorateDetail();}
  const observer=new MutationObserver(()=>requestAnimationFrame(refresh));
  [$("demoResults"),$("detailBody"),document.querySelector("main")].filter(Boolean).forEach(el=>observer.observe(el,{childList:true,subtree:true,attributes:true,attributeFilter:["class"]}));
  const style=document.createElement("style");style.id="demo-evidence-intelligence-styles";style.textContent=`.demo-evidence-panel{margin:10px 0;padding:11px;border:1px solid #dce6ef;border-radius:12px;background:#fbfdff}.demo-evidence-panel>small,.demo-evidence-panel>b,.demo-evidence-panel>span{display:block}.demo-evidence-panel>small{font-size:7px;font-weight:900;letter-spacing:.06em;color:#718295}.demo-evidence-panel>b{font-size:10px;color:#173c5f;margin:2px 0}.demo-evidence-panel>span{font-size:7px;line-height:1.45;color:#718295}.demo-evidence-list{display:grid;gap:6px;margin-top:8px}.demo-evidence-chip{display:block;padding:8px;border-radius:9px;text-decoration:none}.demo-evidence-chip span,.demo-evidence-chip b{display:block}.demo-evidence-chip span{font-size:6px;font-weight:900;letter-spacing:.04em}.demo-evidence-chip b{font-size:8px;line-height:1.35;margin-top:2px}.demo-evidence-chip.verified{background:#e8f7f2;color:#176b58}.demo-evidence-chip.demo{background:#fff2df;color:#8a5a18}.demo-evidence-panel.compact{padding:9px}.demo-evidence-panel.compact .demo-evidence-chip{padding:7px}@media(max-width:600px){.demo-evidence-list{grid-template-columns:1fr}}`;
  document.head.appendChild(style);refresh();
})();