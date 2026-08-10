import { LegalPage } from "@/components/legal-page";
import { privacySections } from "@/content/legal";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Privacy",
  description:
    "How Alizane Labs handles information submitted through this website, and how it differs from call and incident data inside a client deployment.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy and call-data handling"
      intro="What this website collects, why, and how long it is kept."
      sections={privacySections}
    />
  );
}
