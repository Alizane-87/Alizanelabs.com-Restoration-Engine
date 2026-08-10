import { TrackedLink } from "@/components/tracked-link";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Container, Eyebrow, ScopeNote, Section, SectionHeading } from "@/components/ui/section";
import { StatusChip } from "@/components/ui/status-chip";
import { IllustrativeLabel } from "@/components/ui/status-chip";
import { cta, site } from "@/content/site";
import { analyticsEvents } from "@/lib/analytics";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "How it works",
  description:
    "The full sequence from a routed after-hours homeowner call to named human acceptance, including the voicemail, decline, duplicate, and fallback paths.",
  path: "/how-it-works",
});

const sequence = [
  {
    time: "00:00",
    actor: "Homeowner",
    title: "Call is routed into the Engine",
    body: "Your phone system forwards the call under the conditions you configured: after hours, on no answer, or on overflow.",
    status: "routed" as const,
  },
  {
    time: "00:01",
    actor: "Engine",
    title: "Answer with disclosure",
    body: "The automated assistant answers and discloses automated handling and recording or processing before intake begins.",
    status: "active" as const,
  },
  {
    time: "00:20",
    actor: "Engine",
    title: "Triage and intake",
    body: "Urgency is classified and the approved restoration intake is captured: confirmed address, callback number, damage type, and insurance status as reported.",
    status: "active" as const,
  },
  {
    time: "01:00",
    actor: "Engine",
    title: "Incident opened during the live call",
    body: "The incident record exists before the homeowner hangs up, so escalation does not wait for a transcript or a summary email.",
    status: "active" as const,
  },
  {
    time: "01:05",
    actor: "Engine",
    title: "Primary on-call contacted",
    body: "The first approved position on the roster is called. This is a call, not only a notification.",
    status: "escalating" as const,
  },
  {
    time: "01:50",
    actor: "Engine",
    title: "Escalation continues",
    body: "No answer, voicemail, or a decline moves the incident to the next approved position under the runbook's retry rules.",
    status: "escalating" as const,
  },
  {
    time: "02:18",
    actor: "Technician",
    title: "Named human acceptance",
    body: "A technician presses 1 or verbally accepts. The incident locks against that named contact with a timestamp.",
    status: "accepted" as const,
  },
  {
    time: "Next morning",
    actor: "Owner",
    title: "Response evidence",
    body: "The response timeline shows calls routed, incidents opened, who accepted, and any unconfirmed exceptions.",
    status: "accepted" as const,
  },
];

const distinctions = [
  {
    term: "Answer",
    body: "Someone or something picked up. On its own, this proves only that the line was not dead.",
  },
  {
    term: "Notification",
    body: "A message was delivered to a device. Delivery is not acknowledgement, and a sleeping phone still counts as delivered.",
  },
  {
    term: "Transfer",
    body: "The call was passed to another line. If nobody picks up that line, the emergency is back where it started.",
  },
  {
    term: "Acceptance",
    body: "A named human confirmed they own the incident. This is the event the Engine is built to produce and record.",
  },
  {
    term: "Fallback",
    body: "The contracted path used when no approved contact accepts. It is defined in the agreement, not improvised at 3 AM.",
  },
];

const failureRows = [
  { status: "escalating" as const, path: "Primary does not answer", result: "Retry per runbook, then next approved contact." },
  { status: "escalating" as const, path: "Call reaches voicemail", result: "Neutral message with incident reference; no homeowner details exposed; escalation continues." },
  { status: "escalating" as const, path: "Technician declines", result: "Decline recorded against the named contact; next position called immediately." },
  { status: "accepted" as const, path: "Two technicians respond", result: "First acceptance locks the incident; the second is told it is already owned." },
  { status: "exception" as const, path: "No approved contact accepts", result: "Contracted fallback is reached and an unconfirmed exception is recorded." },
  { status: "exception" as const, path: "Upstream service degraded", result: "Defined fallback and incident-response procedures apply per service level." },
];

export default function HowItWorksPage() {
  return (
    <>
      <div className="bg-navy text-offwhite">
        <Container className="py-16 sm:py-20">
          <div className="flex max-w-3xl flex-col gap-6">
            <Eyebrow tone="dark">How it works</Eyebrow>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              From a homeowner at 2 AM to a named human who accepted
            </h1>
            <p className="text-base leading-relaxed text-steel sm:text-lg">
              This is the whole sequence, including the parts that do not go to plan.
            </p>
            <ScopeNote tone="dark">{site.scopeNote}</ScopeNote>
          </div>
        </Container>
      </div>

      <Section tone="light" labelledBy="sequence-heading">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionHeading
            id="sequence-heading"
            eyebrow="Sequence"
            title="The routed-call timeline"
            description="Elapsed times are an illustration of the workflow shape, not a promised response time."
          />
          <IllustrativeLabel />
        </div>

        <ol className="mt-10 flex flex-col">
          {sequence.map((entry, index) => {
            const isLast = index === sequence.length - 1;
            return (
              <li key={entry.title} className="grid grid-cols-[auto_1fr] gap-x-4 sm:grid-cols-[7rem_auto_1fr] sm:gap-x-6">
                <p className="hidden pt-0.5 font-mono text-xs text-steel-dark sm:block">
                  {entry.time}
                </p>
                <div className="flex flex-col items-center">
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                      entry.status === "accepted"
                        ? "bg-verified"
                        : entry.status === "escalating"
                          ? "bg-amber"
                          : "bg-steel"
                    }`}
                  />
                  {!isLast ? <span className="w-px flex-1 bg-navy/10" /> : null}
                </div>
                <div className={isLast ? "" : "pb-8"}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs uppercase tracking-[0.14em] text-steel-dark sm:hidden">
                      {entry.time}
                    </span>
                    <StatusChip status={entry.status} />
                    <span className="font-mono text-xs uppercase tracking-[0.14em] text-steel-dark">
                      {entry.actor}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-navy sm:text-lg">
                    {entry.title}
                  </h3>
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-steel-dark">
                    {entry.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section tone="muted" labelledBy="distinctions-heading">
        <SectionHeading
          id="distinctions-heading"
          eyebrow="Definitions"
          title="Five words that get used interchangeably — and should not be"
        />
        <dl className="mt-10 grid gap-4 md:grid-cols-2">
          {distinctions.map((item) => (
            <div key={item.term} className="rounded-lg border border-navy/10 bg-white p-6">
              <dt className="text-lg font-semibold text-navy">{item.term}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-steel-dark">{item.body}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="dark" labelledBy="failure-heading">
        <SectionHeading
          id="failure-heading"
          tone="dark"
          eyebrow="Failure paths"
          title="What the Engine does when the happy path breaks"
        />
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {failureRows.map((row) => (
            <Card key={row.path} as="li" tone="dark">
              <StatusChip status={row.status} surface="dark" />
              <CardTitle className="mt-3 text-base text-white">{row.path}</CardTitle>
              <CardBody tone="dark">{row.result}</CardBody>
            </Card>
          ))}
        </ul>
      </Section>

      <Section tone="light" labelledBy="control-heading">
        <SectionHeading
          id="control-heading"
          eyebrow="Division of responsibility"
          title="What Alizane manages, and what stays yours"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Card>
            <CardTitle>Alizane manages</CardTitle>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-steel-dark">
              {[
                "Implementation and runbook configuration",
                "Voice agent and workflow monitoring",
                "On-call roster updates you request",
                "Daily and weekly health checks",
                "Incident reconciliation and monthly reporting",
              ].map((item) => (
                <li key={item} className="grid grid-cols-[auto_1fr] gap-2.5">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 rounded-full bg-steel" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardTitle>You control</CardTitle>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-steel-dark">
              {[
                "Which calls are routed into the Engine",
                "Who is on the approved on-call roster",
                "Whether a technician accepts",
                "Callback, crew availability, and arrival",
                "Pricing, coverage advice, and the customer relationship",
              ].map((item) => (
                <li key={item} className="grid grid-cols-[auto_1fr] gap-2.5">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 rounded-full bg-steel" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="mt-10">
          <TrackedLink
            href={cta.audit.href}
            event={analyticsEvents.productCtaClick}
            location="how-it-works-closing"
            size="lg"
          >
            {cta.audit.label}
          </TrackedLink>
        </div>
      </Section>
    </>
  );
}
