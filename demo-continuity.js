(()=>{
  const $=id=>document.getElementById(id);
  const providers=()=>window.PROVIDERS||[];
  const careQuery={general:"Internal Medicine",dental:"Dentistry",screening:"Health Screening",cardiology:"Cardiology",cancer:"Second Opinion",womens:"Assisted Reproductive Technology"};
  const scenario=()=>{const q=new URLSearchParams(location.search);return{audience:q.get("audience")||"visitor",care:q.get("care")||"general",language:q.get("language")||"all",area:q.get("area")||"all"};};
  function directoryHref(){
    const s=scenario(),q=new URLSearchParams({audience:s.audience==="medical-travel"?"visitor":s.audience,city:"Tokyo",q:careQuery[s.care]||""});
    if(s.audience==="medical-travel")q.set("journey","medical-travel");
    if(s.language!=="all")q.set("language",s.language);
    if(s.area!=="all")q.set("area",s.area);
    return `/clinics.html?${q}`;
  }
  function syncDirectoryLinks(){
    const href=directoryHref();
    document.querySelectorAll('a[href^="/clinics.html"]').forEach(a=>{
      if(a.closest("header")||a.textContent.trim()==="Open directory")return;
      if(a.getAttribute("href")!==href)a.setAttribute("href",href);
      a.dataset.demoScenarioPreserved="1";
      if(!a.title)a.title="Open the full directory with this demo scenario preserved";
    });
  }
  function orderingExplainer(){
    const summary=$("resultSummary");if(!summary||$("demoOrderingExplainer"))return;
    const d=document.createElement("details");d.id="demoOrderingExplainer";d.className="demo-ordering-explainer";
    d.innerHTML='<summary>Why these results appear in this order</summary><p>Japan Health first preserves the selected audience, care topic, Tokyo area and language constraint. Within those matches, the demo favors provider-source verification, source-backed service booking documentation and documented communication access. This ordering is about access evidence only — never clinical quality, outcomes or physician skill.</p>';
    summary.insertAdjacentElement("afterend",d);
  }
  function selectedProvider(){
    const name=$("detailTitle")?.textContent?.trim();return providers().find(p=>p.name===name)||null;
  }
  function nextActions(){
    const preview=$("handoffPreview"),panel=$("stepHandoff");if(!preview||!panel)return;
    let box=$("demoNextActions");if(!box){box=document.createElement("div");box.id="demoNextActions";box.className="demo-next-actions";preview.insertAdjacentElement("afterend",box);}
    const p=selectedProvider(),logistics=[...preview.querySelectorAll(".handoff-box")].find(x=>x.querySelector("small")?.textContent?.includes("LOGISTICS NEXT STEP"));
    const title=logistics?.querySelector("b")?.textContent||"";
    const coordination=/coordination/i.test(title),direct=/direct provider start is documented/i.test(title);
    const source=p?.recordStatus==="official-source-verified"&&/^https:\/\//i.test(String(p.source||""))?p.source:null;
    const links=[];
    if(direct&&source)links.push(`<a class="btn primary" href="${source}" target="_blank" rel="noopener noreferrer">Open official provider source ↗</a>`);
    if(coordination)links.push('<a class="btn primary" href="/#coordinators">Open Japan Health coordination path →</a>');
    links.push(`<a class="btn ghost" href="${directoryHref()}">Continue in full directory →</a>`);
    box.innerHTML=`<div><small>ACTIONABLE NEXT STEP</small><b>${coordination?"Continue with coordination context":direct?"Continue with the documented provider start":"Continue without inventing a pathway"}</b><span>${coordination?"The partner handoff remains a placeholder, but the user can continue into Japan Health’s coordination path with the same scenario context.":direct?"A provider source is offered only when the current record is official-source checked. Current acceptance still requires confirmation.":"The current record does not support a stronger routing claim, so the directory remains the safe next step."}</span></div><div class="demo-next-links">${links.join("")}</div>`;
  }
  function stepA11y(){
    const steps=[...document.querySelectorAll("#demoSteps .demo-step")];
    steps.forEach((x,i)=>{
      x.setAttribute("role","listitem");
      if(x.classList.contains("current"))x.setAttribute("aria-current","step");else x.removeAttribute("aria-current");
      x.setAttribute("aria-label",`Step ${i+1}: ${x.querySelector("b")?.textContent||""}${x.classList.contains("done")?", completed":x.classList.contains("current")?", current":""}`);
    });
    $("demoSteps")?.setAttribute("role","list");
  }
  function refresh(){syncDirectoryLinks();orderingExplainer();nextActions();stepA11y();}
  const observer=new MutationObserver(()=>requestAnimationFrame(refresh));
  observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["class","href"]});
  const style=document.createElement("style");style.id="demo-continuity-styles";style.textContent=`.demo-ordering-explainer{margin:-4px 0 12px;padding:9px 11px;border:1px solid #dce6ef;border-radius:10px;background:#fbfdff;font-size:8px;color:#607487}.demo-ordering-explainer summary{cursor:pointer;font-weight:900;color:#24455f}.demo-ordering-explainer p{line-height:1.55;margin:7px 0 0}.demo-next-actions{display:flex;justify-content:space-between;gap:14px;align-items:center;margin-top:12px;padding:14px;border:1px solid #cfe0f3;border-radius:13px;background:#f4f8fd}.demo-next-actions small,.demo-next-actions b,.demo-next-actions span{display:block}.demo-next-actions small{font-size:7px;font-weight:900;letter-spacing:.06em;color:#718295}.demo-next-actions b{font-size:11px;color:#173c5f;margin:3px 0}.demo-next-actions span{font-size:8px;line-height:1.45;color:#607487;max-width:650px}.demo-next-links{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}.demo-step[aria-current="step"]{outline:2px solid rgba(23,109,240,.18);outline-offset:2px}@media(max-width:700px){.demo-next-actions{align-items:stretch;flex-direction:column}.demo-next-links{display:grid;width:100%}.demo-next-links .btn{text-align:center;width:100%}}`;
  document.head.appendChild(style);
  refresh();
})();