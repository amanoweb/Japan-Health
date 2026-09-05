(()=>{
  const $=id=>document.getElementById(id);
  const providers=()=>window.PROVIDERS||[];
  const params=()=>new URLSearchParams(location.search);
  const known=v=>{const s=String(v||"").trim().toLowerCase();return Boolean(s)&&!s.includes("unknown")&&!s.includes("needs verification");};
  const current=()=>{const q=params();return{audience:q.get("audience")||"visitor",care:q.get("care")||"general",language:q.get("language")||"all",area:q.get("area")||"all"};};
  const providerFromPreview=()=>{
    const boxes=[...($("handoffPreview")?.querySelectorAll(".handoff-box")||[])];
    const box=boxes.find(x=>x.querySelector("small")?.textContent?.includes("SELECTED ACCESS PROFILE"));
    const name=box?.querySelector("b")?.textContent?.trim();
    return providers().find(p=>p.name===name)||null;
  };
  const communication=p=>{
    const pref=current().language;
    if(pref==="direct")return p?.doctorEnglish==="yes"?{ok:true,text:"Direct physician English recorded"}:{ok:false,text:"Direct physician English needs verification"};
    if(pref==="interpreter")return ["yes","available","external"].includes(p?.interpreter)?{ok:true,text:"Interpreter pathway recorded"}:{ok:false,text:"Interpreter pathway needs verification"};
    if(p?.doctorEnglish==="yes")return{ok:true,text:"Direct physician English recorded"};
    if(["yes","available","external"].includes(p?.interpreter))return{ok:true,text:"Interpreter pathway recorded"};
    return{ok:false,text:"Communication pathway needs verification"};
  };
  const costState=p=>{
    const rows=[["Medical cost",p?.medicalCost],["Interpreter cost",p?.interpreterCost],["Coordinator cost",p?.coordinatorCost]];
    const recorded=rows.filter(([,v])=>known(v)).map(([label])=>label);
    const missing=rows.filter(([,v])=>!known(v)).map(([label])=>label);
    return{recorded,missing};
  };
  const providerStatus=p=>p?.recordStatus==="official-source-verified"?"Official-source checked provider record":"Demo / unverified provider record";
  const audienceLabel=v=>v==="resident"?"Resident":v==="medical-travel"?"Major medical travel":"Visitor";
  const careLabel=v=>({general:"General / internal medicine",dental:"Dental",screening:"Health screening",cardiology:"Cardiology",cancer:"Cancer / second opinion",womens:"Women's health / ART"}[v]||v);

  function reviewData(){
    const s=current(),p=providerFromPreview();if(!p)return null;
    const comm=communication(p),cost=costState(p),score=window.JapanHealthDemoAccessScore?.accessScore?.(p);
    const confirmed=[comm.ok?comm.text:null,cost.recorded.length?`${cost.recorded.length}/3 cost components recorded`:null,p.recordStatus==="official-source-verified"?"Provider record source status checked":null].filter(Boolean);
    const verify=[!comm.ok?comm.text:null,...cost.missing.map(x=>`${x} needs verification`),"Current availability and case acceptance must be confirmed before booking"].filter(Boolean);
    return{s,p,comm,cost,score,confirmed,verify};
  }
  function brief(data){
    const score=Number.isFinite(data.score?.score)?`${data.score.score}/100 International Access Score (logistics only)`:"International Access Score unavailable";
    return [
      "Japan Health coordination brief — demo",
      `Patient context: ${audienceLabel(data.s.audience)}`,
      `Care need: ${careLabel(data.s.care)}`,
      `Area constraint: ${data.s.area==="all"?"Any Tokyo area":data.s.area}`,
      `Communication constraint: ${data.s.language}`,
      `Selected access profile: ${data.p.name}`,
      `Record status: ${providerStatus(data.p)}`,
      `Access score: ${score}`,
      `Recorded logistics: ${data.confirmed.length?data.confirmed.join("; "):"None beyond the selected provider record"}`,
      `Needs human verification: ${data.verify.join("; ")}`,
      "This brief is for access coordination only. It is not medical advice, a clinical-quality ranking, a price quote, or a guarantee of eligibility, language support, availability, acceptance, or outcomes.",
      "AMECA remains only a downstream partner placeholder in this demo."
    ].join("\n");
  }
  async function copyBrief(button){
    const data=reviewData();if(!data)return;
    const text=brief(data);
    try{await navigator.clipboard.writeText(text);button.textContent="Copied share-safe brief";setTimeout(()=>button.textContent="Copy share-safe brief",1600);}catch(_){
      const ta=document.createElement("textarea");ta.value=text;ta.setAttribute("readonly","");ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();button.textContent="Copied share-safe brief";setTimeout(()=>button.textContent="Copy share-safe brief",1600);
    }
  }
  function render(){
    const form=$("demoInquiryForm"),data=reviewData();if(!form||!data)return;
    let section=$("demoHandoffReview");
    if(!section){
      section=document.createElement("section");section.id="demoHandoffReview";section.className="demo-handoff-review";section.setAttribute("aria-label","Handoff review");
      form.insertAdjacentElement("beforebegin",section);
    }
    section.innerHTML=`<div class="demo-review-head"><small>HANDOFF REVIEW</small><b>Separate what the record supports from what a coordinator still needs to verify.</b><span>This review uses the current Japan Health demo record only. It does not infer provider eligibility, language ability, pricing, availability, case acceptance, or clinical quality.</span></div><div class="demo-review-grid"><div><small>RECORDED IN CURRENT DATA</small>${data.confirmed.length?`<ul>${data.confirmed.map(x=>`<li>${x}</li>`).join("")}</ul>`:"<p>No additional logistics fields are confirmed.</p>"}</div><div><small>VERIFY BEFORE BOOKING</small><ul>${data.verify.map(x=>`<li>${x}</li>`).join("")}</ul></div></div><div class="demo-review-actions"><button type="button" class="small-btn" id="copySafeBrief">Copy share-safe brief</button><span>Excludes name, email, and free-text notes so it can be used as a presentation-safe coordination summary.</span></div>`;
    $("copySafeBrief")?.addEventListener("click",e=>copyBrief(e.currentTarget));
  }
  const observer=new MutationObserver(()=>requestAnimationFrame(render));
  observer.observe(document.querySelector("main")||document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["class"]});
  const style=document.createElement("style");style.id="demo-handoff-review-styles";style.textContent=`.demo-handoff-review{margin-top:12px;padding:15px;border:1px solid #cfddea;border-radius:14px;background:#f9fbfd}.demo-review-head small,.demo-review-head b,.demo-review-head span{display:block}.demo-review-head small{font-size:7px;font-weight:900;letter-spacing:.06em;color:#718295}.demo-review-head b{font-size:11px;color:#173c5f;margin:3px 0}.demo-review-head span{font-size:8px;line-height:1.5;color:#607487}.demo-review-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:10px}.demo-review-grid>div{padding:10px;border:1px solid #e1e9f0;border-radius:10px;background:#fff}.demo-review-grid small{display:block;font-size:7px;font-weight:900;color:#607487}.demo-review-grid ul{margin:7px 0 0;padding-left:16px}.demo-review-grid li,.demo-review-grid p{font-size:8px;line-height:1.5;color:#52687c;margin:4px 0}.demo-review-actions{display:flex;gap:9px;align-items:center;margin-top:10px}.demo-review-actions span{font-size:7px;line-height:1.45;color:#718295}@media(max-width:600px){.demo-review-grid{grid-template-columns:1fr}.demo-review-actions{align-items:stretch;flex-direction:column}.demo-review-actions .small-btn{width:100%;text-align:center}}`;
  document.head.appendChild(style);render();
})();