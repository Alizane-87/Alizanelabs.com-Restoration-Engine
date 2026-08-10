import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/components/ui/cn";

type Variant = "primary" | "secondary" | "ghost" | "onDark";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-amber text-navy hover:bg-[#e0912f]",
  secondary:
    "border border-navy/20 bg-white text-navy hover:border-navy/40 hover:bg-offwhite",
  ghost: "text-navy underline underline-offset-4 hover:text-carbon",
  onDark: "border border-white/25 text-white hover:border-white/60 hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md") {
  return cn(base, variants[variant], sizes[size]);
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(buttonClass(variant, size), className)} {...props}>
      {children}
    </Link>
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={cn(buttonClass(variant, size), className)} {...props} />
  );
}
