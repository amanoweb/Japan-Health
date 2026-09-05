(()=>{
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const providers=()=>window.PROVIDERS||[];
  const care=[
    {id:"general",label:"General / internal medicine",q:"Internal Medicine",terms:["internal medicine","general practice"],note:"Routine outpatient care"},
    {id:"dental",label:"Dental",q:"Dentistry",terms:["dentistry","dental"],note:"Dental and oral care"},
    {id:"screening",label:"Health screening",q:"Health Screening",terms:["health screening","ningen dock","imaging"],note:"Planned checkups"},
    {id:"cardiology",label:"Cardiology",q:"Cardiology",terms:["cardiology","cardiovascular","arrhythmia","heart failure"],note:"Heart and cardiovascular access"},
    {id:"cancer",label:"Cancer / second opinion",q:"Second Opinion",terms:["oncology","cancer","second opinion"],note:"Specialist cancer access"},
    {id:"womens",label:"Women's health / ART",q:"Assisted Reproductive Technology",terms:["gynecology","women's health","assisted reproductive technology","ivf","icsi"],note:"Gynecology and fertility access"}
  ];
  const state={step:1,audience:"visitor",care:"general",language:"all",area:"all",selected:null};
  const human=v=>({yes:"Yes",no:"No",partial:"Partial",limited:"Limited",available:"Available",required:"Required",recommended:"Recommended",optional:"Optional",unknown:"Needs verification",varies:"Varies by pathway",external:"External arrangement",both:"Resident insurance + self-pay",resident:"Resident insurance",low:"Low",medium:"Medium",high:"High"}[v]||v||"Needs verification");
  const selectedCare=()=>care.find(x=>x.id===state.care)||care[0];
  const audienceLabel=()=>state.audience==="resident"?"Resident":state.audience==="medical-travel"?"Major medical travel":"Visitor";
  function setStep(n){
    state.step=n;
    ["stepSituation","stepCare","stepResults","stepDetail","stepHandoff","stepComplete"].forEach((id,i)=>$(id)?.classList.toggle("hidden-step",i!==n-1));
    [...$("demoSteps").children].forEach((x,i)=>{x.classList.toggle("done",i<n-1);x.classList.toggle("current",i===Math.min(n-1,4));});
    scrollTo({top:Math.max(0,$("demoSteps").offsetTop-90),behavior:"smooth"});
  }
  function renderCare(){
    $("careChoices").innerHTML=care.map(x=>`<button class="choice${x.id===state.care?" selected":""}" data-care="${x.id}"><b>${esc(x.label)}</b><span>${esc(x.note)}</span></button>`).join("");
    $("careChoices").querySelectorAll("[data-care]").forEach(b=>b.addEventListener("click",()=>{state.care=b.dataset.care;renderCare()}));
  }
  function textBlob(p){return [p.name,p.area,...(p.specialties||[]),p.notes,...(p.expertiseEvidence||[]).map(e=>typeof e==="string"?e:e?.label||"")].join(" ").toLowerCase();}
  function languageState(p){
    if(state.language==="direct")return p.doctorEnglish==="yes"?{match:true,label:"Direct physician English recorded"}:{match:false,label:"Direct physician English not confirmed"};
    if(state.language==="interpreter")return ["yes","available","external"].includes(p.interpreter)?{match:true,label:p.interpreter==="external"?"External interpreter pathway recorded":"Interpreter pathway recorded"}:{match:false,label:"Interpreter pathway not confirmed"};
    if(p.doctorEnglish==="yes")return{match:true,label:"Direct physician English recorded"};
    if(["yes","available"].includes(p.interpreter))return{match:true,label:"Interpreter pathway recorded"};
    if(p.interpreter==="external")return{match:true,label:"External interpreter pathway recorded"};
    return{match:false,label:"Language route needs verification"};
  }
  function audienceMatch(p){
    const target=state.audience==="medical-travel"?"visitor":state.audience;
    return Array.isArray(p.audience)&&p.audience.includes(target);
  }
  function score(p){
    const blob=textBlob(p),c=selectedCare(),topic=c.terms.some(t=>blob.includes(t));
    const lang=languageState(p),aud=audienceMatch(p),area=state.area==="all"||String(p.area||"").toLowerCase().includes(state.area.toLowerCase());
    const verified=p.recordStatus==="official-source-verified";
    let n=topic?40:0;n+=aud?18:0;n+=lang.match?16:0;n+=area?8:0;n+=verified?12:0;n+=p.referral&&p.referral!=="unknown"?3:0;n+=p.coordinator&&p.coordinator!=="unknown"?3:0;
    if(state.audience==="medical-travel"&&["required","recommended","varies"].includes(p.coordinator))n+=8;
    return{n,topic,lang,aud,area,verified};
  }
  function matches(){
    const all=providers().map(p=>({p,s:score(p)})).filter(x=>x.s.topic&&x.s.aud&&x.s.area);
    const strict=state.language==="all"?all:all.filter(x=>x.s.lang.match);
    return strict.sort((a,b)=>b.s.n-a.s.n).slice(0,6);
  }
  function officialEvidence(p){return (p.expertiseEvidence||[]).filter(e=>typeof e==="object"&&e.evidenceStatus==="official-source-verified"&&/^https:\/\//i.test(e.sourceUrl||""));}
  function resultCard({p,s}){
    const signals=[];
    signals.push(`<span class="match good">${esc(audienceLabel())} pathway in record</span>`);
    signals.push(`<span class="match ${s.lang.match?"good":""}">${esc(s.lang.label)}</span>`);
    if(p.referral)signals.push(`<span class="match">Referral: ${esc(human(p.referral))}</span>`);
    if(p.coordinator)signals.push(`<span class="match">Coordinator: ${esc(human(p.coordinator))}</span>`);
    const ev=officialEvidence(p).length;
    return `<article class="demo-provider"><span class="state ${s.verified?"verified":"demo"}">${s.verified?`OFFICIAL SOURCE CHECKED · ${esc(p.verified)}`:"DEMO · UNVERIFIED"}</span><h3>${esc(p.name)}</h3><div class="meta">Tokyo · ${esc(p.area)} · ${esc((p.specialties||[]).slice(0,3).join(" / "))}</div><div class="match-list">${signals.join("")}</div><p>${esc(p.notes||"Access details require verification.")}</p><div class="meta">${ev?`${ev} source-backed expertise/access evidence item${ev===1?"":"s"}`:"No source-backed expertise evidence in this record"}</div><div class="actions"><button class="small-btn" data-provider="${esc(p.id)}">View access profile</button><a class="small-btn primary" href="/clinics.html?audience=${encodeURIComponent(state.audience==="medical-travel"?"visitor":state.audience)}&city=Tokyo&q=${encodeURIComponent(selectedCare().q)}${state.language!=="all"?`&language=${encodeURIComponent(state.language)}`:""}">Full directory</a></div></article>`;
  }
  function renderResults(){
    const r=matches(),c=selectedCare();
    $("resultSummary").innerHTML=`<b>${r.length} demo results shown</b> for <b>${esc(audienceLabel())} · ${esc(c.label)}</b>${state.area!=="all"?` · ${esc(state.area)}`:""}. ${state.language==="direct"?"Direct physician English requested.":state.language==="interpreter"?"Interpreter pathway acceptable.":"Any documented communication pathway accepted."} Results are ordered by access-evidence fit for this demo, never clinical quality.`;
    $("demoResults").innerHTML=r.length?r.map(resultCard).join(""):'<div class="demo-warning" style="grid-column:1/-1"><b>No result matches all selected demo constraints.</b><br>Japan Health did not silently relax them. Go back and change the area or communication preference.</div>';
    $("demoResults").querySelectorAll("[data-provider]").forEach(b=>b.addEventListener("click",()=>{state.selected=providers().find(p=>p.id===b.dataset.provider)||null;renderDetail();setStep(4)}));
    const q=new URLSearchParams({audience:state.audience==="medical-travel"?"visitor":state.audience,city:"Tokyo",q:c.q});if(state.language!=="all")q.set("language",state.language);$("openFullDirectory").href=`/clinics.html?${q}`;
  }
  function renderDetail(){
    const p=state.selected;if(!p)return;
    $("detailTitle").textContent=p.name;
    const ev=officialEvidence(p);
    const source=p.recordStatus==="official-source-verified"&&/^https:\/\//i.test(p.source||"")?`<a href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">Open official provider source ↗</a>`:"Demo record — no official source claim";
    $("detailBody").innerHTML=`<div class="detail-grid-demo"><div><small>DOCTOR ENGLISH</small><b>${esc(human(p.doctorEnglish))}</b></div><div><small>INTERPRETER</small><b>${esc(human(p.interpreter))}</b></div><div><small>REFERRAL</small><b>${esc(human(p.referral))}</b></div><div><small>COORDINATOR</small><b>${esc(human(p.coordinator))}</b></div></div><div class="detail-grid-demo"><div><small>MEDICAL COST DATA</small><b>${esc(p.medicalCost||"Needs verification")}</b></div><div><small>INTERPRETER COST</small><b>${esc(p.interpreterCost||"Needs verification")}</b></div><div><small>COORDINATOR COST</small><b>${esc(p.coordinatorCost||"Needs verification")}</b></div><div><small>PRICE TRANSPARENCY</small><b>${esc(human(p.priceTransparency||"low"))}</b></div></div><div class="demo-warning">This profile describes documented access logistics only. It does not recommend this provider, assess clinical quality, guarantee case acceptance, or confirm current availability.</div><p class="demo-source"><b>Source status:</b> ${source}</p><p class="demo-source"><b>Source-backed evidence:</b> ${ev.length?ev.slice(0,4).map(e=>esc(e.label)).join(" · "):"None in the current record."}</p>`;
  }
  function renderHandoff(){
    const p=state.selected;if(!p)return;
    const lang=languageState(p);
    const needs=[];
    if(!lang.match)needs.push("Confirm communication route");
    if(["required","varies"].includes(p.referral))needs.push("Confirm referral / records");
    if(["required","recommended","varies"].includes(p.coordinator))needs.push("Confirm coordination pathway");
    if((p.priceTransparency||"low")==="low")needs.push("Confirm total cost components");
    $("handoffPreview").innerHTML=`<div class="handoff-box"><small>PATIENT CONTEXT</small><b>${esc(audienceLabel())} · ${esc(selectedCare().label)}</b><span>Tokyo${state.area!=="all"?` · ${esc(state.area)}`:""} · ${esc(state.language==="direct"?"Direct physician English requested":state.language==="interpreter"?"Interpreter acceptable":"Any documented communication pathway")}</span></div><div class="handoff-box"><small>SELECTED ACCESS PROFILE</small><b>${esc(p.name)}</b><span>${p.recordStatus==="official-source-verified"?"Official-source checked record":"DEMO · UNVERIFIED record"} · referral ${esc(human(p.referral))} · coordinator ${esc(human(p.coordinator))}</span></div><div class="handoff-box"><small>WHAT STILL NEEDS CONFIRMATION</small><b>${needs.length?`${needs.length} access item${needs.length===1?"":"s"}`:"No additional structured access gaps flagged"}</b><span>${esc(needs.join(" · ")||"Current availability and case acceptance still require confirmation.")}</span></div><div class="handoff-box"><small>DOWNSTREAM HANDOFF</small><b>Japan Health → coordination partner</b><span>AMECA can remain the placeholder downstream destination for the demo. No clinical recommendation is implied.</span></div>`;
  }
  document.querySelectorAll("[data-audience]").forEach(b=>b.addEventListener("click",()=>{state.audience=b.dataset.audience;document.querySelectorAll("[data-audience]").forEach(x=>x.classList.toggle("selected",x===b))}));
  $("toCare").addEventListener("click",()=>setStep(2));
  $("showResults").addEventListener("click",()=>{state.language=$("demoLanguage").value;state.area=$("demoArea").value;renderResults();setStep(3)});
  $("toHandoff").addEventListener("click",()=>{renderHandoff();setStep(5)});
  $("completeDemo").addEventListener("click",()=>setStep(6));
  $("restartDemo").addEventListener("click",()=>{state.step=1;state.audience="visitor";state.care="general";state.language="all";state.area="all";state.selected=null;document.querySelectorAll("[data-audience]").forEach(x=>x.classList.toggle("selected",x.dataset.audience==="visitor"));$("demoLanguage").value="all";$("demoArea").value="all";renderCare();setStep(1)});
  document.querySelectorAll("[data-back]").forEach(b=>b.addEventListener("click",()=>setStep(Number(b.dataset.back))));
  renderCare();
})();
