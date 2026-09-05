(()=>{
const scenarios=[
{id:'visitor-general',title:'Visitor · General medicine',audience:'visitor',care:'general',language:'all',area:'all',href:'/demo.html?audience=visitor&care=general&scenario=visitor-general'},
{id:'resident-cardiology',title:'Resident · Cardiology',audience:'resident',care:'cardiology',language:'interpreter',area:'Chiyoda',href:'/demo.html?audience=resident&care=cardiology&language=interpreter&area=Chiyoda&scenario=resident-cardiology'},
{id:'medical-travel-cancer',title:'Overseas · Cancer second opinion',audience:'medical-travel',care:'cancer',language:'interpreter',area:'Chuo',href:'/demo.html?audience=medical-travel&care=cancer&language=interpreter&area=Chuo&scenario=medical-travel-cancer'}
];
const params=new URLSearchParams(location.search);
const value=(p,k,d)=>p.get(k)||d;
const matches=(s,p)=>value(p,'audience','visitor')===s.audience&&value(p,'care','general')===s.care&&value(p,'language','all')===s.language&&value(p,'area','all')===s.area;
const explicit=params.get('scenario');
const explicitScenario=scenarios.find(s=>s.id===explicit&&matches(s,params));
const inferredScenario=explicitScenario||scenarios.find(s=>matches(s,params))||null;
let activeScenario=inferredScenario?.id||'';
function preserveScenario(url){
  if(!url)return url;
  try{
    const u=new URL(url,location.origin),scenario=scenarios.find(s=>s.id===activeScenario);
    if(scenario&&matches(scenario,u.searchParams))u.searchParams.set('scenario',scenario.id);
    else{u.searchParams.delete('scenario');activeScenario='';}
    return u.pathname+(u.searchParams.size?'?'+u.searchParams.toString():'')+u.hash;
  }catch(_){return url}
}
const nativeReplace=history.replaceState.bind(history);
history.replaceState=(state,title,url)=>nativeReplace(state,title,preserveScenario(url));
if(inferredScenario&&!params.has('scenario'))nativeReplace(history.state,'',preserveScenario(location.pathname+location.search+location.hash));
function mount(){
  if(document.getElementById('demoScenarioPresets'))return;
  const host=document.createElement('section');host.id='demoScenarioPresets';host.className='demo-scenario-presets';host.setAttribute('aria-label','Presentation-ready demo scenarios');
  host.innerHTML='<div class="demo-preset-head"><small>PRESENTATION-READY SCENARIOS</small><b>Three repeatable ways to show the full product journey.</b><span>Visitor routine care, resident specialist access, and overseas complex care use the current dataset; source status remains visible and unknown fields stay unknown.</span></div><div class="demo-preset-grid">'+scenarios.map(s=>'<a class="demo-preset'+(s.id===activeScenario?' active':'')+'" href="'+s.href+'"><small>'+(s.id===activeScenario?'CURRENT SCENARIO':'LOAD SCENARIO')+'</small><b>'+s.title+'</b><span>Open this scenario with the same patient and access constraints every time.</span></a>').join('')+'</div>';
  const bar=document.getElementById('demoScenarioBar'),steps=document.getElementById('demoSteps');(bar||steps)?.insertAdjacentElement('afterend',host)
}
const style=document.createElement('style');style.textContent='.demo-scenario-presets{margin:12px 0;padding:14px;border:1px solid #dce6ef;border-radius:15px;background:#fff}.demo-preset-head small,.demo-preset-head b,.demo-preset-head span{display:block}.demo-preset-head small{font-size:7px;font-weight:900;letter-spacing:.07em;color:#718295}.demo-preset-head b{font-size:11px;color:#173c5f;margin:3px 0}.demo-preset-head span{font-size:8px;color:#607487}.demo-preset-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}.demo-preset{display:block;padding:11px;border:1px solid #e1e9f0;border-radius:11px;text-decoration:none;background:#f9fbfd;color:#27465f}.demo-preset.active{border-color:#176df0;box-shadow:0 0 0 1px #176df0 inset;background:#edf5ff}.demo-preset small,.demo-preset b,.demo-preset span{display:block}.demo-preset small{font-size:7px;font-weight:900;color:#176df0}.demo-preset b{font-size:10px;margin:3px 0}.demo-preset span{font-size:8px;line-height:1.4;color:#607487}@media(max-width:760px){.demo-preset-grid{grid-template-columns:1fr}}';document.head.appendChild(style);
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount):mount();
window.JapanHealthDemoScenarios=scenarios;
})();