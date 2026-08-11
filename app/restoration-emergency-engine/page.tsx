import { PricingCards } from "@/components/pricing-cards";
import { TrackedLink } from "@/components/tracked-link";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Container, Eyebrow, ScopeNote, Section, SectionHeading } from "@/components/ui/section";
import { StatusChip } from "@/components/ui/status-chip";
import { StepList } from "@/components/ui/step-list";
import { cta, dispatchSteps, site } from "@/content/site";
import { analyticsEvents } from "@/lib/analytics";
import { pageMetadata } from "@/lib/metadata";
import { serviceSchema } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "Restoration Emergency Engine",
  description:
    "A managed after-hours intake and verified dispatch system for restoration companies: restoration-specific triage, sequential on-call escalation, named human acceptance, monitored fallback, and response reporting.",
  path: "/restoration-emergency-engine",
});

const intakeFields = [
  "Confirmed service address",
  "Callback number",
  "Damage type and reported source",
  "Whether water is still active",
  "Approximate affected area",
  "Property type and access notes",
  "Insurance status as reported by the caller",
  "Safety flags that require 911 rather than a technician",
];

const safetyBoundaries = [
  "Does not quote prices or estimate restoration cost",
  "Does not confirm or deny insurance coverage",
  "Does not promise an arrival window",
  "Does not invent technician names or availability",
  "Directs immediate danger to 911",
  "Stays inside the intake script your team approved",
];

const failurePaths = [
  {
    status: "escalating" as const,
    title: "No answer",
    body: "The contact is retried according to the runbook, then the next approved contact is called. Nothing waits on a single device.",
  },
  {
    status: "escalating" as const,
    title: "Voicemail",
    body: "A neutral message is left that identifies the incident reference without exposing homeowner details, and escalation continues in parallel.",
  },
  {
    status: "escalating" as const,
    title: "Decline",
    body: "A decline is recorded against the named contact and the Engine moves immediately to the next position in the roster.",
  },
  {
    status: "accepted" as const,
    title: "Duplicate acceptance attempt",
    body: "The first acceptance locks the incident. A later attempt is told the incident is already accepted, so two technicians never both believe they own it.",
  },
  {
    status: "exception" as const,
    title: "Nobody accepts",
    body: "The Engine reaches the contracted fallback and records an unconfirmed exception for immediate operational attention.",
  },
  {
    status: "exception" as const,
    title: "Upstream service degraded",
    body: "Defined fallback and incident-response procedures apply. The exact behaviour depends on the contracted service level.",
  },
];

const architecture = [
  {
    title: "Telephony routing",
    body: "Your existing number forwards into the Engine under the conditions you choose — after hours, on no answer, or on overflow.",
  },
  {
    title: "Voice intake",
    body: "A managed voice agent runs the approved disclosure, triage, and intake script.",
  },
  {
    title: "Incident state",
    body: "An incident record is opened during the live call and holds the authoritative acceptance state.",
  },
  {
    title: "Escalation orchestration",
    body: "Outbound escalation follows the approved roster order with retries, decline handling, and duplicate protection.",
  },
  {
    title: "Monitoring and reporting",
    body: "Health checks, reconciliation, and a monthly response report for calls routed into the Engine.",
  },
];

export default function ProductPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema()) }}
      />

      <div className="bg-navy text-offwhite">
        <Container className="py-16 sm:py-20">
          <div className="flex max-w-3xl flex-col gap-6">
            <Eyebrow tone="dark">{site.category}</Eyebrow>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              The Restoration Emergency Engine
            </h1>
            <p className="text-base leading-relaxed text-steel sm:text-lg">
              {site.descriptor} Every qualifying after-hours emergency routed into the Engine
              is answered, classified, logged, and escalated according to the client-approved
              runbook until a named human accepts or the contracted fallback is reached.
            </p>
            <ScopeNote tone="dark">{site.evidenceScope}</ScopeNote>
            <div className="flex flex-col gap-3 sm:flex-row">
              <TrackedLink
                href={cta.primary.href}
                event={analyticsEvents.productCtaClick}
                location="product-hero"
                size="lg"
              >
                {cta.primary.label}
              </TrackedLink>
              <TrackedLink
                href="/how-it-works"
                event={analyticsEvents.productCtaClick}
                location="product-hero-secondary"
                variant="onDark"
                size="lg"
              >
                {cta.secondary.label}
              </TrackedLink>
            </div>
          </div>
        </Container>
      </div>

      <Section tone="light" labelledBy="journey-heading">
        <SectionHeading
          id="journey-heading"
          eyebrow="Call journey"
          title="What happens between the ring and the acceptance"
          description="The same six steps run on every routed call, whether or not the first technician answers."
        />
        <StepList steps={dispatchSteps} className="mt-10" />
      </Section>

      <Section tone="muted" labelledBy="intake-heading">
        <SectionHeading
          id="intake-heading"
          eyebrow="Restoration intake"
          title="Restoration-specific triage, not a generic message pad"
          description="The intake script is built for water-damage-led emergency work and approved by your team before go-live."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Card>
            <CardTitle>Captured on the call</CardTitle>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-steel-dark">
              {intakeFields.map((field) => (
                <li key={field} className="grid grid-cols-[auto_1fr] gap-2.5">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 rounded-full bg-steel" />
                  <span>{field}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardTitle>Safety boundaries</CardTitle>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-steel-dark">
              {safetyBoundaries.map((boundary) => (
                <li key={boundary} className="grid grid-cols-[auto_1fr] gap-2.5">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 rounded-full bg-steel" />
                  <span>{boundary}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      <Section tone="light" labelledBy="roster-heading">
        <SectionHeading
          id="roster-heading"
          eyebrow="Escalation"
          title="Your roster, in the order you approved"
          description="The on-call roster is designed with you during the readiness audit and maintained by Alizane Labs as part of managed operation."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Card>
            <CardTitle>Roster design</CardTitle>
            <CardBody>
              Positions, rotation, retry counts, and the point at which the Engine moves on are
              defined in writing rather than left to habit.
            </CardBody>
          </Card>
          <Card>
            <CardTitle>Deterministic acceptance</CardTitle>
            <CardBody>
              A technician presses 1 or verbally accepts. Acceptance is stored against a named
              contact with a timestamp — not inferred from a delivered notification.
            </CardBody>
          </Card>
          <Card>
            <CardTitle>Duplicate protection</CardTitle>
            <CardBody>
              The incident locks on first acceptance, so a later responder is told it is already
              owned instead of duplicating the callback.
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section tone="dark" labelledBy="failure-heading">
        <SectionHeading
          id="failure-heading"
          tone="dark"
          eyebrow="Failure paths"
          title="Designed around the calls that do not go perfectly"
          description="A dispatch system is only as good as its worst night. These paths are specified, tested in staging, and monitored in production."
        />
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {failurePaths.map((path) => (
            <Card key={path.title} as="li" tone="dark">
              <StatusChip status={path.status} surface="dark" />
              <CardTitle className="mt-3 text-white">{path.title}</CardTitle>
              <CardBody tone="dark">{path.body}</CardBody>
            </Card>
          ))}
        </ul>
      </Section>

      <Section tone="muted" labelledBy="reporting-heading">
        <SectionHeading
          id="reporting-heading"
          eyebrow="Monitoring and reporting"
          title="Evidence you can review in daylight"
          description="Reporting separates what the system did from what your team did, so a slow night can be diagnosed instead of argued about."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Calls routed", body: "Calls your phone system sent into the Engine." },
            { label: "Incidents opened", body: "Emergencies classified and recorded during the live call." },
            { label: "Named acceptance", body: "Who accepted, and when, per incident." },
            { label: "Unconfirmed exceptions", body: "Incidents that reached fallback without an approved acceptance." },
          ].map((item) => (
            <Card key={item.label}>
              <CardTitle className="text-base">{item.label}</CardTitle>
              <CardBody>{item.body}</CardBody>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-sm text-steel-dark">{site.evidenceScope}</p>
      </Section>

      <Section tone="light" labelledBy="architecture-heading">
        <SectionHeading
          id="architecture-heading"
          eyebrow="Architecture summary"
          title="High level by design"
          description="Enough to evaluate the product; not enough to expose a client deployment. Numbers, endpoints, and configuration detail are shared under agreement, not published."
        />
        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {architecture.map((layer, index) => (
            <Card key={layer.title} as="li">
              <span className="font-mono text-xs tracking-[0.18em] text-steel-dark">
                {String(index + 1).padStart(2, "0")}
              </span>
              <CardTitle className="mt-2 text-base">{layer.title}</CardTitle>
              <CardBody>{layer.body}</CardBody>
            </Card>
          ))}
        </ol>
      </Section>

      <Section tone="muted" labelledBy="staging-heading">
        <SectionHeading
          id="staging-heading"
          eyebrow="Before go-live"
          title="Twenty scenarios, then a shadow launch"
          description="Acceptance, decline, voicemail, duplicate events, outages, and fallback are tested in staging. A 7–14 day shadow launch keeps your existing coverage available while real calls are reviewed."
        />
      </Section>

      <Section tone="light" labelledBy="product-pricing-heading">
        <SectionHeading
          id="product-pricing-heading"
          eyebrow="Pricing"
          title="Priced around the managed handoff"
        />
        <PricingCards location="product" />
      </Section>
    </>
  );
}
