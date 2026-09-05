(()=>{
  const $=id=>document.getElementById(id);
  const providers=()=>window.PROVIDERS||[];
  const normalize=v=>String(v||'').toLowerCase().trim();
  const topicMap=[
    {terms:['tooth','teeth','dental','dentist'],target:['dentistry','dental']},
    {terms:['heart','chest','cardio','arrhythmia','palpitation'],target:['cardiology','ischemic heart disease','arrhythmia','heart failure']},
    {terms:['cancer','tumor','oncology','second opinion'],target:['oncology','cancer care','second opinion','rare cancer']},
    {terms:['period','menstrual','gyne','gyn','women','ivf','fertility','infertility','contraception'],target:['gynecology','women\'s health','infertility','assisted reproductive technology','ivf','icsi']},
    {terms:['parkinson','tremor','movement','neurology','nerve'],target:['neurology','parkinson\'s disease','movement disorders']},
    {terms:['checkup','screening','physical','ningen'],target:['health screening','ningen dock','imaging']},
    {terms:['fever','cold','cough','stomach','pain','internal','general','medicine'],target:['internal medicine','general practice']}
  ];

  function topicTargets(q){
    const n=normalize(q),out=[];
    for(const group of topicMap)if(group.terms.some(t=>n.includes(t)))out.push(...group.target);
    return [...new Set(out)];
  }
  function evidenceText(p){return (p.expertiseEvidence||[]).map(e=>typeof e==='string'?e:(e.label||e.name||'')).join(' ')}
  function providerHaystack(p){return normalize([p.name,p.area,(p.specialties||[]).join(' '),evidenceText(p),p.notes].join(' '))}
  function relevanceScore(p,query){
    if(!query)return 0;
    const hay=providerHaystack(p),q=normalize(query),targets=topicTargets(query);let relevance=0;
    if(hay.includes(q))relevance+=90;
    for(const t of targets)if(hay.includes(normalize(t)))relevance+=35;
    for(const token of q.split(/[^a-z0-9]+/).filter(x=>x.length>2))if(hay.includes(token))relevance+=6;
    return relevance;
  }
  function state(){return{query:$("careQuery").value.trim(),area:$("area").value.trim(),audience:$("audienceHome").value,language:$("languageHome").value}}
  function areaMatches(p,area){return !area||normalize(p.area).includes(normalize(area))}
  function constraintMatch(p,s){
    if(p.city!=='Tokyo')return false;
    if(s.audience!=='all'&&!(Array.isArray(p.audience)&&p.audience.includes(s.audience)))return false;
    if(s.language==='direct'&&p.doctorEnglish!=='yes')return false;
    if(s.language==='interpreter'&&!['yes','available','external'].includes(p.interpreter))return false;
    if(s.area&&!areaMatches(p,s.area))return false;
    return true;
  }
  function scoreBreakdown(p,s){
    const direct={yes:100,partial:70,limited:35}[p.doctorEnglish]||20,
      interp=['yes','available'].includes(p.interpreter)?90:p.interpreter==='external'?45:25,
      reception=p.receptionEnglish==='yes'?100:p.receptionEnglish==='partial'?65:30,
      docs=p.englishDocs==='yes'?100:p.englishDocs==='partial'?65:30;
    const communication=Math.round(direct*.45+interp*.30+reception*.15+docs*.10);
    const booking=Math.max(0,Math.min(100,85-(p.referral==='required'?30:p.referral==='varies'?12:0)-(p.coordinator==='required'?25:p.coordinator==='recommended'?10:p.coordinator==='varies'?8:0)));
    let eligibility=50+(p.selfPay==='yes'?20:0);
    if(s.audience!=='all')eligibility+=(Array.isArray(p.audience)&&p.audience.includes(s.audience))?30:-35;
    else eligibility+=Array.isArray(p.audience)&&p.audience.length>1?20:8;
    eligibility=Math.max(0,Math.min(100,eligibility));
    const cost=({high:100,medium:70,low:35}[p.priceTransparency]||25);
    return{communication,booking,eligibility,cost};
  }
  function accessScore(p,s){
    const b=scoreBreakdown(p,s);
    return{score:Math.round(b.communication*.4+b.booking*.25+b.eligibility*.2+b.cost*.15),breakdown:b};
  }
  function rankScore(p,s){
    const relevance=relevanceScore(p,s.query),access=accessScore(p,s).score,verified=p.recordStatus==='official-source-verified'?16:0;
    return relevance+access*.3+verified;
  }
  function accessLabel(p){
    if(p.doctorEnglish==='yes')return 'Direct physician English documented';
    if(['yes','available'].includes(p.interpreter))return 'Interpreter pathway documented';
    if(p.interpreter==='external')return 'External interpreter arrangement';
    return 'Language route needs verification';
  }
  function costCount(p){return [p.medicalCost,p.interpreterCost,p.coordinatorCost].filter(v=>v&&!/^unknown/i.test(String(v))).length}
  function openGaps(p){
    const gaps=[];
    const missingCosts=3-costCount(p);if(missingCosts>0)gaps.push(`${missingCosts} cost component${missingCosts===1?'':'s'}`);
    if(!p.referral||p.referral==='unknown')gaps.push('referral rule');
    if(!p.coordinator||p.coordinator==='unknown')gaps.push('coordinator rule');
    if(accessLabel(p)==='Language route needs verification')gaps.push('communication route');
    return gaps;
  }
  function whyMatched(p,s){
    const reasons=[];
    if(relevanceScore(p,s.query)>0)reasons.push('Search terms found in specialty/evidence');
    if(s.area&&areaMatches(p,s.area))reasons.push(`Area: ${p.area}`);
    if(s.audience!=='all'&&p.audience?.includes(s.audience))reasons.push(s.audience==='visitor'?'Visitor pathway documented':'Resident pathway documented');
    if(s.language==='direct'&&p.doctorEnglish==='yes')reasons.push('Direct physician English documented');
    if(s.language==='interpreter'&&['yes','available'].includes(p.interpreter))reasons.push('Interpreter pathway documented');
    if(s.language==='interpreter'&&p.interpreter==='external')reasons.push('External interpreter arrangement');
    if(p.recordStatus==='official-source-verified')reasons.push('Official source checked');
    return reasons;
  }
  function detailUrl(p,s){
    const q=new URLSearchParams();if(s.query)q.set('q',s.query);q.set('city','Tokyo');if(s.audience!=='all')q.set('audience',s.audience);if(s.language!=='any')q.set('language',s.language==='direct'?'direct':'interpreter');if(s.area)q.set('area',s.area);q.set('provider',p.id||p.name);return `/clinics.html?${q.toString()}#find`;
  }
  function escapeHtml(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
  function render(){
    const s=state(),grid=$("quickResults"),summary=$("searchSummary");
    const candidates=providers().filter(p=>constraintMatch(p,s)).map(p=>({p,relevance:relevanceScore(p,s.query),rank:rankScore(p,s)})).filter(x=>!s.query||x.relevance>0).sort((a,b)=>b.rank-a.rank).slice(0,5);
    summary.textContent=s.query?`${candidates.length} documented constraint match${candidates.length===1?'':'es'} for “${s.query}”${s.area?` in ${s.area}`:''}. Selected Visitor/Resident, area and communication constraints are hard filters; they are not silently relaxed.`:'Describe a symptom, care need, disease, or procedure to get started.';
    if(!candidates.length){
      const areaRecovery=s.area?'<button class="btn ghost" type="button" data-clear-area>Search all Tokyo instead</button>':'';
      grid.innerHTML=`<div class="fast-empty"><b>No documented match for all selected constraints.</b><span>Japan Health will not silently relax Visitor/Resident, area, or communication requirements. Change a constraint explicitly or open the full directory.</span><div class="fast-actions">${areaRecovery}<a class="btn ghost" href="/clinics.html">Open full directory →</a></div></div>`;
      const clear=grid.querySelector('[data-clear-area]');if(clear)clear.addEventListener('click',()=>{$("area").value='';sync();render()});
      return;
    }
    grid.innerHTML=candidates.map(({p})=>{
      const sc=accessScore(p,s),gaps=openGaps(p),reasons=whyMatched(p,s);
      return `<article class="fast-card">
        <div class="fast-card-top"><span class="record ${p.recordStatus==='official-source-verified'?'verified':'demo'}">${p.recordStatus==='official-source-verified'?'OFFICIAL SOURCE CHECKED':'DEMO · UNVERIFIED'}</span><span>${escapeHtml(p.area||'Tokyo')}</span></div>
        <div class="fast-title-row"><div><h3>${escapeHtml(p.name)}</h3><p class="fast-specialty">${escapeHtml((p.specialties||[]).slice(0,4).join(' · '))}</p></div><div class="access-score-home" aria-label="International Access Score ${sc.score} out of 100"><small>ACCESS SCORE</small><strong>${sc.score}</strong><span>/100</span></div></div>
        <div class="match-reasons" aria-label="Why this result matched">${reasons.map(r=>`<span>${escapeHtml(r)}</span>`).join('')}</div>
        <div class="fast-facts"><div><small>COMMUNICATION</small><b>${escapeHtml(accessLabel(p))}</b></div><div><small>REFERRAL</small><b>${escapeHtml(p.referral||'unknown')}</b></div><div><small>COST DATA</small><b>${costCount(p)}/3 components</b></div></div>
        <div class="access-breakdown-home"><span>Communication ${sc.breakdown.communication}</span><span>Booking ${sc.breakdown.booking}</span><span>Eligibility ${sc.breakdown.eligibility}</span><span>Cost data ${sc.breakdown.cost}</span></div>
        <p class="fast-note"><b>Open verification gaps:</b> ${gaps.length?escapeHtml(gaps.join(' · ')):'No additional gaps identified in these displayed fields.'}</p>
        <div class="fast-actions"><a class="btn primary" href="${detailUrl(p,s)}">Compare access details</a>${p.recordStatus==='official-source-verified'&&/^https:\/\//.test(p.source||'')?`<a class="text-link" href="${escapeHtml(p.source)}" target="_blank" rel="noopener noreferrer">Official source ↗</a>`:''}</div>
        <p class="score-disclaimer">International Access Score uses communication 40%, booking friction 25%, pathway eligibility 20%, and cost-data visibility 15%. It is not a clinical-quality score.</p>
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