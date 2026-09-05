(()=>{
  const $=id=>document.getElementById(id);
  const providers=()=>window.PROVIDERS||[];
  const normalize=v=>String(v||'').toLowerCase().trim();
  const topicMap=[
    {id:'dental',label:'dental care',terms:['tooth','teeth','dental','dentist','toothache'],target:['dentistry','dental','emergency dental']},
    {id:'cardiology',label:'cardiology',terms:['heart','chest','cardio','arrhythmia','palpitation','palpitations'],target:['cardiology','ischemic heart disease','arrhythmia','heart failure']},
    {id:'oncology',label:'oncology / cancer care',terms:['cancer','tumor','tumour','oncology','second opinion'],target:['oncology','cancer care','second opinion','rare cancer']},
    {id:'womens-health',label:"women's health",terms:['period','menstrual','gyne','gyn','women','ivf','fertility','infertility','contraception'],target:['gynecology',"women's health",'ob-gyn','infertility','assisted reproductive technology','ivf','icsi']},
    {id:'neurology',label:'neurology',terms:['parkinson','tremor','movement','neurology','nerve'],target:['neurology',"parkinson's disease",'movement disorders']},
    {id:'screening',label:'health screening',terms:['checkup','check-up','screening','physical','ningen'],target:['health screening','ningen dock','imaging']},
    {id:'general-care',label:'general medical care',terms:['fever','temperature','cold','flu','influenza','cough','sore throat','stomach','stomachache','vomit','vomiting','diarrhea','diarrhoea','pain','internal','general','medicine','headache','dizzy','dizziness'],target:['internal medicine','general practice','primary care','general medicine']}
  ];

  function topicGroups(q){const n=normalize(q);return topicMap.filter(group=>group.terms.some(t=>n.includes(t)))}
  function topicTargets(q){return [...new Set(topicGroups(q).flatMap(group=>group.target))]}
  function routeLabel(q){const groups=topicGroups(q);return groups.length?groups.map(g=>g.label).join(' / '):''}
  function evidenceObjects(p){return (p.expertiseEvidence||[]).filter(e=>e&&typeof e==='object')}
  function evidenceText(p){return (p.expertiseEvidence||[]).map(e=>typeof e==='string'?e:(e.label||e.name||'')).join(' ')}
  function providerHaystack(p){return normalize([p.name,p.area,(p.specialties||[]).join(' '),evidenceText(p),p.notes].join(' '))}
  function relevanceScore(p,query){
    if(!query)return 0;
    const hay=providerHaystack(p),q=normalize(query),targets=topicTargets(query);let relevance=0;
    if(hay.includes(q))relevance+=90;
    for(const t of targets)if(hay.includes(normalize(t)))relevance+=45;
    for(const token of q.split(/[^a-z0-9]+/).filter(x=>x.length>2))if(hay.includes(token))relevance+=6;
    return relevance;
  }
  function matchedEvidence(p,query){
    if(!query)return[];
    const q=normalize(query),targets=topicTargets(query),tokens=q.split(/[^a-z0-9]+/).filter(x=>x.length>2);
    return evidenceObjects(p).map(e=>{
      const label=normalize(e.label||e.name||'');let score=0;
      if(label.includes(q))score+=100;
      targets.forEach(t=>{if(label.includes(normalize(t)))score+=45});
      tokens.forEach(t=>{if(label.includes(t))score+=8});
      if(e.evidenceStatus==='official-source-verified'||e.status==='official-source-verified')score+=score?20:0;
      return{e,score};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
  }
  function bestEvidence(p,query){return matchedEvidence(p,query)[0]?.e||null}
  function evidenceStrength(p,query){
    const e=bestEvidence(p,query);
    if(!e)return{label:'Provider specialty/text match',className:'provider',source:null};
    const verified=(e.evidenceStatus||e.status)==='official-source-verified';
    return{label:verified?'Source-backed disease/service evidence':'Unverified disease/service evidence',className:verified?'verified':'provider',source:verified&&/^https:\/\//.test(e.sourceUrl||e.source||'')?(e.sourceUrl||e.source):null};
  }
  function serviceAccess(p,query){
    const e=matchedEvidence(p,query).find(x=>x.e?.serviceAccess)?.e;
    const sa=e?.serviceAccess;
    if(sa&&(sa.evidenceStatus||sa.status)==='official-source-verified'){
      const route={
        'direct-physician-english':'Direct physician English',
        'interpreter':'Interpreter-supported',
        'external-interpreter':'External interpreter / coordination route',
        'language-support':'Documented language support'
      }[sa.route]||'Documented language route';
      return{level:'service',label:`Service-level: ${route}`,route:sa.route||'language-support',source:/^https:\/\//.test(sa.sourceUrl||'')?sa.sourceUrl:null};
    }
    if(p.doctorEnglish==='yes')return{level:'provider',label:'Provider-level only: direct physician English',route:'direct-physician-english',source:null};
    if(['yes','available'].includes(p.interpreter))return{level:'provider',label:'Provider-level only: interpreter pathway',route:'interpreter',source:null};
    if(p.interpreter==='external')return{level:'provider',label:'Provider-level only: external interpreter arrangement',route:'external-interpreter',source:null};
    return{level:'unknown',label:'Requested-service language route needs verification',route:'unknown',source:null};
  }
  function state(){return{query:$("careQuery").value.trim(),area:$("area").value.trim(),audience:$("audienceHome").value,language:$("languageHome").value}}
  function areaMatches(p,area){return !area||normalize(p.area).includes(normalize(area))}
  function communicationMatches(p,s){
    if(s.language==='direct'){
      const sa=serviceAccess(p,s.query);
      return sa.level==='service'?sa.route==='direct-physician-english':p.doctorEnglish==='yes';
    }
    if(s.language==='interpreter'){
      const sa=serviceAccess(p,s.query);
      if(sa.level==='service')return ['interpreter','external-interpreter','language-support'].includes(sa.route);
      return ['yes','available','external'].includes(p.interpreter);
    }
    return true;
  }
  function constraintMatch(p,s){
    if(p.city!=='Tokyo')return false;
    if(s.audience!=='all'&&!(Array.isArray(p.audience)&&p.audience.includes(s.audience)))return false;
    if(!communicationMatches(p,s))return false;
    if(s.area&&!areaMatches(p,s.area))return false;
    return true;
  }
  function scoreBreakdown(p,s){
    const direct={yes:100,partial:70,limited:35}[p.doctorEnglish]||20,
      interp=['yes','available'].includes(p.interpreter)?90:p.interpreter==='external'?45:25,
      reception=p.receptionEnglish==='yes'?100:p.receptionEnglish==='partial'?65:30,
      docs=p.englishDocs==='yes'?100:p.englishDocs==='partial'?65:30;
    let communication=Math.round(direct*.45+interp*.30+reception*.15+docs*.10);
    const sa=serviceAccess(p,s.query);
    if(sa.level==='service')communication=Math.max(communication,sa.route==='direct-physician-english'?95:sa.route==='interpreter'?90:sa.route==='language-support'?75:60);
    const booking=Math.max(0,Math.min(100,85-(p.referral==='required'?30:p.referral==='varies'?12:0)-(p.coordinator==='required'?25:p.coordinator==='recommended'?10:p.coordinator==='varies'?8:0)));
    let eligibility=50+(p.selfPay==='yes'?20:0);
    if(s.audience!=='all')eligibility+=(Array.isArray(p.audience)&&p.audience.includes(s.audience))?30:-35;
    else eligibility+=Array.isArray(p.audience)&&p.audience.length>1?20:8;
    eligibility=Math.max(0,Math.min(100,eligibility));
    const cost=({high:100,medium:70,low:35}[p.priceTransparency]||25);
    return{communication,booking,eligibility,cost};
  }
  function accessScore(p,s){const b=scoreBreakdown(p,s);return{score:Math.round(b.communication*.4+b.booking*.25+b.eligibility*.2+b.cost*.15),breakdown:b}}
  function rankScore(p,s){
    const relevance=relevanceScore(p,s.query),access=accessScore(p,s).score,verified=p.recordStatus==='official-source-verified'?16:0,
      sourceEvidence=evidenceStrength(p,s.query).className==='verified'?35:0,
      service=serviceAccess(p,s.query).level==='service'?30:0;
    return relevance+access*.3+verified+sourceEvidence+service;
  }
  function accessLabel(p){
    if(p.doctorEnglish==='yes')return 'Direct physician English documented';
    if(['yes','available'].includes(p.interpreter))return 'Interpreter pathway documented';
    if(p.interpreter==='external')return 'External interpreter arrangement';
    return 'Language route needs verification';
  }
  function costCount(p){return [p.medicalCost,p.interpreterCost,p.coordinatorCost].filter(v=>v&&!/^unknown/i.test(String(v))).length}
  function openGaps(p,s){
    const gaps=[];
    const missingCosts=3-costCount(p);if(missingCosts>0)gaps.push(`${missingCosts} cost component${missingCosts===1?'':'s'}`);
    if(!p.referral||p.referral==='unknown')gaps.push('referral rule');
    if(!p.coordinator||p.coordinator==='unknown')gaps.push('coordinator rule');
    const sa=serviceAccess(p,s.query);
    if(sa.level!=='service')gaps.push('requested-service communication route');
    return gaps;
  }
  function whyMatched(p,s){
    const reasons=[];
    const strength=evidenceStrength(p,s.query),routed=routeLabel(s.query);
    if(strength.className==='verified')reasons.push('Source-backed disease/service evidence');
    else if(routed&&relevanceScore(p,s.query)>0)reasons.push(`Symptom routed to ${routed}`);
    else if(relevanceScore(p,s.query)>0)reasons.push('Search terms found in specialty/evidence');
    if(serviceAccess(p,s.query).level==='service')reasons.push('Service-level language evidence');
    if(s.area&&areaMatches(p,s.area))reasons.push(`Area: ${p.area}`);
    if(s.audience!=='all'&&p.audience?.includes(s.audience))reasons.push(s.audience==='visitor'?'Visitor pathway documented':'Resident pathway documented');
    if(p.recordStatus==='official-source-verified')reasons.push('Official source checked');
    return reasons;
  }
  function detailUrl(p,s){
    const q=new URLSearchParams();if(s.query)q.set('q',s.query);q.set('city','Tokyo');if(s.audience!=='all')q.set('audience',s.audience);if(s.language!=='any')q.set('language',s.language==='direct'?'direct':'interpreter');if(s.area)q.set('area',s.area);q.set('provider',p.id||p.name);return `/clinics.html?${q.toString()}#find`;
  }
  function escapeHtml(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
  function render(){
    const s=state(),grid=$("quickResults"),summary=$("searchSummary"),routed=routeLabel(s.query);
    const candidates=providers().filter(p=>constraintMatch(p,s)).map(p=>({p,relevance:relevanceScore(p,s.query),rank:rankScore(p,s)})).filter(x=>!s.query||x.relevance>0).sort((a,b)=>b.rank-a.rank).slice(0,5);
    const routeText=routed?` We interpreted this as ${routed} for access search only; this is not a diagnosis.`:'';
    summary.textContent=s.query?`${candidates.length} documented constraint match${candidates.length===1?'':'es'} for “${s.query}”${s.area?` in ${s.area}`:''}.${routeText} Results prioritize source-backed searched-service evidence and documented access, never clinical quality. Selected constraints are not silently relaxed.`:'Describe a symptom, care need, disease, or procedure to get started.';
    if(!candidates.length){
      const areaRecovery=s.area?'<button class="btn ghost" type="button" data-clear-area>Search all Tokyo instead</button>':'';
      const understood=routed?`No documented match for all selected constraints. We understood “${escapeHtml(s.query)}” as ${escapeHtml(routed)}, but no provider in the current dataset satisfies every selected constraint.`:'No documented match for all selected constraints. No current provider record matched the search terms and every selected constraint.';
      grid.innerHTML=`<div class="fast-empty"><b>${understood}</b><span>Japan Health will not silently relax Visitor/Resident, area, or communication requirements. Change a constraint explicitly or open the full directory. This routing is for navigation only and is not medical advice.</span><div class="fast-actions">${areaRecovery}<a class="btn ghost" href="/clinics.html">Open full directory →</a></div></div>`;
      const clear=grid.querySelector('[data-clear-area]');if(clear)clear.addEventListener('click',()=>{$("area").value='';sync();render()});
      return;
    }
    grid.innerHTML=candidates.map(({p},index)=>{
      const sc=accessScore(p,s),gaps=openGaps(p,s),reasons=whyMatched(p,s),strength=evidenceStrength(p,s.query),sa=serviceAccess(p,s.query);
      return `<article class="fast-card">
        <div class="fast-card-top"><span class="record ${p.recordStatus==='official-source-verified'?'verified':'demo'}">${p.recordStatus==='official-source-verified'?'OFFICIAL SOURCE CHECKED':'DEMO · UNVERIFIED'}</span><span>${index===0?'TOP ACCESS-EVIDENCE MATCH · ':''}${escapeHtml(p.area||'Tokyo')}</span></div>
        <div class="fast-title-row"><div><h3>${escapeHtml(p.name)}</h3><p class="fast-specialty">${escapeHtml((p.specialties||[]).slice(0,4).join(' · '))}</p></div><div class="access-score-home" aria-label="International Access Score ${sc.score} out of 100"><small>ACCESS SCORE</small><strong>${sc.score}</strong><span>/100</span></div></div>
        <div class="match-reasons" aria-label="Why this result matched">${reasons.map(r=>`<span>${escapeHtml(r)}</span>`).join('')}</div>
        <div class="fast-facts"><div><small>SEARCH EVIDENCE</small><b>${escapeHtml(strength.label)}</b></div><div><small>REQUESTED-SERVICE LANGUAGE</small><b>${escapeHtml(sa.label)}</b></div><div><small>TOTAL-COST DATA</small><b>${costCount(p)}/3 components recorded</b></div></div>
        <div class="access-breakdown-home"><span>Communication ${sc.breakdown.communication}</span><span>Booking ${sc.breakdown.booking}</span><span>Eligibility ${sc.breakdown.eligibility}</span><span>Cost data ${sc.breakdown.cost}</span></div>
        <p class="fast-note"><b>Referral:</b> ${escapeHtml(p.referral||'unknown')} · <b>Coordinator:</b> ${escapeHtml(p.coordinator||'unknown')}<br/><b>Open verification gaps:</b> ${gaps.length?escapeHtml(gaps.join(' · ')):'No additional gaps identified in these displayed fields.'}</p>
        <div class="fast-actions"><a class="btn primary" href="${detailUrl(p,s)}">Compare access details</a>${strength.source?`<a class="text-link" href="${escapeHtml(strength.source)}" target="_blank" rel="noopener noreferrer">Matched evidence ↗</a>`:p.recordStatus==='official-source-verified'&&/^https:\/\//.test(p.source||'')?`<a class="text-link" href="${escapeHtml(p.source)}" target="_blank" rel="noopener noreferrer">Official source ↗</a>`:''}</div>
        <p class="score-disclaimer">“Top access-evidence match” means strongest fit to the selected search and logistics evidence in the current dataset. International Access Score uses communication 40%, booking friction 25%, pathway eligibility 20%, and cost-data visibility 15%. Neither is a clinical-quality ranking.</p>
      </article>`;
    }).join('');
  }
  function sync(){const s=state(),q=new URLSearchParams();if(s.query)q.set('q',s.query);if(s.area)q.set('area',s.area);if(s.audience!=='all')q.set('audience',s.audience);if(s.language!=='any')q.set('language',s.language);history.replaceState(null,'',`${location.pathname}${q.size?'?'+q:''}`)}
  function restore(){const q=new URLSearchParams(location.search);if(q.get('q'))$("careQuery").value=q.get('q');if(q.get('area'))$("area").value=q.get('area');if(q.get('audience'))$("audienceHome").value=q.get('audience');if(q.get('language'))$("languageHome").value=q.get('language')}
  restore();
  $("careSearchForm").addEventListener('submit',e=>{e.preventDefault();sync();render();$("results").scrollIntoView({behavior:'smooth',block:'start'})});
  ["area","audienceHome","languageHome"].forEach(id=>$(id).addEventListener('change',()=>{sync();if($("careQuery").value.trim())render()}));
  document.querySelectorAll('[data-quick]').forEach(b=>b.addEventListener('click',()=>{$("careQuery").value=b.dataset.quick;sync();render();$("results").scrollIntoView({behavior:'smooth',block:'start'})}));
  if($("careQuery").value.trim())render();
})();

(()=>{const s=document.createElement('script');s.src='/home-product-polish.js';s.defer=true;document.body.appendChild(s)})();