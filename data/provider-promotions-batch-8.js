(() => {
  const checked="2026-09-05";
  const promotions=[
    {
      id:"shinjuku-higashiguchi-eye-clinic",
      name:"Shinjuku-Higashiguchi Eye Clinic",
      providerType:"clinic",
      city:"Tokyo",
      area:"Shinjuku",
      audience:["unknown"],
      specialties:["Ophthalmology","Cataract Surgery"],
      doctorEnglish:"unknown",
      receptionEnglish:"yes",
      interpreter:"yes",
      englishDocs:"unknown",
      coordinator:"no",
      insurance:"unknown",
      selfPay:"unknown",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://www.shec.jp/english/english-speaking-staff/",
      verified:checked,
      notes:"Official English page states that English-speaking staff are available and that an interpreter can support patients during consultations, surgeries and treatments. The page also states appointments can be made without Japanese and publishes extended weekday/weekend/holiday hours. Physician-level English, insurance eligibility and self-pay rules are not established on the reviewed page and remain unknown.",
      expertiseEvidence:[
        {type:"service",label:"English-speaking staff are available",evidenceStatus:"official-source-verified",sourceUrl:"https://www.shec.jp/english/english-speaking-staff/",verifiedDate:checked},
        {type:"service",label:"Interpreter support is available during consultation, surgery and treatment",evidenceStatus:"official-source-verified",sourceUrl:"https://www.shec.jp/english/english-speaking-staff/",verifiedDate:checked},
        {type:"service",label:"Appointments can be made without Japanese",evidenceStatus:"official-source-verified",sourceUrl:"https://www.shec.jp/english/english-speaking-staff/",verifiedDate:checked}
      ],
      medicalCost:"Unknown",interpreterCost:"Unknown",coordinatorCost:"No coordinator requirement identified for direct clinic access",priceTransparency:"low",discoveryStatus:"provider-level-verified"
    },
    {
      id:"eye-clinic-tokyo",
      name:"Eye Clinic Tokyo",
      providerType:"clinic",
      city:"Tokyo",
      area:"Marunouchi",
      audience:["unknown"],
      specialties:["Ophthalmology","ICL","Cataract Surgery","Keratoconus"],
      doctorEnglish:"unknown",
      receptionEnglish:"unknown",
      interpreter:"yes",
      englishDocs:"yes",
      coordinator:"no",
      insurance:"unknown",
      selfPay:"yes",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://eyeclinic-tokyo.jp/en/",
      verified:checked,
      notes:"Official English site lists ICL, cataract surgery, bifocal intraocular lens and keratoconus services. The clinic is appointment-only, provides reservations/inquiries in Japanese, Chinese and English, and publishes a dedicated interpreter telephone contact. The reviewed page does not separate doctor English from reception English or establish insurance eligibility.",
      expertiseEvidence:[
        {type:"service",label:"Reservations and inquiries are available in Japanese, Chinese and English",evidenceStatus:"official-source-verified",sourceUrl:"https://eyeclinic-tokyo.jp/en/",verifiedDate:checked},
        {type:"service",label:"Dedicated interpreter telephone contact is published",evidenceStatus:"official-source-verified",sourceUrl:"https://eyeclinic-tokyo.jp/en/",verifiedDate:checked},
        {type:"procedure",label:"ICL and cataract surgery pathways are published",evidenceStatus:"official-source-verified",sourceUrl:"https://eyeclinic-tokyo.jp/en/",verifiedDate:checked}
      ],
      medicalCost:"Self-pay surgical fees are published by the clinic; exact total varies by procedure",interpreterCost:"Unknown",coordinatorCost:"No coordinator requirement identified for the published direct booking pathway",priceTransparency:"medium",discoveryStatus:"provider-level-verified"
    },
    {
      id:"shinjuku-eye-clinic",
      name:"Shinjuku Eye Clinic",
      providerType:"clinic",
      city:"Tokyo",
      area:"Kitashinjuku",
      audience:["unknown"],
      specialties:["Ophthalmology","Glaucoma","Eye Checkup"],
      doctorEnglish:"unknown",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"yes",
      coordinator:"no",
      insurance:"resident",
      selfPay:"unknown",
      referral:"no",
      recordStatus:"official-source-verified",
      source:"https://www.shinjuku-eye.com/english/index.html",
      verified:checked,
      notes:"Official English first-visit page describes online and phone reservations, general ophthalmology consultations, glaucoma visual-field testing, optional checkups, required Japanese insurance card/My Number card for insured care, and cash payment for medical services. A referral letter is listed as optional, not required. English-speaking staff or physician English are not explicitly stated on the reviewed page, so language-role fields remain unknown.",
      expertiseEvidence:[
        {type:"service",label:"Online and telephone reservation pathways for first-time patients are published",evidenceStatus:"official-source-verified",sourceUrl:"https://www.shinjuku-eye.com/english/index.html",verifiedDate:checked},
        {type:"service",label:"Japanese insurance card or My Number card is requested for insured care",evidenceStatus:"official-source-verified",sourceUrl:"https://www.shinjuku-eye.com/english/index.html",verifiedDate:checked},
        {type:"service",label:"Referral letter is optional for first-time visits",evidenceStatus:"official-source-verified",sourceUrl:"https://www.shinjuku-eye.com/english/index.html",verifiedDate:checked}
      ],
      medicalCost:"Japanese insured care supported; exact patient cost varies",interpreterCost:"Unknown",coordinatorCost:"No coordinator requirement identified for direct booking",priceTransparency:"low",discoveryStatus:"provider-level-verified"
    }
  ];
  const normalize=v=>String(v||"").toLowerCase().replace(/[^a-z0-9]/g,"");
  const byId=new Map(promotions.map(p=>[p.id,p]));
  const byName=new Map(promotions.map(p=>[normalize(p.name),p]));
  const replaced=new Set();
  window.PROVIDERS=(window.PROVIDERS||[]).map(p=>{const replacement=byId.get(p.id)||byName.get(normalize(p.name));if(!replacement)return p;replaced.add(replacement.id);return replacement;});
  for(const p of promotions)if(!replaced.has(p.id))window.PROVIDERS.push(p);
  window.PROVIDER_PROMOTIONS_BATCH_8_META={checked,count:promotions.length,source:"official provider websites"};
})();
