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
      source: "https://www.ncc.go.jp/jp/ncch/d001/foreign_patients/index.html",
      verified: checked,
      notes: "The hospital's foreign-patient page states that designated foreign-patient groups use a contracted medical-coordination company and that patients unable to arrange a medical interpreter may be directed to another institution with foreign-language support. The hospital's second-opinion page separately covers difficult cancers, rare cancers and new treatments. These are access facts, not a clinical-quality ranking or a guarantee that an individual case will be accepted.",
      expertiseEvidence: [
        {
          type: "second_opinion",
          label: "Cancer second-opinion pathway for foreign patients",
          evidenceStatus: "official-source-verified",
          sourceUrl: "https://www.ncc.go.jp/jp/ncch/d001/secondopinion/index.html",
          verifiedDate: checked,
          serviceAccess: {
            route: "external-interpreter",
            evidenceStatus: "official-source-verified",
            sourceUrl: "https://www.ncc.go.jp/jp/ncch/d001/foreign_patients/index.html",
            verifiedDate: checked,
            notes: "The foreign-patient pathway requires coordination through a contracted company for the specified patient groups and says patients who cannot prepare a medical interpreter may be guided elsewhere. This confirms an external-interpreter access requirement/context for the foreign-patient pathway, not hospital-provided interpretation."
          }
        },
        {
          type: "disease_focus",
          label: "Difficult cancers, rare cancers and new-treatment questions are addressed in the second-opinion pathway",
          evidenceStatus: "official-source-verified",
          sourceUrl: "https://www.ncc.go.jp/jp/ncch/d001/secondopinion/index.html",
          verifiedDate: checked
        },
        {
          type: "service",
          label: "Contracted medical-coordination-company pathway for specified foreign patients",
          evidenceStatus: "official-source-verified",
          sourceUrl: "https://www.ncc.go.jp/jp/ncch/d001/foreign_patients/index.html",
          verifiedDate: checked
        }
      ],
      publishedCosts: [
        {
          label: "Second opinion",
          amount: "JPY 132,000",
          scope: "Published on the hospital foreign-patient page; coordinator fees are separate and depend on the selected coordination company.",
          sourceUrl: "https://www.ncc.go.jp/jp/ncch/d001/foreign_patients/index.html",
          verifiedDate: checked
        }
      ],
      medicalCost: "Second opinion JPY 132,000; other medical charges vary by pathway",
      interpreterCost: "External medical interpreter cost not published by the hospital",
      coordinatorCost: "Separate coordinator fee applies; amount depends on selected company",
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
      source: "https://www.hospital.japanpost.jp/tokyo/outpatient/foreignpatients.html",
      verified: checked,
      notes: "Tokyo Metropolitan Government's foreign-patient list reports English availability for Tokyo Teishin Hospital across listed departments including cardiovascular medicine and orthopedic surgery. The hospital's own foreign-patient page still tells patients who do not speak Japanese to bring a medical interpreter, so Japan Health does not treat the Tokyo listing as physician-fluency confirmation. The English guide says a referral letter is recommended and that an additional first-visit fee applies without one; some department-specific booking rules may still vary.",
      expertiseEvidence: [
        {
          type: "service",
          label: "Cardiovascular medicine listed with English availability on Tokyo's foreign-patient medical-institution list",
          evidenceStatus: "official-source-verified",
          sourceUrl: sourceTokyoForeign,
          verifiedDate: checked,
          serviceAccess: {
            route: "language-support",
            evidenceStatus: "official-source-verified",
            sourceUrl: sourceTokyoForeign,
            verifiedDate: checked,
            notes: "Tokyo Metropolitan Government lists English as available for cardiovascular medicine. Tokyo Teishin Hospital separately instructs non-Japanese-speaking foreign patients to bring a medical interpreter, so this is documented department-level language availability, not direct physician-English confirmation."
          }
        },
        {
          type: "service",
          label: "Orthopedic Surgery listed with English availability on Tokyo's foreign-patient medical-institution list",
          evidenceStatus: "official-source-verified",
          sourceUrl: sourceTokyoForeign,
          verifiedDate: checked,
          serviceAccess: {
            route: "language-support",
            evidenceStatus: "official-source-verified",
            sourceUrl: sourceTokyoForeign,
            verifiedDate: checked,
            notes: "Tokyo Metropolitan Government lists English as available for orthopedic surgery. The hospital's own foreign-patient instructions still advise a medical interpreter if the patient does not speak Japanese."
          }
        },
        {
          type: "disease_focus",
          label: "Cardiology scope includes ischemic heart disease, arrhythmia, heart failure, vascular disease and valvular disease",
          evidenceStatus: "official-source-verified",
          sourceUrl: "https://www.hospital.japanpost.jp/tokyo/shinryo/jyunnai/index.html",
          verifiedDate: checked
        },
        {
          type: "procedure",
          label: "Cardiology reports PCI, pacemaker procedures, catheter ablation and peripheral vascular treatment",
          evidenceStatus: "official-source-verified",
          sourceUrl: "https://www.hospital.japanpost.jp/tokyo/shinryo/jyunnai/index.html",
          verifiedDate: checked
        }
      ],
      medicalCost: "For foreign patients without Japanese public insurance, hospital states JPY 30 per medical-fee point; other charges depend on care",
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
      notes: "The clinic maintains an official page for English-speaking people covering ART, IVF, ICSI, embryo transfer, general infertility treatment and gynecology, with phone/web first-visit booking and referral letters listed only if available. Tokyo Metropolitan Government's foreign-patient list also reports English and Chinese availability for gynecology and assisted reproductive technology. Japan Health records this as service-level language support, not proof of physician fluency or a guarantee of treatment eligibility.",
      expertiseEvidence: [
        {
          type: "procedure",
          label: "Assisted reproductive technology including IVF, ICSI and frozen-thawed embryo transfer",
          evidenceStatus: "official-source-verified",
          sourceUrl: "https://asahi-lc.jp/english.html",
          verifiedDate: checked,
          serviceAccess: {
            route: "language-support",
            evidenceStatus: "official-source-verified",
            sourceUrl: sourceTokyoForeign,
            verifiedDate: checked,
            notes: "Tokyo Metropolitan Government lists English and Chinese availability for assisted reproductive technology at this clinic. This confirms documented service-level language availability, not physician-language proficiency."
          }
        },
        {
          type: "service",
          label: "Gynecology, contraception, emergency contraception, menstrual-cycle adjustment and gynecological examinations",
          evidenceStatus: "official-source-verified",
          sourceUrl: "https://asahi-lc.jp/english.html",
          verifiedDate: checked,
          serviceAccess: {
            route: "language-support",
            evidenceStatus: "official-source-verified",
            sourceUrl: sourceTokyoForeign,
            verifiedDate: checked,
            notes: "Tokyo Metropolitan Government lists English and Chinese availability for gynecology at this clinic."
          }
        },
        {
          type: "specialist_clinic",
          label: "Reproductive-medicine and women's-health specialist clinic",
          evidenceStatus: "official-source-verified",
          sourceUrl: "https://asahi-lc.jp/english.html",
          verifiedDate: checked
        }
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
    caveat: "Language claims are limited to the level supported by the cited official source. Department-level language availability is not physician-fluency confirmation and does not imply clinical quality or individual suitability."
  };
})();
