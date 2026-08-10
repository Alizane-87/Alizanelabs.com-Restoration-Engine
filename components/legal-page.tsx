import { Container, Eyebrow, Section } from "@/components/ui/section";
import { legalIdentity, pendingValueLabel, type LegalSection } from "@/content/legal";

export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
  showContact = true,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
  showContact?: boolean;
}) {
  return (
    <>
      <div className="bg-navy text-offwhite">
        <Container className="py-14 sm:py-16">
          <div className="flex max-w-3xl flex-col gap-4">
            <Eyebrow tone="dark">{eyebrow}</Eyebrow>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
            <p className="text-base leading-relaxed text-steel">{intro}</p>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-steel">
              Last updated: {legalIdentity.lastUpdated}
            </p>
          </div>
        </Container>
      </div>

      <Section tone="light">
        <div className="flex max-w-3xl flex-col gap-10">
          {sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-navy">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-steel-dark">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-1 flex flex-col gap-2.5">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="grid grid-cols-[auto_1fr] gap-2.5 text-sm leading-relaxed text-steel-dark"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 rounded-full bg-steel"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          {showContact ? (
            <section className="flex flex-col gap-3 border-t border-navy/10 pt-8">
              <h2 className="text-xl font-semibold text-navy">Contact</h2>
              <dl className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Legal entity", value: legalIdentity.entityName },
                  { label: "Registered address", value: legalIdentity.address },
                  { label: "Privacy contact", value: legalIdentity.privacyEmail },
                  { label: "Governing law", value: legalIdentity.governingLaw },
                ].map((item) => (
                  <div key={item.label}>
                    <dt className="font-mono text-xs uppercase tracking-[0.14em] text-steel-dark">
                      {item.label}
                    </dt>
                    <dd className="mt-1.5 text-sm text-navy">
                      {item.value ?? pendingValueLabel}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </div>
      </Section>
    </>
  );
}
