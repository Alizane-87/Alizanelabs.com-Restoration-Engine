import { siteUrl } from "@/lib/env";
import { site } from "@/content/site";
import type { Faq } from "@/content/faqs";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: siteUrl,
    description: site.defaultDescription,
    slogan: site.category,
  };
}

export function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: site.product,
    serviceType: site.category,
    description: site.descriptor,
    provider: { "@type": "Organization", name: site.name, url: siteUrl },
    areaServed: { "@type": "Country", name: "United States" },
    audience: {
      "@type": "BusinessAudience",
      name: "Independent restoration companies",
    },
    url: `${siteUrl}/restoration-emergency-engine`,
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
