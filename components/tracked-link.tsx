"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { buttonClass } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

type Variant = "primary" | "secondary" | "ghost" | "onDark";
type Size = "md" | "lg";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  event: AnalyticsEvent;
  location: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

/** Link that records a privacy-conscious click event before navigating. */
export function TrackedLink({
  event,
  location,
  variant = "primary",
  size = "md",
  className,
  children,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      className={cn(buttonClass(variant, size), className)}
      onClick={(clickEvent) => {
        trackEvent(event, { location });
        onClick?.(clickEvent);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
