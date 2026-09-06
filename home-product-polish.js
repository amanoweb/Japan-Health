(()=>{
  if(window.__JAPAN_HEALTH_HOME_PRODUCT_POLISH__)return;
  window.__JAPAN_HEALTH_HOME_PRODUCT_POLISH__=true;

  const area=document.getElementById('area');
  const form=document.getElementById('careSearchForm');
  const grid=document.getElementById('quickResults');
  const careQuery=document.getElementById('careQuery');
  if(!area||!form||!grid||!careQuery)return;

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

  form.addEventListener('submit',()=>{
    const original=area.value.trim();
    if(!original)return;
    const canonical=canonicalArea(original);
    if(canonical!==original){
      area.dataset.enteredArea=original;
      area.value=canonical;
    }else delete area.dataset.enteredArea;
  },true);

  const urgentTerms=[
    'chest pain','difficulty breathing','trouble breathing','shortness of breath',
    'cannot breathe','can\'t breathe','stroke','face droop','arm weakness',
    'slurred speech','unconscious','unresponsive','severe bleeding','heavy bleeding',
    'seizure','convulsion'
  ];
  const urgentNotice=document.createElement('aside');
  urgentNotice.className='home-urgent-notice';
  urgentNotice.hidden=true;
  urgentNotice.setAttribute('role','alert');
  urgentNotice.innerHTML='<div><strong>This may need urgent care.</strong><span>Japan Health is not an emergency-triage service. If you think this could be a medical emergency in Japan, call 119 or go to an emergency department.</span></div><a class="home-urgent-call" href="tel:119" aria-label="Call emergency services in Japan at 119">Call 119</a>';
  form.insertAdjacentElement('afterend',urgentNotice);

  function updateUrgentNotice(){
    const query=normalize(careQuery.value);
    urgentNotice.hidden=!urgentTerms.some(term=>query.includes(term));
  }
  careQuery.addEventListener('input',updateUrgentNotice);
  form.addEventListener('submit',updateUrgentNotice,true);
  updateUrgentNotice();

  const datalist=document.createElement('datalist');
  datalist.id='tokyo-area-suggestions';
  ['Ginza','Shinjuku','Shibuya','Roppongi','Akihabara','Tokyo Station','Marunouchi','Ikebukuro','Ueno','Bunkyo','Tsukiji'].forEach(name=>{
    const option=document.createElement('option');
    option.value=name;
    datalist.appendChild(option);
  });
  area.setAttribute('list',datalist.id);
  area.insertAdjacentElement('afterend',datalist);

  const isRecorded=v=>Boolean(v&&!/^unknown$/i.test(String(v).trim()));
  const currentSearch=()=>({
    query:careQuery.value.trim(),
    area:area.value.trim(),
    audience:document.getElementById('audienceHome')?.value||'all',
    language:document.getElementById('languageHome')?.value||'any'
  });

  function compactAccessSignals(card,provider){
    if(card.querySelector('[data-home-access-signals]'))return;
    const facts=[...card.querySelectorAll('.fast-facts>div')];
    const languageFact=facts.find(item=>item.querySelector('small')?.textContent?.trim()==='REQUESTED-SERVICE LANGUAGE');
    const languageText=languageFact?.querySelector('b')?.textContent?.trim()||'';
    let communication='Communication needs verification';
    let communicationClass='verify';
    if(/^Service-level:/i.test(languageText)){
      communication=languageText.replace(/^Service-level:\s*/i,'');
      communicationClass='documented';
    }else if(/^Provider-level only:/i.test(languageText)){
      communication=languageText.replace(/^Provider-level only:\s*/i,'');
      communicationClass='provider';
    }

    const s=currentSearch();
    let pathway='Visitor / resident pathway not selected';
    let pathwayClass='neutral';
    if(s.audience==='visitor'){
      pathway=Array.isArray(provider.audience)&&provider.audience.includes('visitor')?'Visitor pathway in record':'Visitor pathway needs verification';
      pathwayClass=pathway.includes('in record')?'documented':'verify';
    }else if(s.audience==='resident'){
      pathway=Array.isArray(provider.audience)&&provider.audience.includes('resident')?'Resident pathway in record':'Resident pathway needs verification';
      pathwayClass=pathway.includes('in record')?'documented':'verify';
    }else if(Array.isArray(provider.audience)&&provider.audience.length){
      pathway=provider.audience.includes('visitor')&&provider.audience.includes('resident')?'Visitor + resident pathways in record':provider.audience.includes('visitor')?'Visitor pathway in record':'Resident pathway in record';
      pathwayClass='provider';
    }

    const strip=document.createElement('div');
    strip.className='home-access-signals';
    strip.dataset.homeAccessSignals='true';
    strip.setAttribute('aria-label','Access information');
    strip.innerHTML=`<span class="${communicationClass}">${communication}</span><span class="${pathwayClass}">${pathway}</span>`;
    const actions=card.querySelector('.fast-actions');
    if(actions)actions.before(strip);else card.appendChild(strip);
  }

  function ensureDialog(){
    let dialog=document.getElementById('homeAccessHandoff');
    if(dialog)return dialog;
    dialog=document.createElement('dialog');
    dialog.id='homeAccessHandoff';
    dialog.className='home-handoff-dialog';
    dialog.innerHTML=`<form method="dialog" class="home-handoff-shell" id="homeHandoffForm"><button class="home-handoff-close" value="cancel" aria-label="Close access verification form">×</button><span class="home-handoff-kicker">JAPAN HEALTH ACCESS CHECK</span><h2>Need help confirming access?</h2><p class="home-handoff-copy">Japan Health can collect your access question and pass it to a configured downstream coordination partner when appropriate. AMECA remains a downstream partner. This is not medical advice or a booking guarantee.</p><div class="home-handoff-selected" id="homeHandoffSelected"></div><label>Name<input id="homeHandoffName" autocomplete="name" required></label><label>Email<input id="homeHandoffEmail" type="email" autocomplete="email" required></label><label class="home-handoff-consent"><input id="homeHandoffConsent" type="checkbox" required><span>I consent to sharing this coordination inquiry with a Japan Health downstream partner if one is configured.</span></label><button class="btn primary full" id="homeHandoffSubmit" type="submit">Send access question</button><p class="home-handoff-status" id="homeHandoffStatus" role="status" aria-live="polite"></p></form>`;
    document.body.appendChild(dialog);

    const handoffForm=dialog.querySelector('#homeHandoffForm');
    handoffForm.addEventListener('submit',async event=>{
      event.preventDefault();
      const provider=(window.PROVIDERS||[]).find(p=>String(p.id||'')===dialog.dataset.providerId);
      if(!provider)return;
      const name=dialog.querySelector('#homeHandoffName').value.trim();
      const email=dialog.querySelector('#homeHandoffEmail').value.trim();
      const consent=dialog.querySelector('#homeHandoffConsent').checked;
      const status=dialog.querySelector('#homeHandoffStatus');
      const submit=dialog.querySelector('#homeHandoffSubmit');
      if(!name||!email||!consent){status.textContent='Name, email, and partner-sharing consent are required.';return;}

      const s=currentSearch();
      const costs=[['Medical',provider.medicalCost],['Interpreter',provider.interpreterCost],['Coordinator',provider.coordinatorCost]];
      submit.disabled=true;
      status.textContent='Sending…';
      try{
        const response=await fetch('/api/lead',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            name,email,partnerConsent:true,
            audience:s.audience==='all'?'unknown':s.audience,
            city:'Tokyo',
            need:s.query||'Healthcare access verification',
            notes:`Please verify current access logistics for the selected provider. Area constraint: ${s.area||'Any Tokyo area'}. Communication requirement: ${s.language==='any'?'Any documented pathway':s.language}. Provider record status: ${provider.recordStatus||'unknown'}.`,
            providerId:provider.id||null,
            providerName:provider.name||null,
            timeframe:'flexible',
            contactPreference:'email',
            sourcePage:`${location.pathname}${location.search}`,
            accessConstraints:{q:s.query,audience:s.audience==='all'?'unknown':s.audience,city:'Tokyo',language:s.language==='any'?'all':s.language,coordinator:'all',referral:'all'},
            costSnapshot:{
              recorded:costs.filter(([,v])=>isRecorded(v)).length,
              total:3,
              missing:costs.filter(([,v])=>!isRecorded(v)).map(([label])=>label),
              completeness:costs.every(([,v])=>isRecorded(v))?'components-recorded':costs.some(([,v])=>isRecorded(v))?'partial':'needs-verification',
              priceTransparency:provider.priceTransparency||'unknown',
              provenance:provider.recordStatus==='official-source-verified'?'official-source-checked':provider.recordStatus==='demo'?'demo-unverified':'unknown'
            }
          })
        });
        const payload=await response.json().catch(()=>({}));
        if(!response.ok)throw new Error(payload.error||'Inquiry could not be sent.');
        status.textContent=payload.forwarded?'Access question sent to the configured downstream partner.':'Access question received. No live downstream partner was contacted.';
      }catch(error){
        status.textContent=error?.message||'Inquiry could not be sent. Please try again.';
      }finally{
        submit.disabled=false;
      }
    });
    return dialog;
  }

  function openHandoff(provider){
    const dialog=ensureDialog(),s=currentSearch();
    dialog.dataset.providerId=String(provider.id||'');
    const selected=dialog.querySelector('#homeHandoffSelected');
    selected.innerHTML='';
    const strong=document.createElement('b');strong.textContent=provider.name;
    const context=document.createElement('span');context.textContent=[s.query,s.area,s.audience!=='all'?s.audience:''].filter(Boolean).join(' · ')||'Access verification';
    selected.append(strong,context);
    dialog.querySelector('#homeHandoffStatus').textContent='';
    if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
  }

  function decorate(){
    const cards=[...grid.querySelectorAll('.fast-card')];
    cards.forEach((card,index)=>{
      card.hidden=index>=3;
      const name=card.querySelector('h3')?.textContent?.trim();
      const provider=(window.PROVIDERS||[]).find(p=>p.name===name);
      const actions=card.querySelector('.fast-actions');
      if(!provider)return;
      compactAccessSignals(card,provider);
      const primary=actions?.querySelector('.btn.primary');
      if(primary)primary.textContent='View clinic';
      if(!actions||actions.querySelector('[data-access-handoff-home]'))return;
      const button=document.createElement('button');
      button.type='button';
      button.className='btn ghost';
      button.dataset.accessHandoffHome='true';
      button.textContent='Need help accessing this?';
      button.addEventListener('click',()=>openHandoff(provider));
      actions.appendChild(button);
    });

    let note=grid.querySelector('[data-home-three-note]');
    if(cards.length>3){
      if(!note){
        note=document.createElement('div');
        note.className='home-three-note';
        note.dataset.homeThreeNote='true';
        grid.appendChild(note);
      }
      note.innerHTML='<span>Showing 3 strongest access matches from the current search. This is not a clinical-quality ranking.</span><a href="/clinics.html">See all matching clinics →</a>';
    }else note?.remove();
  }

  new MutationObserver(decorate).observe(grid,{childList:true,subtree:true});
  decorate();

  const style=document.createElement('style');
  style.textContent=`.home-access-signals{display:flex;gap:7px;flex-wrap:wrap;margin:14px 0 2px}.home-access-signals span{display:inline-flex;align-items:center;min-height:28px;padding:5px 9px;border-radius:999px;font-size:9px;font-weight:800;line-height:1.25}.home-access-signals .documented{background:#e9f7f2;color:#176b58}.home-access-signals .provider{background:#eef3ff;color:#35528c}.home-access-signals .verify{background:#fff4df;color:#8a5a18}.home-access-signals .neutral{background:#f3f5f7;color:#637487}.home-three-note{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 14px;border:1px solid #dfe6ee;border-radius:12px;background:#fbfcfe;color:#637487;font-size:10px}.home-three-note a{font-weight:900;color:#35528c;text-decoration:none;white-space:nowrap}.home-urgent-notice{max-width:calc(1180px - 56px);margin:12px auto 0;padding:14px 16px;border:1px solid #f0b8a8;border-radius:14px;background:#fff7f4;color:#713220;display:flex;align-items:center;justify-content:space-between;gap:16px}.home-urgent-notice[hidden]{display:none!important}.home-urgent-notice div{display:grid;gap:3px}.home-urgent-notice strong{font-size:12px}.home-urgent-notice span{font-size:10px;line-height:1.5;color:#7a493a}.home-urgent-call{flex:0 0 auto;border-radius:10px;padding:10px 14px;background:#a52d1d;color:#fff;text-decoration:none;font-size:11px;font-weight:900}.home-handoff-dialog{width:min(520px,calc(100vw - 24px));border:0;border-radius:18px;padding:0;box-shadow:0 24px 70px rgba(19,43,69,.25)}.home-handoff-dialog::backdrop{background:rgba(13,31,48,.48)}.home-handoff-shell{position:relative;padding:24px;display:grid;gap:12px}.home-handoff-shell h2{font-size:24px;margin:0}.home-handoff-kicker{font-size:8px;font-weight:900;letter-spacing:.08em;color:#2155ff}.home-handoff-copy{font-size:10px;line-height:1.55;color:#64748b;margin:0}.home-handoff-selected{padding:10px;border-radius:10px;background:#f4f7fb}.home-handoff-selected b,.home-handoff-selected span{display:block}.home-handoff-selected b{font-size:11px}.home-handoff-selected span{font-size:8px;color:#64748b;margin-top:3px}.home-handoff-shell label{font-size:9px;font-weight:800;color:#53687c}.home-handoff-shell label>input:not([type=checkbox]){width:100%;box-sizing:border-box;height:44px;margin-top:5px;border:1px solid #d7e0e9;border-radius:10px;padding:0 11px}.home-handoff-consent{display:flex;gap:8px;align-items:flex-start;font-weight:600!important;line-height:1.45}.home-handoff-close{position:absolute;right:14px;top:14px;border:0;background:transparent;font-size:24px;cursor:pointer}.home-handoff-status{min-height:18px;font-size:9px;line-height:1.45;color:#526579;margin:0}@media(max-width:700px){.home-three-note{align-items:flex-start;flex-direction:column}.home-urgent-notice{margin:12px 20px 0;align-items:flex-start}.home-urgent-call{margin-top:1px}}@media(max-width:520px){.home-access-signals{display:grid;grid-template-columns:1fr}.home-access-signals span{border-radius:10px}.home-urgent-notice{flex-direction:column}.home-urgent-call{width:100%;box-sizing:border-box;text-align:center}.home-handoff-dialog{margin:auto 12px 12px}.home-handoff-shell{padding:22px 18px}}`;
  document.head.appendChild(style);
})();