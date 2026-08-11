import { FaqList } from "@/components/faq";
import { PricingCards } from "@/components/pricing-cards";
import { TrackedLink } from "@/components/tracked-link";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Container, Eyebrow, ScopeNote, Section, SectionHeading } from "@/components/ui/section";
import { pricingFaqs } from "@/content/faqs";
import { cta, pricing, site } from "@/content/site";
import { analyticsEvents } from "@/lib/analytics";
import { pageMetadata } from "@/lib/metadata";
import { faqSchema } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "Pricing",
  description:
    "Launch pricing for the Restoration Emergency Engine: implementation from $1,500 per location and managed Verified Dispatch from $599 per month, with fallback and integrations scoped separately.",
  path: "/pricing",
});

const whyPremium = [
  {
    title: "Implementation is owned, not handed over",
    body: "Alizane Labs runs the readiness audit, designs the escalation runbook, builds the workflow, and tests it before a real emergency touches it.",
  },
  {
    title: "The handoff is verified",
    body: "Producing and storing named human acceptance — with duplicate protection and decline handling — is the expensive part, and it is the part generic answering products leave to you.",
  },
  {
    title: "Someone watches it",
    body: "Monitoring, daily checks, roster upkeep, and reconciliation are ongoing work, not a one-time setup fee.",
  },
  {
    title: "Fallback is contracted",
    body: "What happens when nobody accepts is defined in advance and operated, rather than discovered during an incident.",
  },
];

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(pricingFaqs)) }}
      />

      <div className="bg-navy text-offwhite">
        <Container className="py-16 sm:py-20">
          <div className="flex max-w-3xl flex-col gap-6">
            <Eyebrow tone="dark">Pricing</Eyebrow>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              Premium because the handoff is managed
            </h1>
            <p className="text-base leading-relaxed text-steel sm:text-lg">
              Generic answering products compete on minutes. Alizane Labs is priced around
              implementation ownership, dispatch verification, monitoring, and fallback
              operations.
            </p>
            <ScopeNote tone="dark">{site.evidenceScope}</ScopeNote>
          </div>
        </Container>
      </div>

      <Section tone="light" labelledBy="tiers-heading">
        <SectionHeading id="tiers-heading" title="Launch pricing" description={pricing.note} />
        <PricingCards location="pricing" />
      </Section>

      <Section tone="muted" labelledBy="why-heading">
        <SectionHeading
          id="why-heading"
          eyebrow="Why it costs more"
          title="What you are actually buying"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {whyPremium.map((item) => (
            <Card key={item.title}>
              <CardTitle>{item.title}</CardTitle>
              <CardBody>{item.body}</CardBody>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="light" labelledBy="scope-heading">
        <SectionHeading
          id="scope-heading"
          eyebrow="Scoped separately"
          title="Priced after the readiness audit"
          description="These are quoted per deployment because their cost depends on your operation, not on a list price."
        />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {pricing.scopedSeparately.map((item) => (
            <li
              key={item}
              className="grid grid-cols-[auto_1fr] gap-3 rounded-lg border border-navy/10 bg-white px-4 py-3 text-sm text-steel-dark"
            >
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 rounded-full bg-steel" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="muted" labelledBy="pricing-faq-heading">
        <SectionHeading id="pricing-faq-heading" eyebrow="Questions" title="Pricing questions" />
        <FaqList faqs={pricingFaqs} location="pricing" />
      </Section>

      <Section tone="dark" labelledBy="pricing-cta-heading">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <SectionHeading
            id="pricing-cta-heading"
            tone="dark"
            title="Start with the audit, not a quote"
            description="The readiness audit establishes your call path, roster, and fallback before anyone signs anything."
          />
          <div className="lg:justify-self-end">
            <TrackedLink
              href={cta.audit.href}
              event={analyticsEvents.pricingCtaClick}
              location="pricing-closing"
              size="lg"
            >
              {cta.audit.label}
            </TrackedLink>
          </div>
        </div>
      </Section>
    </>
  );
}
