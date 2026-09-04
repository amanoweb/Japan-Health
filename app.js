const providers = window.PROVIDERS || [];
const $ = id => document.getElementById(id);

function human(v){
  const map={yes:"Yes",no:"No",partial:"Partial",limited:"Limited",available:"Available",required:"Required",recommended:"Recommended",optional:"Optional","self-pay":"Self-pay",both:"Resident insurance + self-pay",resident:"Resident insurance",Easy:"Easy",Moderate:"Moderate",Complex:"Complex",low:"Low"};
  return map[v]||v;
}

function ensureEnhancementStyles(){
  if(document.getElementById("jh-enhancement-styles")) return;
  const style=document.createElement("style");
  style.id="jh-enhancement-styles";
  style.textContent=`
    .filters select#sort{border-color:#b9cee5;background:#fafdff;font-weight:800}
    .match-panel{display:grid;gap:8px;margin:12px 0;padding:11px;border-radius:11px;background:#f8fbfd;border:1px solid #e3ebf2}
    .match-panel small{display:block;font-size:7px;letter-spacing:.08em;color:#7d8b99;font-weight:900;margin-bottom:5px}
    .signal-row{display:flex;flex-wrap:wrap;gap:5px}
    .signal{display:inline-flex;padding:5px 7px;border-radius:99px;font-size:8px;font-weight:800}
    .signal.good{background:#e8f7f2;color:#217a64}
    .signal.friction{background:#fff2df;color:#8a5a18}
    .signal.neutral{background:#eef2f5;color:#677887}
    .empty-state{grid-column:1/-1;background:#fff;border:1px dashed #bdcbd8;border-radius:16px;padding:28px;max-width:720px}
    .empty-state h3{font-size:20px;margin:8px 0}.empty-state p{max-width:620px}
    #resultsGuidance{font-weight:700;color:#526579}
  `;
  document.head.appendChild(style);
}

function badges(p){
  const arr=[];
  if(p.doctorEnglish==="yes")arr.push('<span class="badge">Doctor English</span>');
  else if(["partial","limited"].includes(p.doctorEnglish))arr.push('<span class="badge gray">Doctor English: '+human(p.doctorEnglish)+'</span>');
  if(["yes","available"].includes(p.interpreter))arr.push('<span class="badge green">Interpreter</span>');
  if(["required","recommended"].includes(p.coordinator))arr.push('<span class="badge purple">Coordinator '+human(p.coordinator)+'</span>');
  return arr.join("");
}

function accessScore(p){
  let score=50, reasons=[];
  if(p.doctorEnglish==="yes"){score+=15;reasons.push("doctor-level English");}
  else if(p.doctorEnglish==="partial"){score+=8;reasons.push("partial doctor English");}
  else if(p.doctorEnglish==="limited"){score+=2;reasons.push("limited doctor English");}
  if(["yes","available"].includes(p.interpreter)){score+=12;reasons.push("interpreter pathway");}
  if(p.receptionEnglish==="yes"){score+=7;reasons.push("English reception");}
  if(p.englishDocs==="yes"){score+=5;reasons.push("English documents");}
  else if(p.englishDocs==="partial"){score+=2;}
  if(p.referral==="required"){score-=8;reasons.push("referral required");}
  if(p.coordinator==="required"){score-=8;reasons.push("coordinator required");}
  else if(p.coordinator==="recommended"){score-=3;}
  if(p.selfPay==="yes"){score+=4;reasons.push("self-pay pathway");}
  score=Math.max(0,Math.min(100,score));
  return {score,reasons};
}
function scoreLabel(score){
  if(score>=80)return "Very accessible";
  if(score>=65)return "Accessible";
  if(score>=50)return "Moderate";
  return "Complex";
}
function costSummary(p){
  const parts=[["Medical",p.medicalCost||"Unknown"],["Interpreter",p.interpreterCost||"Unknown"],["Coordinator",p.coordinatorCost||"Unknown"]];
  return parts.map(([k,v])=>`<div><small>${k.toUpperCase()}</small><b>${v}</b></div>`).join("");
}

function activeConstraints(){
  return {
    q:($("q").value||"").trim(),
    audience:$("audience").value,
    city:$("city").value,
    language:$("language").value,
    coordinator:$("coord").value,
    referral:$("referral").value
  };
}

function matchSignals(p){
  const c=activeConstraints(), matches=[], friction=[];
  if(c.audience!=="all" && p.audience.includes(c.audience)) matches.push(c.audience==="visitor"?"Visitor access":"Resident access");
  if(c.city!=="all" && p.city===c.city) matches.push(c.city);
  if(c.language==="direct" && p.doctorEnglish==="yes") matches.push("Direct doctor English");
  if(c.language==="interpreter" && ["yes","available"].includes(p.interpreter)) matches.push("Interpreter available");
  if(c.referral==="no" && p.referral==="no") matches.push("No referral required");
  if(c.coordinator==="not-required" && p.coordinator!=="required") matches.push("Direct booking possible");
  if(c.q){
    const q=c.q.toLowerCase();
    const specialty=p.specialties.find(s=>s.toLowerCase().includes(q)||q.includes(s.toLowerCase()));
    if(specialty) matches.push(specialty);
  }
  if(p.referral==="required") friction.push("Referral required");
  if(p.coordinator==="required") friction.push("Coordinator required");
  if(p.doctorEnglish==="limited") friction.push("Limited doctor English");
  else if(p.doctorEnglish==="partial") friction.push("Partial doctor English");
  if(!["yes","available"].includes(p.interpreter) && p.doctorEnglish!=="yes") friction.push("No confirmed interpreter path");
  if((p.priceTransparency||"low")==="low") friction.push("Costs need verification");
  if(!matches.length) matches.push("Potential pathway");
  return {matches:matches.slice(0,4),friction:friction.slice(0,3)};
}

function ensureSortControl(){
  if($("sort")) return;
  const select=document.createElement("select");
  select.id="sort";
  select.setAttribute("aria-label","Sort care options");
  select.innerHTML='<option value="fit">Best access fit</option><option value="specialist">Specialist depth</option><option value="name">Name A–Z</option>';
  const filters=document.querySelector(".filters");
  if(filters) filters.appendChild(select);
  select.addEventListener("input",renderProviders);
}

function ensureResultsGuidance(){
  const bar=document.querySelector(".results-bar");
  if(!bar) return;
  let span=$("resultsGuidance");
  if(!span){
    span=document.createElement("span");
    span.id="resultsGuidance";
    bar.appendChild(span);
  }
  const c=activeConstraints(), bits=[];
  if(c.audience!=="all")bits.push(c.audience==="visitor"?"visitor":"resident");
  if(c.city!=="all")bits.push(c.city);
  if(c.language==="direct")bits.push("direct English");
  if(c.language==="interpreter")bits.push("interpreter-supported");
  if(c.referral==="no")bits.push("no referral");
  if(c.coordinator==="not-required")bits.push("direct booking");
  span.textContent=bits.length?`Matching: ${bits.join(" · ")}`:"Compare access friction, not clinical quality.";
}

function renderProviders(){
  ensureSortControl();
  ensureResultsGuidance();
  const c=activeConstraints();
  const q=c.q.toLowerCase();
  let filtered=providers.filter(p=>{
    const hay=(p.name+" "+p.city+" "+p.area+" "+p.specialties.join(" ")+" "+p.notes+" "+(p.expertiseEvidence||[]).join(" ")).toLowerCase();
    const okq=!q||hay.includes(q);
    const oka=c.audience==="all"||p.audience.includes(c.audience);
    const okc=c.city==="all"||p.city===c.city;
    const okl=c.language==="all"||(c.language==="direct"&&p.doctorEnglish==="yes")||(c.language==="interpreter"&&["yes","available"].includes(p.interpreter));
    const okcoord=c.coordinator==="all"||(c.coordinator==="required"&&p.coordinator==="required")||(c.coordinator==="not-required"&&p.coordinator!=="required");
    const okref=c.referral==="all"||(c.referral==="required"&&p.referral==="required")||(c.referral==="no"&&p.referral==="no");
    return okq&&oka&&okc&&okl&&okcoord&&okref;
  });

  const sort=$("sort")?.value||"fit";
  filtered=filtered.slice().sort((a,b)=>{
    if(sort==="name")return a.name.localeCompare(b.name);
    if(sort==="specialist"){
      const depthB=(b.expertiseEvidence||[]).length+(b.specialties||[]).length;
      const depthA=(a.expertiseEvidence||[]).length+(a.specialties||[]).length;
      return depthB-depthA || accessScore(b).score-accessScore(a).score;
    }
    return accessScore(b).score-accessScore(a).score;
  });

  $("resultCount").textContent=filtered.length+" options";
  if(!filtered.length){
    $("providerGrid").innerHTML=`<div class="empty-state">
      <span class="mini">NO DEMO MATCHES</span>
      <h3>Your access constraints are more specific than the current demo directory.</h3>
      <p>That is useful information: instead of silently relaxing your requirements, Japan Health should preserve them and hand the case to a coordinator when needed.</p>
      <div class="provider-actions">
        <button class="small-btn" onclick="document.getElementById('resetFilters').click()">Broaden search</button>
        <button class="small-btn primary" onclick="openLeadModal()">Ask a coordinator</button>
      </div>
    </div>`;
    return;
  }

  $("providerGrid").innerHTML=filtered.map(p=>{
    const signals=matchSignals(p);
    return `
    <article class="provider-card">
      <h3>${p.name}</h3>
      <div class="provider-meta">${p.city} · ${p.area} · ${p.specialties.join(" / ")}</div>
      <div class="badge-row">${badges(p)}</div>
      <div class="match-panel">
        <div><small>WHY IT MATCHES</small><div class="signal-row">${signals.matches.map(x=>`<span class="signal good">${x}</span>`).join("")}</div></div>
        <div><small>ACCESS FRICTION</small><div class="signal-row">${signals.friction.length?signals.friction.map(x=>`<span class="signal friction">${x}</span>`).join(""):'<span class="signal neutral">No major friction shown in demo data</span>'}</div></div>
      </div>
      <p>${p.notes}</p>
      <div class="score-row">
        <div class="score-ring"><b>${accessScore(p).score}</b><small>/100</small></div>
        <div><strong>${scoreLabel(accessScore(p).score)}</strong><span>International access friction only — not clinical quality</span></div>
      </div>
      <div class="provider-gridline">
        <div><small>REFERRAL</small><b>${human(p.referral)}</b></div>
        <div><small>SELF-PAY</small><b>${human(p.selfPay)}</b></div>
        <div><small>COORDINATOR</small><b>${human(p.coordinator)}</b></div>
        <div><small>PRICE DATA</small><b>${human(p.priceTransparency)}</b></div>
      </div>
      <div class="cost-grid">${costSummary(p)}</div>
      <div class="provider-actions">
        <button class="small-btn" onclick="openProvider('${p.id}')">View access details</button>
        <button class="small-btn primary" onclick="openLeadModal('${p.id}')">Ask a coordinator</button>
      </div>
      <div class="source-line">Source: ${p.source} · Last verified: ${p.verified}</div>
    </article>`;
  }).join("");
}

["q","audience","city","language","coord","referral"].forEach(id=>$(id).addEventListener("input",renderProviders));
$("resetFilters").onclick=()=>{
  $("q").value="";
  $("audience").value="all";
  $("city").value="all";
  $("language").value="all";
  $("coord").value="all";
  $("referral").value="all";
  if($("sort"))$("sort").value="fit";
  renderProviders();
};
document.querySelectorAll("[data-preset]").forEach(btn=>btn.onclick=()=>{$("q").value=btn.dataset.preset;location.hash="find";renderProviders()});

window.openProvider=id=>{
  const p=providers.find(x=>x.id===id); if(!p)return;
  const signals=matchSignals(p);
  $("providerDetail").innerHTML=`
    <span class="mini">ACCESS PROFILE</span>
    <h2>${p.name}</h2><div class="provider-meta">${p.city} · ${p.area} · ${p.specialties.join(" / ")}</div>
    <div class="badge-row">${badges(p)}</div>
    <div class="match-panel">
      <div><small>WHY IT MATCHES YOUR CURRENT FILTERS</small><div class="signal-row">${signals.matches.map(x=>`<span class="signal good">${x}</span>`).join("")}</div></div>
      <div><small>ACCESS FRICTION TO CHECK</small><div class="signal-row">${signals.friction.length?signals.friction.map(x=>`<span class="signal friction">${x}</span>`).join(""):'<span class="signal neutral">No major friction shown in demo data</span>'}</div></div>
    </div>
    <div class="detail-grid">
      <div><small>Doctor English</small><b>${human(p.doctorEnglish)}</b></div>
      <div><small>Reception English</small><b>${human(p.receptionEnglish)}</b></div>
      <div><small>Interpreter</small><b>${human(p.interpreter)}</b></div>
      <div><small>English documents</small><b>${human(p.englishDocs)}</b></div>
      <div><small>Coordinator</small><b>${human(p.coordinator)}</b></div>
      <div><small>Referral</small><b>${human(p.referral)}</b></div>
      <div><small>Insurance</small><b>${human(p.insurance)}</b></div>
      <div><small>Self-pay</small><b>${human(p.selfPay)}</b></div>
      <div><small>Access difficulty</small><b>${p.access}</b></div>
      <div><small>Access Score</small><b>${accessScore(p).score}/100 — ${scoreLabel(accessScore(p).score)}</b></div>
      <div><small>Price transparency</small><b>${human(p.priceTransparency)}</b></div>
    </div>
    <h3>Why this access score?</h3>
    <p class="muted">${accessScore(p).reasons.join(" · ") || "Not enough structured access data yet."} This score describes international-access friction only, not medical quality.</p>
    <h3>Cost visibility</h3>
    <div class="detail-grid">${costSummary(p)}</div>
    <h3>Expertise evidence</h3>
    <p class="muted">${(p.expertiseEvidence||[]).join(" · ") || "No verified expertise evidence added yet."}</p>
    <p class="muted">${p.notes}</p>
    <p class="source-line">Source: ${p.source}<br>Last verified: ${p.verified}</p>
    <button class="btn dark" onclick="closeProviderModal();openLeadModal('${p.id}')">Ask a coordinator about this option</button>`;
  $("providerModal").classList.remove("hidden");
};
window.closeProviderModal=()=>$("providerModal").classList.add("hidden");

window.openLeadModal=(providerId="")=>{
  $("leadProvider").value=providerId;
  const p=providers.find(x=>x.id===providerId);
  if(p){
    $("leadNeed").value=p.specialties.join(" / ");
    $("leadCity").value=p.city==="Osaka"?"Osaka":"Tokyo";
  }
  $("leadModal").classList.remove("hidden");
};
window.closeLeadModal=()=>$("leadModal").classList.add("hidden");

$("leadForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const p=providers.find(x=>x.id===$("leadProvider").value);
  const payload={
    name:$("leadName").value.trim(),
    email:$("leadEmail").value.trim(),
    audience:$("leadAudience").value,
    city:$("leadCity").value,
    need:$("leadNeed").value.trim(),
    notes:$("leadNotes").value.trim(),
    providerId:p?.id||null,
    providerName:p?.name||null,
    sourcePage:location.pathname,
    partnerRoute:"ameca",
    accessConstraints:activeConstraints(),
    createdAt:new Date().toISOString()
  };
  $("leadStatus").textContent="Sending…";
  try{
    const r=await fetch("/api/lead",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    const j=await r.json();
    if(!r.ok)throw new Error(j.error||"Failed");
    $("leadStatus").textContent=j.forwarded?"Sent to the configured coordination partner.":"Demo captured. Configure AMECA_LEAD_WEBHOOK_URL to forward real leads.";
  }catch(err){$("leadStatus").textContent="Preview mode: the live partner connection is not configured.";}
});

function addMsg(t,type){
  const d=document.createElement("div");
  d.className="msg "+type;
  d.textContent=t;
  $("chatLog").appendChild(d);
  $("chatLog").scrollTop=$("chatLog").scrollHeight;
}

function navigatorIntent(text){
  const m=text.toLowerCase();
  const changes=[];
  if(/\b(live|living|resident|reside)\b/.test(m)){ $("audience").value="resident";changes.push("resident access"); }
  if(/\b(visit|visiting|visitor|travel|tourist)\b/.test(m)){ $("audience").value="visitor";changes.push("visitor access"); }
  if(m.includes("tokyo")){ $("city").value="Tokyo";changes.push("Tokyo"); }
  if(m.includes("osaka")){ $("city").value="Osaka";changes.push("Osaka"); }

  if(m.includes("interpreter")||m.includes("interpretation")||m.includes("translator")){
    $("language").value="interpreter";changes.push("interpreter-supported");
  }else if(m.includes("english-speaking")||m.includes("english speaking")||m.includes("doctor speaks english")){
    $("language").value="direct";changes.push("direct doctor English");
  }

  if(m.includes("no referral")||m.includes("without referral")){ $("referral").value="no";changes.push("no referral"); }
  if(m.includes("direct booking")||m.includes("without coordinator")){ $("coord").value="not-required";changes.push("direct booking"); }

  const topics=[
    [["parkinson","movement disorder"],"Movement Disorders"],
    [["cancer","oncology"],"Oncology"],
    [["dentist","dental","tooth"],"Dentistry"],
    [["ningen","health screening","checkup","check-up"],"Health Screening"],
    [["cosmetic","aesthetic"],"Cosmetic Surgery"],
    [["dermatology","dermatologist","skin"],"Dermatology"],
    [["ob-gyn","obgyn","gynecology","women's health"],"OB-GYN"],
    [["second opinion"],"Second Opinion"],
    [["internal medicine","general practice"],"Internal Medicine"]
  ];
  for(const [terms,label] of topics){
    if(terms.some(t=>m.includes(t))){
      $("q").value=label;
      changes.push(label);
      break;
    }
  }
  return changes;
}

function answer(text){
  const changes=navigatorIntent(text);
  renderProviders();
  if(changes.length){
    location.hash="find";
    return `I applied these access constraints: ${changes.join(" · ")}. The results now show why each option matches and what access friction still needs checking. This is navigation only, not a diagnosis or treatment recommendation.`;
  }
  return "Tell me whether you live in Japan or are visiting, your city, the type of care you need, and whether direct English or an interpreter is acceptable. I can apply those constraints to the directory.";
}
function ask(t){
  addMsg(t,"user");
  setTimeout(()=>addMsg(answer(t),"bot"),150);
}
$("chatForm").addEventListener("submit",e=>{e.preventDefault();const t=$("chatInput").value.trim();if(!t)return;$("chatInput").value="";ask(t);});
document.querySelectorAll("[data-question]").forEach(b=>b.onclick=()=>ask(b.dataset.question));

ensureEnhancementStyles();
renderProviders();
