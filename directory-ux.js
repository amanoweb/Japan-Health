(()=>{
  if(window.__JH_DIRECTORY_UX__)return;
  window.__JH_DIRECTORY_UX__=true;

  const human=v=>({
    yes:'Yes',no:'No',partial:'Partial',limited:'Limited',available:'Available',
    required:'Required',recommended:'Recommended',optional:'Optional',unknown:'Needs verification',
    varies:'Varies by pathway',external:'External arrangement'
  }[v]||'Needs verification');

  const recorded=v=>Boolean(v&&!/^unknown$/i.test(String(v).trim()));
  const normalize=v=>String(v||'').trim().toLowerCase();
  const initialParams=new URLSearchParams(location.search);
  let selectedArea=(initialParams.get('area')||'').trim();

  function addStyles(){
    if(document.getElementById('jh-directory-ux-styles'))return;
    const style=document.createElement('style');
    style.id='jh-directory-ux-styles';
    style.textContent=`
      .directory-primary-note{margin:8px 0 10px;font-size:10px;line-height:1.5;color:#64748b}
      .directory-area-filter{display:grid;gap:5px;min-width:180px;font-size:8px;font-weight:900;color:#657789}
      .directory-area-filter select{width:100%;min-height:44px}
      .directory-area-chip{display:inline-flex;align-items:center;gap:7px;margin:0 0 10px;padding:7px 10px;border-radius:999px;background:#eef3ff;color:#35528c;font-size:9px;font-weight:900}
      .directory-area-chip button{border:0;background:transparent;color:inherit;font:inherit;cursor:pointer;padding:0}
      .directory-more-filters{margin:10px 0 14px;border:1px solid #dfe6ee;border-radius:12px;background:#fbfcfe}
      .directory-more-filters>summary{cursor:pointer;padding:11px 13px;font-size:10px;font-weight:900;color:#41566b;list-style:none}
      .directory-more-filters>summary::-webkit-details-marker{display:none}
      .directory-more-filters>summary:after{content:'+';float:right;font-size:15px;line-height:1}
      .directory-more-filters[open]>summary:after{content:'−'}
      .directory-more-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;padding:0 12px 12px}
      .directory-more-field{display:grid;gap:5px;font-size:8px;font-weight:900;color:#657789}
      .directory-more-field select{width:100%;min-height:44px}
      .provider-grid{grid-template-columns:1fr!important;gap:12px!important}
      .provider-card{padding:18px 20px!important;border-radius:16px!important}
      .provider-card h3{font-size:20px;margin:7px 0 5px}
      .provider-card .provider-meta{font-size:10px;line-height:1.5;color:#64748b}
      .provider-card .badge-row{margin-top:10px}
      .provider-card>.match-panel,
      .provider-card>.score-row,
      .provider-card>.score-breakdown,
      .provider-card>.provider-gridline,
      .provider-card>.cost-grid,
      .provider-card>.published-cost,
      .provider-card>.evidence-row,
      .provider-card>.evidence-note,
      .provider-card>.source-line{display:none!important}
      .provider-card>p{display:none!important}
      .provider-card .provider-actions{margin-top:14px;display:flex;gap:8px;flex-wrap:wrap}
      .provider-card .provider-actions .small-btn:first-child{font-weight:900}
      .directory-card-helper{margin:10px 0 0;font-size:9px;line-height:1.5;color:#718295}
      .clinic-detail-intro{margin:10px 0 2px;font-size:9px;line-height:1.55;color:#64748b}
      .clinic-essentials{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:14px 0}
      .clinic-essential{padding:11px;border:1px solid #e1e8ef;border-radius:11px;background:#f8fafc}
      .clinic-essential small,.clinic-essential b{display:block}
      .clinic-essential small{font-size:7px;letter-spacing:.05em;color:#718295}
      .clinic-essential b{font-size:10px;line-height:1.4;margin-top:4px;color:#263b50}
      .clinic-essential.booking{grid-column:1/-1;background:#f5f8ff;border-color:#d9e2ff}
      .clinic-essential.booking b{font-size:11px}
      .clinic-detail-more{margin:14px 0;border:1px solid #dfe6ee;border-radius:12px;background:#fff}
      .clinic-detail-more>summary{cursor:pointer;padding:12px 13px;font-size:10px;font-weight:900;color:#35528c;list-style:none}
      .clinic-detail-more>summary::-webkit-details-marker{display:none}
      .clinic-detail-more>summary:after{content:'View';float:right;font-size:8px;color:#718295}
      .clinic-detail-more[open]>summary:after{content:'Hide'}
      .clinic-detail-more-body{padding:0 13px 13px}
      .clinic-handoff-note{margin:8px 0 0;font-size:8px;line-height:1.5;color:#718295}
      @media(max-width:700px){
        .directory-more-grid,.clinic-essentials{grid-template-columns:1fr}
        .clinic-essential.booking{grid-column:auto}
        .directory-more-filters>summary,.clinic-detail-more>summary{min-height:44px;display:flex;align-items:center;justify-content:space-between}
        .provider-card{padding:16px!important}
        .provider-card .provider-actions{display:grid;grid-template-columns:1fr}
      }
    `;
    document.head.appendChild(style);
  }

  function syncAreaUrl(){
    const params=new URLSearchParams(location.search);
    if(selectedArea)params.set('area',selectedArea);else params.delete('area');
    history.replaceState(null,'',`${location.pathname}${params.size?`?${params}`:''}${location.hash}`);
  }

  function areaOptions(){
    return [...new Set((window.PROVIDERS||[]).filter(p=>p.city==='Tokyo'&&p.area).map(p=>String(p.area).trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  }

  function applyAreaFilter(){
    const grid=document.getElementById('providerGrid');
    if(!grid)return;
    if(!selectedArea){updateAreaChip();return;}
    const providers=window.PROVIDERS||[];
    let visible=0,verified=0;
    grid.querySelectorAll('.provider-card').forEach(card=>{
      const name=card.querySelector('h3')?.textContent?.trim();
      const provider=providers.find(p=>p.name===name);
      const match=provider&&normalize(provider.area)===normalize(selectedArea);
      if(!match)card.remove();
      else{
        visible++;
        if(provider.recordStatus==='official-source-verified')verified++;
      }
    });
    const count=document.getElementById('resultCount');
    if(count)count.textContent=`${visible} options in ${selectedArea} · ${verified} official-source checked`;
    if(!visible&&grid&&!grid.querySelector('.empty-state')){
      grid.innerHTML='<div class="empty-state"><h3>No match in this Tokyo area.</h3><p>Japan Health keeps the selected area and other access requirements instead of silently widening the search.</p><button class="small-btn primary" type="button" data-clear-area>Search all Tokyo areas</button></div>';
      grid.querySelector('[data-clear-area]')?.addEventListener('click',()=>setArea(''));
    }
    updateAreaChip();
  }

  function setArea(value){
    selectedArea=String(value||'').trim();
    const select=document.getElementById('directoryArea');
    if(select&&select.value!==selectedArea)select.value=selectedArea;
    syncAreaUrl();
    if(typeof render==='function')render();
    queueMicrotask(applyAreaFilter);
  }

  function updateAreaChip(){
    const anchor=document.getElementById('activeConstraintSummary');
    if(!anchor)return;
    let chip=document.getElementById('directoryAreaChip');
    if(!selectedArea){chip?.remove();return;}
    if(!chip){
      chip=document.createElement('span');
      chip.id='directoryAreaChip';
      chip.className='directory-area-chip';
      anchor.insertAdjacentElement('afterend',chip);
    }
    chip.innerHTML=`Tokyo area: ${selectedArea} <button type="button" aria-label="Clear Tokyo area filter">×</button>`;
    chip.querySelector('button')?.addEventListener('click',()=>setArea(''));
  }

  function simplifyFilters(){
    const filters=document.querySelector('.finder .filters');
    if(!filters||document.querySelector('.directory-more-filters'))return;
    const q=document.getElementById('q');
    const audience=document.getElementById('audience');
    const language=document.getElementById('language');
    const city=document.getElementById('city');
    const coord=document.getElementById('coord');
    const referral=document.getElementById('referral');
    if(!q||!audience||!language||!city||!coord||!referral)return;

    [q,audience,language].forEach(el=>filters.appendChild(el));
    const note=document.createElement('p');
    note.className='directory-primary-note';
    note.textContent='Start with what you need, Visitor or Resident, and communication. Tokyo area stays a hard location filter when selected.';
    filters.after(note);

    const more=document.createElement('details');
    more.className='directory-more-filters';
    more.innerHTML='<summary>More access filters</summary><div class="directory-more-grid"></div>';
    const grid=more.querySelector('.directory-more-grid');

    const areaWrap=document.createElement('label');
    areaWrap.className='directory-area-filter';
    areaWrap.innerHTML='<span>Tokyo area</span><select id="directoryArea" aria-label="Tokyo area"><option value="">All Tokyo areas</option></select>';
    const areaSelect=areaWrap.querySelector('select');
    areaOptions().forEach(area=>{
      const option=document.createElement('option');
      option.value=area;option.textContent=area;areaSelect.appendChild(option);
    });
    if(selectedArea&&![...areaSelect.options].some(o=>normalize(o.value)===normalize(selectedArea))){
      const option=document.createElement('option');option.value=selectedArea;option.textContent=selectedArea;areaSelect.appendChild(option);
    }
    areaSelect.value=selectedArea;
    areaSelect.addEventListener('change',()=>setArea(areaSelect.value));
    grid.appendChild(areaWrap);

    const items=[['City',city],['Coordinator',coord],['Referral',referral]];
    for(const [label,select] of items){
      const wrap=document.createElement('label');
      wrap.className='directory-more-field';
      const text=document.createElement('span');
      text.textContent=label;
      wrap.append(text,select);
      grid.appendChild(wrap);
    }
    note.after(more);

    ['q','audience','city','language','coord','referral','sort','verifiedOnly'].forEach(id=>{
      document.getElementById(id)?.addEventListener('input',()=>queueMicrotask(()=>{syncAreaUrl();applyAreaFilter();}));
    });
  }

  function communicationLabel(p){
    if(p.doctorEnglish==='yes')return 'Provider record: direct physician English';
    if(['yes','available'].includes(p.interpreter))return 'Provider record: interpreter pathway';
    if(p.interpreter==='external')return 'Provider record: external interpreter arrangement';
    if(['partial','limited'].includes(p.doctorEnglish))return `Provider record: physician English ${p.doctorEnglish}`;
    return 'Communication route needs verification';
  }

  function audienceLabel(p){
    const a=Array.isArray(p.audience)?p.audience:[];
    if(a.includes('visitor')&&a.includes('resident'))return 'Visitor + Resident pathways in record';
    if(a.includes('visitor'))return 'Visitor pathway in record';
    if(a.includes('resident'))return 'Resident pathway in record';
    return 'Visitor / Resident pathway needs verification';
  }

  function bookingStartLabel(p){
    if(p.coordinator==='required')return 'Start by confirming the coordinator pathway before trying to book directly.';
    if(p.referral==='required')return 'A referral is recorded as required; confirm the referral route before booking.';
    if(p.coordinator==='recommended')return 'A coordinator is recorded as recommended; confirm whether direct booking is accepted for your visit.';
    if(p.referral==='varies'||p.coordinator==='varies')return 'Booking rules vary by pathway; confirm the current route for the service you need.';
    if(p.referral==='no'&&p.coordinator==='no')return 'No referral or coordinator requirement is recorded; confirm the clinic’s current booking method before proceeding.';
    return 'Current booking method needs verification with the clinic or coordination pathway.';
  }

  function simplifyProviderCards(){
    const grid=document.getElementById('providerGrid');
    if(!grid)return;
    grid.querySelectorAll('.provider-card').forEach(card=>{
      if(card.dataset.directorySimplified==='1')return;
      card.dataset.directorySimplified='1';
      const actions=card.querySelector('.provider-actions');
      if(actions){
        const buttons=actions.querySelectorAll('button');
        if(buttons[0])buttons[0].textContent='View clinic';
        if(buttons[1])buttons[1].textContent='Need access help?';
      }
      if(!card.querySelector('.directory-card-helper')){
        const helper=document.createElement('p');
        helper.className='directory-card-helper';
        helper.textContent='Open this clinic to review referral, cost, source evidence and booking-access details. These logistics do not rank clinical quality.';
        if(actions)actions.before(helper);else card.appendChild(helper);
      }
    });
    applyAreaFilter();
  }

  function enhanceProviderDetail(){
    const root=document.getElementById('providerDetail');
    if(!root||root.dataset.simplified==='1'||root.querySelector('.clinic-essentials'))return;
    const title=root.querySelector('h2');
    if(!title)return;
    const provider=(window.PROVIDERS||[]).find(p=>p.name===title.textContent.trim());
    if(!provider)return;

    const meta=root.querySelector('.provider-meta');
    const action=[...root.querySelectorAll('button')].find(b=>/coordinator/i.test(b.textContent||''));
    if(!meta||!action)return;
    root.dataset.simplified='1';

    const intro=document.createElement('p');
    intro.className='clinic-detail-intro';
    intro.textContent='Start with the access facts most likely to affect whether you can use this clinic. These are record-based logistics, not medical advice or a guarantee of appointment availability.';
    meta.after(intro);

    const costCount=[provider.medicalCost,provider.interpreterCost,provider.coordinatorCost].filter(recorded).length;
    const essentials=document.createElement('div');
    essentials.className='clinic-essentials';
    essentials.setAttribute('aria-label','Access essentials');
    essentials.innerHTML=`
      <div class="clinic-essential"><small>ENGLISH / COMMUNICATION</small><b>${communicationLabel(provider)}</b></div>
      <div class="clinic-essential"><small>VISITOR / RESIDENT</small><b>${audienceLabel(provider)}</b></div>
      <div class="clinic-essential"><small>REFERRAL</small><b>${human(provider.referral)}</b></div>
      <div class="clinic-essential"><small>COST INFO</small><b>${costCount}/3 cost components recorded · data completeness only</b></div>
      <div class="clinic-essential booking"><small>HOW TO START</small><b>${bookingStartLabel(provider)}</b></div>`;
    intro.after(essentials);

    const details=document.createElement('details');
    details.className='clinic-detail-more';
    details.innerHTML='<summary>More access details, cost data & source evidence</summary><div class="clinic-detail-more-body"></div>';
    const body=details.querySelector('.clinic-detail-more-body');
    let node=essentials.nextSibling;
    while(node&&node!==action){
      const next=node.nextSibling;
      body.appendChild(node);
      node=next;
    }
    action.before(details);
    action.textContent='Ask Japan Health for access help';
    const note=document.createElement('p');
    note.className='clinic-handoff-note';
    note.textContent='Coordination may be routed to a downstream partner, including AMECA when configured. This is not a clinical recommendation, booking guarantee, or confirmation of current availability.';
    action.after(note);
  }

  addStyles();
  const init=()=>{simplifyFilters();simplifyProviderCards();enhanceProviderDetail();syncAreaUrl();applyAreaFilter();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();

  const grid=document.getElementById('providerGrid');
  if(grid)new MutationObserver(()=>simplifyProviderCards()).observe(grid,{childList:true});

  const detail=document.getElementById('providerDetail');
  if(detail)new MutationObserver(()=>{
    if(!detail.querySelector('h2')||detail.querySelector('.clinic-essentials'))return;
    detail.dataset.simplified='';
    enhanceProviderDetail();
  }).observe(detail,{childList:true});
})();
