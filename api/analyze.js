function fallback(profile,fda){
  const c=fda.classifications||[], k=fda.k510||[], p=fda.pmas||[], best=c[0]||{};
  const cls=String(best.device_class||"");
  let route="De Novo / 510(k)要検討";
  if(cls==="1") route="Class I / Exempt可能性を確認";
  if(cls==="2") route=k.length?"510(k) が最有力":"510(k) / De Novo要検討";
  if(cls==="3"||p.length) route="PMA可能性を要評価";

  let classClarity=Math.min(95,35+c.length*7+(profile.productCode?20:0));
  let predicate=Math.min(95,20+k.length*8);
  let evidence=62-(profile.aiMl==="yes"?8:0)-(profile.risk==="high"?15:0)-(profile.productType==="Implant"?12:0);
  evidence=Math.max(25,evidence);
  let regRisk=45+(cls==="3"||p.length>4?25:0)+(profile.risk==="high"?15:0)-(k.length>=5&&cls==="2"?15:0);
  regRisk=Math.max(20,Math.min(95,regRisk));
  const score=Math.round(classClarity*.28+predicate*.25+evidence*.30+(100-regRisk)*.17);

  const gaps=[];
  if(profile.productType==="SaMD"||profile.aiMl==="yes"){
    gaps.push(["Software documentation","Architecture、verification/validation、hazard analysis等を確認。"]);
    gaps.push(["Cybersecurity","接続性や更新機能に応じてcybersecurity documentationを評価。"]);
  }
  if(profile.aiMl==="yes") gaps.push(["Algorithm validation","データ代表性、subgroup performance、generalizabilityの根拠を準備。"]);
  if(profile.risk!=="low") gaps.push(["Clinical performance","Intended Useに直結する臨床性能Evidenceを評価。"]);
  gaps.push(["Usability / Human Factors","使用者・使用環境に応じてhuman factorsの要否を確認。"]);
  if(profile.productType==="Implant"||profile.productType==="Therapeutic") gaps.push(["Bench / biocompatibility","該当するbench、電気、材料、生体適合性Evidenceを確認。"]);

  return {
    route, confidence:c.length>=3?"Medium–High confidence":c.length?"Medium confidence":"Low confidence",
    score,classClarity,predicate,evidence,regRisk,
    bestCode:best.product_code||profile.productCode||"未確定",
    deviceClass:best.device_class?`Class ${best.device_class}`:"未確定",
    regNumber:best.regulation_number||"—",
    fdaSpecialty:best.medical_specialty_description||profile.specialty,
    routeReason:cls==="2"&&k.length
      ?"Class II候補と510(k) clearance履歴があるため、まずsubstantial equivalence成立可能性の検証が合理的です。"
      :cls==="3"||p.length?"Class III/PMAシグナルがあるため、高リスク経路を含めた評価が必要です。"
      :"公開データのみでは確定できないため、分類とpredicateの追加確認が必要です。",
    summary:`${profile.productName}についてFDA公開データから初期スクリーニングを行いました。現時点の候補経路は「${route}」です。`,
    gaps,
    actions:[
      `候補Product Code ${best.product_code||profile.productCode||"未確定"} の21 CFR分類とspecial controlsを原典確認する。`,
      k.length?`上位${Math.min(k.length,5)}件の510(k) Summaryを読み、Intended Use・technology・testingを比較する。`:"De Novo precedentを含めて類似機器検索を拡張する。",
      "Q-SubmissionでFDAへ確認すべき論点を整理する。",
      "日本で既に持つEvidenceとUSで追加が必要なEvidenceをGap表にする。",
      "規制経路・追加試験・commercialization費用を入れたGo / No-Goモデルを作る。"
    ]
  };
}

module.exports = async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const {profile,fda}=req.body||{};
  if(!profile||!fda) return res.status(400).json({error:"profile and fda are required"});

  const fallbackAnalysis=fallback(profile,fda);
  const key=process.env.OPENAI_API_KEY;
  if(!key) return res.status(200).json({analysis:fallbackAnalysis,mode:"heuristic"});

  try{
    const payload = {
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      input: [{
        role:"system",
        content:[{type:"input_text",text:
`You are a regulatory intelligence assistant for Japanese MedTech companies exploring US FDA entry.
Use only the supplied product profile and openFDA records. Do not claim a route is definitive.
Return STRICT JSON only with these keys:
route, confidence, score, classClarity, predicate, evidence, regRisk, bestCode, deviceClass, regNumber, fdaSpecialty, routeReason, summary, gaps, actions.
score metrics are integers 0-100. gaps is array of [title, explanation]. actions is array of strings.
Be concise and practical. Japanese output, while keeping FDA regulatory terminology in English where useful.`}]
      },{
        role:"user",
        content:[{type:"input_text",text:JSON.stringify({profile,fda,baseline:fallbackAnalysis})}]
      }],
      text:{format:{type:"json_object"}}
    };
    const r=await fetch("https://api.openai.com/v1/responses",{
      method:"POST",
      headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},
      body:JSON.stringify(payload)
    });
    if(!r.ok) throw new Error("OpenAI API "+r.status);
    const j=await r.json();
    const txt=j.output_text || j.output?.flatMap(x=>x.content||[]).map(x=>x.text||"").join("") || "";
    const analysis=JSON.parse(txt);
    return res.status(200).json({analysis,mode:"openai"});
  }catch(e){
    return res.status(200).json({analysis:fallbackAnalysis,mode:"heuristic_fallback",warning:e.message});
  }
}
