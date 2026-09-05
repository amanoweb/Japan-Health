(()=>{
  const area=document.getElementById('area');
  const form=document.getElementById('careSearchForm');
  const grid=document.getElementById('quickResults');
  if(!area||!form||!grid)return;

  const normalize=v=>String(v||'').trim().toLowerCase();
  const areaAliases=new Map([
    ['ginza','Chuo'],['tsukiji','Chuo'],['nihonbashi','Chuo'],
    ['marunouchi','Chiyoda'],['otemachi','Chiyoda'],['akihabara','Chiyoda'],
    ['roppongi','Minato'],['akasaka','Minato'],['shinagawa','Minato'],
    ['shibuya','Shibuya'],['ebisu','Shibuya'],['harajuku','Shibuya'],
    ['shinjuku','Shinjuku'],['kabukicho','Shinjuku'],
    ['ikebukuro','Toshima'],['ueno','Taito'],['asakusa','Taito'],
    ['bunkyo','Bunkyo'],['hongo','Bunkyo']
  ]);

  function canonicalArea(value){
    const raw=normalize(value).replace(/\s+(ward|ku)$/,'');
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

  // Capture phase guarantees neighborhood normalization happens before home-search.js
  // applies its hard area constraint, without weakening the selected constraint.
  form.addEventListener('submit',normalizeAreaBeforeSearch,true);

  const datalist=document.createElement('datalist');
  datalist.id='tokyo-area-suggestions';
  ['Ginza','Shinjuku','Shibuya','Roppongi','Akihabara','Marunouchi','Ikebukuro','Ueno','Bunkyo','Tsukiji'].forEach(name=>{
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

  function nextStep(p){
    if(p.coordinator==='required')return 'Coordination is required in the current access record.';
    if(p.referral==='required')return 'Prepare the documented referral requirement before booking.';
    if(p.coordinator==='recommended')return 'Coordination is recommended in the current access record.';
    return 'Verify current acceptance and booking route before contacting the provider.';
  }

  function decorateCards(){
    grid.querySelectorAll('.fast-card').forEach(card=>{
      if(card.querySelector('[data-booking-readiness-home]'))return;
      const p=providerForCard(card);if(!p)return;
      const known=[documented(p.referral),documented(p.coordinator)].filter(Boolean).length;
      const box=document.createElement('div');
      box.dataset.bookingReadinessHome='true';
      box.className='home-booking-readiness';
      box.innerHTML=`<div><small>BOOKING READINESS</small><b>${known}/2 access rules documented</b></div><div class="home-booking-rule"><span>Referral</span><strong>${human(p.referral)}</strong></div><div class="home-booking-rule"><span>Coordinator</span><strong>${human(p.coordinator)}</strong></div><p><b>Next access step:</b> ${nextStep(p)}</p>`;
      const actions=card.querySelector('.fast-actions');
      if(actions)actions.before(box);else card.appendChild(box);
    });

    const summary=document.getElementById('searchSummary');
    if(summary&&area.dataset.enteredArea){
      const entered=area.dataset.enteredArea;
      const canonical=area.value;
      if(!summary.dataset.areaExplained){
        summary.textContent+=` “${entered}” was matched to ${canonical} for the area constraint.`;
        summary.dataset.areaExplained='true';
      }
    }
  }

  const style=document.createElement('style');
  style.textContent=`.home-booking-readiness{display:grid;grid-template-columns:1.2fr .9fr .9fr;gap:7px;margin:12px 0;padding:10px;border:1px solid #dfe8f0;border-radius:12px;background:#fbfcfe}.home-booking-readiness small,.home-booking-readiness b,.home-booking-rule span,.home-booking-rule strong{display:block}.home-booking-readiness small{font-size:7px;color:#718295;letter-spacing:.04em}.home-booking-readiness b{font-size:9px;margin-top:3px}.home-booking-rule{padding-left:8px;border-left:1px solid #e5ecf2}.home-booking-rule span{font-size:7px;color:#7b8b99}.home-booking-rule strong{font-size:8px;margin-top:3px}.home-booking-readiness p{grid-column:1/-1;margin:3px 0 0;font-size:8px;line-height:1.45;color:#607487}@media(max-width:520px){.home-booking-readiness{grid-template-columns:1fr 1fr}.home-booking-readiness>div:first-child{grid-column:1/-1}.home-booking-readiness p{grid-column:1/-1}}`;
  document.head.appendChild(style);

  new MutationObserver(decorateCards).observe(grid,{childList:true,subtree:true});
  decorateCards();
})();