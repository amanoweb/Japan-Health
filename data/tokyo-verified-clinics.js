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

  // Additional clinics carried in the Japan Health Drive handoff. These are directory-level
  // discovery records from JNTO only. No physician fluency, reception fluency, interpreter,
  // insurance, self-pay, referral, visitor/resident eligibility, pricing, or current acceptance
  // is inferred from the directory listing.
  const jntoSource = "https://www.jnto.go.jp/emergency/eng/mi_guide.html";
  const driveDirectoryCandidates = [
    ["jnto-kishi-clinica-femina","KISHI CLINICA FEMINA","Chuo / Ginza","03-5537-7171",["Internal Medicine","Gynecology"]],
    ["jnto-akasaka-hitotsugidori-clinic","Akasaka Hitotsugidori Clinic","Minato / Akasaka","03-5544-8205",["Internal Medicine","Dermatology"]],
    ["jnto-azabu-clinic","Azabu Clinic","Minato / Azabujuban","03-5545-8177",["Internal Medicine","Dermatology"]],
    ["jnto-garden-clinic-hiroo","Garden Clinic Hiroo","Minato / Minamiaoyama","03-6427-9198",["Dermatology"]],
    ["jnto-american-clinic-tokyo","American Clinic Tokyo","Minato / Akasaka","03-6441-0969",["Internal Medicine","Psychiatry"]],
    ["jnto-ogimoto-clinic","Ogimoto Clinic","Chiyoda","03-3255-4730",["Internal Medicine","Psychiatry"]],
    ["jnto-tomita-minoru-eye-clinic-ginza","Tomita Minoru EYE Clinic Ginza","Chuo / Ginza","03-6228-4200",["Ophthalmology"]],
    ["jnto-minamiaoyama-eye-clinic","Minamiaoyama Eye Clinic","Minato / Kitaaoyama","03-5772-1451",["Ophthalmology"]],
    ["jnto-ohtsuka-clinic","Ohtsuka Clinic","Bunkyo / Yushima","03-3831-2294",["Pediatrics","Internal Medicine"]],
    ["jnto-tatsuno-clinic","Tatsuno Clinic","Bunkyo / Hongo","03-5800-0203",["Pediatrics","Internal Medicine"]],
    ["jnto-kumada-clinic","Kumada Clinic","Minato / Nishiazabu","03-5766-3357",["Otorhinolaryngology"]],
    ["jnto-wada-otorhinolaryngology","Wada Otorhinolaryngology","Chiyoda","03-3255-1187",["Otorhinolaryngology"]],
    ["jnto-azabu-orthopaedic-clinic","Azabu Orthopaedic Clinic","Minato / Azabujuban","03-5765-2020",["Orthopedic Surgery"]],
    ["jnto-mima-ladies-clinic","Mima Ladies Clinic","Minato / Akasaka","03-6277-7397",["Gynecology"]],
    ["jnto-dental-studio-stod","Dental Studio STOD","Minato / Higashiazabu","03-6441-0355",["Oral Health"]],
    ["jnto-nakano-dental","Nakano Dental","Minato / Shirokanedai","03-3446-1117",["Oral Health"]]
  ].map(([id,name,area,phone,specialties]) => ({
    id,
    name,
    providerType: "clinic",
    city: "Tokyo",
    area,
    phone,
    audience: ["unknown"],
    specialties,
    languagesListed: "English — JNTO directory filter",
    doctorEnglish: "unknown",
    receptionEnglish: "unknown",
    interpreter: "unknown",
    englishDocs: "unknown",
    coordinator: "unknown",
    insurance: "unknown",
    selfPay: "unknown",
    referral: "unknown",
    recordStatus: "official-source-verified",
    source: jntoSource,
    verified: checked,
    notes: "JNTO Medical Institution Search directory candidate imported from the Japan Health Drive handoff. The directory record supports the institution name, Tokyo area, listed specialty and discovery under the English-language filter only. Provider-level English capability, visitor/resident eligibility, insurance, self-pay, referral rules, interpreter access, fees and current acceptance remain unverified and must be confirmed from the provider's own source.",
    directorySignals: [{kind:"government-directory",name:"JNTO Medical Institution Search",sourceUrl:jntoSource}],
    expertiseEvidence: [{
      type: "service",
      label: `JNTO directory-listed specialty: ${specialties.join(", ")}`,
      evidenceStatus: "official-source-verified",
      sourceUrl: jntoSource,
      verifiedDate: checked
    }],
    medicalCost: "Unknown",
    interpreterCost: "Unknown",
    coordinatorCost: "Unknown",
    priceTransparency: "low",
    directoryBasis: "JNTO Medical Institution Search",
    directoryOnly: true
  }));

  const existingIds = new Set((window.PROVIDERS || []).map(p => p.id));
  const normalizeName = value => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  const existingNames = new Set((window.PROVIDERS || []).map(p => normalizeName(p.name)));
  const appendUnique = records => records.filter(p => !existingIds.has(p.id) && !existingNames.has(normalizeName(p.name)));

  const newVerified = appendUnique(verifiedClinics);
  newVerified.forEach(p => { existingIds.add(p.id); existingNames.add(normalizeName(p.name)); });
  const newDirectoryCandidates = appendUnique(driveDirectoryCandidates);

  window.PROVIDERS = [...(window.PROVIDERS || []), ...newVerified, ...newDirectoryCandidates];
  window.TOKYO_PROVIDER_LEVEL_META = {checked, count: verifiedClinics.length};
  window.DRIVE_JNTO_CANDIDATE_META = {
    checked,
    source: jntoSource,
    sourceCount: driveDirectoryCandidates.length,
    addedCount: newDirectoryCandidates.length,
    caveat: "Directory-only records; provider-level access facts remain unknown until independently verified."
  };
})();