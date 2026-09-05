(() => {
  const checked="2026-09-05";
  const jnto="https://www.jnto.go.jp/emergency/eng/mi_guide.html";
  const promotions=[
    {
      id:"jn-handoff-tatsuno-clinic",
      name:"Tatsuno Clinic",
      providerType:"clinic",
      city:"Tokyo",
      area:"Bunkyo-ku (Hongo)",
      audience:["resident","visitor"],
      specialties:["Internal Medicine","Cardiology","Pediatrics","Hypertension","Lifestyle-related Disease"],
      phone:"03-5800-0203",
      doctorEnglish:"unknown",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"unknown",
      insurance:"unknown",
      selfPay:"unknown",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://www.tatsuno-clinic.com/",
      verified:checked,
      notes:"The clinic's official site confirms internal medicine, cardiovascular medicine and pediatrics in Hongo, plus published care information for hypertension, heart disease and lifestyle-related disease. It asks patients to contact the clinic by phone. The official site reviewed does not establish physician/reception English, interpreter support, insurance/self-pay rules or referral requirements, so those fields remain unknown.",
      directorySignals:[{kind:"government-directory",name:"JNTO Medical Institution Search — Tokyo + English",sourceUrl:jnto}],
      expertiseEvidence:[
        {type:"specialist_clinic",label:"Internal medicine, cardiovascular medicine and pediatrics clinic in Hongo",evidenceStatus:"official-source-verified",sourceUrl:"https://www.tatsuno-clinic.com/",verifiedDate:checked},
        {type:"disease_focus",label:"Official clinic information covers hypertension, heart disease and lifestyle-related disease",evidenceStatus:"official-source-verified",sourceUrl:"https://www.tatsuno-clinic.com/",verifiedDate:checked},
        {type:"service",label:"Published patient contact pathway is by telephone",evidenceStatus:"official-source-verified",sourceUrl:"https://www.tatsuno-clinic.com/",verifiedDate:checked}
      ],
      medicalCost:"Unknown",
      interpreterCost:"Unknown",
      coordinatorCost:"Unknown",
      priceTransparency:"low",
      discoveryStatus:"provider-level-verified"
    },
    {
      id:"jn-handoff-kumada-clinic",
      name:"Kumada Clinic",
      providerType:"clinic",
      city:"Tokyo",
      area:"Minato-ku (Nishiazabu)",
      audience:["resident","visitor"],
      specialties:["Otorhinolaryngology","Voice and Speech Medicine"],
      phone:"03-5766-3357",
      doctorEnglish:"unknown",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"no",
      insurance:"varies",
      selfPay:"yes",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://kumadaclinic.com/en/",
      verified:checked,
      notes:"The clinic's official English site describes an otorhinolaryngology clinic specializing in speech and language medicine. Its access page states that appointments are required and that credit-card payment is available only for care not covered by Japanese health insurance. The English website itself is not treated as proof of physician or reception fluency, so role-specific English fields remain unknown.",
      directorySignals:[{kind:"government-directory",name:"JNTO Medical Institution Search — Tokyo + English",sourceUrl:jnto}],
      expertiseEvidence:[
        {type:"specialist_clinic",label:"Otorhinolaryngology clinic specializing in speech and language medicine",evidenceStatus:"official-source-verified",sourceUrl:"https://kumadaclinic.com/en/",verifiedDate:checked},
        {type:"service",label:"Appointment required",evidenceStatus:"official-source-verified",sourceUrl:"https://kumadaclinic.com/en/access-en/",verifiedDate:checked},
        {type:"service",label:"Credit-card payment is published for care not covered by Japanese health insurance",evidenceStatus:"official-source-verified",sourceUrl:"https://kumadaclinic.com/en/access-en/",verifiedDate:checked}
      ],
      medicalCost:"Unknown",
      interpreterCost:"Unknown",
      coordinatorCost:"No coordinator requirement identified for the published direct appointment pathway",
      priceTransparency:"low",
      discoveryStatus:"provider-level-verified"
    }
  ];
  const normalize=v=>String(v||"").toLowerCase().replace(/[^a-z0-9]/g,"");
  const byId=new Map(promotions.map(p=>[p.id,p]));
  const byName=new Map(promotions.map(p=>[normalize(p.name),p]));
  const replaced=new Set();
  window.PROVIDERS=(window.PROVIDERS||[]).map(p=>{
    const replacement=byId.get(p.id)||byName.get(normalize(p.name));
    if(!replacement)return p;
    replaced.add(replacement.id);
    return replacement;
  });
  for(const p of promotions)if(!replaced.has(p.id))window.PROVIDERS.push(p);
  window.PROVIDER_PROMOTIONS_BATCH_4_META={checked,count:promotions.length,source:"official provider websites"};
})();