(()=>{
  const $=id=>document.getElementById(id);
  function buildSummary(){
    const preview=$("handoffPreview");if(!preview)return"";
    const sections=[...preview.querySelectorAll(".handoff-box")].map(box=>({
      label:box.querySelector("small")?.textContent?.trim()||"",
      title:box.querySelector("b")?.textContent?.trim()||"",
      detail:box.querySelector("span")?.textContent?.trim()||""
    })).filter(x=>x.label);
    const pick=label=>sections.find(x=>x.label.includes(label));
    const context=pick("PATIENT CONTEXT"),profile=pick("SELECTED ACCESS PROFILE"),next=pick("LOGISTICS NEXT STEP"),gaps=pick("WHAT STILL NEEDS CONFIRMATION");
    return [
      "Japan Health — Access Summary",
      "",
      `Patient context: ${context?.title||"Not captured"}`,
      context?.detail?`Constraints: ${context.detail}`:"",
      `Selected access profile: ${profile?.title||"Not selected"}`,
      profile?.detail?`Evidence status: ${profile.detail}`:"",
      `Logistics next step: ${next?.title||"Needs verification"}`,
      next?.detail?`Why: ${next.detail}`:"",
      `Open access gaps: ${gaps?.title||"Not assessed"}`,
      gaps?.detail?`Confirm: ${gaps.detail}`:"",
      "",
      "Discovery and coordination only. This summary does not diagnose, provide medical advice, rank clinical quality, guarantee case acceptance, availability or pricing."
    ].filter(Boolean).join("\n");
  }
  function render(){
    const panel=$("stepHandoff"),preview=$("handoffPreview");if(!panel||!preview)return;
    let wrap=$("demoHandoffSummary");if(!wrap){
      wrap=document.createElement("section");wrap.id="demoHandoffSummary";wrap.className="demo-handoff-summary";
      preview.insertAdjacentElement("afterend",wrap);
    }
    const text=buildSummary();if(!text)return;
    wrap.innerHTML=`<div><small>PORTABLE ACCESS SUMMARY</small><b>Carry the structured context into a human conversation.</b><span>This is the product output before any downstream partner handoff. AMECA can remain a placeholder.</span></div><textarea id="demoSummaryText" readonly aria-label="Japan Health access summary"></textarea><div class="demo-summary-actions"><button type="button" class="small-btn primary" id="copyDemoSummary">Copy access summary</button><a class="small-btn" href="/clinics.html">Open full directory</a></div><p id="demoSummaryStatus" aria-live="polite"></p>`;
    const ta=$("demoSummaryText");if(ta)ta.value=text;
    $("copyDemoSummary")?.addEventListener("click",async()=>{
      const status=$("demoSummaryStatus");
      try{await navigator.clipboard.writeText(text);if(status)status.textContent="Access summary copied.";}
      catch(_){if(ta){ta.focus();ta.select();}if(status)status.textContent="Clipboard unavailable. The summary is selected so it can be copied manually.";}
    });
  }
  const observer=new MutationObserver(()=>requestAnimationFrame(render));
  [$("handoffPreview"),document.querySelector("main")].filter(Boolean).forEach(el=>observer.observe(el,{childList:true,subtree:true,attributes:true,attributeFilter:["class"]}));
  const style=document.createElement("style");style.id="demo-handoff-summary-styles";style.textContent=`.demo-handoff-summary{margin-top:12px;padding:14px;border:1px solid #dce6ef;border-radius:13px;background:#fbfdff}.demo-handoff-summary small,.demo-handoff-summary b,.demo-handoff-summary span{display:block}.demo-handoff-summary small{font-size:7px;font-weight:900;letter-spacing:.06em;color:#718295}.demo-handoff-summary b{font-size:10px;color:#173c5f;margin:3px 0}.demo-handoff-summary span{font-size:8px;line-height:1.45;color:#607487}.demo-handoff-summary textarea{width:100%;min-height:170px;margin-top:10px;padding:10px;border:1px solid #dce6ef;border-radius:10px;background:#fff;font:8px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;color:#40576c;resize:vertical}.demo-summary-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}.demo-handoff-summary p{min-height:16px;margin:6px 0 0;font-size:7px;color:#607487}@media(max-width:600px){.demo-summary-actions{display:grid}.demo-summary-actions .small-btn{width:100%;text-align:center}}`;
  document.head.appendChild(style);
  render();
})();