(()=>{
  const $=id=>document.getElementById(id);
  const audience=()=>$("audience")?.value||"all";
  const label=v=>({direct:"Verified physician English",interpreter:"Interpreter-supported",required:"Required",no:"No referral required","not-required":"No confirmed coordinator requirement",visitor:"Visitor",resident:"Resident",Tokyo:"Tokyo",Osaka:"Osaka"}[v]||v);

  function activeConstraints(){
    const parts=[];
    const ids=[["audience","Audience"],["city","City"],["language","Language"],["coord","Coordinator"],["referral","Referral"]];
    ids.forEach(([id,key])=>{const el=$(id);if(el&&el.value&&el.value!=="all")parts.push(`${key}: ${label(el.value)}`)});
    const q=$("q")?.value?.trim();if(q)parts.unshift(`Need: ${q}`);
    if($("verifiedOnly")?.checked)parts.push("Official-source checked only");
    return parts;
  }

  function renderContext(){
    const box=$("directoryContext"),summary=$("activeConstraintSummary");
    if(box){
      const a=audience();
      if(a==="visitor")box.innerHTML='<b>Visitor pathway</b><span>Prioritize access that can work for someone temporarily in Japan. Self-pay, booking and language facts are shown only when supported by the underlying record.</span>';
      else if(a==="resident")box.innerHTML='<b>Resident pathway</b><span>Prioritize local access for people living in Japan. Insurance and referral details stay unknown unless a source supports them.</span>';
      else box.innerHTML='<b>Visitor + Resident view</b><span>Choose a pathway to make eligibility fit part of the International Access Score. The score measures access friction only, never clinical quality.</span>';
    }
    if(summary){const p=activeConstraints();summary.textContent=p.length?`Active constraints: ${p.join(" · ")}`:"No extra constraints selected. Results may include both provider-level verified and clearly labeled demo records.";}
  }

  function setFilter(id,value){
    const el=$(id);if(!el)return;
    el.value=value;
    el.dispatchEvent(new Event("input",{bubbles:true}));
    renderContext();
  }

  document.querySelectorAll("[data-directory-filter]").forEach(btn=>btn.addEventListener("click",()=>{
    const [id,value]=btn.dataset.directoryFilter.split(":");
    if(id==="verifiedOnly"){
      const el=$("verifiedOnly");if(el){el.checked=value==="1";el.dispatchEvent(new Event("change",{bubbles:true}));el.dispatchEvent(new Event("input",{bubbles:true}));}
      renderContext();return;
    }
    setFilter(id,value);
  }));

  document.querySelectorAll("#q,#audience,#city,#language,#coord,#referral,#verifiedOnly").forEach(el=>{
    el?.addEventListener("input",renderContext);el?.addEventListener("change",renderContext);
  });
  $("resetFilters")?.addEventListener("click",()=>setTimeout(renderContext,0));
  renderContext();
})();
