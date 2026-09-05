(()=>{
  const $=id=>document.getElementById(id);
  const providers=()=>window.PROVIDERS||[];
  const known=v=>{const s=String(v||"").trim().toLowerCase();return Boolean(s)&&!s.includes("unknown")&&!s.includes("needs verification");};
  function selectedProvider(){
    const boxes=[...($("handoffPreview")?.querySelectorAll(".handoff-box")||[])];
    const box=boxes.find(x=>x.querySelector("small")?.textContent?.includes("SELECTED ACCESS PROFILE"));
    const name=box?.querySelector("b")?.textContent?.trim();
    return providers().find(p=>p.name===name)||null;
  }
  function verifiedEvidence(p){return (p?.expertiseEvidence||[]).filter(e=>typeof e==="object"&&e.evidenceStatus==="official-source-verified"&&/^https:\/\//i.test(e.sourceUrl||e.source||""));}
  function score(p){
    const api=window.JapanHealthDemoAccessScore;
    if(api?.accessScore)return api.accessScore(p);
    return null;
  }
  function render(){
    const preview=$("handoffPreview"),panel=$("stepHandoff");if(!preview||!panel)return;
    const p=selectedProvider();if(!p)return;
    let wrap=$("demoHandoffReadiness");
    if(!wrap){wrap=document.createElement("section");wrap.id="demoHandoffReadiness";wrap.className="demo-handoff-readiness";preview.insertAdjacentElement("afterend",wrap);}
    const costs=[p.medicalCost,p.interpreterCost,p.coordinatorCost],costRecorded=costs.filter(known).length;
    const evidence=verifiedEvidence(p),s=score(p),sourceChecked=p.recordStatus==="official-source-verified";
    const open=[];
    if(!known(p.medicalCost))open.push("medical cost");
    if(!known(p.interpreterCost))open.push("interpreter cost");
    if(!known(p.coordinatorCost))open.push("coordinator cost");
    if(!known(p.doctorEnglish)&&!["yes","available","external"].includes(p.interpreter))open.push("communication route");
    if(["unknown","varies"].includes(p.referral))open.push("referral rule");
    if(["unknown","varies"].includes(p.coordinator))open.push("coordinator rule");
    wrap.innerHTML=`<div class="demo-packet-head"><div><small>HANDOFF READINESS PACKET</small><b>What Japan Health can pass forward without inventing missing facts.</b></div><span>Structured logistics context only — not medical triage or clinical recommendation.</span></div><div class="demo-packet-grid"><div><small>ACCESS SCORE</small><b>${s?`${s.score}/100`:"Calculating"}</b><span>${s?"40/25/20/15 logistics weighting":"Score module loading"}</span></div><div><small>SOURCE STATUS</small><b>${sourceChecked?"Official-source checked":"DEMO · UNVERIFIED"}</b><span>${evidence.length} verified evidence link${evidence.length===1?"":"s"}</span></div><div><small>TOTAL-COST VISIBILITY</small><b>${costRecorded}/3 components</b><span>Medical · interpreter · coordinator</span></div><div><small>OPEN ACCESS GAPS</small><b>${open.length}</b><span>${open.length?open.join(" · "):"Current availability and case acceptance still require confirmation"}</span></div></div>`;
  }
  const observer=new MutationObserver(()=>requestAnimationFrame(render));
  [$("handoffPreview"),document.querySelector("main")].filter(Boolean).forEach(el=>observer.observe(el,{childList:true,subtree:true,attributes:true,attributeFilter:["class"]}));
  const style=document.createElement("style");style.id="demo-handoff-readiness-styles";style.textContent=`.demo-handoff-readiness{margin-top:12px;padding:14px;border:1px solid #cfddea;border-radius:13px;background:#f8fbfd}.demo-packet-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.demo-packet-head small,.demo-packet-head b{display:block}.demo-packet-head small{font-size:7px;font-weight:900;letter-spacing:.06em;color:#718295}.demo-packet-head b{font-size:10px;color:#173c5f;margin-top:3px}.demo-packet-head>span{font-size:7px;line-height:1.45;color:#718295;text-align:right;max-width:300px}.demo-packet-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:10px}.demo-packet-grid>div{padding:9px;border:1px solid #dce6ef;border-radius:9px;background:#fff}.demo-packet-grid small,.demo-packet-grid b,.demo-packet-grid span{display:block}.demo-packet-grid small{font-size:6px;color:#718295}.demo-packet-grid b{font-size:9px;color:#24455f;margin:2px 0}.demo-packet-grid span{font-size:6px;line-height:1.4;color:#718295}@media(max-width:760px){.demo-packet-grid{grid-template-columns:1fr 1fr}.demo-packet-head{flex-direction:column}.demo-packet-head>span{text-align:left}}@media(max-width:480px){.demo-packet-grid{grid-template-columns:1fr}}`;
  document.head.appendChild(style);render();setTimeout(render,250);
})();