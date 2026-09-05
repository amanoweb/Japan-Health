(() => {
  const checked = "2026-09-05";
  const sourceTokyoForeign = "https://www.hokeniryo.metro.tokyo.lg.jp/iryo/iryo_hoken/medical_info_eng/hospitals_list/chiyodaku";
  const records = [
    {
      id: "ncc-hospital-tsukiji-international",
      name: "National Cancer Center Hospital — International Patient Pathway",
      providerType: "hospital",
      city: "Tokyo",
      area: "Chuo / Tsukiji",
      audience: ["visitor", "resident"],
      specialties: ["Oncology", "Cancer Care", "Second Opinion", "Rare Cancer"],
      doctorEnglish: "unknown",
      receptionEnglish: "unknown",
      interpreter: "external",
      englishDocs: "unknown",
      coordinator: "required",
      insurance: "both",
      selfPay: "yes",
      referral: "varies",
      recordStatus: "official-source-verified",
      source: "https://www.ncc.go.jp/jp/ncch/information/2026/20260401145845.html",
      verified: checked,
      notes: "NCC publishes separate access routes for foreign residents, overseas patients and foreign-patient second opinions. Direct booking is possible only under stated Japanese-language/referral conditions; otherwise contracted medical-coordination-company routing applies. These are logistics facts, not clinical-quality ranking or case-acceptance guarantees.",
      expertiseEvidence: [
        {
          type: "second_opinion",
          label: "Cancer second-opinion pathway for foreign patients",
          evidenceStatus: "official-source-verified",
          sourceUrl: "https://www.ncch-accel.ncc.go.jp/jp/ncch/international_medical_advanced_care/foreign_patients/second_opinion/index.html",
          verifiedDate: checked,
          serviceAccess: {
            route: "external-interpreter",
            evidenceStatus: "official-source-verified",
            sourceUrl: "https://www.ncch-accel.ncc.go.jp/jp/ncch/international_medical_advanced_care/foreign_patients/second_opinion/index.html",
            verifiedDate: checked,
            notes: "Patients who cannot communicate independently in medical Japanese or whose referral is in a foreign language are directed to apply through a medical coordination company; interpreter/translation charges are separate."
          },
          accessRequirements: {
            audience: ["visitor", "resident"],
            audienceDetail: "Foreign residents and overseas patients are both covered by published foreign-patient pathways, with different logistics depending on insurance/residency and language.",
            referral: "required",
            referralDetail: "A referral/medical information letter is required for second opinion and must be in Japanese; foreign-language records require Japanese translation.",
            bookingStart: "Direct reservation-center booking is available when the patient can independently communicate in medical Japanese and has a Japanese referral; otherwise start through a contracted medical coordination company.",
            coordinator: "conditional",
            coordinatorDetail: "Required when medical-Japanese communication is difficult or referral materials are not in Japanese.",
            sourceUrl: "https://www.ncch-accel.ncc.go.jp/jp/ncch/international_medical_advanced_care/foreign_patients/second_opinion/index.html",
            verifiedDate: checked
          }
        },
        {
          type: "service",
          label: "Overseas outpatient cancer consultation pathway",
          evidenceStatus: "official-source-verified",
          sourceUrl: "https://www.ncc.go.jp/jp/ncch/international_medical_advanced_care/foreign_patients/consultation_2/index.html",
          verifiedDate: checked,
          accessRequirements: {
            audience: ["visitor"],
            audienceDetail: "Published for patients coming to Japan from overseas for treatment.",
            referral: "required",
            referralDetail: "Direct booking conditions include a Japanese-language referral; foreign-language referrals require translation through a medical coordination company.",
            bookingStart: "Reservation center by phone/online only when the published Japanese-language and referral conditions are met; otherwise medical coordination company first.",
            coordinator: "conditional",
            coordinatorDetail: "Required when the patient cannot communicate independently in medical Japanese or when the referral is in a foreign language.",
            sourceUrl: "https://www.ncc.go.jp/jp/ncch/international_medical_advanced_care/foreign_patients/consultation_2/index.html",
            verifiedDate: checked
          }
        },
        {
          type: "service",
          label: "Foreign resident outpatient cancer consultation pathway",
          evidenceStatus: "official-source-verified",
          sourceUrl: "https://www.ncc.go.jp/jp/ncch/international_medical_advanced_care/foreign_patients/consultation_1/index.html",
          verifiedDate: checked,
          accessRequirements: {
            audience: ["resident"],
            audienceDetail: "Published for foreign patients residing in Japan, including a route for patients with Japanese health insurance.",
            referral: "required",
            referralDetail: "The direct-booking route requires a Japanese-language referral.",
            bookingStart: "Reservation center by phone/online when the published Japanese-language/referral conditions are met; otherwise medical coordination company first.",
            coordinator: "conditional",
            coordinatorDetail: "Required when the patient cannot communicate independently in medical Japanese.",
            sourceUrl: "https://www.ncc.go.jp/jp/ncch/international_medical_advanced_care/foreign_patients/consultation_1/index.html",
            verifiedDate: checked
          }
        },
        {
          type: "disease_focus",
          label: "Difficult cancers, rare cancers and new-treatment questions are addressed in the second-opinion pathway",
          evidenceStatus: "official-source-verified",
          sourceUrl: "https://www.ncc.go.jp/jp/ncch/d001/secondopinion/index.html",
          verifiedDate: checked
        }
      ],
      publishedCosts: [
        {label:"Second opinion",amount:"JPY 132,000",scope:"Published for the foreign-patient second-opinion pathway; interpreter, translation and coordinator charges are separate when applicable.",sourceUrl:"https://www.ncc.go.jp/jp/ncch/d001/foreign_patients/index.html",verifiedDate:checked}
      ],
      medicalCost: "Second opinion JPY 132,000; other medical charges vary by pathway",
      interpreterCost: "External medical interpreter / translation charges may apply; hospital does not publish a single total",
      coordinatorCost: "Separate coordinator fee may apply; amount depends on selected company",
      priceTransparency: "medium"
    },
    {
      id: "tokyo-teishin-cardiology-orthopedics-international",
      name: "Tokyo Teishin Hospital — Cardiology / Orthopedics International Access",
      providerType: "hospital",
      city: "Tokyo",
      area: "Chiyoda / Fujimi",
      audience: ["visitor", "resident"],
      specialties: ["Cardiology", "Orthopedic Surgery", "Ischemic Heart Disease", "Arrhythmia", "Heart Failure"],
      doctorEnglish: "unknown",
      receptionEnglish: "unknown",
      interpreter: "external",
      englishDocs: "unknown",
      coordinator: "unknown",
      insurance: "both",
      selfPay: "yes",
      referral: "no",
      recordStatus: "official-source-verified",
      source: "https://www.hospital.japanpost.jp/tokyo/english/guide.html",
      verified: checked,
      notes: "Tokyo's foreign-patient list reports English availability for cardiovascular medicine and orthopedic surgery. Tokyo Teishin's own English guide says patients who do not speak Japanese should bring a medical interpreter. A referral letter is recommended rather than absolutely required; first visits without one can incur an additional fee. Department-specific booking rules should still be confirmed.",
      expertiseEvidence: [
        {
          type: "service",
          label: "Cardiovascular medicine listed with English availability on Tokyo's foreign-patient medical-institution list",
          evidenceStatus: "official-source-verified",
          sourceUrl: sourceTokyoForeign,
          verifiedDate: checked,
          serviceAccess: {route:"language-support",evidenceStatus:"official-source-verified",sourceUrl:sourceTokyoForeign,verifiedDate:checked,notes:"Department-level English availability is listed; this is not direct physician-English confirmation. Hospital guidance still asks non-Japanese-speaking patients to bring a medical interpreter."},
          accessRequirements: {
            audience: ["visitor", "resident"],
            audienceDetail: "Hospital guidance addresses patients with Japanese insurance and foreign patients without Japanese public insurance.",
            referral: "recommended",
            referralDetail: "Referral is recommended; first visit without one is still possible but may incur an additional first-visit fee.",
            bookingStart: "First visit begins through the hospital outpatient/check-in pathway; appointment telephone is published. Confirm cardiology-specific scheduling before arrival.",
            coordinator: "unknown",
            coordinatorDetail: "No service-specific coordinator requirement was confirmed in the cited sources.",
            sourceUrl: "https://www.hospital.japanpost.jp/tokyo/english/guide.html",
            verifiedDate: checked
          }
        },
        {
          type: "service",
          label: "Orthopedic Surgery listed with English availability on Tokyo's foreign-patient medical-institution list",
          evidenceStatus: "official-source-verified",
          sourceUrl: sourceTokyoForeign,
          verifiedDate: checked,
          serviceAccess: {route:"language-support",evidenceStatus:"official-source-verified",sourceUrl:sourceTokyoForeign,verifiedDate:checked,notes:"Department-level English availability is listed; hospital guidance still advises a medical interpreter if the patient does not speak Japanese."},
          accessRequirements: {
            audience: ["visitor", "resident"],
            audienceDetail: "Hospital guidance addresses patients with Japanese insurance and foreign patients without Japanese public insurance.",
            referral: "recommended",
            referralDetail: "Referral is recommended; first visit without one is still possible but may incur an additional first-visit fee.",
            bookingStart: "First visit begins through the hospital outpatient/check-in pathway; appointment telephone is published. Confirm orthopedic-specific scheduling before arrival.",
            coordinator: "unknown",
            coordinatorDetail: "No service-specific coordinator requirement was confirmed in the cited sources.",
            sourceUrl: "https://www.hospital.japanpost.jp/tokyo/english/guide.html",
            verifiedDate: checked
          }
        },
        {type:"disease_focus",label:"Cardiology scope includes ischemic heart disease, arrhythmia, heart failure, vascular disease and valvular disease",evidenceStatus:"official-source-verified",sourceUrl:"https://www.hospital.japanpost.jp/tokyo/shinryo/jyunnai/index.html",verifiedDate:checked},
        {type:"procedure",label:"Cardiology reports PCI, pacemaker procedures, catheter ablation and peripheral vascular treatment",evidenceStatus:"official-source-verified",sourceUrl:"https://www.hospital.japanpost.jp/tokyo/shinryo/jyunnai/index.html",verifiedDate:checked}
      ],
      medicalCost: "Foreign patients without Japanese public insurance are billed under the hospital's published self-pay point rule; other charges depend on care",
      interpreterCost: "Patient-arranged medical interpreter; cost not published by hospital",
      coordinatorCost: "Unknown",
      priceTransparency: "medium"
    },
    {
      id: "asahi-ladies-clinic-akihabara",
      name: "Asahi Ladies Clinic",
      providerType: "clinic",
      city: "Tokyo",
      area: "Chiyoda / Akihabara",
      audience: ["resident", "visitor"],
      specialties: ["Gynecology", "Infertility", "Assisted Reproductive Technology", "IVF", "ICSI", "Women's Health"],
      doctorEnglish: "unknown",
      receptionEnglish: "unknown",
      interpreter: "unknown",
      englishDocs: "yes",
      coordinator: "no",
      insurance: "unknown",
      selfPay: "yes",
      referral: "no",
      recordStatus: "official-source-verified",
      source: "https://asahi-lc.jp/english.html",
      verified: checked,
      notes: "The clinic's English page covers ART, IVF, ICSI, embryo transfer, infertility treatment and gynecology. First visits use reservation, temporary registration and web questionnaire steps. The page does not explicitly classify overseas visitors versus residents, so service-level audience eligibility remains unconfirmed even though the broader provider record includes both audiences.",
      expertiseEvidence: [
        {
          type: "procedure",
          label: "Assisted reproductive technology including IVF, ICSI and frozen-thawed embryo transfer",
          evidenceStatus: "official-source-verified",
          sourceUrl: "https://asahi-lc.jp/english.html",
          verifiedDate: checked,
          serviceAccess: {route:"language-support",evidenceStatus:"official-source-verified",sourceUrl:sourceTokyoForeign,verifiedDate:checked,notes:"Tokyo lists English and Chinese availability for ART; this is service-level language availability, not physician-language proficiency."},
          accessRequirements: {
            audience: ["unknown"],
            audienceDetail: "The English first-visit page does not explicitly distinguish overseas visitors from Japan residents; eligibility should be confirmed before travel.",
            referral: "not-required",
            referralDetail: "The English page lists referral letters among items to bring only if available, rather than as a stated prerequisite.",
            bookingStart: "Make a first-visit appointment, complete temporary registration, then complete the web medical questionnaire before visiting.",
            coordinator: "not-required",
            coordinatorDetail: "No coordinator requirement is stated in the published first-visit pathway.",
            sourceUrl: "https://asahi-lc.jp/english.html",
            verifiedDate: checked
          }
        },
        {
          type: "service",
          label: "Gynecology, contraception, emergency contraception, menstrual-cycle adjustment and gynecological examinations",
          evidenceStatus: "official-source-verified",
          sourceUrl: "https://asahi-lc.jp/english.html",
          verifiedDate: checked,
          serviceAccess: {route:"language-support",evidenceStatus:"official-source-verified",sourceUrl:sourceTokyoForeign,verifiedDate:checked,notes:"Tokyo lists English and Chinese availability for gynecology."},
          accessRequirements: {
            audience: ["unknown"],
            audienceDetail: "The English page does not explicitly distinguish overseas visitors from residents.",
            referral: "not-required",
            referralDetail: "No referral prerequisite is stated for the published first-visit pathway.",
            bookingStart: "Make a first-visit appointment, complete temporary registration, then complete the web medical questionnaire before visiting.",
            coordinator: "not-required",
            coordinatorDetail: "No coordinator requirement is stated in the published first-visit pathway.",
            sourceUrl: "https://asahi-lc.jp/english.html",
            verifiedDate: checked
          }
        },
        {type:"specialist_clinic",label:"Reproductive-medicine and women's-health specialist clinic",evidenceStatus:"official-source-verified",sourceUrl:"https://asahi-lc.jp/english.html",verifiedDate:checked}
      ],
      medicalCost: "Unknown — treatment-specific fees require confirmation",
      interpreterCost: "Unknown",
      coordinatorCost: "No coordinator requirement identified in the published first-visit pathway",
      priceTransparency: "low"
    }
  ];

  const normalize = value => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  const existing = window.PROVIDERS || [];
  const ids = new Set(existing.map(p => p?.id).filter(Boolean));
  const names = new Set(existing.map(p => normalize(p?.name)).filter(Boolean));
  const added = records.filter(p => !ids.has(p.id) && !names.has(normalize(p.name)));
  window.PROVIDERS = [...existing, ...added];
  window.SPECIALTY_SERVICE_ACCESS_BATCH_META = {
    checked,
    sourceCount: records.length,
    addedCount: added.length,
    categories: ["cancer", "cardiology", "orthopedics", "women's health"],
    caveat: "Language, audience, referral, booking and coordinator claims are limited to the level supported by cited sources. Unknown remains unknown; these logistics fields do not imply clinical quality or individual suitability."
  };
})();