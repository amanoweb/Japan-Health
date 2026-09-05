(() => {
  const checked = "2026-09-05";
  const providers = window.PROVIDERS || [];
  const byId = id => providers.find(p => p && p.id === id);
  const hasEvidence = (p, label) => Array.isArray(p?.expertiseEvidence) && p.expertiseEvidence.some(e => e && e.label === label);

  const jihs = byId("jihs-center-hospital-icc");
  if (jihs) {
    const secondOpinion = Array.isArray(jihs.expertiseEvidence)
      ? jihs.expertiseEvidence.find(e => e && e.type === "second_opinion" && /online second opinion/i.test(String(e.label || "")))
      : null;
    if (secondOpinion) {
      secondOpinion.serviceAccess = {
        route: "interpreter",
        evidenceStatus: "official-source-verified",
        sourceUrl: "https://www.hosp.jihs.go.jp/en/icc/on_line.html",
        verifiedDate: checked,
        notes: "The official international online second-opinion page states that hospital medical interpreting is provided and that the JPY 110,000 consultation fee includes the interpreter. This confirms language support for this specific online second-opinion service only."
      };
    }
    jihs.notes = "Official ICC pages describe resident and overseas access pathways, hospital medical interpreting, and international online second opinions. The international online second-opinion service specifically states that hospital medical interpreting is provided and included in its published fee. Neurology separately lists Parkinson's disease within its scope; that disease listing does not by itself confirm service-level interpreter availability for a Parkinson's clinic visit. Acceptance for a specific case remains case-dependent and must be confirmed with the hospital.";
  }

  const utokyo = byId("utokyo-international-neurology");
  if (utokyo) {
    utokyo.interpreter = "available";
    utokyo.englishDocs = "yes";
    utokyo.notes = "For patients living outside Japan, the hospital says a medical coordinator/facilitator and formal referral are basically required before the visit. Its international-patient FAQ states that interpreters are available for a charge with advance request, subject to language availability, and that English medical reports and itemized bills can be prepared on request. Neurology separately lists a Parkinson's disease special clinic. The hospital-wide interpreter policy is not treated as confirmation that interpretation is available for that specific Parkinson's clinic; that must be re-checked before booking.";

    const pathwayLabel = "Overseas patient pathway through the International Medical Center";
    const pathway = Array.isArray(utokyo.expertiseEvidence)
      ? utokyo.expertiseEvidence.find(e => e && e.label === pathwayLabel)
      : null;
    if (pathway) {
      pathway.serviceAccess = {
        route: "interpreter",
        evidenceStatus: "official-source-verified",
        sourceUrl: "https://www.h.u-tokyo.ac.jp/english/international-patients/faq/",
        verifiedDate: checked,
        notes: "The international-patient FAQ documents charged interpretation by advance request for the overseas-patient pathway. This is hospital/international-pathway access evidence, not confirmation for the separate Parkinson's disease special clinic."
      };
    }

    const interpreterLabel = "International-patient interpretation available by advance request for a charge";
    if (!hasEvidence(utokyo, interpreterLabel)) {
      utokyo.expertiseEvidence = [...(utokyo.expertiseEvidence || []), {
        type: "service",
        label: interpreterLabel,
        evidenceStatus: "official-source-verified",
        sourceUrl: "https://www.h.u-tokyo.ac.jp/english/international-patients/faq/",
        verifiedDate: checked
      }, {
        type: "service",
        label: "English medical reports and itemized bills available on request for international patients",
        evidenceStatus: "official-source-verified",
        sourceUrl: "https://www.h.u-tokyo.ac.jp/english/international-patients/faq/",
        verifiedDate: checked
      }];
    }
  }

  window.SERVICE_ACCESS_PROMOTION_META = {
    checked,
    updatedProviderIds: [jihs?.id, utokyo?.id].filter(Boolean),
    caveat: "Service-level confirmation is attached only where an official source explicitly documents language access for that specific service. Provider-wide access is not promoted to specialist-service access."
  };
})();
