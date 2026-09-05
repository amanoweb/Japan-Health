(() => {
  const checked = "2026-09-05";
  const jnto = "https://www.jnto.go.jp/emergency/eng/mi_guide.html";

  const verified = [
    {
      id:"ncnp-international-patients",name:"NCNP Hospital — International Patient Pathway",providerType:"hospital",city:"Tokyo",area:"Kodaira",audience:["resident","visitor"],specialties:["Neurology","Psychiatry","Neurosurgery","International Patient Services"],doctorEnglish:"unknown",receptionEnglish:"unknown",interpreter:"external",englishDocs:"unknown",coordinator:"varies",insurance:"both",selfPay:"yes",referral:"varies",recordStatus:"official-source-verified",source:"https://hsp.ncnp.go.jp/EN/",verified:checked,notes:"NCNP publishes separate foreign-patient pathways by Japanese insurance status. Insured patients are asked to bring their own medical interpreter; uninsured patients use contracted guaranteeing/intermediary agencies. Confirm case acceptance directly.",directorySignals:[{kind:"government-directory",name:"JNTO medical institution list",sourceUrl:jnto}],expertiseEvidence:[{type:"service",label:"Foreign-patient pathways differ by Japanese public insurance status",evidenceStatus:"official-source-verified",sourceUrl:"https://hsp.ncnp.go.jp/EN/",verifiedDate:checked},{type:"disease_focus",label:"Psychiatric, neurological, muscular and developmental diseases are within hospital scope",evidenceStatus:"official-source-verified",sourceUrl:"https://hsp.ncnp.go.jp/EN/",verifiedDate:checked}],publishedCosts:[{label:"Additional first-visit fee when referral letter cannot be prepared",amount:"JPY 7,700",scope:"Separate from normal consultation fee",sourceUrl:"https://hsp.ncnp.go.jp/EN/",verifiedDate:checked}],medicalCost:"Varies by pathway",interpreterCost:"External / agency arrangement; amount unknown",coordinatorCost:"Unknown",priceTransparency:"medium"
    },
    {
      id:"tokyo-medical-university-international",name:"Tokyo Medical University Hospital — International Medical Care",providerType:"hospital",city:"Tokyo",area:"Shinjuku",audience:["visitor"],specialties:["International Patient Services"],doctorEnglish:"unknown",receptionEnglish:"unknown",interpreter:"unknown",englishDocs:"unknown",coordinator:"required",insurance:"self-pay",selfPay:"yes",referral:"unknown",recordStatus:"official-source-verified",source:"https://hospinfo.tokyo-med.ac.jp/shinryo/kokusai/index.html",verified:checked,notes:"For patients from other countries without Japanese public medical insurance, the hospital requires support from a contracted guarantor / international medical-care coordination organization. Department-level language support is not inferred.",directorySignals:[{kind:"government-directory",name:"JNTO medical institution list",sourceUrl:jnto}],expertiseEvidence:[{type:"service",label:"Contracted guarantor / medical-coordination organization required for cited uninsured overseas pathway",evidenceStatus:"official-source-verified",sourceUrl:"https://hospinfo.tokyo-med.ac.jp/shinryo/kokusai/index.html",verifiedDate:checked}],medicalCost:"Patient responsible; amount unknown",interpreterCost:"Unknown",coordinatorCost:"Unknown",priceTransparency:"low"
    },
    {
      id:"tokyo-business-clinic-yaesu",name:"Tokyo Business Clinic — Yaesu North Exit",providerType:"clinic",city:"Tokyo",area:"Marunouchi",audience:["unknown"],specialties:["Internal Medicine","Surgery","Pediatrics","Dermatology"],doctorEnglish:"unknown",receptionEnglish:"unknown",interpreter:"unknown",englishDocs:"yes",coordinator:"unknown",insurance:"unknown",selfPay:"unknown",referral:"unknown",recordStatus:"official-source-verified",source:"https://www.businessclinic.tokyo/en/yaesu-north-exit",verified:checked,notes:"Official site lists English/Japanese/Mandarin, English receipts/statements/medical certificates, specialist referrals and overseas-insurance assistance. It does not distinguish doctor English from reception English.",directorySignals:[{kind:"government-directory",name:"JNTO medical institution list",sourceUrl:jnto},{kind:"competitor-directory",name:"Clinic Nearme listing",sourceUrl:"https://clinicnearme.jp/clinic/tokyo-business-clinic-yaesu-kitaguchi/"}],expertiseEvidence:[{type:"service",label:"Multilingual support plus English documents and overseas-insurance assistance",evidenceStatus:"official-source-verified",sourceUrl:"https://www.businessclinic.tokyo/en/yaesu-north-exit",verifiedDate:checked}],medicalCost:"Unknown",interpreterCost:"Unknown",coordinatorCost:"Unknown",priceTransparency:"low"
    },
    {
      id:"international-health-care-clinic-shimbashi",name:"International Health Care Clinic",providerType:"clinic",city:"Tokyo",area:"Shimbashi",audience:["resident","visitor"],specialties:["General Medicine","Travel Medicine","Vaccination","Health Checkup"],doctorEnglish:"unknown",receptionEnglish:"unknown",interpreter:"unknown",englishDocs:"unknown",coordinator:"unknown",insurance:"both",selfPay:"yes",referral:"unknown",recordStatus:"official-source-verified",source:"https://www.ihc-clinic.jp/en/about",verified:checked,notes:"Official appointment form includes Japanese-insured patients and uninsured / tourist short-stay visitors. The clinic says it serves people regardless of nationality; staff-role English capability is not separated.",directorySignals:[{kind:"government-directory",name:"JNTO medical institution list",sourceUrl:jnto},{kind:"competitor-directory",name:"Clinic Nearme listing",sourceUrl:"https://clinicnearme.jp/clinic/international-health-care-clinic/"}],expertiseEvidence:[{type:"service",label:"Appointment pathway explicitly includes uninsured tourist short-stay visitors",evidenceStatus:"official-source-verified",sourceUrl:"https://www.ihc-clinic.jp/en/contact2",verifiedDate:checked}],medicalCost:"Unknown",interpreterCost:"Unknown",coordinatorCost:"Unknown",priceTransparency:"low"
    },
    {
      id:"shimbashi-hibiya-clinic",name:"Shimbashi Hibiya Clinic",providerType:"clinic",city:"Tokyo",area:"Shimbashi",audience:["resident","visitor"],specialties:["Orthopedics","Dermatology","Allergy","Plastic Surgery"],doctorEnglish:"unknown",receptionEnglish:"unknown",interpreter:"unknown",englishDocs:"yes",coordinator:"no",insurance:"both",selfPay:"yes",referral:"no",recordStatus:"official-source-verified",source:"https://sbhc.jp/en/",verified:checked,notes:"Official site says medical information is available in English, appointments are not accepted, and patients are seen in arrival order. It publishes a self-pay consultation fee for people without a Japanese health-insurance card and can issue an English receipt.",directorySignals:[{kind:"government-directory",name:"JNTO medical institution list",sourceUrl:jnto}],expertiseEvidence:[{type:"service",label:"English information plus walk-in / arrival-order pathway",evidenceStatus:"official-source-verified",sourceUrl:"https://sbhc.jp/en/",verifiedDate:checked}],publishedCosts:[{label:"Consultation without Japanese health-insurance card",amount:"JPY 16,500",scope:"Tax included; additional services cost extra",sourceUrl:"https://sbhc.jp/en/",verifiedDate:checked}],medicalCost:"JPY 16,500 consultation without Japanese health-insurance card; extras vary",interpreterCost:"Unknown",coordinatorCost:"Unknown",priceTransparency:"medium"
    }
  ];

  const candidates = [
    ["jn-handoff-kishi-clinica-femina","KISHI CLINICA FEMINA","Chuo-ku (Ginza)",["Internal Medicine","Gynecology"],"03-5537-7171"],
    ["jn-handoff-akasaka-hitotsugidori","Akasaka Hitotsugidori Clinic","Minato-ku (Akasaka)",["Internal Medicine","Dermatology"],"03-5544-8205"],
    ["jn-handoff-azabu-clinic","Azabu Clinic","Minato-ku (Azabujuban)",["Internal Medicine","Dermatology"],"03-5545-8177"],
    ["jn-handoff-garden-clinic-hiroo","Garden Clinic Hiroo","Minato-ku (Minamiaoyama)",["Dermatology"],"03-6427-9198"],
    ["jn-handoff-american-clinic-tokyo","American Clinic Tokyo","Minato-ku (Akasaka)",["Internal Medicine","Psychiatry"],"03-6441-0969"],
    ["jn-handoff-ogimoto-clinic","Ogimoto Clinic","Chiyoda-ku",["Internal Medicine","Psychiatry"],"03-3255-4730"],
    ["jn-handoff-tomita-minoru-eye-ginza","Tomita Minoru EYE Clinic Ginza","Chuo-ku (Ginza)",["Ophthalmology"],"03-6228-4200"],
    ["jn-handoff-minamiaoyama-eye","Minamiaoyama Eye Clinic","Minato-ku (Kitaaoyama)",["Ophthalmology"],"03-5772-1451"],
    ["jn-handoff-ohtsuka-clinic","Ohtsuka Clinic","Bunkyo-ku (Yushima)",["Pediatrics","Internal Medicine"],"03-3831-2294"],
    ["jn-handoff-tatsuno-clinic","Tatsuno Clinic","Bunkyo-ku (Hongo)",["Pediatrics","Internal Medicine"],"03-5800-0203"],
    ["jn-handoff-kumada-clinic","Kumada Clinic","Minato-ku (Nishiazabu)",["Otorhinolaryngology"],"03-5766-3357"],
    ["jn-handoff-wada-otorhinolaryngology","Wada Otorhinolaryngology","Chiyoda-ku",["Otorhinolaryngology"],"03-3255-1187"],
    ["jn-handoff-azabu-orthopaedic","Azabu Orthopaedic Clinic","Minato-ku (Azabujuban)",["Orthopedic Surgery"],"03-5765-2020"],
    ["jn-handoff-mima-ladies","Mima Ladies Clinic","Minato-ku (Akasaka)",["Gynecology"],"03-6277-7397"],
    ["jn-handoff-dental-studio-stod","Dental Studio STOD","Minato-ku (Higashiazabu)",["Oral Health"],"03-6441-0355"],
    ["jn-handoff-nakano-dental","Nakano Dental","Minato-ku (Shirokanedai)",["Oral Health"],"03-3446-1117"]
  ].map(([id,name,area,specialties,phone]) => ({
    id,name,providerType:"clinic",city:"Tokyo",area,audience:["unknown"],specialties,phone,
    doctorEnglish:"unknown",receptionEnglish:"unknown",interpreter:"unknown",englishDocs:"unknown",coordinator:"unknown",insurance:"unknown",selfPay:"unknown",referral:"unknown",
    recordStatus:"official-source-verified",source:jnto,verified:checked,
    notes:"JNTO Medical Institution Search candidate from the Tokyo + English filter. This confirms directory discovery only; physician English, reception English, interpreter availability, insurance, self-pay rules, referral requirements, prices and current acceptance have not been independently verified from the clinic's own website.",
    directorySignals:[{kind:"government-directory",name:"JNTO Medical Institution Search — Tokyo + English",sourceUrl:jnto}],
    expertiseEvidence:[],medicalCost:"Unknown",interpreterCost:"Unknown",coordinatorCost:"Unknown",priceTransparency:"low",
    discoveryStatus:"directory-only"
  }));

  const normalize = value => String(value || "").toLowerCase().replace(/[^a-z0-9]/g,"");
  const existing = window.PROVIDERS || [];
  const seenIds = new Set(existing.map(p => p.id));
  const seenNames = new Set(existing.map(p => normalize(p.name)));
  const seenPhones = new Set(existing.map(p => normalize(p.phone)).filter(Boolean));
  const additions = [];
  for (const p of [...verified, ...candidates]) {
    const nameKey = normalize(p.name), phoneKey = normalize(p.phone);
    if (seenIds.has(p.id) || seenNames.has(nameKey) || (phoneKey && seenPhones.has(phoneKey))) continue;
    additions.push(p); seenIds.add(p.id); seenNames.add(nameKey); if (phoneKey) seenPhones.add(phoneKey);
  }
  window.PROVIDERS = [...existing, ...additions];
  window.DRIVE_PROVIDER_HANDOFF_META = {checked, source:"Google Drive japanhealthproviderdata.md", verifiedRecords:verified.length, directoryCandidates:candidates.length, added:additions.length, dedupe:"id+normalized-name+phone"};
})();