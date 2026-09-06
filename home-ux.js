(()=>{
  if(window.__JAPAN_HEALTH_HOME_UX__)return;
  window.__JAPAN_HEALTH_HOME_UX__=true;

  const grid=document.getElementById('quickResults');
  const form=document.getElementById('careSearchForm');
  if(!grid||!form)return;

  const providers=()=>window.PROVIDERS||[];
  const normalize=v=>String(v||'').trim().toLowerCase();

  function providerForCard(card){
    const name=card.querySelector('h3')?.textContent?.trim();
    return providers().find(p=>p.name===name)||null;
  }

  function languageSummary(card,p){
    const facts=[...card.querySelectorAll('.fast-facts>div')];
    const service=facts.find(item=>item.querySelector('small')?.textContent?.trim()==='REQUESTED-SERVICE LANGUAGE');
    const serviceText=service?.querySelector('b')?.textContent?.trim()||'';
    if(/^Service-level:/i.test(serviceText))return serviceText.replace(/^Service-level:\s*/i,'');
    if(p?.doctorEnglish==='yes')return 'Provider-level physician English documented';
    if(['yes','available'].includes(p?.interpreter))return 'Provider-level interpreter pathway documented';
    if(p?.interpreter==='external')return 'External interpreter arrangement documented';
    return 'Communication route needs verification';
  }

  function audienceSummary(p){
    const audience=Array.isArray(p?.audience)?p.audience:[];
    const visitor=audience.includes('visitor'),resident=audience.includes('resident');
    if(visitor&&resident)return 'Visitor + resident pathways in record';
    if(visitor)return 'Visitor pathway in record';
    if(resident)return 'Resident pathway in record';
    return 'Patient pathway needs verification';
  }

  function decorateCard(card){
    if(card.dataset.homeUxReady==='1')return;
    const p=providerForCard(card);
    if(!p)return;
    card.dataset.homeUxReady='1';

    const specialty=card.querySelector('.fast-specialty');
    if(specialty&&!card.querySelector('.home-access-glance')){
      const glance=document.createElement('div');
      glance.className='home-access-glance';
      glance.setAttribute('aria-label','Access summary');
      glance.innerHTML=`<span>${languageSummary(card,p)}</span><span>${audienceSummary(p)}</span>`;
      specialty.insertAdjacentElement('afterend',glance);
    }

    const primary=card.querySelector('.fast-actions .btn.primary');
    if(primary){
      primary.textContent='View clinic';
      primary.setAttribute('aria-label',`View access details for ${p.name}`);
    }

    const handoff=card.querySelector('[data-access-handoff-home]');
    if(handoff){
      handoff.textContent='Need help accessing this?';
      handoff.classList.remove('btn','ghost');
      handoff.classList.add('home-help-link');
    }

    const top=card.querySelector('.fast-card-top>span:last-child');
    if(top){
      top.textContent=p.area||'Tokyo';
    }
  }

  function decorate(){
    grid.querySelectorAll('.fast-card').forEach(decorateCard);
  }

  new MutationObserver(decorate).observe(grid,{childList:true,subtree:true});
  decorate();

  const style=document.createElement('style');
  style.textContent=`
    .home-search-state{display:none!important}
    .home-access-glance{display:flex;gap:7px;flex-wrap:wrap;margin:12px 0 2px}
    .home-access-glance span{display:inline-flex;align-items:center;min-height:28px;padding:5px 9px;border-radius:999px;background:#f3f6fa;color:#425a70;font-size:9px;font-weight:800;line-height:1.25}
    .fast-card{display:flex;flex-direction:column}
    .fast-card .fast-actions{margin-top:auto;padding-top:16px}
    .fast-actions .btn.primary{min-height:44px;display:inline-flex;align-items:center;justify-content:center}
    .home-help-link{border:0;background:transparent;padding:9px 2px;color:#35528c;font-size:10px;font-weight:800;cursor:pointer;text-decoration:underline;text-underline-offset:3px}
    .home-help-link:focus-visible,.fast-actions a:focus-visible,.optional-filters summary:focus-visible,.quick-menu button:focus-visible{outline:3px solid rgba(33,85,255,.28);outline-offset:3px}
    #results{scroll-margin-top:20px}
    @media(max-width:700px){
      .fast-results{padding-top:30px}
      .fast-card{padding:16px}
      .fast-card h3{font-size:19px}
      .fast-actions{display:grid;grid-template-columns:1fr;align-items:stretch}
      .fast-actions .btn.primary{width:100%;min-height:48px}
      .home-help-link{text-align:left;min-height:40px}
      .optional-filters summary{min-height:40px;display:flex;align-items:center}
      .quick-menu button{min-height:72px}
    }
  `;
  document.head.appendChild(style);
})();