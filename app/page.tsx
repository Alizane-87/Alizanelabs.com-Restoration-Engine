import { ComparisonTable } from "@/components/comparison-table";
import { FaqList } from "@/components/faq";
import { HeroDispatchTimeline } from "@/components/hero-dispatch-timeline";
import { PricingCards } from "@/components/pricing-cards";
import { ProofProtocol } from "@/components/proof-protocol";
import { TrackedLink } from "@/components/tracked-link";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Container, Eyebrow, ScopeNote, Section, SectionHeading } from "@/components/ui/section";
import { StepList } from "@/components/ui/step-list";
import { homeFaqs } from "@/content/faqs";
import { cta, dispatchSteps, offerColumns, pricing, problemCards, site } from "@/content/site";
import { analyticsEvents } from "@/lib/analytics";
import { faqSchema, serviceSchema } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <>
      <div className="bg-amber text-navy py-2 px-4 text-center text-sm font-medium">
        [Placeholder] The After-Hours Gap Report: How Restoration Companies Lose $40,000+ a Year Without Knowing It. <a href="#" className="underline font-semibold hover:text-black">Download the free gap report &rarr;</a>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(homeFaqs)) }}
      />

      <div className="bg-navy text-offwhite">
        <Container className="py-16 sm:py-20 lg:py-28">
          <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="animate-rise-in flex flex-col gap-6">
              <Eyebrow tone="dark">
                For restoration companies. After-hours emergency dispatch.
              </Eyebrow>
              <h1 className="text-3xl font-semibold leading-[1.1] text-white sm:text-4xl lg:text-5xl">
                You're losing jobs you never even knew you were losing.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-steel sm:text-lg">
                At 2 AM, a homeowner's basement is flooding. They call your number. Instead of voicemail, they reach our system — which collects the details, calls your technician, and records their verbal acceptance before hanging up. You wake up with a confirmed dispatch, not a missed lead.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <TrackedLink
                  href={cta.primary.href}
                  event={analyticsEvents.heroDemoCtaClick}
                  location="hero"
                  size="lg"
                >
                  {cta.primary.label}
                </TrackedLink>
                <TrackedLink
                  href={cta.secondary.href}
                  event={analyticsEvents.productCtaClick}
                  location="hero-secondary"
                  variant="onDark"
                  size="lg"
                >
                  {cta.secondary.label}
                </TrackedLink>
              </div>
              <ScopeNote tone="dark">Tested across 20 failure scenarios before your first live call.</ScopeNote>
            </div>

            <HeroDispatchTimeline />
          </div>
        </Container>
      </div>

      <Section tone="light" labelledBy="problem-heading">
        <SectionHeading
          id="problem-heading"
          eyebrow="The gap"
          title="A message is not a dispatch."
          description="Voicemail waits. Generic answering services take notes. Notifications can be missed. During an after-hours restoration call, the operational question is simple: who has accepted responsibility for calling the homeowner?"
        />
        <div className="mt-10 mb-8 rounded-lg border border-amber/20 bg-amber/5 px-6 py-5 text-amber-900 shadow-sm text-center">
          <p className="text-base sm:text-lg font-medium leading-relaxed">
            The average restoration job is worth $4,000–$12,000.<br/>
            Every missed after-hours call is a coin flip on that revenue.<br/>
            The average restoration company loses 3–7 jobs per month to after-hours gaps.
          </p>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {problemCards.map((card) => (
            <Card key={card.title} as="li">
              <CardTitle>{card.title}</CardTitle>
              <CardBody>{card.body}</CardBody>
            </Card>
          ))}
        </ul>
      </Section>

      <Section tone="dark" labelledBy="mechanism-heading">
        <SectionHeading
          id="mechanism-heading"
          tone="dark"
          eyebrow="Mechanism"
          title="From routed call to named acceptance"
          description="Six steps run every time a call is routed into the Engine."
        />
        <StepList steps={dispatchSteps} tone="dark" className="mt-10" />
        <div className="mt-10">
          <TrackedLink
            href="/how-it-works"
            event={analyticsEvents.productCtaClick}
            location="mechanism"
            variant="onDark"
            size="lg"
          >
            Experience all six steps
          </TrackedLink>
        </div>
      </Section>

      <Section tone="muted" labelledBy="difference-heading">
        <SectionHeading
          id="difference-heading"
          eyebrow="Category difference"
          title="Not another AI receptionist subscription"
          description="Both categories answer the phone. Only one is built to end with a named human who has accepted the incident."
        />
        <ComparisonTable />
        <p className="mt-5 text-sm text-steel-dark">
          Competitor capabilities vary. This compares common product categories, not every
          individual provider.
        </p>
      </Section>

      <Section tone="dark" labelledBy="proof-heading">
        <SectionHeading
          id="proof-heading"
          tone="dark"
          eyebrow="Proof by process"
          title="You test it before it handles a single real emergency."
          description="We don't ask you to trust a sales deck. We run the system through your exact on-call roster, simulate 20 failure scenarios, and confirm every edge case passes before your first live call goes live. Our onboarding is more thorough than most competitors' SLAs."
        />
        <ProofProtocol />
      </Section>

      <Section tone="light" labelledBy="safety-heading">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <SectionHeading
            id="safety-heading"
            eyebrow="Safety and transparency"
            title="Designed for urgency without pretending to be a human"
            description="The caller is told that an automated after-hours assistant is handling and processing the call. The Engine gathers the information your team approved, stays inside defined safety boundaries, and does not quote prices, promise insurance coverage, or invent technician availability."
          />
          <div className="self-center">
            <TrackedLink
              href="/ai-call-disclosure"
              event={analyticsEvents.productCtaClick}
              location="safety"
              variant="secondary"
              size="lg"
            >
              Read our AI call and recording approach
            </TrackedLink>
          </div>
        </div>
      </Section>

      <Section tone="muted" labelledBy="offer-heading">
        <SectionHeading
          id="offer-heading"
          eyebrow="The offer"
          title="Installed around your on-call reality"
          description="Alizane Labs runs the deployment as managed infrastructure rather than handing you software to configure."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {offerColumns.map((column) => (
            <Card key={column.title}>
              <CardTitle>{column.title}</CardTitle>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm text-steel-dark">
                {column.items.map((item) => (
                  <li key={item} className="grid grid-cols-[auto_1fr] gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 rounded-full bg-steel"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <div className="mt-10">
          <TrackedLink
            href={cta.audit.href}
            event={analyticsEvents.productCtaClick}
            location="offer"
            size="lg"
          >
            {cta.audit.label}
          </TrackedLink>
        </div>
      </Section>

      <Section tone="light" labelledBy="pricing-heading">
        <SectionHeading
          id="pricing-heading"
          eyebrow="Pricing"
          title="Premium because the handoff is managed"
          description="Generic answering products compete on minutes. Alizane Labs is priced around implementation ownership, dispatch verification, monitoring, and fallback operations."
        />
        <div className="mt-6 mb-10 max-w-3xl text-lg font-medium text-navy">
          One prevented missed job pays for 3–6 months of service. <br/>
          At $599/month, the system pays for itself the moment it routes a single $5,000 job that would have gone to voicemail.
        </div>
        <PricingCards location="home" />
        <p className="mt-5 text-sm text-steel-dark">{pricing.note}</p>
      </Section>

      <Section tone="muted" labelledBy="faq-heading">
        <SectionHeading id="faq-heading" eyebrow="Questions" title="What owners ask first" />
        <FaqList faqs={homeFaqs} location="home" />
      </Section>

      <Section tone="dark" labelledBy="closing-heading">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <SectionHeading
            id="closing-heading"
            tone="dark"
            title="Put your own phone through the dispatch test."
            description="No slides. You call the demo line as a homeowner. The Engine collects the incident, alerts your phone as the on-call technician, and records whether you accept."
          />
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <TrackedLink
              href={cta.primary.href}
              event={analyticsEvents.heroDemoCtaClick}
              location="closing"
              size="lg"
            >
              Run the live demo on my phone
            </TrackedLink>
            <TrackedLink
              href={cta.secondary.href}
              event={analyticsEvents.productCtaClick}
              location="closing-secondary"
              variant="onDark"
              size="lg"
            >
              See how the dispatch works first
            </TrackedLink>
          </div>
        </div>
      </Section>
    </>
  );
}
