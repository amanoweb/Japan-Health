(()=>{
  const $=id=>document.getElementById(id);
  const providers=()=>window.PROVIDERS||[];
  const known=v=>{const s=String(v||"").trim().toLowerCase();return Boolean(s)&&!s.includes("unknown")&&!s.includes("needs verification");};
  const providerForCard=card=>{const name=card.querySelector("h3")?.textContent?.trim();return providers().find(p=>p.name===name)||null;};
  const costVisibility=p=>[p?.medicalCost,p?.interpreterCost,p?.coordinatorCost].filter(known).length;
  const communication=p=>{
    const q=new URLSearchParams(location.search),pref=q.get("language")||"all";
    if(pref==="direct")return p?.doctorEnglish==="yes"?"Direct English recorded":"Needs verification";
    if(pref==="interpreter")return ["yes","available","external"].includes(p?.interpreter)?"Interpreter route recorded":"Needs verification";
    if(p?.doctorEnglish==="yes")return"Direct English recorded";
    if(["yes","available","external"].includes(p?.interpreter))return"Interpreter route recorded";
    return"Needs verification";
  };
  const booking=card=>{
    const text=[...card.querySelectorAll(".match")].map(x=>x.textContent||"").find(x=>/Service booking \d\/4 documented/i.test(x));
    const m=text?.match(/Service booking (\d)\/4 documented/i);
    return m?`${m[1]}/4 documented`:"Service-level verification needed";
  };
  const accessScore=p=>window.JapanHealthDemoAccessScore?.accessScore?.(p)?.score;

  function addDecisionStrip(card){
    let strip=card.querySelector(".demo-mobile-decision");
    const p=providerForCard(card);if(!p)return;
    if(!strip){
      strip=document.createElement("section");
      strip.className="demo-mobile-decision";
      strip.setAttribute("aria-label","Access decision summary");
      const meta=card.querySelector(".meta");
      (meta||card.querySelector("h3"))?.insertAdjacentElement("afterend",strip);
    }
    const score=accessScore(p);
    strip.innerHTML=`<div><small>ACCESS SCORE</small><b>${Number.isFinite(score)?`${score}/100`:"Calculating…"}</b><span>Logistics only</span></div><div><small>COMMUNICATION</small><b>${communication(p)}</b><span>Current record</span></div><div><small>BOOKING READINESS</small><b>${booking(card)}</b><span>Documentation only</span></div><div><small>TOTAL-COST DATA</small><b>${costVisibility(p)}/3 recorded</b><span>Not a price quote</span></div>`;
  }

  function addMobileToggle(card){
    let btn=card.querySelector(".demo-mobile-more");
    if(!btn){
      btn=document.createElement("button");
      btn.type="button";
      btn.className="demo-mobile-more";
      btn.setAttribute("aria-expanded","false");
      btn.textContent="Show access evidence";
      const actions=card.querySelector(".actions");
      actions?.insertAdjacentElement("beforebegin",btn);
      btn.addEventListener("click",()=>{
        const open=card.classList.toggle("mobile-evidence-open");
        btn.setAttribute("aria-expanded",String(open));
        btn.textContent=open?"Hide access evidence":"Show access evidence";
      });
    }
  }

  function addComparisonActions(){
    const rows=[...document.querySelectorAll("#demoScoreComparison .demo-compare-row")];
    rows.forEach(row=>{
      if(row.querySelector(".demo-compare-open"))return;
      const name=row.querySelector("div b")?.textContent?.trim();
      const card=[...document.querySelectorAll("#demoResults .demo-provider")].find(x=>x.querySelector("h3")?.textContent?.trim()===name);
      const target=card?.querySelector("[data-provider]");
      if(!target)return;
      const btn=document.createElement("button");
      btn.type="button";
      btn.className="small-btn demo-compare-open";
      btn.textContent="Open access profile";
      btn.setAttribute("aria-label",`Open access profile for ${name}`);
      btn.addEventListener("click",()=>target.click());
      row.appendChild(btn);
    });
  }

  function refresh(){
    document.querySelectorAll("#demoResults .demo-provider").forEach(card=>{addDecisionStrip(card);addMobileToggle(card);});
    addComparisonActions();
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(refresh));
  [$("demoResults"),$("demoScoreComparison"),document.querySelector("main")].filter(Boolean).forEach(el=>observer.observe(el,{childList:true,subtree:true}));
  const style=document.createElement("style");
  style.id="demo-mobile-comparison-styles";
  style.textContent=`.demo-mobile-decision{display:none}.demo-mobile-more{display:none}.demo-compare-open{justify-self:end;white-space:nowrap}.demo-compare-row{grid-template-columns:minmax(0,1.5fr) .55fr .8fr .7fr .9fr auto}@media(max-width:760px){.demo-compare-row{grid-template-columns:1fr 1fr}.demo-compare-open{justify-self:stretch;text-align:center}.demo-mobile-decision{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:9px 0}.demo-mobile-decision>div{padding:8px;border:1px solid #e1e9f0;border-radius:9px;background:#f8fbfd}.demo-mobile-decision small,.demo-mobile-decision b,.demo-mobile-decision span{display:block}.demo-mobile-decision small{font-size:6px;font-weight:900;letter-spacing:.04em;color:#718295}.demo-mobile-decision b{font-size:8px;line-height:1.35;color:#24455f;margin-top:2px}.demo-mobile-decision span{font-size:6px;color:#7a8b9b;margin-top:2px}.demo-mobile-more{display:block;width:100%;margin:7px 0 3px;padding:8px;border:1px solid #dce6ef;border-radius:9px;background:#fff;color:#245f9d;font-size:8px;font-weight:800}.demo-provider:not(.mobile-evidence-open)>.match-list,.demo-provider:not(.mobile-evidence-open)>p,.demo-provider:not(.mobile-evidence-open)>.demo-access-score{display:none}.demo-provider:not(.mobile-evidence-open)>.demo-cost-readiness{display:none}.demo-provider .actions{margin-top:8px}}@media(max-width:480px){.demo-mobile-decision{grid-template-columns:1fr}.demo-compare-open{grid-column:1/-1}}`;
  document.head.appendChild(style);
  refresh();
})();