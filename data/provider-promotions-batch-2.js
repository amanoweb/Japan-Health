(() => {
  const checked="2026-09-05";
  const jnto="https://www.jnto.go.jp/emergency/eng/mi_guide.html";
  const promotions=[
    {
      id:"jn-handoff-garden-clinic-hiroo",
      name:"Garden Clinic Hiroo",
      providerType:"clinic",
      city:"Tokyo",
      area:"Minato-ku (Minamiaoyama)",
      audience:["resident","visitor"],
      specialties:["Dermatology","Pediatric Dermatology","Cosmetic Dermatology","Allergy","Skin Cancer Screening","Vaccination","Travel Vaccination"],
      phone:"03-6427-9198",
      doctorEnglish:"yes",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"no",
      insurance:"resident",
      selfPay:"yes",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://gardenclinic-hiroo.com/doctor-en/",
      verified:checked,
      notes:"Official English pages state that medical director Dr. Chin-Huai Keong is fluent in English and Japanese and that the clinic serves Japanese and international clients. The clinic lists adult and pediatric dermatology plus cosmetic dermatology, allergy care, skin-cancer screening and routine/travel vaccination. The Japanese site states that My Number health-insurance qualification can be used. Reception-level English and current appointment availability are not inferred.",
      directorySignals:[{kind:"government-directory",name:"JNTO Medical Institution Search — Tokyo + English",sourceUrl:jnto}],
      expertiseEvidence:[
        {type:"service",label:"Medical director is fluent in English and Japanese",evidenceStatus:"official-source-verified",sourceUrl:"https://gardenclinic-hiroo.com/doctor-en/",verifiedDate:checked},
        {type:"service",label:"Clinic serves Japanese and international clients",evidenceStatus:"official-source-verified",sourceUrl:"https://gardenclinic-hiroo.com/mainenglish/",verifiedDate:checked},
        {type:"specialist_clinic",label:"Adult and pediatric dermatology with cosmetic dermatology, allergy care and skin-cancer screening",evidenceStatus:"official-source-verified",sourceUrl:"https://gardenclinic-hiroo.com/mainenglish/",verifiedDate:checked},
        {type:"service",label:"Japanese site supports My Number health-insurance qualification confirmation",evidenceStatus:"official-source-verified",sourceUrl:"https://gardenclinic-hiroo.com/home-ja/",verifiedDate:checked}
      ],
      medicalCost:"Unknown",
      interpreterCost:"Unknown",
      coordinatorCost:"No coordinator requirement identified for the clinic's direct contact pathway",
      priceTransparency:"low",
      discoveryStatus:"provider-level-verified"
    },
    {
      id:"jn-handoff-mima-ladies",
      name:"Mima Ladies Clinic",
      providerType:"clinic",
      city:"Tokyo",
      area:"Minato-ku (Akasaka)",
      audience:["resident","visitor"],
      specialties:["Gynecology","Fertility","Menopause","Psychosomatic Medicine","Cosmetic Infusion"],
      phone:"03-6277-7397",
      doctorEnglish:"unknown",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"unknown",
      insurance:"unknown",
      selfPay:"unknown",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://www.mima-ladies.com/",
      verified:checked,
      notes:"Official clinic pages confirm gynecology, general fertility care, menopause care, psychosomatic medicine and cosmetic infusion services at the Akasaka location. A language selector is present, but the available pages reviewed do not establish whether the physician or reception desk specifically provides English-language care, so role-specific language fields remain unknown.",
      directorySignals:[{kind:"government-directory",name:"JNTO Medical Institution Search — Tokyo + English",sourceUrl:jnto}],
      expertiseEvidence:[
        {type:"specialist_clinic",label:"Gynecology and fertility-focused clinic in Akasaka",evidenceStatus:"official-source-verified",sourceUrl:"https://www.mima-ladies.com/",verifiedDate:checked},
        {type:"service",label:"Official site lists gynecology, fertility, menopause, psychosomatic medicine and cosmetic infusion services",evidenceStatus:"official-source-verified",sourceUrl:"https://www.mima-ladies.com/",verifiedDate:checked}
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
  window.PROVIDER_PROMOTIONS_BATCH_2_META={checked,count:promotions.length,source:"official provider websites"};
})();