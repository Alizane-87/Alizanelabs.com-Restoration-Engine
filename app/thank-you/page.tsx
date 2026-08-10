import { TrackedLink } from "@/components/tracked-link";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/section";
import { analyticsEvents } from "@/lib/analytics";
import { pageMetadata } from "@/lib/metadata";

export const metadata = {
  ...pageMetadata({
    title: "Request received",
    description: "Your after-hours dispatch audit request has been received.",
    path: "/thank-you",
  }),
  robots: { index: false, follow: true },
};

const nextSteps = [
  {
    title: "We review your call path",
    body: "Before we speak, we read what you told us about how after-hours calls are handled today.",
  },
  {
    title: "We propose a time",
    body: "You will hear from us by email to confirm a slot for the live phone test and audit.",
  },
  {
    title: "You run the test",
    body: "On the call you play the homeowner, then the on-call technician, and watch acceptance get recorded.",
  },
];

export default function ThankYouPage() {
  return (
    <>
      <div className="bg-navy text-offwhite">
        <Container className="py-16 sm:py-20">
          <div className="flex max-w-3xl flex-col gap-6">
            <Eyebrow tone="dark">Request received</Eyebrow>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              Thank you — your dispatch audit request is in.
            </h1>
            <p className="text-base leading-relaxed text-steel sm:text-lg">
              A founder reads every request. Here is what happens next.
            </p>
          </div>
        </Container>
      </div>

      <Section tone="light" labelledBy="next-heading">
        <SectionHeading id="next-heading" title="What happens next" />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {nextSteps.map((step, index) => (
            <Card key={step.title} as="li">
              <span className="font-mono text-xs tracking-[0.18em] text-steel-dark">
                {String(index + 1).padStart(2, "0")}
              </span>
              <CardTitle className="mt-2 text-base">{step.title}</CardTitle>
              <CardBody>{step.body}</CardBody>
            </Card>
          ))}
        </ol>
      </Section>

      <Section tone="muted" labelledBy="wait-heading">
        <SectionHeading
          id="wait-heading"
          title="While you wait"
          description="The workflow explainer walks through the full sequence, including the voicemail, decline, duplicate, and fallback paths."
        />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <TrackedLink
            href="/how-it-works"
            event={analyticsEvents.productCtaClick}
            location="thank-you"
            size="lg"
          >
            See the dispatch workflow
          </TrackedLink>
          <TrackedLink
            href="/restoration-emergency-engine"
            event={analyticsEvents.productCtaClick}
            location="thank-you-secondary"
            variant="secondary"
            size="lg"
          >
            Read the product detail
          </TrackedLink>
        </div>
      </Section>
    </>
  );
}
