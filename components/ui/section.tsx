import type { ReactNode } from "react";

import { cn } from "@/components/ui/cn";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>
  );
}

export function Section({
  children,
  tone = "light",
  className,
  id,
  labelledBy,
}: {
  children: ReactNode;
  tone?: "light" | "dark" | "muted";
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  const tones = {
    light: "bg-white text-navy",
    muted: "bg-offwhite text-navy",
    dark: "bg-navy text-offwhite",
  } as const;

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("py-16 sm:py-20 lg:py-24", tones[tone], className)}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <p
      className={cn(
        "font-mono text-xs font-medium uppercase tracking-[0.18em]",
        tone === "dark" ? "text-steel" : "text-steel-dark",
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  tone = "light",
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  id?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
}) {
  return (
    <header
      className={cn(
        "flex max-w-3xl flex-col gap-3",
        align === "center" && "mx-auto items-center text-center",
      )}
    >
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <h2
        id={id}
        className={cn(
          "text-2xl font-semibold sm:text-3xl lg:text-4xl",
          tone === "dark" ? "text-white" : "text-navy",
        )}
      >
        {title}
      </h2>
      {description ? (
        <div
          className={cn(
            "text-base leading-relaxed sm:text-lg",
            tone === "dark" ? "text-steel" : "text-steel-dark",
          )}
        >
          {description}
        </div>
      ) : null}
    </header>
  );
}

export function ScopeNote({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <p
      className={cn(
        "border-l-2 pl-3 text-sm leading-relaxed",
        tone === "dark" ? "border-steel/50 text-steel" : "border-navy/15 text-steel-dark",
      )}
    >
      {children}
    </p>
  );
}
