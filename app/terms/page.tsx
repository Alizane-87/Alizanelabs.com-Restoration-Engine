import { LegalPage } from "@/components/legal-page";
import { termsSections } from "@/content/legal";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Terms",
  description: "Terms governing use of the Alizane Labs website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Website terms"
      intro="These terms cover use of this website. Deployment terms are set out in a signed agreement."
      sections={termsSections}
    />
  );
}
