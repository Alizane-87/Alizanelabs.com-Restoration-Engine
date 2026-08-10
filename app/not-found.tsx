import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";

export default function NotFound() {
  return (
    <Container className="py-24 sm:py-32">
      <div className="flex max-w-xl flex-col gap-5">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-steel-dark">404</p>
        <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
          That page is not part of the site.
        </h1>
        <p className="text-base leading-relaxed text-steel-dark">
          The link may be out of date. The dispatch workflow and the audit request are both one
          click away.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            Back to the homepage
          </ButtonLink>
          <ButtonLink href="/dispatch-audit" variant="secondary" size="lg">
            Request a dispatch audit
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
