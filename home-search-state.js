(()=>{
  const $=id=>document.getElementById(id);
  const form=$('careSearchForm'),grid=$('quickResults'),summary=$('searchSummary');
  if(!form||!grid||!summary)return;
  const controls={query:$('careQuery'),area:$('area'),audience:$('audienceHome'),language:$('languageHome')};
  const validAudience=new Set(['all','visitor','resident']);
  const validLanguage=new Set(['any','direct','interpreter']);
  let verifiedOnly=false;

  const bar=document.createElement('div');
  bar.className='home-search-state';
  bar.innerHTML=`<div class="home-search-state-main"><small>ACTIVE SEARCH</small><div id="homeSearchChips" class="home-search-chips" aria-live="polite"></div></div><div class="home-search-state-actions"><label class="home-verified-toggle"><input id="homeVerifiedOnly" type="checkbox"><span>Official-source checked only</span></label><button type="button" class="btn ghost home-share-search" id="homeShareSearch">Copy search link</button><span id="homeShareStatus" class="home-share-status" role="status" aria-live="polite"></span></div>`;
  const results=document.getElementById('results');
  results?.insertBefore(bar,results.querySelector('.fast-results-head')?.nextSibling||results.firstChild);

  const chips=$('homeSearchChips'),toggle=$('homeVerifiedOnly'),share=$('homeShareSearch'),shareStatus=$('homeShareStatus');

  function state(){return{query:controls.query?.value.trim()||'',area:controls.area?.value.trim()||'',audience:controls.audience?.value||'all',language:controls.language?.value||'any'}}
  function setUrl(replace=true){
    const s=state(),params=new URLSearchParams();
    if(s.query)params.set('q',s.query);
    if(s.area)params.set('area',s.area);
    if(s.audience!=='all')params.set('audience',s.audience);
    if(s.language!=='any')params.set('language',s.language);
    if(verifiedOnly)params.set('verified','1');
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
    if(toggle)toggle.checked=verifiedOnly;
    return Boolean(q);
  }
  function chip(label,value){return `<span><b>${label}</b>${String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</span>`}
  function updateChips(){
    const s=state(),items=[];
    if(s.query)items.push(chip('Need',s.query));
    items.push(chip('Area',s.area||'Any Tokyo area'));
    items.push(chip('Patient',s.audience==='visitor'?'Visitor':s.audience==='resident'?'Resident':'Visitor or resident'));
    items.push(chip('Communication',s.language==='direct'?'Direct physician English':s.language==='interpreter'?'Interpreter acceptable':'Any documented pathway'));
    if(verifiedOnly)items.push(chip('Sources','Official-source checked only'));
    chips.innerHTML=items.join('');
  }
  function applyVerifiedFilter(){
    const cards=[...grid.querySelectorAll('.fast-card')];
    let shown=0;
    cards.forEach(card=>{
      const verified=Boolean(card.querySelector('.record.verified'));
      card.hidden=verifiedOnly&&!verified;
      if(!card.hidden)shown++;
    });
    let empty=grid.querySelector('[data-home-verified-empty]');
    if(verifiedOnly&&cards.length&&!shown){
      if(!empty){empty=document.createElement('div');empty.dataset.homeVerifiedEmpty='true';empty.className='fast-empty';empty.innerHTML='<b>No official-source checked result satisfies the current search.</b><span>Demo or unverified records are hidden. Change the source filter explicitly to see them; Japan Health will not treat unverified data as confirmed.</span>';grid.appendChild(empty);}
    }else empty?.remove();
    if(verifiedOnly&&cards.length){
      summary.dataset.baseSummary=summary.dataset.baseSummary||summary.textContent;
      summary.textContent=`${shown} official-source checked result${shown===1?'':'s'} shown. ${summary.dataset.baseSummary}`;
    }else if(summary.dataset.baseSummary){summary.textContent=summary.dataset.baseSummary;delete summary.dataset.baseSummary;}
  }
  function refresh(){updateChips();applyVerifiedFilter();setUrl(true)}

  form.addEventListener('submit',()=>setTimeout(refresh,0));
  toggle?.addEventListener('change',()=>{verifiedOnly=toggle.checked;refresh()});
  ['change','input'].forEach(evt=>{
    controls.area?.addEventListener(evt,()=>{updateChips();setUrl(true)});
    controls.audience?.addEventListener(evt,()=>{updateChips();setUrl(true)});
    controls.language?.addEventListener(evt,()=>{updateChips();setUrl(true)});
  });
  share?.addEventListener('click',async()=>{
    setUrl(true);
    try{await navigator.clipboard.writeText(location.href);shareStatus.textContent='Search link copied.';}
    catch{shareStatus.textContent='Copy failed — use the browser address bar.';}
    setTimeout(()=>{shareStatus.textContent=''},2200);
  });
  new MutationObserver(()=>{summary.dataset.baseSummary='';applyVerifiedFilter()}).observe(grid,{childList:true,subtree:false});

  const style=document.createElement('style');
  style.textContent=`.home-search-state{display:flex;justify-content:space-between;gap:14px;align-items:center;margin:-4px 0 18px;padding:12px 14px;border:1px solid #dfe6ee;border-radius:14px;background:#fbfcfe}.home-search-state-main small{display:block;font-size:7px;font-weight:900;letter-spacing:.08em;color:#718295;margin-bottom:6px}.home-search-chips{display:flex;gap:6px;flex-wrap:wrap}.home-search-chips span{display:inline-flex;gap:4px;align-items:center;padding:6px 8px;border-radius:999px;background:#eef3ff;color:#35528c;font-size:8px}.home-search-chips b{font-size:7px;text-transform:uppercase;letter-spacing:.04em}.home-search-state-actions{display:flex;align-items:center;gap:9px;flex-wrap:wrap;justify-content:flex-end}.home-verified-toggle{display:flex;align-items:center;gap:6px;font-size:8px;font-weight:800;color:#526579;white-space:nowrap}.home-share-search{padding:8px 10px!important;font-size:8px!important}.home-share-status{font-size:8px;color:#526579;min-width:92px}@media(max-width:760px){.home-search-state{align-items:stretch;flex-direction:column}.home-search-state-actions{justify-content:flex-start}.home-share-status{min-width:0}}`;
  document.head.appendChild(style);

  const hadQuery=restore();
  updateChips();
  if(hadQuery){setTimeout(()=>{form.requestSubmit();applyVerifiedFilter()},0);}else applyVerifiedFilter();
})();