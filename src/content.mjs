// Public content is edited and verified here. Unknown costs/eligibility are never inferred.
export const CHECKED = "2026-10-15";
export const official = {
  jnto: {label: "JNTO — Guide to medical care for travelers", url: "https://www.jnto.go.jp/emergency/eng/mi_guide.html"},
  mhlw: {label: "MHLW — National Health Insurance information for foreign residents", url: "https://www.mhlw.go.jp/stf/newpage_21895.html"},
  visa: {label: "MOFA — Medical stay visa process", url: "https://www.mofa.go.jp/j_info/visit/visa/medical_stay1.html"},
  coordinators: {label: "MOFA — Registered medical coordinators", url: "https://www.mofa.go.jp/j_info/visit/visa/medical_stay2.html"},
  travel: {label: "MOFA — Registered travel agency guarantors", url: "https://www.mofa.go.jp/j_info/visit/visa/medical_stay3.html"}
};
export const guides = [
  {
    slug: "visiting-a-clinic-in-japan",
    kind: "Healthcare guide",
    title: "How to visit a clinic in Japan as a tourist",
    summary: "From finding an appropriate service to paying at reception and filling a prescription.",
    read: "6 min",
    audience: "Short-term visitors",
    status: "Reviewed against official visitor guidance",
    sections: [
      {heading: "Start with the urgency of the problem", paragraphs: [
        "For a medical emergency in Japan, call 119 for an ambulance. For non-emergency problems, Japan's tourism authority advises visiting a clinic or general hospital during its regular hours. After-hours services vary by area.",
        "This is a guide to navigating care, not a tool for diagnosing symptoms. If you are uncertain whether a condition is urgent, seek professional advice."
      ]},
      {heading: "Find and contact a medical institution", paragraphs: [
        "The Japan National Tourism Organization publishes a medical institution guide and search resource for visitors. Check location, available specialties, languages and opening arrangements, and contact the institution before visiting where possible.",
        "Do not assume that a clinic listed as multilingual has an English-speaking clinician available at every appointment. Confirm your preferred language, whether a new patient can be seen, and whether an appointment is required."
      ]},
      {heading: "What happens at the appointment", paragraphs: [
        "A typical visitor pathway includes reception, completing a medical questionnaire, consultation or treatment, payment and — when prescribed — obtaining medicine from a pharmacy. The exact steps depend on the institution.",
        "Keep your passport and any useful insurance documents available. If you have existing test results or a medication list, ask the provider what documentation will be helpful."
      ]},
      {heading: "Insurance and payment", paragraphs: [
        "A short visit does not, by itself, establish eligibility for Japanese public health insurance. Travel insurance terms determine whether a policy covers the visit and whether direct billing may be possible.",
        "Ask about estimated costs and accepted payment methods before non-urgent treatment. Pharmacy charges may be separate. Save receipts and documentation for your insurer."
      ]},
      {heading: "Next step", paragraphs: [
        "If you know what specialty you need, contact a suitable provider directly. If treatment is planned, complex or requires travel and documentation coordination, consult a medical coordination agency before sharing medical records."
      ]}
    ],
    sources: [official.jnto]
  },
  {
    slug: "health-insurance-for-foreign-residents",
    kind: "Healthcare guide",
    title: "Japanese public health insurance for foreign residents",
    summary: "Understanding insurance eligibility, your coverage arrangements and what to confirm before booking.",
    read: "5 min",
    audience: "Residents in Japan",
    status: "Reviewed against MHLW resident information",
    sections: [
      {heading: "Residence and health insurance are separate questions", paragraphs: [
        "Foreign nationality alone does not determine whether someone can use Japan's public health insurance. The relevant question is whether the person meets the enrollment requirements of an applicable Japanese insurance scheme.",
        "Depending on employment and other circumstances, eligible residents may be enrolled through an employer or through municipal National Health Insurance. Specific eligibility and enrollment details should be confirmed with the responsible insurer, employer or municipality."
      ]},
      {heading: "What to confirm before visiting", paragraphs: [
        "Check that your insurance enrollment and proof-of-coverage arrangements are current. Ask the clinic whether the planned service is provided under Japanese public health insurance, and whether a referral is needed.",
        "Not every medical or cosmetic service is insured. A consultation, procedure, prescription or additional service may have different payment conditions."
      ]},
      {heading: "Tourists are a different audience", paragraphs: [
        "Do not assume that the rules applicable to insured residents also apply to travelers. If you are visiting Japan temporarily, start with the visitor guide and your travel insurer rather than an insured-resident cost example."
      ]},
      {heading: "Use official and local sources", paragraphs: [
        "The Ministry of Health, Labour and Welfare publishes information for foreign residents about National Health Insurance, including a multilingual leaflet. The most current eligibility details for an individual should be confirmed with the competent local office or insurer."
      ]}
    ],
    sources: [official.mhlw, official.jnto]
  },
  {
    slug: "medical-stay-visa-japan",
    kind: "Medical tourism guide",
    title: "Japan's medical-stay visa: how the process works",
    summary: "What overseas patients should know about registered guarantors, documents and medical arrangements.",
    read: "6 min",
    audience: "People planning treatment in Japan",
    status: "Reviewed against Ministry of Foreign Affairs guidance",
    sections: [
      {heading: "What a medical-stay visa is for", paragraphs: [
        "Japan has a medical-stay visa route for eligible foreign patients traveling to Japan for medical services. The requirements are different from ordinary tourist healthcare and depend on the applicant's circumstances.",
        "Not every traveler needs this specific visa. Confirm entry requirements with the Japanese diplomatic mission responsible for your application before making plans."
      ]},
      {heading: "The role of registered guarantors", paragraphs: [
        "The Ministry of Foreign Affairs directs medical-stay visa applicants to registered guarantors, including medical coordinators and certain travel agencies. A guarantor can help arrange the medical institution and required documentation under the visa scheme.",
        "Japan Health is an independent information publisher; it does not issue visas, guarantee admission or arrange medical care."
      ]},
      {heading: "Documents and timing", paragraphs: [
        "MOFA describes a process involving medical-service arrangements, documentation from the medical institution and guarantor, and a visa application. Additional documents may be required depending on the applicant and intended stay.",
        "Requirements for extended stays or repeated visits can differ. Verify the current documents and procedures directly with MOFA, the guarantor and the relevant Japanese embassy or consulate."
      ]},
      {heading: "Choosing an agency", paragraphs: [
        "Compare stated languages, services, locations, contacts and whether an agency appears in the applicable official guarantor list. The government list does not establish that any agency is clinically superior, or that all agencies accept every type of case.",
        "Confirm service scope, fees, privacy arrangements and any hospital relationships directly with each agency."
      ]}
    ],
    sources: [official.visa, official.coordinators, official.travel]
  },
  {
    slug: "seeing-a-specialist-in-japan",
    kind: "Healthcare guide",
    title: "How to arrange a specialist appointment in Japan",
    summary: "A practical checklist for referrals, language support, records and international patient departments.",
    read: "5 min",
    audience: "Residents and international patients",
    status: "Editorial practical checklist; provider requirements must be confirmed",
    sections: [
      {heading: "Identify the service, not a self-diagnosis", paragraphs: [
        "Describe your concern or the specialty recommended by your existing clinician. When a medical problem is urgent, seek prompt professional help rather than waiting for an elective appointment.",
        "Different facilities offer different services. A hospital advertising a specialty may have separate arrangements for new patients and overseas consultations."
      ]},
      {heading: "Check referral and booking policies", paragraphs: [
        "Before arranging travel, contact the specific department or international patient office. Ask whether it accepts new patients, requires a referral, asks for prior medical records, or requires an initial review of documents.",
        "Treat hospital-specific requirements as hospital-specific. Do not generalize one institution's appointment policies to all Japanese hospitals."
      ]},
      {heading: "Prepare documentation", paragraphs: [
        "Ask whether the provider needs prior diagnosis letters, imaging files, medication information or translated records. Find out whether interpreter support is available at the requested appointment time.",
        "For planned treatment requiring accommodation, travel, visa support or extensive coordination, a medical agency may offer logistical help. The medical team determines clinical appropriateness."
      ]}
    ],
    sources: [official.jnto, official.visa]
  }
];
export const treatments = [
  {
    slug: "dental-treatment-in-japan",
    kind: "Treatment explainer",
    title: "Dental treatment in Japan: a practical guide for international patients",
    summary: "How to ask about appointments, treatment plans, insurance and follow-up care.",
    read: "5 min",
    audience: "Visitors and residents",
    status: "Navigation guide; no price or coverage claims",
    sections: [
      {heading: "Understand what you are booking", paragraphs: [
        "Routine dentistry, emergency dental care and elective procedures can involve different appointments and payment arrangements. Describe your needs when contacting a dental clinic and ask whether the clinic can accommodate the requested service.",
        "If you are considering an elective procedure, ask the clinician about alternatives, risks, treatment stages and the expected follow-up schedule."
      ]},
      {heading: "Confirm payment before treatment", paragraphs: [
        "Insurance coverage depends on your eligibility and the particular service. Ask the clinic for a written treatment plan and itemized estimate when appropriate, and check whether your insurer accepts the claim.",
        "Do not interpret an advertised procedure price as a guaranteed all-inclusive total; diagnostics, additional treatment and follow-up may be billed separately."
      ]},
      {heading: "Plan for follow-up", paragraphs: [
        "International visitors should ask whether the treatment can be completed during their stay and how complications or follow-up visits would be managed after leaving Japan.",
        "Japan Health does not recommend a particular treatment or clinic. Provider profiles, where available, describe reported services and practical access information."
      ]}
    ],
    sources: [official.jnto]
  }
];
