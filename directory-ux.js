(()=>{
  if(window.__JH_DIRECTORY_UX__)return;
  window.__JH_DIRECTORY_UX__=true;

  const human=v=>({
    yes:'Yes',no:'No',partial:'Partial',limited:'Limited',available:'Available',
    required:'Required',recommended:'Recommended',optional:'Optional',unknown:'Needs verification',
    varies:'Varies by pathway',external:'External arrangement'
  }[v]||'Needs verification');

  const recorded=v=>Boolean(v&&!/^unknown$/i.test(String(v).trim()));

  function addStyles(){
    if(document.getElementById('jh-directory-ux-styles'))return;
    const style=document.createElement('style');
    style.id='jh-directory-ux-styles';
    style.textContent=`
      .directory-primary-note{margin:8px 0 10px;font-size:10px;line-height:1.5;color:#64748b}
      .directory-more-filters{margin:10px 0 14px;border:1px solid #dfe6ee;border-radius:12px;background:#fbfcfe}
      .directory-more-filters>summary{cursor:pointer;padding:11px 13px;font-size:10px;font-weight:900;color:#41566b;list-style:none}
      .directory-more-filters>summary::-webkit-details-marker{display:none}
      .directory-more-filters>summary:after{content:'+';float:right;font-size:15px;line-height:1}
      .directory-more-filters[open]>summary:after{content:'−'}
      .directory-more-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;padding:0 12px 12px}
      .directory-more-field{display:grid;gap:5px;font-size:8px;font-weight:900;color:#657789}
      .directory-more-field select{width:100%;min-height:44px}
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
      }
    `;
    document.head.appendChild(style);
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
    note.textContent='Start with what you need, Visitor or Resident, and communication. Open more filters only when referral, coordinator, or city rules matter.';
    filters.after(note);

    const more=document.createElement('details');
    more.className='directory-more-filters';
    more.innerHTML='<summary>More access filters</summary><div class="directory-more-grid"></div>';
    const grid=more.querySelector('.directory-more-grid');
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
  const init=()=>{simplifyFilters();enhanceProviderDetail();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();

  const detail=document.getElementById('providerDetail');
  if(detail)new MutationObserver(()=>{
    if(!detail.querySelector('h2')||detail.querySelector('.clinic-essentials'))return;
    detail.dataset.simplified='';
    enhanceProviderDetail();
  }).observe(detail,{childList:true});
})();
