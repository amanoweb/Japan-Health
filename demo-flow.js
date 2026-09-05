(()=>{
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const path=location.pathname;
  const isHome=path==="/"||path.endsWith("/index.html");
  const isDirectory=path.endsWith("/clinics.html");
  const careOptions=[
    {id:"general",label:"General care",q:"Internal Medicine",note:"Everyday outpatient care"},
    {id:"dental",label:"Dental",q:"Dentistry",note:"Dental and oral care"},
    {id:"screening",label:"Health screening",q:"Health Screening",note:"Checkups and screening"},
    {id:"cardiology",label:"Cardiology",q:"Cardiology",note:"Heart and cardiovascular care"},
    {id:"cancer",label:"Cancer / second opinion",q:"Second Opinion",note:"Specialist cancer access"},
    {id:"womens",label:"Women's health / ART",q:"Assisted Reproductive Technology",note:"Gynecology and fertility access"}
  ];
  const state={audience:"visitor",care:"general",language:"all"};
  function style(){
    if($("jh-demo-flow-styles"))return;
    const s=document.createElement("style");s.id="jh-demo-flow-styles";s.textContent=`
      .demo-flow{margin:0;padding:34px 7vw 40px;background:#0f2840;color:#fff;border-top:1px solid rgba(255,255,255,.08)}
      .demo-flow-wrap{max-width:1180px;margin:auto}.demo-flow-head{display:flex;justify-content:space-between;gap:22px;align-items:flex-end;margin-bottom:18px}.demo-flow-head h2{margin:5px 0 0;font-size:28px}.demo-flow-head p{max-width:620px;color:#c9d6e2;font-size:11px;line-height:1.55}.demo-kicker{font-size:8px;font-weight:900;letter-spacing:.08em;color:#8fc0ff}.demo-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px}.demo-step{padding:12px;border:1px solid rgba(255,255,255,.15);border-radius:13px;background:rgba(255,255,255,.055)}.demo-step small,.demo-step b{display:block}.demo-step small{font-size:7px;color:#9db0c2}.demo-step b{font-size:10px;margin-top:3px}.demo-step.active{border-color:#7fb6ff;background:rgba(80,151,242,.16)}
      .demo-panel{display:grid;grid-template-columns:.75fr 1.45fr .85fr;gap:12px}.demo-choice{padding:15px;border-radius:15px;background:#fff;color:#173c5f}.demo-choice>small{display:block;font-size:7px;font-weight:900;letter-spacing:.06em;color:#718295;margin-bottom:9px}.demo-buttons{display:grid;gap:7px}.demo-buttons.care{grid-template-columns:repeat(2,minmax(0,1fr))}.demo-option{border:1px solid #dce6ef;border-radius:10px;background:#f8fbfd;padding:9px 10px;text-align:left;color:#25445f;font:inherit;cursor:pointer}.demo-option b,.demo-option span{display:block}.demo-option b{font-size:9px}.demo-option span{font-size:7px;color:#718295;margin-top:2px}.demo-option.selected{border-color:#176df0;background:#eef6ff;box-shadow:0 0 0 1px #176df0 inset}.demo-summary{padding:16px;border-radius:15px;background:#fff;color:#173c5f;display:flex;flex-direction:column;justify-content:space-between}.demo-summary small{font-size:7px;color:#718295}.demo-summary b{display:block;font-size:15px;margin:4px 0}.demo-summary p{font-size:8px;line-height:1.45;color:#607487}.demo-summary .btn{width:100%;text-align:center;justify-content:center;margin-top:10px}.demo-proof{font-size:7px;color:#8da3b6;margin-top:8px}.demo-progress{margin:12px 0;padding:11px 14px;border:1px solid #dbe6ef;border-radius:12px;background:#f8fbfd;display:flex;align-items:center;justify-content:space-between;gap:14px}.demo-progress-main{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.demo-progress-main span{font-size:8px;padding:5px 7px;border-radius:999px;background:#e9f2fb;color:#47647e}.demo-progress-main span.done{background:#e8f7f2;color:#176b58}.demo-progress-main span.current{background:#eef6ff;color:#176df0;font-weight:900}.demo-progress-context{font-size:8px;color:#607487;text-align:right}.demo-next-card{margin:12px 0;padding:12px;border:1px solid #dce6ef;border-radius:12px;background:#fbfdff}.demo-next-card small,.demo-next-card b,.demo-next-card span{display:block}.demo-next-card small{font-size:7px;color:#718295}.demo-next-card b{font-size:11px;margin:3px 0}.demo-next-card span{font-size:8px;line-height:1.45;color:#607487}
      @media(max-width:900px){.demo-panel{grid-template-columns:1fr}.demo-flow-head{align-items:flex-start;flex-direction:column}.demo-steps{grid-template-columns:1fr}.demo-buttons.care{grid-template-columns:1fr 1fr}.demo-progress{align-items:flex-start;flex-direction:column}.demo-progress-context{text-align:left}}
      @media(max-width:560px){.demo-flow{padding:28px 20px}.demo-buttons.care{grid-template-columns:1fr}.demo-flow-head h2{font-size:24px}}
    `;document.head.appendChild(s);
  }
  function selectedCare(){return careOptions.find(x=>x.id===state.care)||careOptions[0];}
  function destination(){
    const p=new URLSearchParams({audience:state.audience,city:"Tokyo",q:selectedCare().q});
    if(state.language!=="all")p.set("language",state.language);
    p.set("demo","1");
    return `/clinics.html?${p.toString()}`;
  }
  function mountHome(){
    const hero=document.querySelector(".hero");if(!hero||$("guidedDemoFlow"))return;
    const sec=document.createElement("section");sec.id="guidedDemoFlow";sec.className="demo-flow";
    sec.innerHTML=`<div class="demo-flow-wrap"><div class="demo-flow-head"><div><div class="demo-kicker">LIVE DEMO PATH</div><h2>Start with the patient, not the provider list.</h2></div><p>Choose the situation and care need. Japan Health carries those constraints into the Tokyo directory, where the user can compare documented access, open a provider, and continue to coordination if needed.</p></div><div class="demo-steps"><div class="demo-step active"><small>STEP 1</small><b>Who is the patient?</b></div><div class="demo-step active"><small>STEP 2</small><b>What care do they need?</b></div><div class="demo-step"><small>STEP 3</small><b>Compare access → choose next step</b></div></div><div class="demo-panel"><div class="demo-choice"><small>PATIENT SITUATION</small><div class="demo-buttons" id="demoAudience"><button class="demo-option selected" data-audience="visitor"><b>Visiting Tokyo</b><span>Short stay / travel</span></button><button class="demo-option" data-audience="resident"><b>Living in Tokyo</b><span>Resident pathway</span></button><button class="demo-option" data-audience="medical-travel"><b>Major medical travel</b><span>Planned specialist care</span></button></div></div><div class="demo-choice"><small>CARE NEED</small><div class="demo-buttons care" id="demoCare">${careOptions.map((x,i)=>`<button class="demo-option${i===0?" selected":""}" data-care="${x.id}"><b>${esc(x.label)}</b><span>${esc(x.note)}</span></button>`).join("")}</div></div><div class="demo-summary"><div><small>YOUR DEMO PATH</small><b id="demoPathTitle"></b><p id="demoPathCopy"></p><label style="display:block;font-size:8px;font-weight:800;margin-top:8px">Communication<select id="demoLanguage" style="width:100%;margin-top:4px"><option value="all">Any documented pathway</option><option value="direct">Direct physician English only</option><option value="interpreter">Interpreter acceptable</option></select></label></div><div><a id="demoStart" class="btn primary" href="#">Show matching Tokyo access →</a><div class="demo-proof">Demo carries the selected constraints into the real directory. No clinical-quality ranking.</div></div></div></div></div>`;
    hero.insertAdjacentElement("afterend",sec);
    const refresh=()=>{
      const c=selectedCare(),aud=state.audience==="resident"?"Resident":state.audience==="medical-travel"?"Medical travel":"Visitor";
      $("demoPathTitle").textContent=`${aud} → ${c.label}`;
      $("demoPathCopy").textContent=state.audience==="medical-travel"?"Start with specialist access evidence and documented booking requirements. Coordination remains a downstream option.":"Open the directory with your patient type and care need already applied.";
      $("demoStart").href=destination();
    };
    sec.querySelectorAll("[data-audience]").forEach(b=>b.addEventListener("click",()=>{state.audience=b.dataset.audience;sec.querySelectorAll("[data-audience]").forEach(x=>x.classList.toggle("selected",x===b));refresh()}));
    sec.querySelectorAll("[data-care]").forEach(b=>b.addEventListener("click",()=>{state.care=b.dataset.care;sec.querySelectorAll("[data-care]").forEach(x=>x.classList.toggle("selected",x===b));refresh()}));
    $("demoLanguage").addEventListener("change",e=>{state.language=e.target.value;refresh()});
    refresh();
  }
  function directoryContext(){
    const p=new URLSearchParams(location.search);if(p.get("demo")!=="1")return null;
    return{audience:p.get("audience")||"all",q:p.get("q")||"",language:p.get("language")||"all"};
  }
  function mountDirectoryProgress(){
    const c=directoryContext();if(!c)return;
    const host=document.querySelector(".finder-head")||document.querySelector(".finder");if(!host||$("demoProgress"))return;
    const aud=c.audience==="resident"?"Resident":c.audience==="medical-travel"?"Medical travel":"Visitor";
    const d=document.createElement("div");d.id="demoProgress";d.className="demo-progress";d.setAttribute("aria-live","polite");
    d.innerHTML=`<div class="demo-progress-main"><span class="done">1 · Situation</span><span class="done">2 · Care need</span><span class="current">3 · Compare access</span><span>4 · Provider details</span><span>5 · Next step</span></div><div class="demo-progress-context"><b>${esc(aud)} · ${esc(c.q||"Tokyo care")}</b><br>${c.language==="interpreter"?"Interpreter acceptable":c.language==="direct"?"Direct physician English requested":"Any documented language pathway"}</div>`;
    host.insertAdjacentElement("afterend",d);
  }
  function enhanceModals(){
    if(!isDirectory)return;
    const nativeProvider=window.openProvider;
    if(typeof nativeProvider==="function")window.openProvider=id=>{
      nativeProvider(id);
      const box=$("providerDetail");if(!box||box.querySelector(".demo-next-card"))return;
      const p=(window.PROVIDERS||[]).find(x=>x.id===id);
      const c=directoryContext();
      const card=document.createElement("div");card.className="demo-next-card";
      card.innerHTML=`<small>DEMO FLOW · STEP 4 OF 5</small><b>Provider access profile opened</b><span>You are now checking whether ${esc(p?.name||"this provider")} fits the documented access constraints${c?.q?` for ${esc(c.q)}`:""}. Review language, referral, booking and cost visibility, then choose the next step below.</span>`;
      box.insertBefore(card,box.firstChild);
    };
    const nativeLead=window.openLeadModal;
    if(typeof nativeLead==="function")window.openLeadModal=id=>{
      nativeLead(id);
      const form=$("leadForm");if(!form||form.querySelector(".demo-next-card"))return;
      const card=document.createElement("div");card.className="demo-next-card";
      card.innerHTML='<small>DEMO FLOW · STEP 5 OF 5</small><b>Coordination handoff</b><span>The product journey is complete here. For the current demo, partner delivery is only the downstream handoff layer; the core value is the access context carried into this inquiry.</span>';
      form.insertBefore(card,form.firstChild);
    };
  }
  function init(){style();if(isHome)mountHome();if(isDirectory){mountDirectoryProgress();enhanceModals();}}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
