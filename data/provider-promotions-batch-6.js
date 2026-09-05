(() => {
  const checked="2026-09-05";
  const promotions=[
    {
      id:"anbi-shibuya-dental-orthodontics",
      name:"ANBI Shibuya Dental & Orthodontics",
      providerType:"clinic",
      city:"Tokyo",
      area:"Shibuya",
      audience:["resident","visitor"],
      specialties:["General Dentistry","Orthodontics","Dental Implants","Aesthetic Dentistry","Preventive Dentistry"],
      doctorEnglish:"yes",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"no",
      insurance:"unknown",
      selfPay:"yes",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://www.anbishibuya.com/en",
      verified:checked,
      notes:"The official English site describes the clinic as an English-speaking dental and orthodontic practice and says services are offered in English, Korean and Japanese. It publishes direct clinic information and self-pay prices for initial consultation, re-examination, cleaning and whitening. The reviewed page does not establish reception-level English, interpreter support, Japanese insurance eligibility or referral rules, so those fields remain unknown.",
      expertiseEvidence:[
        {type:"service",label:"Official English site identifies the practice as an English-speaking dental and orthodontic clinic",evidenceStatus:"official-source-verified",sourceUrl:"https://www.anbishibuya.com/en",verifiedDate:checked},
        {type:"service",label:"Clinic states services are offered in English, Korean and Japanese",evidenceStatus:"official-source-verified",sourceUrl:"https://www.anbishibuya.com/en",verifiedDate:checked},
        {type:"procedure",label:"General dentistry, orthodontic, implant and aesthetic dental services are published",evidenceStatus:"official-source-verified",sourceUrl:"https://www.anbishibuya.com/en",verifiedDate:checked}
      ],
      publishedCosts:[
        {label:"Initial consultation fee",amount:"JPY 5,000 before tax",scope:"Published on official English site",sourceUrl:"https://www.anbishibuya.com/en",verifiedDate:checked},
        {label:"Cleaning",amount:"JPY 6,000 / 30 min before tax",scope:"Published on official English site",sourceUrl:"https://www.anbishibuya.com/en",verifiedDate:checked},
        {label:"ANBI Whitening",amount:"JPY 20,000 before tax",scope:"Published on official English site",sourceUrl:"https://www.anbishibuya.com/en",verifiedDate:checked}
      ],
      medicalCost:"Published self-pay fees available; exact treatment cost varies",
      interpreterCost:"Unknown",
      coordinatorCost:"No coordinator requirement identified for the clinic's direct-care pathway",
      priceTransparency:"high",
      discoveryStatus:"provider-level-verified"
    },
    {
      id:"kamiyacho-dental-clinic",
      name:"Kamiyacho Dental Clinic",
      providerType:"clinic",
      city:"Tokyo",
      area:"Minato-ku (Kamiyacho)",
      audience:["resident","visitor"],
      specialties:["General Dentistry","Root Canal Treatment","Restorative Dentistry","Preventive Dentistry","CAD/CAM Dentistry"],
      doctorEnglish:"yes",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"no",
      insurance:"unknown",
      selfPay:"unknown",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://kamiyacho-dc.jp/en/",
      verified:checked,
      notes:"The official English site explicitly presents the clinic as an English-speaking dentist in Japan and says care is available in English. It describes microscope-based dentistry, CAD treatment and a direct appointment pathway. The reviewed English page does not establish reception-level English, interpreter support, insurance eligibility, self-pay rules or referral requirements, so those fields remain unknown.",
      expertiseEvidence:[
        {type:"service",label:"Official site explicitly states dental care is available in English",evidenceStatus:"official-source-verified",sourceUrl:"https://kamiyacho-dc.jp/en/",verifiedDate:checked},
        {type:"procedure",label:"Microscope-based treatment and CAD-supported dentistry are described",evidenceStatus:"official-source-verified",sourceUrl:"https://kamiyacho-dc.jp/en/",verifiedDate:checked},
        {type:"service",label:"Direct appointment pathway is provided on the official English site",evidenceStatus:"official-source-verified",sourceUrl:"https://kamiyacho-dc.jp/en/",verifiedDate:checked}
      ],
      medicalCost:"Unknown",
      interpreterCost:"Unknown",
      coordinatorCost:"No coordinator requirement identified for the published direct appointment pathway",
      priceTransparency:"low",
      discoveryStatus:"provider-level-verified"
    },
    {
      id:"azabudai-united-dental-office",
      name:"Azabudai United Dental Office",
      providerType:"clinic",
      city:"Tokyo",
      area:"Minato-ku (Azabudai)",
      audience:["resident","visitor"],
      specialties:["General Dentistry","Restorative Dentistry","Dental Implants","Preventive Dentistry"],
      doctorEnglish:"unknown",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"no",
      insurance:"unknown",
      selfPay:"unknown",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://www.englishspeakingdentist.jp/",
      verified:checked,
      notes:"The clinic's official English site describes an international dental office in Tokyo and identifies three US-licensed dentists. Tokyo Metropolitan Government's foreign-patient list also lists English for the clinic. The reviewed provider page does not explicitly separate doctor English from reception English or establish interpreter, insurance, self-pay or referral rules, so those fields remain unknown.",
      directorySignals:[{kind:"government-directory",name:"Tokyo Metropolitan Government foreign-patient list — English listed",sourceUrl:"https://www.hokeniryo.metro.tokyo.lg.jp/iryo/iryo_hoken/medical_info_eng/hospitals_list/minatoku"}],
      expertiseEvidence:[
        {type:"service",label:"Official site describes an international dental office serving Tokyo's international community",evidenceStatus:"official-source-verified",sourceUrl:"https://www.englishspeakingdentist.jp/",verifiedDate:checked},
        {type:"service",label:"Official site identifies three US-licensed dentists",evidenceStatus:"official-source-verified",sourceUrl:"https://www.englishspeakingdentist.jp/",verifiedDate:checked}
      ],
      medicalCost:"Unknown",
      interpreterCost:"Unknown",
      coordinatorCost:"No coordinator requirement identified on the reviewed provider page",
      priceTransparency:"low",
      discoveryStatus:"provider-level-verified"
    },
    {
      id:"azabu-tokyo-dental-clinic",
      name:"Azabu Tokyo Dental Clinic",
      providerType:"clinic",
      city:"Tokyo",
      area:"Minato-ku (Azabu)",
      audience:["resident","visitor"],
      specialties:["General Dentistry","Dental Implants","Prosthodontics","Aesthetic Dentistry","Preventive Dentistry"],
      doctorEnglish:"unknown",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"no",
      insurance:"unknown",
      selfPay:"yes",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://azabutokyodc.jp/en/",
      verified:checked,
      notes:"The official English site states that the clinic offers services in English and describes implant, prosthetic, esthetic and preventive dental care. It also describes one-to-one counseling with a treatment plan and realistic cost estimate before treatment. The page does not separate physician/dentist English from reception English or establish interpreter, insurance or referral rules, so those remain unknown.",
      directorySignals:[{kind:"government-directory",name:"Tokyo Metropolitan Government foreign-patient list — English listed",sourceUrl:"https://www.hokeniryo.metro.tokyo.lg.jp/iryo/iryo_hoken/medical_info_eng/hospitals_list/minatoku"}],
      expertiseEvidence:[
        {type:"service",label:"Official English site states that services are offered in English",evidenceStatus:"official-source-verified",sourceUrl:"https://azabutokyodc.jp/en/",verifiedDate:checked},
        {type:"procedure",label:"Implant, prosthetic, esthetic and preventive dental care are published",evidenceStatus:"official-source-verified",sourceUrl:"https://azabutokyodc.jp/en/",verifiedDate:checked},
        {type:"service",label:"One-to-one counseling includes a treatment plan and realistic cost estimate before treatment",evidenceStatus:"official-source-verified",sourceUrl:"https://azabutokyodc.jp/en/",verifiedDate:checked}
      ],
      medicalCost:"Treatment estimate provided before care; exact cost varies",
      interpreterCost:"Unknown",
      coordinatorCost:"No coordinator requirement identified for the published direct consultation pathway",
      priceTransparency:"medium",
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
  window.PROVIDER_PROMOTIONS_BATCH_6_META={checked,count:promotions.length,source:"official provider websites"};
})();