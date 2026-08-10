import { LegalPage } from "@/components/legal-page";
import { aiDisclosureSections } from "@/content/legal";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "AI call and recording approach",
  description:
    "Plain-language explanation of how the Restoration Emergency Engine uses automated voice assistance, recording, transcription, and consent.",
  path: "/ai-call-disclosure",
});

export default function AiCallDisclosurePage() {
  return (
    <LegalPage
      eyebrow="AI call disclosure"
      title="How automation is used on your calls"
      intro="Written for homeowners, technicians, and owners — not for lawyers."
      sections={aiDisclosureSections}
    />
  );
}
