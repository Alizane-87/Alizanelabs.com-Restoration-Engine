import type { ReactNode } from "react";

import { cn } from "@/components/ui/cn";

export function Card({
  children,
  className,
  tone = "light",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark";
  as?: "div" | "li" | "article";
}) {
  return (
    <Tag
      className={cn(
        "rounded-lg border p-6",
        tone === "dark"
          ? "border-white/10 bg-carbon text-offwhite"
          : "border-navy/10 bg-white text-navy",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>;
}

export function CardBody({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <p
      className={cn(
        "mt-2 text-sm leading-relaxed",
        tone === "dark" ? "text-steel" : "text-steel-dark",
      )}
    >
      {children}
    </p>
  );
}
