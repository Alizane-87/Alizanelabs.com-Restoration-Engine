export const site = {
  name: "Alizane Labs",
  product: "Restoration Emergency Engine",
  category: "Verified Dispatch Assurance",
  descriptor:
    "A managed after-hours emergency intake and verified dispatch system for restoration companies.",
  defaultDescription:
    "A managed after-hours intake and verified dispatch system for restoration companies. Route urgent calls through an approved on-call escalation runbook and record named human acceptance.",
  scopeNote:
    "Covers calls routed into the Engine. Human availability and arrival times remain controlled by your team.",
  evidenceScope:
    "Dispatch evidence applies only to calls routed into the Restoration Emergency Engine.",
} as const;

export const nav = [
  { href: "/restoration-emergency-engine", label: "Product" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
] as const;

export const footerNav = [
  {
    heading: "Product",
    links: [
      { href: "/restoration-emergency-engine", label: "Restoration Emergency Engine" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/pricing", label: "Pricing" },
      { href: "/dispatch-audit", label: "Dispatch audit" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/ai-call-disclosure", label: "AI call & recording approach" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
] as const;

/** Primary conversion destination. Kept in one place so CTAs never break. */
export const ctaHref = "/dispatch-audit";

export const cta = {
  primary: { label: "Run the demo on my phone", href: ctaHref },
  secondary: { label: "See the dispatch workflow", href: "/how-it-works" },
  header: { label: "Run a live dispatch demo", href: ctaHref },
  audit: { label: "Book the dispatch audit", href: ctaHref },
} as const;

export const heroTimeline = [
  { time: "2:03:11 AM", event: "Call routed to Engine", state: "routed" },
  { time: "2:03:12 AM", event: "Automated emergency assistant answers", state: "active" },
  { time: "2:04:08 AM", event: "Address and callback confirmed", state: "active" },
  { time: "2:04:12 AM", event: "Primary technician alerted", state: "escalating" },
  { time: "2:05:01 AM", event: "Backup escalation initiated", state: "escalating" },
  { time: "2:05:29 AM", event: "Alex R. accepted", state: "accepted" },
] as const;

export const problemCards = [
  {
    title: "Voicemail loses the job",
    body: "The homeowner hangs up and calls the next company in Google Maps. You never know it happened.",
  },
  {
    title: "A Slack ping is not a dispatched technician",
    body: "Your tech may be asleep, driving, or off-roster. A notification proves nothing.",
  },
  {
    title: "On-call systems break at the handoff",
    body: "The first technician may be asleep, driving, unavailable, or no longer on the roster.",
  },
] as const;

export const dispatchSteps = [
  {
    title: "Answer",
    body: "The caller hears a transparent automated-assistant and recording disclosure.",
  },
  {
    title: "Triage",
    body: "The Engine identifies urgency and captures the confirmed address, callback number, damage category (water/fire/mold), and adjuster/insurance status.",
  },
  {
    title: "Open incident",
    body: "An incident is created while the call is still active.",
  },
  {
    title: "Escalate",
    body: "The approved on-call contacts are called in sequence.",
  },
  {
    title: "Confirm",
    body: "A technician presses 1 or verbally accepts. Acceptance is stored against a named contact.",
  },
  {
    title: "Report",
    body: "The owner receives a response timeline for calls routed into the Engine.",
  },
] as const;

export const comparisonRows = [
  { capability: "Answers after hours", generic: "Usually", engine: "Yes" },
  {
    capability: "Restoration-native triage (TPA/Water/Fire)",
    generic: "Sometimes",
    engine: "Client-approved runbook",
  },
  { capability: "Sends summary or notification", generic: "Yes", engine: "Yes" },
  {
    capability: "Sequential on-call escalation",
    generic: "Varies",
    engine: "Built into the runbook",
  },
  {
    capability: "Named human acceptance",
    generic: "Rarely evidenced",
    engine: "Deterministic acceptance record",
  },
  {
    capability: "Duplicate-acceptance protection",
    generic: "Rarely documented",
    engine: "Included",
  },
  {
    capability: "Monitored fallback",
    generic: "Add-on or unclear",
    engine: "Contracted configuration",
  },
  {
    capability: "Daily health checks",
    generic: "Usually self-managed",
    engine: "Managed by Alizane Labs",
  },
  {
    capability: "Monthly response evidence",
    generic: "Basic call log",
    engine: "Acceptance and exception reporting",
  },
  {
    capability: "Implementation ownership",
    generic: "DIY or light onboarding",
    engine: "Alizane Labs-managed deployment",
  },
] as const;

export const proofBlocks = [
  {
    title: "Live phone demo",
    body: "You play the homeowner and the on-call technician.",
  },
  {
    title: "Twenty-scenario staging test",
    body: "Acceptance, decline, voicemail, duplicate events, outages, and fallback are tested before production.",
  },
  {
    title: "7–14 day shadow launch",
    body: "Existing coverage remains available while real calls are reviewed.",
  },
  {
    title: "Measured acceptance timeline",
    body: "Reporting distinguishes calls routed, incidents opened, human acceptance, and unconfirmed exceptions.",
  },
] as const;

export const offerColumns = [
  {
    title: "Readiness audit",
    items: [
      "Current after-hours call path",
      "Forwarding and fallback review",
      "On-call roster design",
      "Disclosure and data-flow review",
    ],
  },
  {
    title: "Implementation",
    items: [
      "Verified dispatch workflow",
      "Managed incident state",
      "Acceptance tests and staff setup",
    ],
  },
  {
    title: "Managed operation",
    items: [
      "Workflow and agent monitoring",
      "On-call roster updates",
      "Daily and weekly checks",
      "Incident reconciliation",
      "Monthly response report",
    ],
  },
] as const;

export type PricingTier = {
  name: string;
  price: string;
  unit: string;
  setupText?: string;
  summary: string;
  items: readonly string[];
  featured?: boolean;
};

/** Launch pricing. Edit here only — every page reads these values. */
export const pricing: {
  note: string;
  tiers: readonly PricingTier[];
  scopedSeparately: readonly string[];
} = {
  note: "Currently accepting 5 design partners. General availability pricing applies after the first cohort.",
  tiers: [
    {
      name: "Design Partner Cohort",
      price: "$199",
      unit: "/month per location",
      setupText: "$499 Setup Fee (Discounted for first 5 partners)",
      summary: "Full managed emergency intake, sequential escalation, and deterministic acceptance in exchange for a published case study.",
      items: [
        "24/7 After-hours routed emergency intake",
        "Restoration-native incident triage (Water/Fire/TPA)",
        "Active call escalation (Sequential roster calls)",
        "Deterministic press-1 or verbal human acceptance",
        "Duplicate-acceptance protection & state locking",
        "Alizane Labs-managed daily health checks",
        "Monthly response & acceptance timeline reports",
        "Standard CRM webhook integration",
      ],
      featured: true,
    },
    {
      name: "Verified Dispatch",
      price: "$599",
      unit: "/month per location",
      setupText: "$1,500 implementation setup per location",
      summary: "Standard general availability pricing for full managed emergency intake and dispatch verification.",
      items: [
        "All Design Partner cohort features",
        "Up to 3 on-call roster shifts per location",
        "Standard onboarding & SLA timeline",
      ],
      featured: false,
    },
    {
      name: "Assured Dispatch",
      price: "Custom",
      unit: "tailored enterprise SLA",
      setupText: "Custom implementation scoping",
      summary: "Includes contracted live-human fallback operator dispatch for ultimate operational coverage.",
      items: [
        "All Verified Dispatch features",
        "Contracted live-human backstop fallback operator",
        "Multi-location consolidated dashboard",
        "Custom CRM / job-management webhooks",
        "Dedicated account engineer & instant roster updates",
        "Custom compliance & recording retention options",
        "Priority 24/7 system health monitoring",
      ],
    },
  ],
  scopedSeparately: [
    "Contracted live-human fallback",
    "Additional locations",
    "Additional languages",
    "New integrations",
    "SMS workflows (after A2P registration and documented opt-in)",
    "Custom compliance requirements",
  ],
} as const;
