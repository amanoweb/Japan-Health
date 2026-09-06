(()=>{
  const $=id=>document.getElementById(id);
  const form=$('careSearchForm'),grid=$('quickResults'),summary=$('searchSummary');
  if(!form||!grid||!summary)return;

  const controls={query:$('careQuery'),area:$('area'),audience:$('audienceHome'),language:$('languageHome')};
  const validAudience=new Set(['all','visitor','resident']);
  const validLanguage=new Set(['any','direct','interpreter']);
  let verifiedOnly=false;
  let serviceLanguageOnly=false;

  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const searchOptions=form.querySelector('.search-options');
  const inertSearchType=[...form.querySelectorAll('.field')].find(field=>field.querySelector('span')?.textContent?.trim()==='Search by');
  inertSearchType?.remove();
  if(searchOptions&&!$('commonReasonHome')){
    const reasonField=document.createElement('label');
    reasonField.className='field home-common-reason';
    reasonField.innerHTML=`<span>Common reason for visit</span><select id="commonReasonHome" aria-label="Common reason for visit"><option value="">Choose a common reason…</option><optgroup label="Everyday illness"><option value="Fever">Fever</option><option value="Cold or flu">Cold or flu</option><option value="Cough">Cough</option><option value="Sore throat">Sore throat</option><option value="Headache">Headache</option><option value="Dizziness">Dizziness</option></optgroup><optgroup label="Stomach / digestive"><option value="Stomach pain">Stomach pain</option><option value="Vomiting">Vomiting</option><option value="Diarrhea">Diarrhea</option></optgroup><optgroup label="Dental"><option value="Toothache">Toothache</option><option value="Dental care">General dental care</option></optgroup><optgroup label="Heart"><option value="Chest pain">Chest pain</option><option value="Palpitations">Palpitations</option><option value="Cardiology">Cardiology</option></optgroup><optgroup label="Women's health"><option value="Period or menstrual problem">Period or menstrual problem</option><option value="Women's health">Women's health</option><option value="Fertility / IVF">Fertility / IVF</option></optgroup><optgroup label="Neurology"><option value="Tremor">Tremor</option><option value="Parkinson's disease">Parkinson's disease</option><option value="Neurology">Neurology</option></optgroup><optgroup label="Preventive / planned care"><option value="Health checkup">Health checkup</option><option value="Screening">Screening</option><option value="Cancer second opinion">Cancer second opinion</option><option value="Internal medicine">Internal medicine</option></optgroup></select>`;
    searchOptions.prepend(reasonField);
    reasonField.querySelector('select')?.addEventListener('change',event=>{
      const value=event.target.value;
      if(!value||!controls.query)return;
      controls.query.value=value;
      event.target.value='';
      form.requestSubmit();
    });
  }

  const trustCopy=document.querySelector('.trust-copy');
  if(trustCopy){
    trustCopy.textContent='No clinical-quality ranking is presented on this homepage. Unknown information does not count as a confirmed match. When you require a communication route, you can also require evidence for the requested service itself instead of relying on provider-wide language information. Japan Health is for discovery and access navigation only; it does not diagnose, provide medical advice, or guarantee eligibility, pricing, language ability, availability, or outcomes.';
  }

  const bar=document.createElement('div');
  bar.className='home-search-state';
  bar.innerHTML=`<div class="home-search-state-main"><small>YOUR SEARCH</small><div id="homeSearchChips" class="home-search-chips" aria-live="polite"></div><p id="homeAudienceGuidance" class="home-audience-guidance" role="note"></p></div><div class="home-search-state-actions"><label class="home-verified-toggle"><input id="homeVerifiedOnly" type="checkbox"><span>Official-source checked only</span></label><label class="home-service-language-toggle" id="homeServiceLanguageWrap"><input id="homeServiceLanguageOnly" type="checkbox"><span>Requested-service language evidence only</span></label><button type="button" class="btn ghost home-share-search" id="homeShareSearch">Copy search link</button><button type="button" class="home-reset-search" id="homeResetSearch">Clear</button><span id="homeShareStatus" class="home-share-status" role="status" aria-live="polite"></span></div>`;
  const results=document.getElementById('results');
  results?.insertBefore(bar,results.querySelector('.fast-results-head')?.nextSibling||results.firstChild);

  const chips=$('homeSearchChips'),guidance=$('homeAudienceGuidance'),verifiedToggle=$('homeVerifiedOnly'),serviceToggle=$('homeServiceLanguageOnly'),serviceWrap=$('homeServiceLanguageWrap'),share=$('homeShareSearch'),reset=$('homeResetSearch'),shareStatus=$('homeShareStatus');

  function state(){
    return{
      query:controls.query?.value.trim()||'',
      area:controls.area?.value.trim()||'',
      audience:controls.audience?.value||'all',
      language:controls.language?.value||'any'
    };
  }

  function setUrl(replace=true){
    const s=state(),params=new URLSearchParams();
    if(s.query)params.set('q',s.query);
    if(s.area)params.set('area',s.area);
    if(s.audience!=='all')params.set('audience',s.audience);
    if(s.language!=='any')params.set('language',s.language);
    if(verifiedOnly)params.set('verified','1');
    if(serviceLanguageOnly&&s.language!=='any')params.set('serviceLanguage','1');
    const url=`${location.pathname}${params.toString()?`?${params}`:''}${s.query?'#results':''}`;
    history[replace?'replaceState':'pushState']({},'',url);
  }

  function restore(){
    const params=new URLSearchParams(location.search);
    const q=params.get('q'),area=params.get('area'),audience=params.get('audience'),language=params.get('language');
    if(q&&controls.query)controls.query.value=q;
    if(area&&controls.area)controls.area.value=area;
    if(audience&&validAudience.has(audience)&&controls.audience)controls.audience.value=audience;
    if(language&&validLanguage.has(language)&&controls.language)controls.language.value=language;
    verifiedOnly=params.get('verified')==='1';
    serviceLanguageOnly=params.get('serviceLanguage')==='1'&&controls.language?.value!=='any';
    if(verifiedToggle)verifiedToggle.checked=verifiedOnly;
    if(serviceToggle)serviceToggle.checked=serviceLanguageOnly;
    return Boolean(q);
  }

  function chip(label,value){return `<span><b>${label}</b>${escapeHtml(value)}</span>`;}

  function updateGuidance(){
    const s=state();
    if(!guidance)return;
    const audienceText=s.audience==='visitor'
      ?'Visitor view: prioritize current acceptance, payment pathway and communication logistics before travel or arrival.'
      :s.audience==='resident'
        ?'Resident view: prioritize referral, insurance/pathway and communication logistics before booking.'
        :'Visitor or resident: choose your status when it matters so access rules are not mixed together.';
    const languageText=s.language==='direct'
      ?' Direct physician English is selected; service-level evidence can be required below.'
      :s.language==='interpreter'
        ?' Interpreter-supported access is selected; service-level evidence can be required below.'
        :' Choose a communication requirement if language access is a hard constraint.';
    guidance.textContent=audienceText+languageText;
  }

  function updateServiceToggle(){
    const active=state().language!=='any';
    if(serviceWrap)serviceWrap.hidden=!active;
    if(serviceToggle)serviceToggle.disabled=!active;
    if(!active){serviceLanguageOnly=false;if(serviceToggle)serviceToggle.checked=false;}
  }

  function updateChips(){
    const s=state(),items=[];
    if(s.query)items.push(chip('Need',s.query));
    items.push(chip('Area',s.area||'Any Tokyo area'));
    items.push(chip('Patient',s.audience==='visitor'?'Visitor':s.audience==='resident'?'Resident':'Visitor or resident'));
    items.push(chip('Communication',s.language==='direct'?'Direct physician English':s.language==='interpreter'?'Interpreter acceptable':'Any documented pathway'));
    if(serviceLanguageOnly&&s.language!=='any')items.push(chip('Evidence','Requested service only'));
    if(verifiedOnly)items.push(chip('Sources','Official-source checked only'));
    chips.innerHTML=items.join('');
    updateGuidance();
    updateServiceToggle();
  }

  function hasRequestedServiceLanguageEvidence(card){
    const facts=[...card.querySelectorAll('.fast-facts>div')];
    const languageFact=facts.find(item=>item.querySelector('small')?.textContent?.trim()==='REQUESTED-SERVICE LANGUAGE');
    const value=languageFact?.querySelector('b')?.textContent?.trim()||'';
    return /^Service-level:/i.test(value);
  }

  function applyResultFilters(){
    const cards=[...grid.querySelectorAll('.fast-card')];
    let shown=0;
    for(const card of cards){
      const verified=Boolean(card.querySelector('.record.verified'));
      const serviceOk=!serviceLanguageOnly||state().language==='any'||hasRequestedServiceLanguageEvidence(card);
      card.hidden=(verifiedOnly&&!verified)||!serviceOk;
      if(!card.hidden)shown++;
    }

    let empty=grid.querySelector('[data-home-filter-empty]');
    if(cards.length&&!shown&&(verifiedOnly||serviceLanguageOnly)){
      if(!empty){
        empty=document.createElement('div');
        empty.dataset.homeFilterEmpty='true';
        empty.className='fast-empty';
        grid.appendChild(empty);
      }
      const reasons=[];
      if(verifiedOnly)reasons.push('official-source checked records');
      if(serviceLanguageOnly&&state().language!=='any')reasons.push('requested-service language evidence');
      empty.innerHTML=`<b>No result satisfies the active evidence filter${reasons.length>1?'s':''}.</b><span>The current result set has no provider matching ${escapeHtml(reasons.join(' and '))} together with your other constraints. Japan Health will not promote provider-wide language support to a specialist service or silently relax the filter.</span>`;
    }else empty?.remove();

    if(cards.length&&(verifiedOnly||serviceLanguageOnly)){
      summary.dataset.baseSummary=summary.dataset.baseSummary||summary.textContent;
      const filters=[];
      if(verifiedOnly)filters.push('official-source checked');
      if(serviceLanguageOnly&&state().language!=='any')filters.push('requested-service language evidence');
      summary.textContent=`${shown} result${shown===1?'':'s'} shown with ${filters.join(' + ')} filtering. ${summary.dataset.baseSummary}`;
    }else if(summary.dataset.baseSummary){
      summary.textContent=summary.dataset.baseSummary;
      delete summary.dataset.baseSummary;
    }
  }

  function refresh(){updateChips();applyResultFilters();setUrl(true);}

  form.addEventListener('submit',()=>setTimeout(refresh,0));
  verifiedToggle?.addEventListener('change',()=>{verifiedOnly=verifiedToggle.checked;refresh();});
  serviceToggle?.addEventListener('change',()=>{serviceLanguageOnly=serviceToggle.checked&&state().language!=='any';refresh();});
  ['change','input'].forEach(evt=>{
    controls.area?.addEventListener(evt,()=>{updateChips();setUrl(true);});
    controls.audience?.addEventListener(evt,()=>{updateChips();setUrl(true);});
    controls.language?.addEventListener(evt,()=>{
      updateChips();
      setTimeout(()=>{applyResultFilters();setUrl(true);},0);
    });
  });

  share?.addEventListener('click',async()=>{
    setUrl(true);
    try{await navigator.clipboard.writeText(location.href);shareStatus.textContent='Search link copied.';}
    catch{shareStatus.textContent='Copy failed — use the browser address bar.';}
    setTimeout(()=>{shareStatus.textContent='';},2200);
  });

  reset?.addEventListener('click',()=>{
    if(controls.query)controls.query.value='';
    if(controls.area)controls.area.value='';
    if(controls.audience)controls.audience.value='all';
    if(controls.language)controls.language.value='any';
    verifiedOnly=false;serviceLanguageOnly=false;
    if(verifiedToggle)verifiedToggle.checked=false;
    if(serviceToggle)serviceToggle.checked=false;
    history.replaceState({},'',location.pathname);
    updateChips();
    grid.innerHTML='';
    summary.textContent='Choose a common reason for care or describe what you need.';
    document.getElementById('search')?.scrollIntoView({behavior:'smooth'});
    controls.query?.focus();
  });

  new MutationObserver(()=>{
    summary.dataset.baseSummary='';
    applyResultFilters();
  }).observe(grid,{childList:true,subtree:false});

  const style=document.createElement('style');
  style.textContent=`.search-options{grid-template-columns:repeat(2,minmax(0,1fr))}.home-common-reason select{font-weight:700;color:#334a62}.access-score-home,.access-method-home,.access-breakdown-home{display:none!important}.home-search-state{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;margin:-4px 0 18px;padding:12px 14px;border:1px solid #dfe6ee;border-radius:14px;background:#fbfcfe}.home-search-state-main{min-width:0;flex:1}.home-search-state-main small{display:block;font-size:7px;font-weight:900;letter-spacing:.08em;color:#718295;margin-bottom:6px}.home-search-chips{display:flex;gap:6px;flex-wrap:wrap}.home-search-chips span{display:inline-flex;gap:4px;align-items:center;padding:6px 8px;border-radius:999px;background:#eef3ff;color:#35528c;font-size:8px}.home-search-chips b{font-size:7px;text-transform:uppercase;letter-spacing:.04em}.home-audience-guidance{margin:8px 0 0;font-size:8px;line-height:1.5;color:#617487;max-width:720px}.home-search-state-actions{display:flex;align-items:center;gap:9px;flex-wrap:wrap;justify-content:flex-end;max-width:480px}.home-verified-toggle,.home-service-language-toggle{display:flex;align-items:flex-start;gap:6px;font-size:8px;font-weight:800;color:#526579;line-height:1.35}.home-verified-toggle input,.home-service-language-toggle input{margin-top:1px}.home-service-language-toggle[hidden]{display:none!important}.home-share-search{padding:8px 10px!important;font-size:8px!important}.home-reset-search{border:0;background:transparent;color:#526579;font-size:8px;font-weight:900;cursor:pointer;padding:8px}.home-reset-search:hover{text-decoration:underline}.home-share-status{font-size:8px;color:#526579;min-width:92px}@media(max-width:760px){.search-options{grid-template-columns:1fr}.home-search-state{align-items:stretch;flex-direction:column}.home-search-state-actions{justify-content:flex-start;max-width:none}.home-share-status{min-width:0}.home-service-language-toggle{width:100%}}`;
  document.head.appendChild(style);

  const hadQuery=restore();
  updateChips();
  if(hadQuery)setTimeout(()=>{form.requestSubmit();applyResultFilters();},0);
  else applyResultFilters();
})();