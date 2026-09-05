(() => {
  const checked = "2026-09-05";
  const verifiedClinics = [
    {
      id: "ehealth-clinic-shinjuku",
      name: "eHealth Clinic Shinjuku",
      providerType: "clinic",
      city: "Tokyo",
      area: "Shinjuku",
      audience: ["resident", "visitor"],
      specialties: ["Internal Medicine", "Nephrology", "Allergy", "Urology", "Diabetology", "Respiratory Medicine", "Health Screening"],
      doctorEnglish: "yes",
      receptionEnglish: "unknown",
      interpreter: "unknown",
      englishDocs: "yes",
      coordinator: "unknown",
      insurance: "both",
      selfPay: "yes",
      referral: "unknown",
      recordStatus: "official-source-verified",
      source: "https://ehealthclinic.jp/lang/en/",
      verified: checked,
      notes: "The clinic's official English pages describe resident and traveler care, English- and Chinese-speaking physicians, English/Chinese medical certificates and receipts, and separate reservation routes for people with and without Japanese insurance certificates. Current appointment availability should still be confirmed before visiting.",
      expertiseEvidence: [
        {type:"service",label:"Foreign-traveler outpatient care staffed by English- and Chinese-speaking physicians",evidenceStatus:"official-source-verified",sourceUrl:"https://ehealthclinic.jp/lang/en/",verifiedDate:checked},
        {type:"service",label:"English and Chinese medical certificates and receipts available",evidenceStatus:"official-source-verified",sourceUrl:"https://ehealthclinic.jp/lang/en/",verifiedDate:checked},
        {type:"service",label:"Official booking routes distinguish people with Japanese insurance certificates from those without",evidenceStatus:"official-source-verified",sourceUrl:"https://ehealthclinic.jp/lang/en/",verifiedDate:checked}
      ],
      publishedCosts: [
        {label:"Standard foreign-language consultation fee",amount:"JPY 5,500",scope:"Official English FAQ states the standard consultation fee for foreign-language consultations; other medical charges can depend on care provided.",sourceUrl:"https://ehealthclinic.jp/lang/en/faq/",verifiedDate:checked}
      ],
      medicalCost: "Foreign-language consultation fee JPY 5,500; other medical charges vary",
      interpreterCost: "Unknown",
      coordinatorCost: "Unknown",
      priceTransparency: "medium"
    },
    {
      id: "tokyo-medical-surgical-clinic-shibakoen",
      name: "Tokyo Medical and Surgical Clinic",
      providerType: "clinic",
      city: "Tokyo",
      area: "Minato",
      audience: ["resident", "visitor"],
      specialties: ["General Practice", "Preventive Health", "Children's Health", "Women's Health", "Dermatology", "Gastroenterology"],
      doctorEnglish: "yes",
      receptionEnglish: "yes",
      interpreter: "unknown",
      englishDocs: "unknown",
      coordinator: "no",
      insurance: "self-pay",
      selfPay: "yes",
      referral: "unknown",
      recordStatus: "official-source-verified",
      source: "https://tmsc.jp/",
      verified: checked,
      notes: "The clinic's official site describes English-speaking bilingual staff including full-time doctors, nurses and administrative staff, direct online/phone booking, and states that the clinic is outside the Japanese National Health Insurance system. It publishes indicative consultation fees and conditional direct billing with listed international insurers.",
      expertiseEvidence: [
        {type:"service",label:"English-speaking bilingual staff includes full-time doctors, nurses and administrative staff",evidenceStatus:"official-source-verified",sourceUrl:"https://tmsc.jp/our-facilities/",verifiedDate:checked},
        {type:"service",label:"Clinic states it is outside the Japanese National Health Insurance system",evidenceStatus:"official-source-verified",sourceUrl:"https://tmsc.jp/fees/",verifiedDate:checked},
        {type:"service",label:"Conditional direct billing arrangements are published for multiple international insurers",evidenceStatus:"official-source-verified",sourceUrl:"https://tmsc.jp/fees/",verifiedDate:checked}
      ],
      publishedCosts: [
        {label:"GP consultation",amount:"JPY 17,600",scope:"Indicative fee; exact charges can vary with services and consultation complexity.",sourceUrl:"https://tmsc.jp/fees/",verifiedDate:checked},
        {label:"Out-of-hours urgent consultation",amount:"JPY 27,500",scope:"Published for in-person or remote out-of-hours consultation; tests, medication or additional services may cost extra.",sourceUrl:"https://tmsc.jp/out-of-hours-urgent-consultations/",verifiedDate:checked}
      ],
      medicalCost: "GP consultation JPY 17,600; other charges vary",
      interpreterCost: "Unknown",
      coordinatorCost: "No coordinator requirement identified for the clinic's direct booking pathway",
      priceTransparency: "high"
    },
    {
      id: "yanagisawa-clinic-shinjuku",
      name: "Yanagisawa Clinic",
      providerType: "clinic",
      city: "Tokyo",
      area: "Shinjuku",
      audience: ["resident", "visitor"],
      specialties: ["Internal Medicine", "Infectious Diseases", "Travel Health", "Immunization", "HIV/STI Management"],
      doctorEnglish: "unknown",
      receptionEnglish: "unknown",
      interpreter: "unknown",
      englishDocs: "unknown",
      coordinator: "no",
      insurance: "unknown",
      selfPay: "unknown",
      referral: "unknown",
      recordStatus: "official-source-verified",
      source: "https://www.yanagisawa-clinic.org/yanagisawa-clinic/",
      verified: checked,
      notes: "The clinic's official English page says it accommodates English/Japanese-speaking patients, welcomes walk-ins without reservations, and lists general internal medicine, infectious diseases, immunization, travel health and HIV/STI management. The page does not separate physician English from reception English, so those fields remain unknown.",
      expertiseEvidence: [
        {type:"service",label:"English/Japanese-speaking patients accommodated; no reservation required and walk-ins welcomed",evidenceStatus:"official-source-verified",sourceUrl:"https://www.yanagisawa-clinic.org/yanagisawa-clinic/",verifiedDate:checked},
        {type:"service",label:"General internal medicine, infectious diseases, immunization, travel health and HIV/STI management listed",evidenceStatus:"official-source-verified",sourceUrl:"https://www.yanagisawa-clinic.org/yanagisawa-clinic/",verifiedDate:checked},
        {type:"service",label:"Official English page states cash only / credit cards not accepted",evidenceStatus:"official-source-verified",sourceUrl:"https://www.yanagisawa-clinic.org/yanagisawa-clinic/",verifiedDate:checked}
      ],
      medicalCost: "Unknown",
      interpreterCost: "Unknown",
      coordinatorCost: "No coordinator requirement identified for the published walk-in pathway",
      priceTransparency: "low"
    }
  ];

  const existing = new Set((window.PROVIDERS || []).map(p => p.id));
  window.PROVIDERS = [...(window.PROVIDERS || []), ...verifiedClinics.filter(p => !existing.has(p.id))];
  window.TOKYO_PROVIDER_LEVEL_META = {checked, count: verifiedClinics.length};
})();