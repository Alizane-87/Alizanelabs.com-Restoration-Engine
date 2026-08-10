/**
 * DRAFT LEGAL CONTENT — requires founder and legal review before launch.
 *
 * These drafts are deliberately conservative. Do not add jurisdiction,
 * compliance, or certification claims that have not been reviewed by counsel.
 *
 * Missing founder inputs are represented as `null` below rather than invented.
 * Pages render a neutral "to be confirmed" line whenever a value is null.
 */

export const legalIdentity: {
  /** Registered legal entity name, e.g. "Alizane Labs LLC". */
  entityName: string | null;
  /** Full business address used for legal and email notices. */
  address: string | null;
  /** Privacy contact mailbox. */
  privacyEmail: string | null;
  /** General contact mailbox. */
  contactEmail: string | null;
  /** Jurisdiction whose law governs the terms. */
  governingLaw: string | null;
  lastUpdated: string;
} = {
  entityName: null,
  address: null,
  privacyEmail: null,
  contactEmail: null,
  governingLaw: null,
  lastUpdated: "Pending founder approval",
};

export const pendingValueLabel = "To be confirmed before launch";

export type LegalSection = { heading: string; paragraphs: string[]; bullets?: string[] };

export const privacySections: LegalSection[] = [
  {
    heading: "Scope of this policy",
    paragraphs: [
      "This policy describes how Alizane Labs handles information collected through this website. It does not describe how an individual client configures call handling inside their own deployment of the Restoration Emergency Engine; that configuration is agreed with each client and documented in their service agreement.",
    ],
  },
  {
    heading: "Information collected on this website",
    paragraphs: [
      "We collect only what you submit and a minimal set of technical signals needed to operate the site.",
    ],
    bullets: [
      "Details you enter in the dispatch audit form: first name, company, work email, phone, primary service area, current after-hours handling, approximate after-hours call range, and optional CRM or field-service system.",
      "Your consent to be contacted about the audit you requested.",
      "Aggregate, privacy-conscious usage events such as which calls-to-action are clicked. These events do not include names, email addresses, or phone numbers.",
      "Standard server and security logs generated when a page or form endpoint is requested.",
    ],
  },
  {
    heading: "How the information is used",
    paragraphs: [
      "Submitted details are used to contact you about the audit or demo you requested, to prepare that conversation, and to keep a record of the request. We do not sell website form submissions.",
    ],
  },
  {
    heading: "Call and incident data",
    paragraphs: [
      "Call recordings, transcripts, incident records, homeowner details, and technician acceptance records produced by a client deployment are governed by that client's agreement — not by this website policy. Operational call and incident data is never sent into website analytics.",
    ],
  },
  {
    heading: "Retention",
    paragraphs: [
      "Website enquiry records are retained for as long as needed to manage the sales conversation and to meet record-keeping obligations, then deleted or anonymised. The final retention schedule is confirmed as part of legal review.",
    ],
  },
  {
    heading: "Your choices",
    paragraphs: [
      "You can ask us to access, correct, or delete the details you submitted through this website, or to stop contacting you, by writing to the privacy contact listed below.",
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    heading: "Use of this website",
    paragraphs: [
      "This website is provided for information about Alizane Labs and the Restoration Emergency Engine. You may not attempt to disrupt the site, probe its infrastructure, or use it to submit unlawful or misleading information.",
    ],
  },
  {
    heading: "No service agreement is formed here",
    paragraphs: [
      "Nothing on this website is an offer, quote, or binding commitment. Pricing shown is an editable launch starting point. The scope, service level, fallback path, and commercial terms of any deployment are set out only in a signed written agreement.",
    ],
  },
  {
    heading: "Product statements and limits",
    paragraphs: [
      "Descriptions of the Restoration Emergency Engine describe intended operation for calls routed into the Engine. Alizane Labs does not warrant uninterrupted availability of third-party telephony, voice, automation, or hosting services, and does not guarantee technician availability, callback timing, arrival, job conversion, or revenue.",
      "Alizane Labs is not an emergency service, insurer, public-safety agency, or restoration contractor.",
    ],
  },
  {
    heading: "Illustrative material",
    paragraphs: [
      "Timelines, sample events, and workflow diagrams shown on this website are illustrative demonstrations of the workflow. They are not customer results and should not be read as performance figures.",
    ],
  },
  {
    heading: "Intellectual property",
    paragraphs: [
      "The content, design, and diagrams on this website belong to Alizane Labs unless stated otherwise. You may share links to pages; you may not republish substantial portions as your own.",
    ],
  },
  {
    heading: "Changes",
    paragraphs: [
      "These terms may be updated as the product and the business change. The version published on this page applies to your use of the site.",
    ],
  },
];

export const aiDisclosureSections: LegalSection[] = [
  {
    heading: "An automated assistant handles the call",
    paragraphs: [
      "When a call is routed into the Restoration Emergency Engine, an automated voice assistant answers. The caller is told at the start of the call that automated handling is in use. The assistant does not present itself as a human employee.",
    ],
  },
  {
    heading: "Recording, transcription, and processing",
    paragraphs: [
      "Depending on the deployment, calls may be recorded, transcribed, and processed to create the incident record and the response timeline. What is captured, how consent is worded, and how long records are kept are configured per client and reviewed with that client and their counsel before go-live.",
    ],
  },
  {
    heading: "Outbound escalation calls to technicians",
    paragraphs: [
      "Escalation calls placed to on-call technicians are also automated. People who receive these calls must be informed and consented in line with the deployment policy agreed with the client. Voicemail and no-answer paths are designed not to expose homeowner details.",
    ],
  },
  {
    heading: "What the assistant will not do",
    paragraphs: [
      "The assistant stays inside boundaries approved by the client. It does not quote prices, promise insurance coverage, commit to arrival times, or invent technician availability.",
    ],
  },
  {
    heading: "Emergencies and safety",
    paragraphs: [
      "The Engine is not an emergency service. Anyone in immediate danger, or facing fire, gas, electrical, or medical risk, should contact 911 or their local emergency number.",
    ],
  },
  {
    heading: "Insurance and pricing",
    paragraphs: [
      "The Engine does not determine insurance coverage, adjudicate claims, or price restoration work. It records what the caller reports so a named human can take responsibility for the next step.",
    ],
  },
  {
    heading: "The limits of this page",
    paragraphs: [
      "This page explains Alizane's general approach. It does not itself make any client deployment legally compliant. Consent wording, recording practice, retention, and fallback design must be reviewed for each client, in each jurisdiction where they operate, with their own legal advisers.",
    ],
  },
];
