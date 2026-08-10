import { LeadForm } from "@/components/lead-form";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Container, Eyebrow, ScopeNote, Section, SectionHeading } from "@/components/ui/section";
import { site } from "@/content/site";
import { hasScheduling } from "@/lib/env";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "After-hours dispatch audit",
  description:
    "Request a live phone demo and an after-hours dispatch audit of your current call path, on-call roster, and fallback.",
  path: "/dispatch-audit",
});

const agenda = [
  {
    title: "Your current after-hours path",
    body: "Where calls land tonight, what happens on no answer, and where the process depends on one person being awake.",
  },
  {
    title: "The live phone test",
    body: "You call as the homeowner and answer as the on-call technician, so you see acceptance recorded rather than described.",
  },
  {
    title: "Roster and fallback design",
    body: "Who should be called, in what order, with what retry rules, and what the contracted fallback should be.",
  },
  {
    title: "Fit and next steps",
    body: "An honest answer about whether the Engine is worth it for your call volume and job values.",
  },
];

export default function DispatchAuditPage() {
  return (
    <>
      <div className="bg-navy text-offwhite">
        <Container className="py-16 sm:py-20">
          <div className="flex max-w-3xl flex-col gap-6">
            <Eyebrow tone="dark">Live demo and audit</Eyebrow>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              Put your own phone through the dispatch test
            </h1>
            <p className="text-base leading-relaxed text-steel sm:text-lg">
              Tell us how after-hours calls are handled today. We will review your call path and
              run the live demo with you on the phone.
            </p>
            <ScopeNote tone="dark">{site.scopeNote}</ScopeNote>
          </div>
        </Container>
      </div>

      <Section tone="light" labelledBy="form-heading">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <SectionHeading
              id="form-heading"
              title="Request the audit"
              description="Eight short fields. A founder reads every submission."
            />
            <div className="mt-8">
              <LeadForm />
            </div>
            {!hasScheduling ? (
              <p className="mt-6 text-sm text-steel-dark">
                We confirm a time by email once we have your details.
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-steel-dark">
              What the session covers
            </h2>
            {agenda.map((item) => (
              <Card key={item.title}>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardBody>{item.body}</CardBody>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
