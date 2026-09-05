(() => {
  const checked="2026-09-05";
  const promotions=[
    {
      id:"takanawa-gateway-station-front-orthopedic-clinic",
      name:"Takanawa Gateway Station Front Orthopedic Clinic",
      providerType:"clinic",
      city:"Tokyo",
      area:"Minato / Takanawa Gateway",
      audience:["unknown"],
      specialties:["Orthopedics","Sports Medicine","Rehabilitation","Regenerative Medicine"],
      doctorEnglish:"yes",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"yes",
      coordinator:"no",
      insurance:"unknown",
      selfPay:"unknown",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://tgoc.jp/en/",
      verified:checked,
      notes:"Official English site states that English consultations are available and that English can be used during the medical consultation. The clinic treats musculoskeletal and sports-related conditions, offers rehabilitation, and publishes a direct appointment pathway. Overseas travel insurance acceptance is stated, but Japanese insurance eligibility, reception English and interpreter availability are not separately established on the reviewed page.",
      expertiseEvidence:[
        {type:"service",label:"English consultations available",evidenceStatus:"official-source-verified",sourceUrl:"https://tgoc.jp/en/",verifiedDate:checked},
        {type:"service",label:"Direct appointment pathway is published",evidenceStatus:"official-source-verified",sourceUrl:"https://tgoc.jp/en/",verifiedDate:checked},
        {type:"service",label:"Overseas travel insurance accepted",evidenceStatus:"official-source-verified",sourceUrl:"https://tgoc.jp/en/",verifiedDate:checked}
      ],
      medicalCost:"Unknown",interpreterCost:"Unknown",coordinatorCost:"No coordinator requirement identified for the published direct booking pathway",priceTransparency:"low",discoveryStatus:"provider-level-verified"
    },
    {
      id:"ito-orthopedic-clinic-sangenjaya",
      name:"Ito Orthopedic Clinic Sangenjaya",
      providerType:"clinic",
      city:"Tokyo",
      area:"Setagaya / Sangenjaya",
      audience:["unknown"],
      specialties:["Orthopedics","Sports Orthopedics"],
      doctorEnglish:"yes",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"yes",
      coordinator:"no",
      insurance:"unknown",
      selfPay:"unknown",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://ito-seikei.jp/question/",
      verified:checked,
      notes:"Official FAQ states that the clinic provides medical consultations in English. It says the doctor can communicate in English at a daily conversational level, that translation tools may be used for complex explanations, and that international patients may visit the clinic on their own. Insurance, reception English and interpreter availability are not separately established on the reviewed page.",
      expertiseEvidence:[
        {type:"service",label:"Medical consultations in English are available",evidenceStatus:"official-source-verified",sourceUrl:"https://ito-seikei.jp/question/",verifiedDate:checked},
        {type:"service",label:"Doctor states daily conversational English ability",evidenceStatus:"official-source-verified",sourceUrl:"https://ito-seikei.jp/question/",verifiedDate:checked},
        {type:"service",label:"International patients may visit on their own",evidenceStatus:"official-source-verified",sourceUrl:"https://ito-seikei.jp/question/",verifiedDate:checked}
      ],
      medicalCost:"Unknown",interpreterCost:"Unknown",coordinatorCost:"No coordinator requirement identified for direct clinic access",priceTransparency:"low",discoveryStatus:"provider-level-verified"
    },
    {
      id:"tokyo-hospital-shin-okubo",
      name:"Tokyo Hospital Shin-Okubo",
      providerType:"clinic",
      city:"Tokyo",
      area:"Shinjuku / Shin-Okubo",
      audience:["unknown"],
      specialties:["Orthopedics","Internal Medicine","Dermatology"],
      doctorEnglish:"unknown",
      receptionEnglish:"yes",
      interpreter:"unknown",
      englishDocs:"yes",
      coordinator:"no",
      insurance:"resident",
      selfPay:"unknown",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://www.tokyohospital.co.jp/landing_page_en/",
      verified:checked,
      notes:"Official English page states that the clinic supports English, Chinese, Vietnamese and Korean, provides orthopedics among its main services, accepts walk-ins, and offers insured medical treatment when a Japanese health insurance card is presented. A dedicated foreign-language support phone number is published. The reviewed page does not separate physician English from reception support or establish visitor self-pay rules.",
      expertiseEvidence:[
        {type:"service",label:"English support is available",evidenceStatus:"official-source-verified",sourceUrl:"https://www.tokyohospital.co.jp/landing_page_en/",verifiedDate:checked},
        {type:"service",label:"Walk-in consultations are accepted",evidenceStatus:"official-source-verified",sourceUrl:"https://www.tokyohospital.co.jp/landing_page_en/",verifiedDate:checked},
        {type:"service",label:"Japanese insured medical treatment is available with a health insurance card",evidenceStatus:"official-source-verified",sourceUrl:"https://www.tokyohospital.co.jp/landing_page_en/",verifiedDate:checked}
      ],
      medicalCost:"Japanese insured care supported; exact patient cost varies",interpreterCost:"Unknown",coordinatorCost:"No coordinator requirement identified for direct clinic access",priceTransparency:"low",discoveryStatus:"provider-level-verified"
    }
  ];
  const normalize=v=>String(v||"").toLowerCase().replace(/[^a-z0-9]/g,"");
  const byId=new Map(promotions.map(p=>[p.id,p]));
  const byName=new Map(promotions.map(p=>[normalize(p.name),p]));
  const replaced=new Set();
  window.PROVIDERS=(window.PROVIDERS||[]).map(p=>{const replacement=byId.get(p.id)||byName.get(normalize(p.name));if(!replacement)return p;replaced.add(replacement.id);return replacement;});
  for(const p of promotions)if(!replaced.has(p.id))window.PROVIDERS.push(p);
  window.PROVIDER_PROMOTIONS_BATCH_9_META={checked,count:promotions.length,source:"official provider websites"};
})();