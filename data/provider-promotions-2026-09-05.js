(() => {
  const checked = "2026-09-05";
  const promotions = [
    {
      id:"jn-handoff-american-clinic-tokyo",
      name:"American Clinic Tokyo",
      providerType:"clinic",
      city:"Tokyo",
      area:"Minato-ku (Akasaka)",
      audience:["resident","visitor"],
      specialties:["General Medicine","Travel Medicine","Vaccination","Telemedicine"],
      phone:"03-6441-0969",
      doctorEnglish:"yes",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"no",
      insurance:"self-pay",
      selfPay:"yes",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://www.americanclinictokyo.com/",
      verified:checked,
      notes:"Official site offers native English-speaking physicians for its traveler video-consultation pathway, requires advance appointments for clinic visits, and states that the cited online service does not accept health insurance. New in-person patient access may be limited and considered case by case, so current acceptance should be confirmed before relying on the clinic.",
      directorySignals:[{kind:"government-directory",name:"JNTO Medical Institution Search — Tokyo + English",sourceUrl:"https://www.jnto.go.jp/emergency/eng/mi_guide.html"}],
      expertiseEvidence:[
        {type:"service",label:"Native English-speaking physicians available through the traveler video-consultation pathway",evidenceStatus:"official-source-verified",sourceUrl:"https://www.americanclinictokyo.com/",verifiedDate:checked},
        {type:"service",label:"Clinic visits require advance appointments; online appointment request is available",evidenceStatus:"official-source-verified",sourceUrl:"https://www.americanclinictokyo.com/",verifiedDate:checked},
        {type:"service",label:"New in-person patient access may be limited and considered case by case",evidenceStatus:"official-source-verified",sourceUrl:"https://www.americanclinictokyo.com/",verifiedDate:checked}
      ],
      medicalCost:"Unknown",
      interpreterCost:"Unknown",
      coordinatorCost:"No coordinator requirement identified for the published direct booking pathway",
      priceTransparency:"low",
      discoveryStatus:"provider-level-verified"
    },
    {
      id:"jn-handoff-kishi-clinica-femina",
      name:"KISHI CLINICA FEMINA",
      providerType:"clinic",
      city:"Tokyo",
      area:"Chuo-ku (Ginza)",
      audience:["resident","visitor"],
      specialties:["Gynecology","Women's Health"],
      phone:"03-5537-7171",
      doctorEnglish:"unknown",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"unknown",
      insurance:"unknown",
      selfPay:"unknown",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://www.kishiclinicafemina.jp/english/facility/index.html",
      verified:checked,
      notes:"Official English-language clinic pages confirm the Ginza location, gynecology/women's-health focus and direct contact details. The existence of an English website is not treated as proof that the physician or reception desk is fluent in English; role-specific language capability and payment/insurance rules remain unknown until separately sourced.",
      directorySignals:[{kind:"government-directory",name:"JNTO Medical Institution Search — Tokyo + English",sourceUrl:"https://www.jnto.go.jp/emergency/eng/mi_guide.html"}],
      expertiseEvidence:[
        {type:"specialist_clinic",label:"Gynecology and women's-health clinic in Ginza with an official English-language site",evidenceStatus:"official-source-verified",sourceUrl:"https://www.kishiclinicafemina.jp/english/facility/index.html",verifiedDate:checked}
      ],
      medicalCost:"Unknown",
      interpreterCost:"Unknown",
      coordinatorCost:"Unknown",
      priceTransparency:"low",
      discoveryStatus:"provider-level-verified"
    },
    {
      id:"jn-handoff-minamiaoyama-eye",
      name:"Minamiaoyama Eye Clinic",
      providerType:"clinic",
      city:"Tokyo",
      area:"Minato-ku (Akasaka)",
      audience:["resident","visitor"],
      specialties:["Ophthalmology","Refractive Surgery","LASIK","PRK","SMILE pro","ICL"],
      phone:"03-6633-4872",
      doctorEnglish:"unknown",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"varies",
      insurance:"varies",
      selfPay:"unknown",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://minamiaoyama.or.jp/en/",
      verified:checked,
      notes:"The clinic's August 1, 2026 international-patient policy states that overseas patients/medical-tourism pathways are limited to refractive surgeries (LASIK, PRK, SMILE pro and ICL). Foreign residents in Japan are told there are no such treatment restrictions and to call to book; tourists with urgent symptoms are told to call directly. General ophthalmic care is appointment-only, and the clinic asks patients enrolled in Japanese public medical insurance to bring their insurance card. These access rules do not establish physician or reception English fluency.",
      directorySignals:[{kind:"government-directory",name:"JNTO Medical Institution Search — Tokyo + English",sourceUrl:"https://www.jnto.go.jp/emergency/eng/mi_guide.html"}],
      expertiseEvidence:[
        {type:"procedure",label:"Overseas-patient pathway accepts refractive surgeries including LASIK, PRK, SMILE pro and ICL",evidenceStatus:"official-source-verified",sourceUrl:"https://minamiaoyama.or.jp/en/",verifiedDate:checked},
        {type:"service",label:"Foreign residents in Japan are instructed to call to book and are not subject to the overseas-treatment restriction",evidenceStatus:"official-source-verified",sourceUrl:"https://minamiaoyama.or.jp/en/",verifiedDate:checked},
        {type:"service",label:"General ophthalmic care is appointment-only; Japanese public-insurance patients are asked to bring their insurance card",evidenceStatus:"official-source-verified",sourceUrl:"https://minamiaoyama.or.jp/ippan_en/",verifiedDate:checked}
      ],
      medicalCost:"Unknown",
      interpreterCost:"Unknown",
      coordinatorCost:"Varies for overseas/medical-agency pathway; amount unknown",
      priceTransparency:"low",
      discoveryStatus:"provider-level-verified"
    }
  ];

  const normalize = value => String(value || "").toLowerCase().replace(/[^a-z0-9]/g,"");
  const byId = new Map(promotions.map(p => [p.id,p]));
  const byName = new Map(promotions.map(p => [normalize(p.name),p]));
  const replaced = new Set();
  window.PROVIDERS = (window.PROVIDERS || []).map(p => {
    const replacement = byId.get(p.id) || byName.get(normalize(p.name));
    if (!replacement) return p;
    replaced.add(replacement.id);
    return replacement;
  });
  for (const p of promotions) if (!replaced.has(p.id)) window.PROVIDERS.push(p);
  window.PROVIDER_PROMOTIONS_META = {checked,count:promotions.length,source:"official provider websites"};
})();