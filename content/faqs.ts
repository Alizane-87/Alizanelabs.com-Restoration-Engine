export type Faq = { question: string; answer: string };

export const homeFaqs: Faq[] = [
  {
    question: "Does this answer every call our company receives?",
    answer:
      "Yes — as long as the call reaches our system via forwarding. We set up the forwarding rules during the readiness audit, so this is handled for you.",
  },
  {
    question: "Is this an AI receptionist?",
    answer:
      "It uses an automated voice assistant for intake, but the product is managed dispatch assurance: escalation, named acceptance, fallback, monitoring, and reporting.",
  },
  {
    question: "What happens when nobody accepts?",
    answer:
      "The Engine continues through the approved escalation order. If no approved contact accepts, it reaches the contracted fallback and records an unconfirmed exception for immediate operational attention.",
  },
  {
    question: "Does the system promise a technician will arrive?",
    answer:
      "No. It verifies that a named human accepted responsibility for the incident. The restoration company controls callback, crew availability, and arrival commitments.",
  },
  {
    question: "Will callers know they are speaking with automation?",
    answer:
      "Yes. The opening discloses automated handling and recording or processing. The exact consent design is reviewed for each deployment.",
  },
  {
    question: "Can it work with our current phone number?",
    answer:
      "Usually through conditional forwarding. Final compatibility is confirmed during the readiness audit.",
  },
  {
    question: "What if Retell, n8n, or a database is unavailable?",
    answer:
      "Production deployments include defined fallback and incident-response procedures. The exact fallback depends on the selected service level.",
  },
  {
    question: "Can you send confirmation texts?",
    answer:
      "Yes, but it requires a one-time carrier registration (A2P 10DLC). We guide you through it during setup — it's a paperwork step, not a technical one.",
  },
  {
    question: "Do you guarantee recovered revenue?",
    answer:
      "No — and we'll be straight with you: what we guarantee is that the right person on your team was reached and accepted the job. Whether they show up is on your crew. We handle the dispatch chain so nothing falls through the cracks before that.",
  },
];

export const pricingFaqs: Faq[] = [
  {
    question: "Why is this priced above a per-minute answering product?",
    answer:
      "Per-minute products price the conversation. Alizane Labs prices the handoff: runbook design, escalation logic, acceptance evidence, monitoring, reconciliation, and fallback operation are delivered and maintained by us.",
  },
  {
    question: "Is there a contract minimum?",
    answer:
      "Terms are confirmed in writing during the readiness audit before implementation begins.",
  },
  {
    question: "What is not included in the launch price?",
    answer:
      "Contracted live-human fallback, additional locations, additional languages, new integrations, SMS workflows, and custom compliance requirements are scoped separately.",
  },
  {
    question: "Can pricing change after the audit?",
    answer:
      "The audit establishes the final scope. Listed figures are starting points, not a quote for every deployment.",
  },
];
