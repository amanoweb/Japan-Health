(()=>{
  const $=id=>document.getElementById(id);
  const providers=()=>window.PROVIDERS||[];
  const normalize=v=>String(v||'').toLowerCase();
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
    const n=normalize(q);const out=[];
    for(const group of topicMap)if(group.terms.some(t=>n.includes(t)))out.push(...group.target);
    return [...new Set(out)];
  }
  function evidenceText(p){return (p.expertiseEvidence||[]).map(e=>typeof e==='string'?e:(e.label||'')).join(' ')}
  function score(p,state){
    const hay=normalize([p.name,p.area,(p.specialties||[]).join(' '),evidenceText(p),p.notes].join(' '));
    const targets=topicTargets(state.query);let relevance=0;
    if(state.query){
      const q=normalize(state.query);
      if(hay.includes(q))relevance+=90;
      for(const t of targets)if(hay.includes(normalize(t)))relevance+=35;
      for(const token of q.split(/[^a-z0-9]+/).filter(x=>x.length>2))if(hay.includes(token))relevance+=6;
    } else relevance=20;
    const audienceFit=state.audience==='all'?12:(p.audience||[]).includes(state.audience)?28:-70;
    const areaFit=!state.area?8:normalize(p.area).includes(normalize(state.area))?24:-18;
    const languageFit=state.language==='any'?8:state.language==='direct'?(p.doctorEnglish==='yes'?22:-22):(['yes','available','external'].includes(p.interpreter)?20:-20);
    const verified=p.recordStatus==='official-source-verified'?16:0;
    return relevance+audienceFit+areaFit+languageFit+verified;
  }
  function accessLabel(p){
    if(p.doctorEnglish==='yes')return 'Direct physician English documented';
    if(['yes','available'].includes(p.interpreter))return 'Interpreter pathway documented';
    if(p.interpreter==='external')return 'External interpreter arrangement';
    return 'Language route needs verification';
  }
  function costCount(p){return [p.medicalCost,p.interpreterCost,p.coordinatorCost].filter(v=>v&& !/^unknown/i.test(String(v))).length}
  function state(){return{query:$("careQuery").value.trim(),area:$("area").value.trim(),audience:$("audienceHome").value,language:$("languageHome").value}}
  function detailUrl(p,s){
    const q=new URLSearchParams();if(s.query)q.set('q',s.query);q.set('city','Tokyo');if(s.audience!=='all')q.set('audience',s.audience);if(s.language!=='any')q.set('language',s.language==='direct'?'direct':'interpreter');return `/clinics.html?${q.toString()}#find`;
  }
  function render(){
    const s=state();const list=providers().filter(p=>p.city==='Tokyo').map(p=>({p,score:score(p,s)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,6);
    const grid=$("quickResults"),summary=$("searchSummary");
    summary.textContent=s.query?`${list.length} access-relevant options for “${s.query}”${s.area?` near ${s.area}`:''}. Results prioritize your stated constraints and documented access evidence; this is not clinical-quality ranking.`:'Describe a symptom, care need, disease, or procedure to get started.';
    if(!list.length){grid.innerHTML='<div class="fast-empty"><b>No clear access match yet.</b><span>Try a broader care term or remove the area/language constraint. Japan Health will not invent a match.</span><a href="/clinics.html">Open full directory →</a></div>';return}
    grid.innerHTML=list.map(({p})=>`<article class="fast-card">
      <div class="fast-card-top"><span class="record ${p.recordStatus==='official-source-verified'?'verified':'demo'}">${p.recordStatus==='official-source-verified'?'OFFICIAL SOURCE CHECKED':'DEMO · UNVERIFIED'}</span><span>${p.area||'Tokyo'}</span></div>
      <h3>${p.name}</h3><p class="fast-specialty">${(p.specialties||[]).slice(0,4).join(' · ')}</p>
      <div class="fast-facts"><div><small>COMMUNICATION</small><b>${accessLabel(p)}</b></div><div><small>REFERRAL</small><b>${p.referral||'unknown'}</b></div><div><small>COST DATA</small><b>${costCount(p)}/3 components</b></div></div>
      <p class="fast-note">${p.notes||''}</p>
      <div class="fast-actions"><a class="btn primary" href="${detailUrl(p,s)}">Compare access details</a>${p.recordStatus==='official-source-verified'&&/^https:\/\//.test(p.source||'')?`<a class="text-link" href="${p.source}" target="_blank" rel="noopener">Official source ↗</a>`:''}</div>
    </article>`).join('');
  }
  function sync(){const s=state(),q=new URLSearchParams();if(s.query)q.set('q',s.query);if(s.area)q.set('area',s.area);if(s.audience!=='all')q.set('audience',s.audience);if(s.language!=='any')q.set('language',s.language);history.replaceState(null,'',`${location.pathname}${q.size?'?'+q:''}`)}
  function restore(){const q=new URLSearchParams(location.search);if(q.get('q'))$("careQuery").value=q.get('q');if(q.get('area'))$("area").value=q.get('area');if(q.get('audience'))$("audienceHome").value=q.get('audience');if(q.get('language'))$("languageHome").value=q.get('language')}
  restore();
  $("careSearchForm").addEventListener('submit',e=>{e.preventDefault();sync();render();$("results").scrollIntoView({behavior:'smooth',block:'start'})});
  ["area","audienceHome","languageHome"].forEach(id=>$(id).addEventListener('change',()=>{sync();if($("careQuery").value.trim())render()}));
  document.querySelectorAll('[data-quick]').forEach(b=>b.addEventListener('click',()=>{$("careQuery").value=b.dataset.quick;sync();render();$("results").scrollIntoView({behavior:'smooth',block:'start'})}));
  if($("careQuery").value.trim())render();
})();