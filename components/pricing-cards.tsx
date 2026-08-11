import { TrackedLink } from "@/components/tracked-link";
import { cn } from "@/components/ui/cn";
import { cta, pricing } from "@/content/site";
import { analyticsEvents } from "@/lib/analytics";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function PricingCards({ location }: { location: string }) {
  return (
    <div className="mt-10 grid gap-5 lg:grid-cols-3">
      {pricing.tiers.map((tier) => (
        <article
          key={tier.name}
          className={cn(
            "flex flex-col rounded-lg border p-6 lg:p-8",
            tier.featured ? "border-amber bg-navy shadow-xl border-2" : "border-navy/5 bg-offwhite shadow-sm",
          )}
        >
          <h3 className={cn("text-xl font-bold", tier.featured ? "text-white" : "text-navy")}>{tier.name}</h3>
          
          <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className={cn("text-3xl font-bold tracking-tight", tier.featured ? "text-white" : "text-navy")}>{tier.price}</span>
            <span className={cn("text-sm", tier.featured ? "text-steel" : "text-steel-dark")}>{tier.unit}</span>
          </div>

          {tier.setupText && (
            <p className={cn("mt-4 text-xs font-mono tracking-wide uppercase", tier.featured ? "text-amber" : "text-steel-dark")}>
              {tier.setupText}
            </p>
          )}

          <p className={cn("mt-4 text-sm leading-relaxed", tier.featured ? "text-steel" : "text-steel-dark")}>{tier.summary}</p>
          
          <ul className={cn("mt-8 flex flex-1 flex-col gap-4 text-sm", tier.featured ? "text-white" : "text-navy")}>
            {tier.items.map((item) => (
              <li key={item} className="grid grid-cols-[auto_1fr] gap-3 items-start">
                <CheckIcon className={cn("mt-0.5 h-4 w-4 shrink-0", tier.featured ? "text-verified" : "text-navy")} />
                <span className="opacity-90">{item}</span>
              </li>
            ))}
          </ul>
          
          <TrackedLink
            href={cta.audit.href}
            event={analyticsEvents.pricingCtaClick}
            location={`${location}-${tier.name.toLowerCase().replace(/\s+/g, "-")}`}
            variant={tier.featured ? "primary" : "secondary"}
            size="md"
            className="mt-8"
          >
            {cta.audit.label}
          </TrackedLink>
        </article>
      ))}
    </div>
  );
}
