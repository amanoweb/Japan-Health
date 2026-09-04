const $ = (id) => document.getElementById(id);
let currentResult = null;

const stopWords = new Set(["device","system","medical","patient","patients","clinical","using","used","use","with","from","that","this","for","and","the","software","analysis","support","japan","japanese"]);

function keywordGuess(text){
  const words = (text || "").toLowerCase().replace(/[^a-z0-9\s-]/g," ").split(/\s+/)
    .filter(x => x.length >= 4 && !stopWords.has(x));
  return [...new Set(words)].slice(0,5);
}

function show(id){
  ["emptyState","loadingState","report"].forEach(x => $(x).classList.add("hidden"));
  $(id).classList.remove("hidden");
}

function esc(s){
  return String(s ?? "").replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
}

function setLoadingMessages(){
  const msgs = [
    "Classification databaseを確認しています…",
    "Product Code周辺の510(k)履歴を取得しています…",
    "PMAシグナルを確認しています…",
    "Evidence Gapを整理しています…"
  ];
  let i = 0;
  $("loadingText").textContent = msgs[0];
  return setInterval(() => { i=(i+1)%msgs.length; $("loadingText").textContent=msgs[i]; }, 950);
}

function readForm(){
  return {
    productName:$("productName").value.trim(),
    shortDesc:$("shortDesc").value.trim(),
    intendedUse:$("intendedUse").value.trim(),
    productType:$("productType").value,
    specialty:$("specialty").value,
    aiMl:$("aiMl").value,
    risk:$("risk").value,
    productCode:$("productCode").value.trim().toUpperCase()
  }
}

function heuristicLocal(profile, fda){
  const classifications = fda.classifications || [];
  const k510 = fda.k510 || [];
  const pmas = fda.pmas || [];
  const best = classifications[0] || {};
  const cls = String(best.device_class || "");
  let route = "De Novo / 510(k)要検討";
  if(cls === "1") route = "Class I / Exempt可能性を確認";
  if(cls === "2") route = k510.length ? "510(k) が最有力" : "510(k) / De Novo要検討";
  if(cls === "3" || pmas.length) route = "PMA可能性を要評価";

  let classClarity = Math.min(95, 35 + classifications.length*7 + (profile.productCode?20:0));
  let predicate = Math.min(95, 20 + k510.length*8);
  let evidence = 62;
  if(profile.aiMl==="yes") evidence -= 8;
  if(profile.risk==="high") evidence -= 15;
  if(profile.productType==="Implant") evidence -= 12;
  if(profile.productType==="SaMD") evidence -= 3;
  evidence = Math.max(25, evidence);
  let regRisk = 45;
  if(cls==="3" || pmas.length>4) regRisk += 25;
  if(profile.risk==="high") regRisk += 15;
  if(k510.length>=5 && cls==="2") regRisk -= 15;
  regRisk = Math.max(20, Math.min(95,regRisk));
  const score = Math.round(classClarity*.28 + predicate*.25 + evidence*.30 + (100-regRisk)*.17);

  const gaps = [];
  if(profile.productType==="SaMD" || profile.aiMl==="yes"){
    gaps.push(["Software documentation","Software architecture、verification/validation、hazard analysis等の文書整備を確認。 "]);
    gaps.push(["Cybersecurity","ネットワーク接続やアップデート機能がある場合はcybersecurity documentationを評価。 "]);
  }
  if(profile.aiMl==="yes"){
    gaps.push(["Algorithm validation","Training/validation data、subgroup performance、generalizabilityの根拠を準備。 "]);
  }
  if(profile.risk!=="low"){
    gaps.push(["Clinical performance","Intended Useに直結する臨床性能のEvidenceが十分か確認。 "]);
  }
  gaps.push(["Usability / Human Factors","使用者・使用環境に応じてuse-related riskとhuman factorsの要否を確認。 "]);
  if(profile.productType==="Implant" || profile.productType==="Therapeutic"){
    gaps.push(["Bench / biocompatibility","機械・電気・材料・生体適合性等、該当するbench evidenceを確認。 "]);
  }

  const actions = [
    `候補Product Code ${best.product_code || profile.productCode || "未確定"} の21 CFR分類とspecial controlsを原典確認する。`,
    k510.length ? `上位${Math.min(k510.length,5)}件の510(k) Summaryを読み、Intended Use・technology・performance testingを比較する。` : "類似機器のpredicate候補が不足しているため、De Novo precedentも含めて検索範囲を広げる。",
    "Q-Submissionが必要かを判断し、FDAへ確認したい論点を5〜10個に絞る。",
    "US向けEvidence Gap表を作り、既存の日本データで埋められる項目と追加試験が必要な項目を分ける。",
    "規制経路と追加Evidenceコストを入れたUS Go / No-Goモデルを作る。"
  ];

  return {
    route,
    confidence: classifications.length>=3 ? "Medium–High confidence" : classifications.length ? "Medium confidence" : "Low confidence",
    score, classClarity, predicate, evidence, regRisk,
    bestCode: best.product_code || profile.productCode || "未確定",
    deviceClass: best.device_class ? `Class ${best.device_class}` : "未確定",
    regNumber: best.regulation_number || "—",
    fdaSpecialty: best.medical_specialty_description || profile.specialty,
    routeReason: cls==="2" && k510.length
      ? "Class II候補が見つかり、同一/近接Product Codeに510(k) clearance履歴が存在するため、まず510(k) substantial equivalenceの成立可能性を検証するのが合理的です。"
      : cls==="3" || pmas.length
      ? "Class III/PMA側のシグナルがあるため、510(k)を前提にせず高リスク経路を含めて評価する必要があります。"
      : "公開データだけでは規制経路を確定できません。Classificationとpredicateの追加確認が必要です。",
    summary: `${profile.productName || "対象製品"}について、FDA公開データから初期スクリーニングを実施しました。現時点では「${route}」が候補です。最大の価値は経路を断定することではなく、次のFDA相談・専門家レビュー前に調査論点を圧縮することです。`,
    gaps, actions
  };
}

async function callFDA(profile){
  const q = [profile.shortDesc, profile.intendedUse, profile.specialty].filter(Boolean).join(" ");
  const params = new URLSearchParams({q, code:profile.productCode});
  const res = await fetch("/api/fda-search?" + params.toString());
  if(!res.ok) throw new Error("FDA API検索に失敗しました");
  return await res.json();
}

async function callAI(profile, fda){
  try{
    const res = await fetch("/api/analyze", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({profile,fda})
    });
    if(res.ok){
      const j = await res.json();
      if(j && j.analysis) return j.analysis;
    }
  }catch(e){}
  return heuristicLocal(profile,fda);
}

function tableClassification(rows){
  if(!rows.length) return `<div class="section-note" style="padding:16px">候補が見つかりませんでした。Product Codeを直接入力するか、製品説明を英語キーワード中心にしてください。</div>`;
  return `<table><thead><tr><th>Product Code</th><th>Device Name</th><th>Class</th><th>Regulation</th><th>Specialty</th></tr></thead><tbody>` +
    rows.slice(0,10).map(r=>`<tr>
      <td><b>${esc(r.product_code)}</b></td>
      <td>${esc(r.device_name)}</td>
      <td>Class ${esc(r.device_class)}</td>
      <td>${esc(r.regulation_number || "—")}</td>
      <td>${esc(r.medical_specialty_description || "—")}</td>
    </tr>`).join("") + `</tbody></table>`;
}

function table510(rows){
  if(!rows.length) return `<div class="section-note" style="padding:16px">同一Product Code周辺で510(k)候補を取得できませんでした。</div>`;
  return `<table><thead><tr><th>K Number</th><th>Device</th><th>Applicant</th><th>Decision</th><th>Date</th><th>Code</th></tr></thead><tbody>` +
    rows.slice(0,12).map(r=>`<tr>
      <td><b>${esc(r.k_number)}</b></td>
      <td>${esc(r.device_name || "—")}</td>
      <td>${esc(r.applicant || "—")}</td>
      <td>${esc(r.decision_description || r.decision_code || "—")}</td>
      <td>${esc(r.decision_date || "—")}</td>
      <td>${esc(r.product_code || "—")}</td>
    </tr>`).join("") + `</tbody></table>`;
}

function tablePMA(rows){
  if(!rows.length) return `<div class="section-note" style="padding:16px">近接キーワード/Product CodeでPMAレコードは取得されませんでした。</div>`;
  return `<table><thead><tr><th>PMA</th><th>Trade / Generic Name</th><th>Applicant</th><th>Decision</th><th>Date</th><th>Code</th></tr></thead><tbody>` +
    rows.slice(0,10).map(r=>`<tr>
      <td><b>${esc(r.pma_number)}</b></td>
      <td>${esc(r.trade_name || r.generic_name || "—")}</td>
      <td>${esc(r.applicant || "—")}</td>
      <td>${esc(r.decision_code || "—")}</td>
      <td>${esc(r.decision_date || "—")}</td>
      <td>${esc(r.product_code || "—")}</td>
    </tr>`).join("") + `</tbody></table>`;
}

function render(profile,fda,a){
  currentResult = {profile,fda,analysis:a,generatedAt:new Date().toISOString()};
  $("reportName").textContent = profile.productName || "Unnamed product";
  $("routeBadge").textContent = a.route;
  $("confidenceBadge").textContent = a.confidence;
  $("summaryText").textContent = a.summary;
  $("scoreValue").textContent = a.score;
  $("scoreRing").style.background = `conic-gradient(var(--cyan) 0deg,var(--cyan) ${a.score*3.6}deg,#263956 ${a.score*3.6}deg)`;
  $("mClass").textContent = a.classClarity;
  $("mPred").textContent = a.predicate;
  $("mEvidence").textContent = a.evidence;
  $("mRisk").textContent = a.regRisk;
  $("routeValue").textContent = a.route;
  $("routeReason").textContent = a.routeReason;
  $("deviceClass").textContent = a.deviceClass;
  $("bestCode").textContent = a.bestCode;
  $("regNumber").textContent = a.regNumber;
  $("fdaSpecialty").textContent = a.fdaSpecialty;

  $("classCount").textContent = `${(fda.classifications||[]).length} hits`;
  $("kCount").textContent = `${(fda.k510||[]).length} hits`;
  $("pmaCount").textContent = `${(fda.pmas||[]).length} hits`;
  $("classificationTable").innerHTML = tableClassification(fda.classifications||[]);
  $("kTable").innerHTML = table510(fda.k510||[]);
  $("pmaTable").innerHTML = tablePMA(fda.pmas||[]);

  $("gapList").innerHTML = (a.gaps||[]).map(x=>`<div class="check-item"><div class="icon">!</div><div><b>${esc(x[0])}</b><p>${esc(x[1])}</p></div></div>`).join("");
  $("actionList").innerHTML = (a.actions||[]).map(x=>`<li>${esc(x)}</li>`).join("");
  show("report");
}

async function analyze(){
  const profile = readForm();
  if(!profile.productName || !profile.shortDesc){
    alert("製品名と「製品を一言で」を入力してください。");
    return;
  }
  show("loadingState");
  const timer=setLoadingMessages();
  try{
    const fda = await callFDA(profile);
    const a = await callAI(profile,fda);
    clearInterval(timer);
    render(profile,fda,a);
  }catch(err){
    clearInterval(timer);
    show("emptyState");
    $("emptyState").innerHTML = `<div><h2>検索できませんでした</h2><p>${esc(err.message)}</p><div class="error-box">VercelなどHTTPサーバー上で実行してください。ローカルでindex.htmlを直接開くと /api エンドポイントは動きません。</div></div>`;
  }
}

function loadDemo(){
  $("productName").value="GaitSense AI";
  $("shortDesc").value="AI software for quantitative gait analysis in Parkinson's disease";
  $("intendedUse").value="Software intended to analyze wearable sensor data from adults with Parkinson's disease to quantify gait features and support clinician assessment of motor function.";
  $("productType").value="SaMD";
  $("specialty").value="Neurology";
  $("aiMl").value="yes";
  $("risk").value="medium";
  $("productCode").value="";
}

function csvEscape(v){
  const s = typeof v==="object" ? JSON.stringify(v) : String(v ?? "");
  return `"${s.replaceAll('"','""')}"`;
}
function exportCSV(){
  if(!currentResult) return;
  const rows = [
    ["section","field","value"],
    ["product","name",currentResult.profile.productName],
    ["product","description",currentResult.profile.shortDesc],
    ["analysis","score",currentResult.analysis.score],
    ["analysis","route",currentResult.analysis.route],
    ["analysis","device_class",currentResult.analysis.deviceClass],
    ["analysis","product_code",currentResult.analysis.bestCode],
    ["analysis","regulation_number",currentResult.analysis.regNumber],
    ...currentResult.fda.classifications.map((r,i)=>["classification_"+(i+1),r.product_code,`${r.device_name} | Class ${r.device_class} | ${r.regulation_number||""}`]),
    ...currentResult.fda.k510.map((r,i)=>["510k_"+(i+1),r.k_number,`${r.device_name||""} | ${r.applicant||""} | ${r.decision_date||""}`])
  ];
  const csv=rows.map(r=>r.map(csvEscape).join(",")).join("\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="FDA_Readiness_Report.csv";a.click();URL.revokeObjectURL(a.href);
}

$("analyzeBtn").addEventListener("click",analyze);
$("demoBtn").addEventListener("click",loadDemo);
$("csvBtn").addEventListener("click",exportCSV);
$("expertBtn").addEventListener("click",()=>$("expertModal").classList.remove("hidden"));
$("closeModal").addEventListener("click",()=>$("expertModal").classList.add("hidden"));
$("closeModal2").addEventListener("click",()=>$("expertModal").classList.add("hidden"));
loadDemo();
