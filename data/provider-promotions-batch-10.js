(() => {
  const checked="2026-09-05";
  const promotions=[
    {
      id:"k-ladies-clinic-shinjuku",
      name:"K Ladies Clinic Shinjuku",
      providerType:"clinic",
      city:"Tokyo",
      area:"Shinjuku",
      audience:["unknown"],
      specialties:["Gynecology","Women's Health"],
      doctorEnglish:"unknown",
      receptionEnglish:"yes",
      interpreter:"unknown",
      englishDocs:"yes",
      coordinator:"no",
      insurance:"unknown",
      selfPay:"yes",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://www.klcs.jp/en/",
      verified:checked,
      notes:"Official English site states that English-speaking staff are available every day and assist throughout consultations. It also states that no appointment is necessary for in-person visits, lists cash and major credit-card payment, and identifies birth-control and emergency-contraception services as self-paid. Physician English, interpreter status, insurance eligibility, and referral requirements are not established on the reviewed page and remain unknown.",
      expertiseEvidence:[
        {type:"service",label:"English-speaking staff are available every day and assist throughout consultation",evidenceStatus:"official-source-verified",sourceUrl:"https://www.klcs.jp/en/",verifiedDate:checked},
        {type:"service",label:"In-person visits do not require an appointment",evidenceStatus:"official-source-verified",sourceUrl:"https://www.klcs.jp/en/",verifiedDate:checked},
        {type:"service",label:"Self-paid contraception services are explicitly identified",evidenceStatus:"official-source-verified",sourceUrl:"https://www.klcs.jp/en/",verifiedDate:checked}
      ],
      medicalCost:"Self-paid contraception services are identified; exact total varies by service",
      interpreterCost:"Unknown",
      coordinatorCost:"No coordinator requirement identified for the published direct clinic pathway",
      priceTransparency:"medium",
      discoveryStatus:"provider-level-verified"
    },
    {
      id:"togoshiginza-ladies-clinic",
      name:"Togoshiginza Ladies Clinic",
      providerType:"clinic",
      city:"Tokyo",
      area:"Shinagawa",
      audience:["unknown"],
      specialties:["Gynecology","Obstetrics","Prenatal Care","Women's Health"],
      doctorEnglish:"unknown",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"yes",
      coordinator:"no",
      insurance:"resident",
      selfPay:"yes",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://tglc.jp/eng/",
      verified:checked,
      notes:"Official English page describes gynecology, obstetrics and prenatal care, asks first-time patients to bring their insurance card and medical certificates, and separately lists self-pay gynecologic screening, vaccination, pill prescriptions and women's health checkups. The clinic also publishes reservation/contact pathways and accepts cash, cards and electronic money. Role-specific English support, interpreter availability and referral requirements are not established on the reviewed page and remain unknown.",
      expertiseEvidence:[
        {type:"service",label:"Official English patient-information page is available",evidenceStatus:"official-source-verified",sourceUrl:"https://tglc.jp/eng/",verifiedDate:checked},
        {type:"service",label:"Gynecology, obstetrics and prenatal-care services are published",evidenceStatus:"official-source-verified",sourceUrl:"https://tglc.jp/eng/",verifiedDate:checked},
        {type:"service",label:"Insurance-card instructions and separate self-pay services are published",evidenceStatus:"official-source-verified",sourceUrl:"https://tglc.jp/eng/",verifiedDate:checked}
      ],
      medicalCost:"Japanese insured care and separate self-pay services are described; exact patient cost varies",
      interpreterCost:"Unknown",
      coordinatorCost:"No coordinator requirement identified for the published direct clinic pathway",
      priceTransparency:"medium",
      discoveryStatus:"provider-level-verified"
    }
  ];
  const normalize=v=>String(v||"").toLowerCase().replace(/[^a-z0-9]/g,"");
  const byId=new Map(promotions.map(p=>[p.id,p]));
  const byName=new Map(promotions.map(p=>[normalize(p.name),p]));
  const replaced=new Set();
  window.PROVIDERS=(window.PROVIDERS||[]).map(p=>{const replacement=byId.get(p.id)||byName.get(normalize(p.name));if(!replacement)return p;replaced.add(replacement.id);return replacement;});
  for(const p of promotions)if(!replaced.has(p.id))window.PROVIDERS.push(p);
  window.PROVIDER_PROMOTIONS_BATCH_10_META={checked,count:promotions.length,source:"official provider websites"};
})();