"use client";

import type { Faq } from "@/content/faqs";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

export function FaqList({ faqs, location }: { faqs: Faq[]; location: string }) {
  return (
    <div className="mt-10 divide-y divide-navy/10 border-y border-navy/10">
      {faqs.map((faq, index) => (
        <details
          key={faq.question}
          className="group py-2"
          onToggle={(event) => {
            if (event.currentTarget.open) {
              trackEvent(analyticsEvents.faqOpen, { location, position: index + 1 });
            }
          }}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded px-1 py-3 text-base font-medium text-navy marker:content-none">
            {faq.question}
            <span
              aria-hidden="true"
              className="shrink-0 font-mono text-lg leading-none text-steel-dark transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="px-1 pb-4 text-sm leading-relaxed text-steel-dark">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
