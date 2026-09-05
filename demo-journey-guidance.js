(()=>{
  const $=id=>document.getElementById(id);
  const providers=()=>window.PROVIDERS||[];
  const known=v=>{const s=String(v||"").trim().toLowerCase();return Boolean(s)&&!s.includes("unknown")&&!s.includes("needs verification");};
  const selectedProvider=()=>{const name=$("detailTitle")?.textContent?.trim();return providers().find(p=>p.name===name)||null;};
  const costVisibility=p=>[p?.medicalCost,p?.interpreterCost,p?.coordinatorCost].filter(known).length;
  const openGapCount=p=>{
    if(!p)return 0;
    let n=0;
    if(!known(p.referral))n++;
    if(!known(p.coordinator))n++;
    if(!known(p.medicalCost))n++;
    if(!known(p.interpreterCost))n++;
    if(!known(p.coordinatorCost))n++;
    return n;
  };
  const communicationSummary=p=>{
    if(!p)return "Needs verification";
    if(p.doctorEnglish==="yes")return "Direct physician English recorded";
    if(["yes","available","external"].includes(p.interpreter))return "Interpreter route recorded";
    return "Communication route needs verification";
  };

  function mountDetailGlance(){
    const body=$("detailBody"),p=selectedProvider();
    if(!body||!p)return;
    let el=$("demoDetailGlance");
    if(!el){
      el=document.createElement("section");
      el.id="demoDetailGlance";
      el.className="demo-detail-glance";
      el.setAttribute("aria-label","Provider access at a glance");
      body.prepend(el);
    }
    const costs=costVisibility(p),gaps=openGapCount(p);
    el.innerHTML=`<div class="demo-glance-head"><div><small>ACCESS AT A GLANCE</small><b>What is documented before the next step</b></div><span>Access logistics only — not clinical quality.</span></div><div class="demo-glance-grid"><div><small>COMMUNICATION</small><b>${communicationSummary(p)}</b></div><div><small>TOTAL-COST VISIBILITY</small><b>${costs}/3 components recorded</b></div><div><small>OPEN DATA GAPS</small><b>${gaps} tracked item${gaps===1?"":"s"} need verification</b></div></div>`;
  }

  function currentPanel(){return [...document.querySelectorAll(".demo-panel")].find(x=>!x.classList.contains("hidden-step"))||null;}
  function resultPrimaryButton(){return document.querySelector("#demoResults .demo-provider .actions button, #demoResults .demo-provider .actions a");}
  function handoffTarget(){return document.querySelector("#stepHandoff form, #stepHandoff input, #stepHandoff textarea, #completeDemo");}
  function actionForPanel(panel){
    if(!panel)return null;
    if(panel.id==="stepResults"){
      const target=resultPrimaryButton();
      return target?{label:"Open first access fit",hint:"Continue to provider access details",run:()=>target.click()}:null;
    }
    if(panel.id==="stepDetail")return{label:"Continue to next step",hint:"Carry this access context forward",run:()=>$("toHandoff")?.click()};
    if(panel.id==="stepHandoff"){
      const target=handoffTarget();
      return target?{label:"Review handoff",hint:"Check what will be sent before submitting",run:()=>{target.scrollIntoView({behavior:"smooth",block:"center"});if(target.matches("input,textarea,button"))target.focus({preventScroll:true});}}:null;
    }
    return null;
  }
  function mountMobileGuide(){
    let bar=$("demoMobileGuide");
    if(!bar){
      bar=document.createElement("aside");
      bar.id="demoMobileGuide";
      bar.className="demo-mobile-guide";
      bar.setAttribute("aria-live","polite");
      bar.innerHTML='<div><small>NEXT ACTION</small><b id="demoMobileGuideHint"></b></div><button type="button" class="btn primary" id="demoMobileGuideButton"></button>';
      document.body.appendChild(bar);
      $("demoMobileGuideButton")?.addEventListener("click",()=>bar._run?.());
    }
    const action=actionForPanel(currentPanel());
    bar.hidden=!action;
    if(!action)return;
    $("demoMobileGuideHint").textContent=action.hint;
    $("demoMobileGuideButton").textContent=action.label;
    bar._run=action.run;
  }

  function refresh(){mountDetailGlance();mountMobileGuide();}
  const observer=new MutationObserver(()=>requestAnimationFrame(refresh));
  [document.querySelector("main"),$("detailBody"),$("demoResults"),$("handoffPreview")].filter(Boolean).forEach(el=>observer.observe(el,{childList:true,subtree:true,attributes:true,attributeFilter:["class"]}));
  const style=document.createElement("style");
  style.id="demo-journey-guidance-styles";
  style.textContent=`.demo-detail-glance{margin:0 0 12px;padding:12px;border-radius:13px;background:#f4f8fb;border:1px solid #dce6ef}.demo-glance-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.demo-glance-head small,.demo-glance-head b,.demo-glance-grid small,.demo-glance-grid b{display:block}.demo-glance-head small,.demo-glance-grid small{font-size:7px;font-weight:900;letter-spacing:.05em;color:#718295}.demo-glance-head b{font-size:10px;color:#173c5f;margin-top:2px}.demo-glance-head>span{font-size:7px;color:#718295;text-align:right}.demo-glance-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:9px}.demo-glance-grid>div{padding:9px;border-radius:9px;background:#fff;border:1px solid #e1e9f0}.demo-glance-grid b{font-size:8px;line-height:1.35;color:#24455f;margin-top:3px}.demo-mobile-guide{display:none}@media(max-width:700px){body.demo-page{padding-bottom:86px}.demo-glance-head{flex-direction:column}.demo-glance-head>span{text-align:left}.demo-glance-grid{grid-template-columns:1fr}.demo-mobile-guide{position:fixed;left:10px;right:10px;bottom:10px;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 11px;border:1px solid #cfdde9;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 8px 28px rgba(16,43,69,.16);backdrop-filter:blur(10px)}.demo-mobile-guide[hidden]{display:none}.demo-mobile-guide small,.demo-mobile-guide b{display:block}.demo-mobile-guide small{font-size:6px;font-weight:900;letter-spacing:.07em;color:#718295}.demo-mobile-guide b{font-size:8px;line-height:1.3;color:#24455f;margin-top:2px}.demo-mobile-guide .btn{flex:0 0 auto;white-space:nowrap}}`;
  document.head.appendChild(style);
  refresh();
})();