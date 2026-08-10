import { TrackedLink } from "@/components/tracked-link";
import { cn } from "@/components/ui/cn";
import { cta, pricing } from "@/content/site";
import { analyticsEvents } from "@/lib/analytics";

export function PricingCards({ location }: { location: string }) {
  return (
    <div className="mt-10 grid gap-5 lg:grid-cols-3">
      {pricing.tiers.map((tier) => (
        <article
          key={tier.name}
          className={cn(
            "flex flex-col rounded-lg border bg-white p-6",
            tier.featured ? "border-navy shadow-sm" : "border-navy/10",
          )}
        >
          <h3 className="text-lg font-semibold text-navy">{tier.name}</h3>
          <p className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-navy">{tier.price}</span>
            <span className="text-sm text-steel-dark">{tier.unit}</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-steel-dark">{tier.summary}</p>
          <ul className="mt-5 flex flex-1 flex-col gap-2.5 text-sm text-navy">
            {tier.items.map((item) => (
              <li key={item} className="grid grid-cols-[auto_1fr] gap-2.5">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 rounded-full bg-steel" />
                <span className="text-steel-dark">{item}</span>
              </li>
            ))}
          </ul>
          <TrackedLink
            href={cta.audit.href}
            event={analyticsEvents.pricingCtaClick}
            location={`${location}-${tier.name.toLowerCase().replace(/\s+/g, "-")}`}
            variant={tier.featured ? "primary" : "secondary"}
            size="md"
            className="mt-6"
          >
            {cta.audit.label}
          </TrackedLink>
        </article>
      ))}
    </div>
  );
}
