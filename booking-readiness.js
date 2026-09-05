(()=>{
  const $=id=>document.getElementById(id),providers=()=>window.PROVIDERS||[];
  const grid=$("providerGrid");
  if(!grid||!window.JapanHealthSpecialistAccess)return;
  const escapeHtml=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const validReferral=new Set(["required","recommended","not-required"]);
  const validCoordinator=new Set(["required","conditional","not-required"]);
  const providerForCard=card=>providers().find(p=>p.name===card.querySelector("h3")?.textContent?.trim());
  const query=()=>($("q")?.value||"").trim();
  function readiness(p,q){
    const snap=p&&q?window.JapanHealthSpecialistAccess.snapshotForId(p.id,q):null;
    const r=snap?.requirements;
    const sourceBacked=Boolean(r?.sourceBacked&&/^https:\/\//i.test(String(r?.source||"")));
    const components=[
      {key:"audience",label:"Audience",documented:sourceBacked&&Array.isArray(r?.audience)&&r.audience.some(v=>v==="visitor"||v==="resident"),detail:Array.isArray(r?.audience)?r.audience.filter(v=>v!=="unknown").join(" + "):""},
      {key:"referral",label:"Referral rule",documented:sourceBacked&&validReferral.has(r?.referral),detail:validReferral.has(r?.referral)?r.referral:""},
      {key:"coordinator",label:"Coordinator rule",documented:sourceBacked&&validCoordinator.has(r?.coordinator),detail:validCoordinator.has(r?.coordinator)?r.coordinator:""},
      {key:"booking-start",label:"Booking start",documented:sourceBacked&&Boolean(String(r?.bookingStart||"").trim()),detail:r?.bookingStart||""}
    ];
    const documented=components.filter(c=>c.documented).length;
    return{
      query:q||"",sourceBacked,documented,total:4,score:sourceBacked?documented*25:0,
      components,missing:components.filter(c=>!c.documented).map(c=>c.label),
      source:sourceBacked?r.source:null,verifiedDate:sourceBacked?r.verifiedDate||null:null,
      label:!q?"Search a service first":!sourceBacked?"No source-backed booking rules":documented===4?"4/4 booking fields documented":`${documented}/4 booking fields documented`
    };
  }
  function badge(r){
    const cls=!r.sourceBacked?"unknown":r.documented===4?"complete":r.documented>=2?"partial":"low";
    return `<span class="booking-readiness-badge ${cls}">${escapeHtml(r.label)}</span>`;
  }
  function panel(p,q){
    const r=readiness(p,q);
    const items=r.components.map(c=>`<div class="booking-readiness-item ${c.documented?"documented":"missing"}"><span aria-hidden="true">${c.documented?"✓":"?"}</span><div><b>${escapeHtml(c.label)}</b><small>${c.documented?escapeHtml(c.detail||"Documented in the service-level source"):"Needs service-level verification"}</small></div></div>`).join("");
    const source=r.source?`<a href="${escapeHtml(r.source)}" target="_blank" rel="noopener noreferrer">Booking requirements source ↗</a>`:"";
    return `<section class="booking-readiness-panel" aria-label="Booking readiness documentation completeness"><div class="booking-readiness-head"><div><small>BOOKING READINESS</small><b>Service-level documentation completeness</b></div>${badge(r)}</div><div class="booking-readiness-meter" role="progressbar" aria-label="${r.documented} of 4 booking fields documented" aria-valuemin="0" aria-valuemax="4" aria-valuenow="${r.documented}"><span style="width:${r.score}%"></span></div><div class="booking-readiness-grid">${items}</div>${source}<p>Booking Readiness measures whether audience, referral, coordinator and booking-start information is documented for the searched service. It does not predict acceptance, appointment availability, clinical quality or outcomes.</p></section>`;
  }
  function ensureStyles(){
    if($("jh-booking-readiness-styles"))return;
    const style=document.createElement("style");style.id="jh-booking-readiness-styles";style.textContent=`.booking-readiness-panel{margin:10px 0;padding:12px;border:1px solid #dce6ef;border-radius:12px;background:#fff}.booking-readiness-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.booking-readiness-head small,.booking-readiness-head b{display:block}.booking-readiness-head small{font-size:7px;font-weight:900;letter-spacing:.07em;color:#607487}.booking-readiness-head b{font-size:9px;margin-top:2px;color:#173c5f}.booking-readiness-badge{font-size:7px;font-weight:900;padding:5px 7px;border-radius:999px;white-space:nowrap}.booking-readiness-badge.complete{background:#e8f7f2;color:#176b58}.booking-readiness-badge.partial{background:#eef6ff;color:#245f9d}.booking-readiness-badge.low{background:#fff2df;color:#8a5a18}.booking-readiness-badge.unknown{background:#eef3f8;color:#607487}.booking-readiness-meter{height:5px;margin:9px 0 10px;border-radius:99px;background:#e8edf2;overflow:hidden}.booking-readiness-meter span{display:block;height:100%;background:currentColor;color:#176b58}.booking-readiness-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.booking-readiness-item{display:flex;gap:6px;padding:8px;border:1px solid #e5ebf0;border-radius:9px;background:#fbfdff}.booking-readiness-item>span{width:17px;height:17px;display:grid;place-items:center;border-radius:50%;font-size:8px;font-weight:900;flex:0 0 auto}.booking-readiness-item.documented>span{background:#e8f7f2;color:#176b58}.booking-readiness-item.missing>span{background:#eef3f8;color:#607487}.booking-readiness-item b,.booking-readiness-item small{display:block}.booking-readiness-item b{font-size:8px;color:#173c5f}.booking-readiness-item small{font-size:7px;line-height:1.35;color:#718295;margin-top:2px}.booking-readiness-panel>a{display:inline-block;margin-top:8px;font-size:7px;font-weight:800;color:#176df0}.booking-readiness-panel>p{font-size:7px;line-height:1.45;color:#718295;margin:8px 0 0}.booking-readiness-summary{margin:10px 0;padding:10px 12px;border:1px solid #dce6ef;border-radius:10px;background:#f9fbfd;font-size:8px;line-height:1.45;color:#607487}.booking-readiness-summary b{color:#173c5f}@media(max-width:900px){.booking-readiness-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.booking-readiness-head{flex-direction:column}.booking-readiness-badge{white-space:normal}.booking-readiness-grid{grid-template-columns:1fr}}`;
    document.head.appendChild(style);
  }
  function ensureSort(){
    const sort=$("sort");if(!sort||[...sort.options].some(o=>o.value==="booking-readiness"))return;
    const o=document.createElement("option");o.value="booking-readiness";o.textContent="Booking readiness · documented fields";sort.appendChild(o);
  }
  let busy=false;
  function decorate(){
    if(busy)return;busy=true;
    try{
      const q=query(),cards=[...grid.querySelectorAll(":scope > .provider-card")];
      cards.forEach(card=>{
        card.querySelector(".booking-readiness-panel")?.remove();
        const p=providerForCard(card);if(!p||!q){delete card.dataset.bookingReadiness;return;}
        const r=readiness(p,q);card.dataset.bookingReadiness=String(r.score);
        const target=card.querySelector(".specialist-access-panel")||card.querySelector(".match-panel")||card.querySelector(".provider-meta");target?.insertAdjacentHTML("afterend",panel(p,q));
      });
      if(q&&$("sort")?.value==="booking-readiness"&&cards.length>1){
        const ordered=[...cards].sort((a,b)=>(Number(b.dataset.bookingReadiness)||0)-(Number(a.dataset.bookingReadiness)||0));
        if(ordered.some((c,i)=>c!==cards[i]))ordered.forEach(c=>grid.appendChild(c));
      }
      let summary=$("bookingReadinessSummary");
      if(!summary){summary=document.createElement("div");summary.id="bookingReadinessSummary";summary.className="booking-readiness-summary";summary.setAttribute("aria-live","polite");document.querySelector(".results-bar")?.insertAdjacentElement("beforebegin",summary);}
      if(!q){summary.hidden=true;return;}summary.hidden=false;
      const rs=cards.map(providerForCard).filter(Boolean).map(p=>readiness(p,q));
      const complete=rs.filter(r=>r.sourceBacked&&r.documented===4).length,partial=rs.filter(r=>r.sourceBacked&&r.documented>0&&r.documented<4).length,unknown=rs.filter(r=>!r.sourceBacked).length;
      summary.innerHTML=`<b>${complete} results have 4/4 service booking fields documented.</b> ${partial} have partial service-level booking documentation · ${unknown} have no source-backed booking requirements for this search. Booking Readiness is documentation completeness only, not booking likelihood or clinical quality.`;
    }finally{busy=false;}
  }
  window.JapanHealthBookingReadiness={readiness};
  ensureStyles();ensureSort();decorate();
  ["q","audience","city","language","coord","referral","sort","verifiedOnly","serviceAudience","serviceReferral","serviceCoordinator"].forEach(id=>$(id)?.addEventListener("input",()=>requestAnimationFrame(decorate)));
  new MutationObserver(()=>requestAnimationFrame(decorate)).observe(grid,{childList:true});
})();
