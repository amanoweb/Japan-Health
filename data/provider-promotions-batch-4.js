(() => {
  const checked="2026-09-05";
  const jnto="https://www.jnto.go.jp/emergency/eng/mi_guide.html";
  const promotions=[
    {
      id:"jn-handoff-azabu-clinic",
      name:"Azabu Clinic",
      providerType:"clinic",
      city:"Tokyo",
      area:"Minato-ku (Azabujuban)",
      audience:["unknown"],
      specialties:["Internal Medicine","Gastroenterology","Hepatology","Dermatology","Allergy","Health Checkup","Vaccination","STI Testing"],
      phone:"03-5545-8177",
      doctorEnglish:"unknown",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"no",
      insurance:"varies",
      selfPay:"yes",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://www.azabu-iin.com/",
      verified:checked,
      notes:"The clinic's official site confirms internal medicine, hepatology/gastroenterology, dermatology and allergy care, plus health checks, vaccination and STI testing. It publishes a separate telephone pathway for self-pay services and states that patients under 18 are not seen. General reservations are available by automated telephone. The reviewed official site does not establish physician/reception English, interpreter availability, a general visitor eligibility rule or referral requirements, so those fields remain unknown.",
      directorySignals:[{kind:"government-directory",name:"JNTO Medical Institution Search — Tokyo + English",sourceUrl:jnto}],
      expertiseEvidence:[
        {type:"specialist_clinic",label:"Internal medicine, hepatology/gastroenterology, dermatology and allergy care",evidenceStatus:"official-source-verified",sourceUrl:"https://www.azabu-iin.com/",verifiedDate:checked},
        {type:"service",label:"Separate telephone reservation pathway is published for self-pay services",evidenceStatus:"official-source-verified",sourceUrl:"https://www.azabu-iin.com/",verifiedDate:checked},
        {type:"service",label:"Clinic states that patients under 18 are not seen",evidenceStatus:"official-source-verified",sourceUrl:"https://www.azabu-iin.com/",verifiedDate:checked},
        {type:"service",label:"Health checks, vaccination and STI testing are published services",evidenceStatus:"official-source-verified",sourceUrl:"https://www.azabu-iin.com/",verifiedDate:checked}
      ],
      medicalCost:"Unknown",
      interpreterCost:"Unknown",
      coordinatorCost:"No coordinator requirement identified for the published direct reservation pathways",
      priceTransparency:"low",
      discoveryStatus:"provider-level-verified"
    },
    {
      id:"jn-handoff-tatsuno-clinic",
      name:"Tatsuno Clinic",
      providerType:"clinic",
      city:"Tokyo",
      area:"Bunkyo-ku (Hongo)",
      audience:["unknown"],
      specialties:["Internal Medicine","Cardiology","Pediatrics","Hypertension","Adult Congenital Heart Disease","Pediatric Congenital Heart Disease","Health Checkup","Vaccination"],
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
      notes:"The clinic's official site confirms internal medicine, cardiovascular medicine and pediatrics in Hongo. Its published care information includes hypertension, ischemic and valvular heart disease, arrhythmia, adult and pediatric congenital heart disease, vaccinations, health checks and second-opinion consultations related to heart surgery. Patient contact is by telephone. The reviewed official site does not establish physician/reception English, interpreter support, insurance/self-pay rules, visitor eligibility or referral requirements, so those fields remain unknown.",
      directorySignals:[{kind:"government-directory",name:"JNTO Medical Institution Search — Tokyo + English",sourceUrl:jnto}],
      expertiseEvidence:[
        {type:"specialist_clinic",label:"Internal medicine, cardiovascular medicine and pediatrics clinic in Hongo",evidenceStatus:"official-source-verified",sourceUrl:"https://www.tatsuno-clinic.com/",verifiedDate:checked},
        {type:"disease_focus",label:"Adult and pediatric congenital heart disease, hypertension, ischemic heart disease, valvular disease and arrhythmia are listed in the clinic's cardiovascular scope",evidenceStatus:"official-source-verified",sourceUrl:"https://www.tatsuno-clinic.com/sp/original5.html",verifiedDate:checked},
        {type:"second_opinion",label:"Second-opinion consultations related to heart surgery are published by the clinic",evidenceStatus:"official-source-verified",sourceUrl:"https://www.tatsuno-clinic.com/sp/original5.html",verifiedDate:checked},
        {type:"service",label:"Vaccinations and health-check services are published by the clinic",evidenceStatus:"official-source-verified",sourceUrl:"https://www.tatsuno-clinic.com/sp/original11.html",verifiedDate:checked},
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
      specialties:["Otorhinolaryngology","Voice and Speech Medicine","Swallowing Disorders","Spasmodic Dysphonia","Speech Therapy"],
      phone:"03-5766-3357",
      doctorEnglish:"unknown",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"no",
      insurance:"both",
      selfPay:"yes",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://kumadaclinic.com/en/",
      verified:checked,
      notes:"The clinic's official English site describes specialist ENT and voice/speech care. It publishes a direct web/phone reservation pathway and states that appointments are required. The clinic says it accepts Japanese Government Health Insurance and Social Insurance; it also publishes credit-card payment for care not covered by Japanese health insurance. Its site identifies the clinic as included in the JNTO traveler medical guide. The English website itself is not treated as proof of physician or reception fluency, so role-specific English fields remain unknown.",
      directorySignals:[{kind:"government-directory",name:"JNTO Medical Institution Search — Tokyo + English",sourceUrl:jnto}],
      expertiseEvidence:[
        {type:"specialist_clinic",label:"ENT clinic specializing in voice and speech medicine",evidenceStatus:"official-source-verified",sourceUrl:"https://kumadaclinic.com/en/",verifiedDate:checked},
        {type:"disease_focus",label:"Voice, pronunciation, speech, language-development and swallowing disorders are within the published specialty scope",evidenceStatus:"official-source-verified",sourceUrl:"https://kumadaclinic.com/en/sound-en/",verifiedDate:checked},
        {type:"procedure",label:"Botulinum toxin injection for spasmodic dysphonia is a published clinic procedure",evidenceStatus:"official-source-verified",sourceUrl:"https://kumadaclinic.com/en/sound-en/",verifiedDate:checked},
        {type:"procedure",label:"Laryngeal EMG is published as part of the voice/speech diagnostic pathway",evidenceStatus:"official-source-verified",sourceUrl:"https://kumadaclinic.com/en/sound-en/",verifiedDate:checked},
        {type:"service",label:"Speech therapists provide voice, speech and swallowing therapy",evidenceStatus:"official-source-verified",sourceUrl:"https://kumadaclinic.com/en/sound-en/",verifiedDate:checked},
        {type:"service",label:"Appointment required; direct web and telephone reservation pathways are published",evidenceStatus:"official-source-verified",sourceUrl:"https://kumadaclinic.com/en/access-en/",verifiedDate:checked},
        {type:"service",label:"Japanese public/social insurance is accepted and non-covered care can be paid by credit card",evidenceStatus:"official-source-verified",sourceUrl:"https://kumadaclinic.com/en/link-en/",verifiedDate:checked}
      ],
      medicalCost:"Varies by Japanese insurance coverage and service; exact amount unknown",
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