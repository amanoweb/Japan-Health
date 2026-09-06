(()=>{
  if(window.__JAPAN_HEALTH_HOME_PRODUCT_POLISH__)return;
  window.__JAPAN_HEALTH_HOME_PRODUCT_POLISH__=true;
  const area=document.getElementById('area');
  const form=document.getElementById('careSearchForm');
  const grid=document.getElementById('quickResults');
  if(!area||!form||!grid)return;

  const normalize=v=>String(v||'').trim().toLowerCase();
  const areaAliases=new Map([
    ['ginza','Chuo'],['tsukiji','Chuo'],['nihonbashi','Chuo'],
    ['marunouchi','Chiyoda'],['otemachi','Chiyoda'],['akihabara','Chiyoda'],['tokyo','Chiyoda'],
    ['roppongi','Minato'],['akasaka','Minato'],['shinagawa','Minato'],
    ['shibuya','Shibuya'],['ebisu','Shibuya'],['harajuku','Shibuya'],
    ['shinjuku','Shinjuku'],['kabukicho','Shinjuku'],
    ['ikebukuro','Toshima'],['ueno','Taito'],['asakusa','Taito'],
    ['bunkyo','Bunkyo'],['hongo','Bunkyo']
  ]);

  function canonicalArea(value){
    const raw=normalize(value)
      .replace(/^tokyo\s+/,'')
      .replace(/\s+(station|st\.?|ward|ku)$/,'')
      .replace(/[-‐‑–—]/g,' ')
      .replace(/\s+/g,' ')
      .trim();
    return areaAliases.get(raw)||value.trim();
  }

  function normalizeAreaBeforeSearch(){
    const original=area.value.trim();
    if(!original)return;
    const canonical=canonicalArea(original);
    if(canonical!==original){
      area.dataset.enteredArea=original;
      area.value=canonical;
    } else delete area.dataset.enteredArea;
  }

  form.addEventListener('submit',normalizeAreaBeforeSearch,true);

  const datalist=document.createElement('datalist');
  datalist.id='tokyo-area-suggestions';
  ['Ginza','Shinjuku','Shibuya','Roppongi','Akihabara','Tokyo Station','Marunouchi','Ikebukuro','Ueno','Bunkyo','Tsukiji'].forEach(name=>{
    const option=document.createElement('option');option.value=name;datalist.appendChild(option);
  });
  area.setAttribute('list',datalist.id);
  area.insertAdjacentElement('afterend',datalist);

  function providerForCard(card){
    const name=card.querySelector('h3')?.textContent?.trim();
    return (window.PROVIDERS||[]).find(p=>p.name===name);
  }
  const human=v=>({required:'Required',recommended:'Recommended',optional:'Optional',no:'Not required',varies:'Varies by pathway',unknown:'Needs verification'}[v]||'Needs verification');
  const documented=v=>Boolean(v&&v!=='unknown');
  const isRecorded=v=>Boolean(v&&!/^unknown$/i.test(String(v).trim()));

  function nextStep(p){
    if(p.coordinator==='required')return 'Coordination is required in the current access record.';
    if(p.referral==='required')return 'Prepare the documented referral requirement before booking.';
    if(p.coordinator==='recommended')return 'Coordination is recommended in the current access record.';
    return 'Verify current acceptance and booking route before contacting the provider.';
  }

  function costLedger(p){
    const components=[['Medical',p.medicalCost],['Interpreter',p.interpreterCost],['Coordinator',p.coordinatorCost]];
    const recorded=components.filter(([,value])=>isRecorded(value)).length;
    return `<div class="home-cost-ledger" data-cost-ledger-home><div class="home-cost-head"><div><small>TOTAL-COST VISIBILITY</small><b>${recorded}/3 components recorded</b></div><span>Data completeness only · not a quote</span></div><div class="home-cost-components">${components.map(([label,value])=>`<div><span>${label}</span><strong class="${isRecorded(value)?'recorded':'verify'}">${isRecorded(value)?'Recorded':'Verify'}</strong></div>`).join('')}</div></div>`;
  }

  function currentSearch(){return{query:document.getElementById('careQuery')?.value.trim()||'',area:area.value.trim(),audience:document.getElementById('audienceHome')?.value||'all',language:document.getElementById('languageHome')?.value||'any'}}

  function ensureHandoffDialog(){
    let dialog=document.getElementById('homeAccessHandoff');
    if(dialog)return dialog;
    dialog=document.createElement('dialog');
    dialog.id='homeAccessHandoff';dialog.className='home-handoff-dialog';
    dialog.innerHTML=`<form method="dialog" class="home-handoff-shell" id="homeHandoffForm"><button class="home-handoff-close" value="cancel" aria-label="Close access verification form">×</button><span class="home-handoff-kicker">JAPAN HEALTH ACCESS CHECK</span><h2>Ask Japan Health to verify the access route.</h2><p class="home-handoff-copy">We can pass the selected logistics context to a downstream coordination partner when configured. AMECA is currently a placeholder partner. This is not medical advice or a booking guarantee.</p><div class="home-handoff-selected" id="homeHandoffSelected"></div><label>Name<input id="homeHandoffName" autocomplete="name" required></label><label>Email<input id="homeHandoffEmail" type="email" autocomplete="email" required></label><label class="home-handoff-consent"><input id="homeHandoffConsent" type="checkbox" required><span>I consent to sharing this coordination inquiry with a Japan Health downstream partner if one is configured.</span></label><button class="btn primary full" id="homeHandoffSubmit" type="submit">Send access verification inquiry</button><p class="home-handoff-status" id="homeHandoffStatus" role="status" aria-live="polite"></p></form>`;
    document.body.appendChild(dialog);
    const handoffForm=dialog.querySelector('#homeHandoffForm');
    handoffForm.addEventListener('submit',async e=>{
      e.preventDefault();
      const providerId=dialog.dataset.providerId||'';
      const provider=(window.PROVIDERS||[]).find(p=>String(p.id||'')===providerId);if(!provider)return;
      const name=dialog.querySelector('#homeHandoffName').value.trim(),email=dialog.querySelector('#homeHandoffEmail').value.trim(),consent=dialog.querySelector('#homeHandoffConsent').checked,status=dialog.querySelector('#homeHandoffStatus'),submit=dialog.querySelector('#homeHandoffSubmit');
      if(!name||!email||!consent){status.textContent='Name, email, and partner-sharing consent are required.';return;}
      const s=currentSearch();submit.disabled=true;status.textContent='Sending inquiry…';
      try{
        const response=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,partnerConsent:true,audience:s.audience==='all'?'unknown':s.audience,city:'Tokyo',need:s.query||'Healthcare access verification',notes:`Please verify current access logistics for the selected provider. Area constraint: ${s.area||'Any Tokyo area'}.`,providerId:provider.id||null,providerName:provider.name||null,timeframe:'flexible',contactPreference:'email',sourcePage:`${location.pathname}${location.search}`,accessConstraints:{q:s.query,audience:s.audience==='all'?'unknown':s.audience,city:'Tokyo',language:s.language==='any'?'all':s.language,coordinator:'all',referral:'all'},costSnapshot:{recorded:[provider.medicalCost,provider.interpreterCost,provider.coordinatorCost].filter(isRecorded).length,total:3,missing:[['Medical',provider.medicalCost],['Interpreter',provider.interpreterCost],['Coordinator',provider.coordinatorCost]].filter(([,v])=>!isRecorded(v)).map(([k])=>k),completeness:[provider.medicalCost,provider.interpreterCost,provider.coordinatorCost].filter(isRecorded).length===3?'components-recorded':[provider.medicalCost,provider.interpreterCost,provider.coordinatorCost].filter(isRecorded).length?'partial':'needs-verification',priceTransparency:provider.priceTransparency||'unknown',provenance:provider.recordStatus==='official-source-verified'?'official-source-checked':provider.recordStatus==='demo'?'demo-unverified':'unknown'}})});
        const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(payload.error||'Inquiry could not be sent.');
        status.textContent=payload.forwarded?'Inquiry sent to the configured downstream coordination partner.':'Inquiry accepted. No live downstream partner was contacted.';
        handoffForm.querySelectorAll('input').forEach(input=>{if(input.type==='checkbox')input.checked=false;else input.value='';});
      }catch(error){status.textContent=error?.message||'Inquiry could not be sent. Please try again.';}finally{submit.disabled=false;}
    });
    return dialog;
  }

  function openHandoff(p){const dialog=ensureHandoffDialog(),s=currentSearch();dialog.dataset.providerId=String(p.id||'');dialog.querySelector('#homeHandoffSelected').innerHTML=`<b>${p.name}</b><span>${s.query||'Access verification'}${s.area?` · ${s.area}`:''}${s.audience!=='all'?` · ${s.audience}`:''}</span>`;dialog.querySelector('#homeHandoffStatus').textContent='';if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','')}

  function decorateCards(){
    grid.querySelectorAll('.fast-card').forEach(card=>{
      const p=providerForCard(card);if(!p)return;
      if(!card.querySelector('[data-booking-readiness-home]')){const known=[documented(p.referral),documented(p.coordinator)].filter(Boolean).length,box=document.createElement('div');box.dataset.bookingReadinessHome='true';box.className='home-booking-readiness';box.innerHTML=`<div><small>BOOKING READINESS</small><b>${known}/2 access rules documented</b></div><div class="home-booking-rule"><span>Referral</span><strong>${human(p.referral)}</strong></div><div class="home-booking-rule"><span>Coordinator</span><strong>${human(p.coordinator)}</strong></div><p><b>Next access step:</b> ${nextStep(p)}</p>`;const actions=card.querySelector('.fast-actions');if(actions)actions.before(box);else card.appendChild(box)}
      if(!card.querySelector('[data-cost-ledger-home]')){const readiness=card.querySelector('[data-booking-readiness-home]');readiness?.insertAdjacentHTML('afterend',costLedger(p))}
      const actions=card.querySelector('.fast-actions');if(actions&&!actions.querySelector('[data-access-handoff-home]')){const button=document.createElement('button');button.type='button';button.className='btn ghost';button.dataset.accessHandoffHome='true';button.textContent='Ask Japan Health to verify access';button.addEventListener('click',()=>openHandoff(p));actions.appendChild(button)}
    });
    const summary=document.getElementById('searchSummary');if(summary&&area.dataset.enteredArea){const entered=area.dataset.enteredArea,canonical=area.value;if(summary.dataset.areaExplained!==entered){summary.textContent+=` “${entered}” was matched to ${canonical} for the area constraint.`;summary.dataset.areaExplained=entered;}}
  }

  const style=document.createElement('style');
  style.textContent=`.home-booking-readiness{display:grid;grid-template-columns:1.2fr .9fr .9fr;gap:7px;margin:12px 0;padding:10px;border:1px solid #dfe8f0;border-radius:12px;background:#fbfcfe}.home-booking-readiness small,.home-booking-readiness b,.home-booking-rule span,.home-booking-rule strong{display:block}.home-booking-readiness small{font-size:7px;color:#718295;letter-spacing:.04em}.home-booking-readiness b{font-size:9px;margin-top:3px}.home-booking-rule{padding-left:8px;border-left:1px solid #e5ecf2}.home-booking-rule span{font-size:7px;color:#7b8b99}.home-booking-rule strong{font-size:8px;margin-top:3px}.home-booking-readiness p{grid-column:1/-1;margin:3px 0 0;font-size:8px;line-height:1.45;color:#607487}.home-cost-ledger{margin:10px 0 12px;padding:10px;border:1px solid #dfe8f0;border-radius:12px;background:#fff}.home-cost-head{display:flex;justify-content:space-between;gap:10px;align-items:end}.home-cost-head small,.home-cost-head b{display:block}.home-cost-head small{font-size:7px;color:#718295;letter-spacing:.04em}.home-cost-head b{font-size:9px;margin-top:3px}.home-cost-head>span{font-size:7px;color:#718295}.home-cost-components{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px}.home-cost-components>div{padding:7px;background:#f7fafc;border-radius:8px}.home-cost-components span,.home-cost-components strong{display:block;font-size:7px}.home-cost-components strong{margin-top:3px}.home-cost-components .recorded{color:#176b58}.home-cost-components .verify{color:#8a5a18}.home-handoff-dialog{width:min(560px,calc(100vw - 24px));border:0;border-radius:20px;padding:0;box-shadow:0 24px 70px rgba(19,43,69,.25)}.home-handoff-dialog::backdrop{background:rgba(13,31,48,.48)}.home-handoff-shell{position:relative;padding:24px;display:grid;gap:12px}.home-handoff-shell h2{font-size:24px;margin:0}.home-handoff-kicker{font-size:8px;font-weight:900;letter-spacing:.08em;color:#2155ff}.home-handoff-copy{font-size:10px;line-height:1.55;color:#64748b;margin:0}.home-handoff-selected{padding:10px;border-radius:10px;background:#f4f7fb}.home-handoff-selected b,.home-handoff-selected span{display:block}.home-handoff-selected b{font-size:11px}.home-handoff-selected span{font-size:8px;color:#64748b;margin-top:3px}.home-handoff-shell label{font-size:9px;font-weight:800;color:#53687c}.home-handoff-shell label>input:not([type=checkbox]){width:100%;box-sizing:border-box;height:44px;margin-top:5px;border:1px solid #d7e0e9;border-radius:10px;padding:0 11px}.home-handoff-consent{display:flex;gap:8px;align-items:flex-start;font-weight:600!important;line-height:1.45}.home-handoff-consent input{margin-top:2px}.home-handoff-close{position:absolute;right:14px;top:14px;border:0;background:transparent;font-size:24px;cursor:pointer}.home-handoff-status{min-height:18px;font-size:9px;line-height:1.45;color:#526579;margin:0}@media(max-width:520px){.home-booking-readiness{grid-template-columns:1fr 1fr}.home-booking-readiness>div:first-child{grid-column:1/-1}.home-booking-readiness p{grid-column:1/-1}.home-cost-head{align-items:start;flex-direction:column}.home-cost-components{grid-template-columns:1fr}.home-handoff-dialog{margin:auto 12px 12px}.home-handoff-shell{padding:22px 18px}}`;
  document.head.appendChild(style);
  new MutationObserver(decorateCards).observe(grid,{childList:true,subtree:true});decorateCards();
})();