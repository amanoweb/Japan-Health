(() => {
  const checked="2026-09-05";
  const promotions=[
    {
      id:"sengawa-ent-clinic",
      name:"Sengawa ENT Clinic",
      providerType:"clinic",
      city:"Tokyo",
      area:"Chofu (Sengawa)",
      audience:["unknown"],
      specialties:["ENT","Otorhinolaryngology","Allergy","Voice Clinic"],
      phone:"03-5313-3281",
      doctorEnglish:"yes",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"unknown",
      insurance:"unknown",
      selfPay:"unknown",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://www.sengawaentclinic.org/",
      verified:checked,
      notes:"The clinic's official site explicitly states that examination in English is available for otolaryngology. It provides general ear, nose and throat care, allergy care and a voice clinic, and publishes 24-hour internet reservation plus phone reservation options. The reviewed provider pages do not establish reception-level English, interpreter availability, visitor/resident eligibility, insurance or referral rules, so those remain unknown.",
      expertiseEvidence:[
        {type:"service",label:"Official site states examination in English is available for otolaryngology",evidenceStatus:"official-source-verified",sourceUrl:"https://www.sengawaentclinic.org/",verifiedDate:checked},
        {type:"specialist_clinic",label:"General ENT care plus allergy and voice-clinic services",evidenceStatus:"official-source-verified",sourceUrl:"https://www.sengawaentclinic.org/",verifiedDate:checked},
        {type:"service",label:"24-hour internet reservation and phone reservation are published",evidenceStatus:"official-source-verified",sourceUrl:"https://www.sengawaentclinic.org/infomation",verifiedDate:checked}
      ],
      medicalCost:"Unknown",
      interpreterCost:"Unknown",
      coordinatorCost:"Unknown",
      priceTransparency:"low",
      discoveryStatus:"provider-level-verified"
    },
    {
      id:"hongo-ent-clinic",
      name:"Hongo ENT, Allergy and Voice Clinic",
      providerType:"clinic",
      city:"Tokyo",
      area:"Bunkyo (Hongo)",
      audience:["unknown"],
      specialties:["ENT","Otorhinolaryngology","Allergy","Voice Disorders","Pediatric ENT"],
      phone:"03-5689-4133",
      doctorEnglish:"unknown",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"unknown",
      insurance:"unknown",
      selfPay:"unknown",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://www.hongoent.com/english/",
      verified:checked,
      notes:"The official English clinic page describes broad ear, nose and throat care for adults and children, allergy treatment and a dedicated voice-clinic pathway with voice evaluation, fiberoptic laryngoscopy, stroboscopy and rehabilitation. It publishes web-based and phone appointment routes. Tokyo's foreign-patient list separately lists English for Hongo ENT Clinic. The reviewed provider page does not explicitly assign English capability to the physician or reception staff, so those fields remain unknown.",
      directorySignals:[{kind:"government-directory",name:"Tokyo Metropolitan Government foreign-patient list — English listed",sourceUrl:"https://www.hokeniryo.metro.tokyo.lg.jp/iryo/iryo_hoken/medical_info_eng/hospitals_list/chiyodaku"}],
      expertiseEvidence:[
        {type:"service",label:"Official English page covers adult and pediatric ear, nose and throat care",evidenceStatus:"official-source-verified",sourceUrl:"https://www.hongoent.com/english/",verifiedDate:checked},
        {type:"specialist_clinic",label:"Voice clinic with voice evaluation, laryngoscopy/stroboscopy and rehabilitation",evidenceStatus:"official-source-verified",sourceUrl:"https://www.hongoent.com/english/",verifiedDate:checked},
        {type:"service",label:"Web-based and phone appointment routes are published",evidenceStatus:"official-source-verified",sourceUrl:"https://www.hongoent.com/english/",verifiedDate:checked}
      ],
      medicalCost:"Unknown",
      interpreterCost:"Unknown",
      coordinatorCost:"Unknown",
      priceTransparency:"low",
      discoveryStatus:"provider-level-verified"
    },
    {
      id:"urao-ent-clinic",
      name:"Urao Clinic",
      providerType:"clinic",
      city:"Tokyo",
      area:"Taito (Minowa)",
      audience:["unknown"],
      specialties:["ENT","Otorhinolaryngology","Hearing Loss","Dizziness","Sleep Apnea"],
      phone:"03-3875-0242",
      doctorEnglish:"unknown",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"unknown",
      insurance:"unknown",
      selfPay:"unknown",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://uraoiin-ioukai.com/english",
      verified:checked,
      notes:"The clinic's official English page describes ear, nose and throat care including sinusitis, ear infections, hearing loss, dizziness, swallowing difficulty and sleep apnea. It asks patients to make a reservation by phone before visiting and publishes clinic hours and access in English. The page does not explicitly establish physician English, reception English, interpreter availability, insurance eligibility or visitor/resident rules, so those fields remain unknown.",
      expertiseEvidence:[
        {type:"service",label:"Official English page describes broad outpatient ENT care",evidenceStatus:"official-source-verified",sourceUrl:"https://uraoiin-ioukai.com/english",verifiedDate:checked},
        {type:"disease_focus",label:"Hearing loss, dizziness, swallowing difficulty and sleep apnea are listed among common conditions",evidenceStatus:"official-source-verified",sourceUrl:"https://uraoiin-ioukai.com/english",verifiedDate:checked},
        {type:"service",label:"Patients are asked to reserve by phone before visiting",evidenceStatus:"official-source-verified",sourceUrl:"https://uraoiin-ioukai.com/english",verifiedDate:checked}
      ],
      medicalCost:"Unknown",
      interpreterCost:"Unknown",
      coordinatorCost:"Unknown",
      priceTransparency:"low",
      discoveryStatus:"provider-level-verified"
    },
    {
      id:"shimotakaido-ent-plus",
      name:"Shimotakaido Station Clinic ENT plus+",
      providerType:"clinic",
      city:"Tokyo",
      area:"Suginami (Shimotakaido)",
      audience:["unknown"],
      specialties:["ENT","Pediatric ENT","Allergy","Internal Medicine"],
      phone:"03-6379-2071",
      doctorEnglish:"unknown",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"unknown",
      insurance:"both",
      selfPay:"yes",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://www.shimotaka-clinic.com/english",
      verified:checked,
      notes:"The clinic maintains an official English page for its ENT service and describes general ear, nose and throat care for children through older adults. The current Japanese clinic page says ENT visits are generally walk-in rather than reservation-based, while selected services require appointments. It also states that patients with valid Japanese insurance documentation can use insured care and those without it are billed as self-pay. The reviewed pages do not explicitly establish physician or reception English, so those fields remain unknown.",
      expertiseEvidence:[
        {type:"service",label:"Official English page describes the clinic's ENT family-doctor pathway",evidenceStatus:"official-source-verified",sourceUrl:"https://www.shimotaka-clinic.com/english",verifiedDate:checked},
        {type:"service",label:"ENT care is generally walk-in; selected services require appointment",evidenceStatus:"official-source-verified",sourceUrl:"https://www.shimotaka-clinic.com/",verifiedDate:checked},
        {type:"service",label:"Japanese insurance documentation is accepted; patients without it are billed self-pay",evidenceStatus:"official-source-verified",sourceUrl:"https://www.shimotaka-clinic.com/",verifiedDate:checked}
      ],
      medicalCost:"Japanese insured care supported; self-pay applies without valid insurance documentation; exact cost varies",
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
  window.PROVIDER_PROMOTIONS_BATCH_7_META={checked,count:promotions.length,source:"official provider websites"};
})();
