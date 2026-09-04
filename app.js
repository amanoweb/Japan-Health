const providers = window.PROVIDERS || [];
const $ = id => document.getElementById(id);

function human(v){
  const map={yes:"Yes",no:"No",partial:"Partial",limited:"Limited",available:"Available",required:"Required",recommended:"Recommended",optional:"Optional","self-pay":"Self-pay",both:"Resident insurance + self-pay",resident:"Resident insurance",Easy:"Easy",Moderate:"Moderate",Complex:"Complex"};
  return map[v]||v;
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
function renderProviders(){
  const q=($("q").value||"").toLowerCase();
  const aud=$("audience").value, city=$("city").value.toLowerCase(), lang=$("language").value, coord=$("coord").value, referral=$("referral").value;
  const filtered=providers.filter(p=>{
    const hay=(p.name+" "+p.city+" "+p.area+" "+p.specialties.join(" ")+" "+p.notes).toLowerCase();
    const okq=!q||hay.includes(q);
    const oka=aud==="all"||p.audience.includes(aud);
    const okc=city==="all"||p.city.toLowerCase()===city;
    const okl=lang==="all"||(lang==="direct"&&p.doctorEnglish==="yes")||(lang==="interpreter"&&["yes","available"].includes(p.interpreter));
    const okcoord=coord==="all"||(coord==="required"&&p.coordinator==="required")||(coord==="not-required"&&p.coordinator!=="required");
    const okref=referral==="all"||(referral==="required"&&p.referral==="required")||(referral==="no"&&p.referral==="no");
    return okq&&oka&&okc&&okl&&okcoord&&okref;
  });
  $("resultCount").textContent=filtered.length+" options";
  $("providerGrid").innerHTML=filtered.map(p=>`
    <article class="provider-card">
      <h3>${p.name}</h3>
      <div class="provider-meta">${p.city} · ${p.area} · ${p.specialties.join(" / ")}</div>
      <div class="badge-row">${badges(p)}</div>
      <p>${p.notes}</p>
      <div class="score-row">
        <div class="score-ring"><b>${accessScore(p).score}</b><small>/100</small></div>
        <div><strong>${scoreLabel(accessScore(p).score)}</strong><span>${accessScore(p).reasons.slice(0,3).join(" · ")}</span></div>
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
    </article>`).join("");
}
["q","audience","city","language","coord","referral"].forEach(id=>$(id).addEventListener("input",renderProviders));
$("resetFilters").onclick=()=>{ $("q").value="";$("audience").value="all";$("city").value="all";$("language").value="all";$("coord").value="all";$("referral").value="all";renderProviders(); };
document.querySelectorAll("[data-preset]").forEach(btn=>btn.onclick=()=>{$("q").value=btn.dataset.preset;location.hash="find";renderProviders()});

window.openProvider=id=>{
  const p=providers.find(x=>x.id===id); if(!p)return;
  $("providerDetail").innerHTML=`
    <span class="mini">ACCESS PROFILE</span>
    <h2>${p.name}</h2><div class="provider-meta">${p.city} · ${p.area} · ${p.specialties.join(" / ")}</div>
    <div class="badge-row">${badges(p)}</div>
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
    <p class="muted">${accessScore(p).reasons.join(" · ") || "Not enough structured access data yet."}</p>
    <h3>Cost visibility</h3>
    <div class="detail-grid">${costSummary(p)}</div>
    <h3>Expertise evidence</h3>
    <p class="muted">${(p.expertiseEvidence||[]).join(" · ") || "No verified expertise evidence added yet."}</p>
    <p class="muted">${p.notes}</p>
    <p class="source-line">Source: ${p.source}<br>Last verified: ${p.verified}</p>
    <button class="btn dark" onclick="closeProviderModal();openLeadModal('${p.id}')">Ask a coordinator about this option</button>`;
  $("providerModal").classList.remove("hidden");
}
window.closeProviderModal=()=>$("providerModal").classList.add("hidden");

window.openLeadModal=(providerId="")=>{
  $("leadProvider").value=providerId;
  const p=providers.find(x=>x.id===providerId);
  if(p){
    $("leadNeed").value=p.specialties.join(" / ");
    $("leadCity").value=p.city==="Osaka"?"Osaka":"Tokyo";
  }
  $("leadModal").classList.remove("hidden");
}
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
    createdAt:new Date().toISOString()
  };
  $("leadStatus").textContent="Sending…";
  try{
    const r=await fetch("/api/lead",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    const j=await r.json();
    if(!r.ok)throw new Error(j.error||"Failed");
    $("leadStatus").textContent=j.forwarded?"Sent to the configured coordination partner.":"Demo captured. Configure AMECA_LEAD_WEBHOOK_URL to forward real leads.";
  }catch(err){$("leadStatus").textContent="Preview mode: the live partner connection is not configured."}
});

function addMsg(t,type){const d=document.createElement("div");d.className="msg "+type;d.textContent=t;$("chatLog").appendChild(d);$("chatLog").scrollTop=$("chatLog").scrollHeight}
function answer(text){
  const m=text.toLowerCase();
  if(m.includes("parkinson")||m.includes("second opinion")||m.includes("specialist")) return "For specialist review, don't filter only for English-speaking doctors. Search by specialty first, then compare interpreter and coordinator pathways.";
  if(m.includes("ningen")||m.includes("health screening")||m.includes("checkup")) return "Use the Visitor pathway and search Health Screening. Compare direct English, interpreter support, self-pay access, and coordinator requirements.";
  if(m.includes("dent")) return "For dental care, first choose Resident or Visitor because insurance, repeat visits and urgency change the best pathway.";
  return "Start by telling me whether you live in Japan or are visiting, your city, and the specialty you need. I’ll help route the search.";
}
function ask(t){addMsg(t,"user");setTimeout(()=>addMsg(answer(t),"bot"),150)}
$("chatForm").addEventListener("submit",e=>{e.preventDefault();const t=$("chatInput").value.trim();if(!t)return;$("chatInput").value="";ask(t)});
document.querySelectorAll("[data-question]").forEach(b=>b.onclick=()=>ask(b.dataset.question));

renderProviders();
