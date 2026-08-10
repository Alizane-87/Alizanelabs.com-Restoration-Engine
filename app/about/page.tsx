import { TrackedLink } from "@/components/tracked-link";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/section";
import { cta, site } from "@/content/site";
import { legalIdentity, pendingValueLabel } from "@/content/legal";
import { analyticsEvents } from "@/lib/analytics";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Alizane Labs builds managed revenue-response infrastructure for restoration companies. The first product is the Restoration Emergency Engine.",
  path: "/about",
});

const principles = [
  {
    title: "Evidence over adjectives",
    body: "We publish what the system records — routed calls, opened incidents, named acceptance, unconfirmed exceptions — and nothing we cannot show.",
  },
  {
    title: "Managed, not shipped",
    body: "You should not have to administer an automation platform to keep after-hours coverage working. Alizane operates the deployment.",
  },
  {
    title: "Boundaries stated up front",
    body: "The Engine does not control technician availability, arrival, coverage decisions, or revenue, and the website says so wherever it matters.",
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="bg-navy text-offwhite">
        <Container className="py-16 sm:py-20">
          <div className="flex max-w-3xl flex-col gap-6">
            <Eyebrow tone="dark">About</Eyebrow>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              Managed revenue-response infrastructure for restoration companies
            </h1>
            <p className="text-base leading-relaxed text-steel sm:text-lg">
              {site.name} builds systems that close the gap between an urgent call and a human
              who has accepted it. The first product is the {site.product}.
            </p>
          </div>
        </Container>
      </div>

      <Section tone="light" labelledBy="founder-heading">
        <SectionHeading id="founder-heading" eyebrow="Founder" title="Who you will speak to" />
        <div className="mt-8 max-w-3xl rounded-lg border border-navy/10 bg-white p-6">
          {/* Founder bio and experience statement are supplied by the founder before launch. */}
          <p className="text-sm leading-relaxed text-steel-dark">
            The founder biography and experience statement are being finalised and will be
            published here before launch. Nothing is claimed on this page that has not been
            verified.
          </p>
          <div className="mt-6">
            <TrackedLink
              href={cta.audit.href}
              event={analyticsEvents.productCtaClick}
              location="about-founder"
              variant="secondary"
            >
              Speak with the founder
            </TrackedLink>
          </div>
        </div>
      </Section>

      <Section tone="muted" labelledBy="principles-heading">
        <SectionHeading
          id="principles-heading"
          eyebrow="How we work"
          title="Three commitments"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {principles.map((item) => (
            <Card key={item.title}>
              <CardTitle>{item.title}</CardTitle>
              <CardBody>{item.body}</CardBody>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="light" labelledBy="company-heading">
        <SectionHeading
          id="company-heading"
          eyebrow="Company"
          title="Registration and contact"
        />
        <dl className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
          {[
            { label: "Legal entity", value: legalIdentity.entityName },
            { label: "Business address", value: legalIdentity.address },
            { label: "Contact", value: legalIdentity.contactEmail },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-navy/10 bg-white p-5">
              <dt className="font-mono text-xs uppercase tracking-[0.14em] text-steel-dark">
                {item.label}
              </dt>
              <dd className="mt-2 text-sm text-navy">{item.value ?? pendingValueLabel}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}
