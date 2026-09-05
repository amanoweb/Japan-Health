(() => {
  const checked="2026-09-05";
  const jnto="https://www.jnto.go.jp/emergency/eng/mi_guide.html";
  const promotions=[
    {
      id:"jn-handoff-ogimoto-clinic",
      name:"Ogimoto Clinic",
      providerType:"clinic",
      city:"Tokyo",
      area:"Chiyoda-ku (Uchikanda)",
      audience:["unknown"],
      specialties:["Psychosomatic Medicine","Psychiatry","Internal Medicine","Adult ADHD","Depression","Anxiety Disorders"],
      phone:"03-3255-4730",
      doctorEnglish:"unknown",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"unknown",
      insurance:"resident",
      selfPay:"unknown",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://www.ogimoto.com/",
      verified:checked,
      notes:"Official clinic pages describe psychosomatic/internal-medicine and mental-health care in Kanda, including adult ADHD, depression and anxiety-related topics. The clinic accepts various Japanese insurance and the self-support medical-care program. Late-night care from 21:30 to 22:30 is appointment-only and first-time patients are not accepted in that late-night slot. The official pages reviewed do not establish physician/reception English, interpreter support, visitor eligibility or a general self-pay policy, so those fields remain unknown.",
      directorySignals:[{kind:"government-directory",name:"JNTO Medical Institution Search — Tokyo + English",sourceUrl:jnto}],
      expertiseEvidence:[
        {type:"specialist_clinic",label:"Psychosomatic medicine / internal-medicine clinic with published mental-health care pathway",evidenceStatus:"official-source-verified",sourceUrl:"https://www.ogimoto.com/",verifiedDate:checked},
        {type:"disease_focus",label:"Official clinic information includes adult ADHD, depression and anxiety disorders",evidenceStatus:"official-source-verified",sourceUrl:"https://www.ogimoto.com/",verifiedDate:checked},
        {type:"service",label:"Late-night 21:30–22:30 consultations are appointment-only; first-time patients are not accepted in that slot",evidenceStatus:"official-source-verified",sourceUrl:"https://www.ogimoto.com/",verifiedDate:checked},
        {type:"service",label:"Japanese insurance and self-support medical-care program are accepted",evidenceStatus:"official-source-verified",sourceUrl:"https://www.ogimoto.com/contact.html",verifiedDate:checked}
      ],
      medicalCost:"Japanese insured care supported; exact patient cost varies",
      interpreterCost:"Unknown",
      coordinatorCost:"Unknown",
      priceTransparency:"low",
      discoveryStatus:"provider-level-verified"
    },
    {
      id:"jn-handoff-tomita-minoru-eye-ginza",
      name:"Tomita Minoru EYE Clinic Ginza",
      providerType:"clinic",
      city:"Tokyo",
      area:"Chuo-ku (Ginza)",
      audience:["unknown"],
      specialties:["Ophthalmology","Cataract Surgery","Glaucoma","ICL","LASIK","LASEK","Refractive Surgery"],
      phone:"03-6228-4200",
      doctorEnglish:"unknown",
      receptionEnglish:"unknown",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"unknown",
      insurance:"both",
      selfPay:"yes",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://www.tomita-ginza.com/",
      verified:checked,
      notes:"Official clinic pages publish general ophthalmology plus cataract, glaucoma and refractive-surgery pathways including ICL, LASIK and LASEK. The clinic asks patients to reserve before visiting, accepts first-time patients, publishes separate insured/general-care and self-pay pathways, and asks insured patients to bring a My Number health-insurance card or insurance card. The reviewed provider pages do not establish physician/reception English or visitor eligibility, so those fields remain unknown.",
      directorySignals:[{kind:"government-directory",name:"JNTO Medical Institution Search — Tokyo + English",sourceUrl:jnto}],
      expertiseEvidence:[
        {type:"procedure",label:"ICL refractive-surgery pathway",evidenceStatus:"official-source-verified",sourceUrl:"https://www.tomita-ginza.com/service/icl/",verifiedDate:checked},
        {type:"procedure",label:"LASIK and LASEK self-pay refractive-surgery pathways",evidenceStatus:"official-source-verified",sourceUrl:"https://www.tomita-ginza.com/price/",verifiedDate:checked},
        {type:"service",label:"Patients are asked to reserve before visiting; first-time patients are accepted",evidenceStatus:"official-source-verified",sourceUrl:"https://www.tomita-ginza-st.com/",verifiedDate:checked},
        {type:"service",label:"Insured general-care and self-pay pathways are both published",evidenceStatus:"official-source-verified",sourceUrl:"https://www.tomita-ginza.com/",verifiedDate:checked}
      ],
      publishedCosts:[
        {label:"Premium ICL lens (hole type), both eyes",amount:"JPY 602,800",scope:"Self-pay; clinic price page states health insurance does not apply to the listed elective procedures",sourceUrl:"https://www.tomita-ginza.com/price/",verifiedDate:checked},
        {label:"8-dimensional Amaris Z8 LASIK, both eyes",amount:"JPY 437,800",scope:"Self-pay; standard listed price, tax included",sourceUrl:"https://www.tomita-ginza.com/price/",verifiedDate:checked}
      ],
      medicalCost:"Insured general ophthalmology varies; self-pay procedure prices are published",
      interpreterCost:"Unknown",
      coordinatorCost:"Unknown",
      priceTransparency:"high",
      discoveryStatus:"provider-level-verified"
    },
    {
      id:"jn-handoff-dental-studio-stod",
      name:"Dental Studio STOD",
      providerType:"clinic",
      city:"Tokyo",
      area:"Minato-ku (Higashiazabu)",
      audience:["unknown"],
      specialties:["General Dentistry","Preventive Dentistry","Cosmetic Dentistry","Dental Implants","Orthodontics","Invisalign","Pediatric Dentistry","Oral Surgery","Sedation Dentistry"],
      phone:"03-6441-0355",
      doctorEnglish:"yes",
      receptionEnglish:"yes",
      interpreter:"unknown",
      englishDocs:"unknown",
      coordinator:"no",
      insurance:"both",
      selfPay:"yes",
      referral:"unknown",
      recordStatus:"official-source-verified",
      source:"https://www.stodjapan.com/en/",
      verified:checked,
      notes:"The clinic's official English site explicitly states that doctor and staff English are available and that counseling, treatment and aftercare can be provided in English. The clinic uses an appointment system with phone, web and LINE reservation options, publishes insured and self-pay credit-card acceptance, and provides advance estimates for self-pay treatment. English availability is source-backed here; interpreter availability and referral requirements remain unknown.",
      directorySignals:[{kind:"government-directory",name:"JNTO Medical Institution Search — Tokyo + English",sourceUrl:jnto}],
      expertiseEvidence:[
        {type:"service",label:"Doctor and staff English available; counseling, treatment and aftercare offered in English",evidenceStatus:"official-source-verified",sourceUrl:"https://www.stodjapan.com/en/",verifiedDate:checked},
        {type:"service",label:"Appointment system with phone, web and LINE reservation",evidenceStatus:"official-source-verified",sourceUrl:"https://www.stodjapan.com/en/",verifiedDate:checked},
        {type:"procedure",label:"Dental implants, Invisalign/orthodontics, cosmetic dentistry and sedation options are published",evidenceStatus:"official-source-verified",sourceUrl:"https://www.stodjapan.com/en/",verifiedDate:checked},
        {type:"service",label:"Credit cards accepted for both insured and self-pay treatment; self-pay estimate available before treatment",evidenceStatus:"official-source-verified",sourceUrl:"https://www.stodjapan.com/en/",verifiedDate:checked}
      ],
      publishedCosts:[
        {label:"Initial check-up + examination",amount:"JPY 18,700",scope:"Published English price list, tax included",sourceUrl:"https://www.stodjapan.com/img/eng.pdf",verifiedDate:checked},
        {label:"Dental implant",amount:"From JPY 470,000 / tooth",scope:"Private practice; tax included",sourceUrl:"https://www.stodjapan.com/en/",verifiedDate:checked},
        {label:"Whitening",amount:"JPY 44,000–55,000 / session",scope:"Private practice; tax included",sourceUrl:"https://www.stodjapan.com/en/",verifiedDate:checked},
        {label:"Nitrous oxide sedation",amount:"JPY 5,500–11,000 / session",scope:"Private practice; tax included; fee varies by treatment and duration",sourceUrl:"https://www.stodjapan.com/en/",verifiedDate:checked}
      ],
      medicalCost:"Insured and self-pay dental care available; published self-pay fees vary by treatment",
      interpreterCost:"Unknown",
      coordinatorCost:"No coordinator requirement identified for the published direct reservation pathway",
      priceTransparency:"high",
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
  window.PROVIDER_PROMOTIONS_BATCH_5_META={checked,count:promotions.length,source:"official provider websites"};
})();