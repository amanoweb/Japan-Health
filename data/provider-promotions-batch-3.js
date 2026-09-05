(() => {
  const checked="2026-09-05";
  const jnto="https://www.jnto.go.jp/emergency/eng/mi_guide.html";
  const promotions=[
    {
      id:"jn-handoff-azabu-orthopaedic",
      name:"Azabu Orthopaedic Clinic",
      providerType:"clinic",
      city:"Tokyo",
      area:"Minato-ku (Azabujuban)",
      audience:["resident","visitor"],
      specialties:["Orthopedic Surgery","Rehabilitation"],
      phone:"03-5765-2020",
      doctorEnglish:"partial",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"no",
      insurance:"both",
      selfPay:"yes",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://azabu-seikei.com/information/",
      verified:checked,
      notes:"Official clinic information states that Dr. Kawano, who is fully English-speaking, is in charge on Wednesdays. The clinic does not require reservations, accepts various insurance, and says patients without an insurance card are treated as self-pay. This supports a day-specific English physician pathway, not clinic-wide physician or reception fluency; current doctor schedules should be confirmed before visiting.",
      directorySignals:[{kind:"government-directory",name:"JNTO Medical Institution Search — Tokyo + English",sourceUrl:jnto}],
      expertiseEvidence:[
        {type:"service",label:"Fully English-speaking physician listed for Wednesday consultations",evidenceStatus:"official-source-verified",sourceUrl:"https://azabu-seikei.com/information/",verifiedDate:checked},
        {type:"service",label:"Walk-in pathway: clinic states reservations are not required",evidenceStatus:"official-source-verified",sourceUrl:"https://azabu-seikei.com/information/",verifiedDate:checked},
        {type:"service",label:"Clinic accepts various insurance; patients without an insurance card are treated as self-pay",evidenceStatus:"official-source-verified",sourceUrl:"https://azabu-seikei.com/",verifiedDate:checked}
      ],
      medicalCost:"Unknown",
      interpreterCost:"Unknown",
      coordinatorCost:"No coordinator requirement identified for the published walk-in pathway",
      priceTransparency:"low",
      discoveryStatus:"provider-level-verified"
    },
    {
      id:"jn-handoff-akasaka-hitotsugidori",
      name:"Akasaka Hitotsugidori Clinic",
      providerType:"clinic",
      city:"Tokyo",
      area:"Minato-ku (Akasaka)",
      audience:["resident","visitor"],
      specialties:["Internal Medicine","Cardiology","Health Checkup","Ningen Dock","Sleep Apnea"],
      phone:"03-5544-8205",
      doctorEnglish:"unknown",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"unknown",
      insurance:"varies",
      selfPay:"unknown",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://www.akasaka-hitotsugiclinic.jp/",
      verified:checked,
      notes:"Official clinic pages confirm general internal medicine and cardiology, health checkups/Ningen Dock, and a sleep-apnea testing/treatment pathway. Health-check appointments can be requested by web form or phone, with same-day requests directed to phone. The official pages reviewed do not establish physician/reception English or a general visitor self-pay policy, so those fields remain unknown.",
      directorySignals:[{kind:"government-directory",name:"JNTO Medical Institution Search — Tokyo + English",sourceUrl:jnto}],
      expertiseEvidence:[
        {type:"specialist_clinic",label:"General internal medicine and cardiology clinic in Akasaka",evidenceStatus:"official-source-verified",sourceUrl:"https://www.akasaka-hitotsugiclinic.jp/",verifiedDate:checked},
        {type:"service",label:"Health checkup and Ningen Dock services with web/phone reservation pathway",evidenceStatus:"official-source-verified",sourceUrl:"https://akasaka-hitotsugiclinic.jp/kenshin/reserved",verifiedDate:checked},
        {type:"disease_focus",label:"Sleep-apnea testing and treatment pathway is published by the clinic",evidenceStatus:"official-source-verified",sourceUrl:"https://www.akasaka-hitotsugiclinic.jp/sleep/",verifiedDate:checked}
      ],
      medicalCost:"Unknown",
      interpreterCost:"Unknown",
      coordinatorCost:"Unknown",
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
  window.PROVIDER_PROMOTIONS_BATCH_3_META={checked,count:promotions.length,source:"official provider websites"};
})();