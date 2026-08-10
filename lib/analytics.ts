"use client";

/**
 * Privacy-conscious event names. Never attach homeowner, technician, call,
 * transcript, or incident data to a website analytics event.
 */
export const analyticsEvents = {
  heroDemoCtaClick: "hero_demo_cta_click",
  productCtaClick: "product_cta_click",
  pricingCtaClick: "pricing_cta_click",
  phoneDemoClick: "phone_demo_click",
  dispatchAuditStart: "dispatch_audit_start",
  dispatchAuditComplete: "dispatch_audit_complete",
  faqOpen: "faq_open",
} as const;

export type AnalyticsEvent = (typeof analyticsEvents)[keyof typeof analyticsEvents];

type AnalyticsProps = Record<string, string | number | boolean>;

type AnalyticsWindow = Window & {
  plausible?: (event: string, options?: { props?: AnalyticsProps }) => void;
  dataLayer?: Array<Record<string, unknown>>;
};

export function trackEvent(event: AnalyticsEvent, props?: AnalyticsProps): void {
  if (typeof window === "undefined") return;

  const target = window as AnalyticsWindow;

  if (typeof target.plausible === "function") {
    target.plausible(event, props ? { props } : undefined);
    return;
  }

  if (Array.isArray(target.dataLayer)) {
    target.dataLayer.push({ event, ...props });
  }
}
