window.PROVIDERS = [
  {
    "id": "demo-neuro-center",
    "name": "Demo Advanced Neuro Center",
    "city": "Tokyo",
    "area": "Bunkyo",
    "audience": [
      "visitor",
      "resident"
    ],
    "specialties": [
      "Neurology",
      "Movement Disorders",
      "Second Opinion"
    ],
    "doctorEnglish": "limited",
    "receptionEnglish": "yes",
    "interpreter": "yes",
    "englishDocs": "partial",
    "coordinator": "required",
    "insurance": "resident",
    "selfPay": "yes",
    "referral": "required",
    "recordStatus": "demo",
    "source": "Demo record — replace with official source",
    "verified": "Not verified",
    "notes": "Illustrative example of a highly specialized center that may be more accessible through interpretation than direct English.",
    "expertiseEvidence": [
      {
        "type": "disease_focus",
        "label": "Movement-disorder focus (demo)",
        "evidenceStatus": "demo"
      },
      {
        "type": "second_opinion",
        "label": "Second-opinion pathway (demo)",
        "evidenceStatus": "demo"
      }
    ],
    "medicalCost": "Unknown",
    "interpreterCost": "Unknown",
    "coordinatorCost": "Unknown",
    "priceTransparency": "low"
  },
  {
    "id": "demo-international-clinic",
    "name": "Demo International Clinic",
    "city": "Tokyo",
    "area": "Shibuya",
    "audience": [
      "visitor",
      "resident"
    ],
    "specialties": [
      "Internal Medicine",
      "General Practice"
    ],
    "doctorEnglish": "yes",
    "receptionEnglish": "yes",
    "interpreter": "no",
    "englishDocs": "yes",
    "coordinator": "no",
    "insurance": "both",
    "selfPay": "yes",
    "referral": "no",
    "recordStatus": "demo",
    "source": "Demo record — replace with official source",
    "verified": "Not verified",
    "notes": "Illustrative direct-English clinic profile for everyday care.",
    "expertiseEvidence": [
      {
        "type": "service",
        "label": "General internal medicine access (demo)",
        "evidenceStatus": "demo"
      }
    ],
    "medicalCost": "Unknown",
    "interpreterCost": "Unknown",
    "coordinatorCost": "Unknown",
    "priceTransparency": "low"
  },
  {
    "id": "demo-womens-health",
    "name": "Demo Women's Health Clinic",
    "city": "Tokyo",
    "area": "Minato",
    "audience": [
      "resident"
    ],
    "specialties": [
      "OB-GYN",
      "Women's Health"
    ],
    "doctorEnglish": "yes",
    "receptionEnglish": "yes",
    "interpreter": "available",
    "englishDocs": "partial",
    "coordinator": "no",
    "insurance": "resident",
    "selfPay": "yes",
    "referral": "no",
    "recordStatus": "demo",
    "source": "Demo record — replace with official source",
    "verified": "Not verified",
    "notes": "Illustrative resident-focused OB-GYN profile.",
    "expertiseEvidence": [
      {
        "type": "specialist_clinic",
        "label": "Women's health / gynecology focus (demo)",
        "evidenceStatus": "demo"
      }
    ],
    "medicalCost": "Unknown",
    "interpreterCost": "Unknown",
    "coordinatorCost": "Unknown",
    "priceTransparency": "low"
  },
  {
    "id": "demo-dental-center",
    "name": "Demo Dental Center",
    "city": "Tokyo",
    "area": "Shinjuku",
    "audience": [
      "visitor",
      "resident"
    ],
    "specialties": [
      "Dentistry",
      "Emergency Dental"
    ],
    "doctorEnglish": "yes",
    "receptionEnglish": "yes",
    "interpreter": "no",
    "englishDocs": "partial",
    "coordinator": "no",
    "insurance": "both",
    "selfPay": "yes",
    "referral": "no",
    "recordStatus": "demo",
    "source": "Demo record — replace with official source",
    "verified": "Not verified",
    "notes": "Illustrative dental profile showing resident and visitor use.",
    "expertiseEvidence": [
      {
        "type": "service",
        "label": "General dentistry + emergency dental access (demo)",
        "evidenceStatus": "demo"
      }
    ],
    "medicalCost": "Unknown",
    "interpreterCost": "Unknown",
    "coordinatorCost": "Unknown",
    "priceTransparency": "low"
  },
  {
    "id": "demo-checkup-center",
    "name": "Demo Executive Checkup Center",
    "city": "Tokyo",
    "area": "Chiyoda",
    "audience": [
      "visitor",
      "resident"
    ],
    "specialties": [
      "Health Screening",
      "Ningen Dock",
      "Imaging"
    ],
    "doctorEnglish": "partial",
    "receptionEnglish": "yes",
    "interpreter": "yes",
    "englishDocs": "yes",
    "coordinator": "recommended",
    "insurance": "self-pay",
    "selfPay": "yes",
    "referral": "no",
    "recordStatus": "demo",
    "source": "Demo record — replace with official source",
    "verified": "Not verified",
    "notes": "Illustrative planned-care listing for health screening.",
    "expertiseEvidence": [
      {
        "type": "service",
        "label": "Ningen Dock / imaging pathway (demo)",
        "evidenceStatus": "demo"
      }
    ],
    "medicalCost": "Unknown",
    "interpreterCost": "Unknown",
    "coordinatorCost": "Unknown",
    "priceTransparency": "low"
  },
  {
    "id": "demo-cancer-center",
    "name": "Demo Oncology Referral Center",
    "city": "Tokyo",
    "area": "Chuo",
    "audience": [
      "visitor"
    ],
    "specialties": [
      "Oncology",
      "Second Opinion",
      "Cancer Care"
    ],
    "doctorEnglish": "limited",
    "receptionEnglish": "partial",
    "interpreter": "yes",
    "englishDocs": "partial",
    "coordinator": "required",
    "insurance": "self-pay",
    "selfPay": "yes",
    "referral": "required",
    "recordStatus": "demo",
    "source": "Demo record — replace with official source",
    "verified": "Not verified",
    "notes": "Illustrative specialist referral pathway where coordinator and record triage matter.",
    "expertiseEvidence": [
      {
        "type": "second_opinion",
        "label": "Oncology second-opinion pathway (demo)",
        "evidenceStatus": "demo"
      }
    ],
    "medicalCost": "Unknown",
    "interpreterCost": "Unknown",
    "coordinatorCost": "Unknown",
    "priceTransparency": "low"
  },
  {
    "id": "demo-cosmetic",
    "name": "Demo Aesthetic Surgery Clinic",
    "city": "Tokyo",
    "area": "Ginza",
    "audience": [
      "visitor"
    ],
    "specialties": [
      "Cosmetic Surgery",
      "Aesthetic Medicine"
    ],
    "doctorEnglish": "partial",
    "receptionEnglish": "yes",
    "interpreter": "available",
    "englishDocs": "yes",
    "coordinator": "optional",
    "insurance": "self-pay",
    "selfPay": "yes",
    "referral": "no",
    "recordStatus": "demo",
    "source": "Demo record — replace with official source",
    "verified": "Not verified",
    "notes": "Illustrative planned aesthetic-care listing.",
    "expertiseEvidence": [
      {
        "type": "service",
        "label": "Aesthetic medicine pathway (demo)",
        "evidenceStatus": "demo"
      }
    ],
    "medicalCost": "Unknown",
    "interpreterCost": "Unknown",
    "coordinatorCost": "Unknown",
    "priceTransparency": "low"
  },
  {
    "id": "demo-osaka-general",
    "name": "Demo Osaka International Medical Clinic",
    "city": "Osaka",
    "area": "Kita",
    "audience": [
      "visitor",
      "resident"
    ],
    "specialties": [
      "Internal Medicine",
      "General Practice",
      "Dermatology"
    ],
    "doctorEnglish": "yes",
    "receptionEnglish": "yes",
    "interpreter": "available",
    "englishDocs": "partial",
    "coordinator": "no",
    "insurance": "both",
    "selfPay": "yes",
    "referral": "no",
    "recordStatus": "demo",
    "source": "Demo record — replace with official source",
    "verified": "Not verified",
    "notes": "Illustrative Osaka listing for geographic expansion.",
    "expertiseEvidence": [
      {
        "type": "service",
        "label": "General medicine + dermatology access (demo)",
        "evidenceStatus": "demo"
      }
    ],
    "medicalCost": "Unknown",
    "interpreterCost": "Unknown",
    "coordinatorCost": "Unknown",
    "priceTransparency": "low"
  },
  {
    "id": "jihs-center-hospital-icc",
    "name": "JIHS Center Hospital — International Health Care Center",
    "city": "Tokyo",
    "area": "Shinjuku",
    "audience": [
      "visitor",
      "resident"
    ],
    "specialties": [
      "International Patient Services",
      "Neurology",
      "Second Opinion"
    ],
    "doctorEnglish": "unknown",
    "receptionEnglish": "unknown",
    "interpreter": "yes",
    "englishDocs": "unknown",
    "coordinator": "available",
    "insurance": "both",
    "selfPay": "yes",
    "referral": "varies",
    "recordStatus": "official-source-verified",
    "source": "https://www.hosp.jihs.go.jp/en/icc/",
    "verified": "2026-09-05",
    "notes": "Official ICC pages describe resident and overseas access pathways, hospital medical interpreting, and international online second opinions. Neurology lists Parkinson's disease within its scope. Acceptance for a specific case is still case-dependent and must be confirmed with the hospital.",
    "expertiseEvidence": [
      {
        "type": "service",
        "label": "Hospital medical interpreting for international patients",
        "evidenceStatus": "official-source-verified",
        "sourceUrl": "https://www.hosp.jihs.go.jp/en/icc/",
        "verifiedDate": "2026-09-05"
      },
      {
        "type": "second_opinion",
        "label": "Online second opinion for international patients",
        "evidenceStatus": "official-source-verified",
        "sourceUrl": "https://www.hosp.jihs.go.jp/en/icc/on_line.html",
        "verifiedDate": "2026-09-05"
      },
      {
        "type": "disease_focus",
        "label": "Parkinson's disease is listed within Neurology's chronic-disease scope",
        "evidenceStatus": "official-source-verified",
        "sourceUrl": "https://www.hosp.jihs.go.jp/en/icc/message.html",
        "verifiedDate": "2026-09-05"
      }
    ],
    "publishedCosts": [
      {
        "label": "International online second opinion",
        "amount": "JPY 110,000",
        "scope": "Up to 60 minutes; hospital medical interpreting included",
        "sourceUrl": "https://www.hosp.jihs.go.jp/en/icc/on_line.html",
        "verifiedDate": "2026-09-05"
      },
      {
        "label": "Medical interpretation fee",
        "amount": "JPY 5,500/day",
        "scope": "Current Japanese FAQ lists this daily fee for specified languages; availability and applicable language should be confirmed",
        "sourceUrl": "https://www.hosp.jihs.go.jp/icc/faq.html",
        "verifiedDate": "2026-09-05"
      }
    ],
    "medicalCost": "Varies by pathway",
    "interpreterCost": "JPY 5,500/day for specified languages (current Japanese FAQ)",
    "coordinatorCost": "Unknown",
    "priceTransparency": "medium"
  },
  {
    "id": "utokyo-international-neurology",
    "name": "The University of Tokyo Hospital — International / Neurology pathway",
    "city": "Tokyo",
    "area": "Bunkyo",
    "audience": [
      "visitor"
    ],
    "specialties": [
      "International Patient Services",
      "Neurology",
      "Parkinson's Disease"
    ],
    "doctorEnglish": "unknown",
    "receptionEnglish": "unknown",
    "interpreter": "unknown",
    "englishDocs": "unknown",
    "coordinator": "required",
    "insurance": "self-pay",
    "selfPay": "yes",
    "referral": "required",
    "recordStatus": "official-source-verified",
    "source": "https://www.h.u-tokyo.ac.jp/english/international-patients/visiting-japan/",
    "verified": "2026-09-05",
    "notes": "For patients living outside Japan, the hospital says a medical coordinator/facilitator is basically required before the visit and referral/health information must be sent. Neurology separately lists a Parkinson's disease special clinic. This does not mean an overseas case will be accepted; the pathway must be confirmed in advance.",
    "expertiseEvidence": [
      {
        "type": "service",
        "label": "Overseas patient pathway through the International Medical Center",
        "evidenceStatus": "official-source-verified",
        "sourceUrl": "https://www.h.u-tokyo.ac.jp/english/international-patients/",
        "verifiedDate": "2026-09-05"
      },
      {
        "type": "service",
        "label": "Medical coordinator/facilitator pathway for patients living outside Japan",
        "evidenceStatus": "official-source-verified",
        "sourceUrl": "https://www.h.u-tokyo.ac.jp/english/international-patients/visiting-japan/",
        "verifiedDate": "2026-09-05"
      },
      {
        "type": "specialist_clinic",
        "label": "Parkinson's disease special clinic listed by Neurology",
        "evidenceStatus": "official-source-verified",
        "sourceUrl": "https://www.h.u-tokyo.ac.jp/english/centers-services/clinical-divisions/neurology/index.html",
        "verifiedDate": "2026-09-05"
      },
      {
        "type": "disease_focus",
        "label": "Parkinson's disease listed among Neurology target diseases",
        "evidenceStatus": "official-source-verified",
        "sourceUrl": "https://www.h.u-tokyo.ac.jp/english/centers-services/clinical-divisions/neurology/index.html",
        "verifiedDate": "2026-09-05"
      }
    ],
    "medicalCost": "Unknown — request an estimate before travel",
    "interpreterCost": "Unknown",
    "coordinatorCost": "Unknown",
    "priceTransparency": "low"
  },
  {
    "id": "keio-international-parkinson",
    "name": "Keio University Hospital — International / Parkinson pathway",
    "city": "Tokyo",
    "area": "Shinjuku",
    "audience": [
      "visitor",
      "resident"
    ],
    "specialties": [
      "International Patient Services",
      "Neurology",
      "Parkinson's Disease"
    ],
    "doctorEnglish": "unknown",
    "receptionEnglish": "unknown",
    "interpreter": "external",
    "englishDocs": "unknown",
    "coordinator": "varies",
    "insurance": "both",
    "selfPay": "yes",
    "referral": "varies",
    "recordStatus": "official-source-verified",
    "source": "https://www.hosp.keio.ac.jp/en/annai/raiin/international_patients/",
    "verified": "2026-09-05",
    "notes": "Official pages distinguish Japanese-insurance, non-insured resident, and overseas routes. Keio says it does not provide interpretive services and encourages patients who need another language to arrange a medical interpreter. Its Neurology and Parkinson's Disease Center pages document a Parkinson disease specialty pathway. Specific international acceptance and booking requirements must be confirmed.",
    "expertiseEvidence": [
      {
        "type": "service",
        "label": "International patient routes are separated by insurance/residency status",
        "evidenceStatus": "official-source-verified",
        "sourceUrl": "https://www.hosp.keio.ac.jp/en/annai/raiin/international_patients/",
        "verifiedDate": "2026-09-05"
      },
      {
        "type": "service",
        "label": "Hospital does not provide interpretive services; external interpreter arrangement is encouraged when needed",
        "evidenceStatus": "official-source-verified",
        "sourceUrl": "https://www.hosp.keio.ac.jp/en/annai/raiin/international_patients/",
        "verifiedDate": "2026-09-05"
      },
      {
        "type": "specialist_clinic",
        "label": "Parkinson disease specialty outpatient clinic listed by Neurology",
        "evidenceStatus": "official-source-verified",
        "sourceUrl": "https://www.hosp.keio.ac.jp/en/shinryo/",
        "verifiedDate": "2026-09-05"
      },
      {
        "type": "specialist_clinic",
        "label": "Parkinson's Disease Center",
        "evidenceStatus": "official-source-verified",
        "sourceUrl": "https://www.hosp.keio.ac.jp/shinryo/parkinson-center/",
        "verifiedDate": "2026-09-05"
      },
      {
        "type": "procedure",
        "label": "Deep brain stimulation is listed among device-assisted therapies in the Parkinson's Disease Center overview",
        "evidenceStatus": "official-source-verified",
        "sourceUrl": "https://www.hosp.keio.ac.jp/shinryo/parkinson-center/",
        "verifiedDate": "2026-09-05"
      }
    ],
    "medicalCost": "Unknown",
    "interpreterCost": "External arrangement; hospital does not publish a hospital interpreter fee because it does not provide the service",
    "coordinatorCost": "Unknown",
    "priceTransparency": "low"
  }
];
