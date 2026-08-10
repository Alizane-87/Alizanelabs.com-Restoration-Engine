import type { ReactNode } from "react";

import { cn } from "@/components/ui/cn";

export type StatusTone = "routed" | "active" | "escalating" | "accepted" | "exception";

type ToneStyle = { border: string; background: string; text: string; dot: string };

const tones: Record<StatusTone, { label: string; light: ToneStyle; dark: ToneStyle }> = {
  routed: {
    label: "Routed",
    light: {
      border: "border-steel/50",
      background: "bg-steel/10",
      text: "text-steel-dark",
      dot: "bg-steel-dark",
    },
    dark: {
      border: "border-steel/40",
      background: "bg-steel/10",
      text: "text-steel",
      dot: "bg-steel",
    },
  },
  active: {
    label: "In progress",
    light: {
      border: "border-steel/50",
      background: "bg-steel/10",
      text: "text-steel-dark",
      dot: "bg-steel-dark",
    },
    dark: {
      border: "border-steel/40",
      background: "bg-steel/10",
      text: "text-steel",
      dot: "bg-steel",
    },
  },
  escalating: {
    label: "Escalating",
    light: {
      border: "border-amber/60",
      background: "bg-amber/15",
      text: "text-[#8a5410]",
      dot: "bg-[#8a5410]",
    },
    dark: {
      border: "border-amber/50",
      background: "bg-amber/10",
      text: "text-amber",
      dot: "bg-amber",
    },
  },
  accepted: {
    label: "Accepted",
    light: {
      border: "border-verified/60",
      background: "bg-verified/15",
      text: "text-[#136b44]",
      dot: "bg-[#136b44]",
    },
    dark: {
      border: "border-verified/50",
      background: "bg-verified/10",
      text: "text-verified",
      dot: "bg-verified",
    },
  },
  exception: {
    label: "Exception",
    light: {
      border: "border-critical/60",
      background: "bg-critical/12",
      text: "text-[#9e2b2b]",
      dot: "bg-[#9e2b2b]",
    },
    dark: {
      border: "border-critical/60",
      background: "bg-critical/10",
      text: "text-[#f3a1a1]",
      dot: "bg-[#f3a1a1]",
    },
  },
};

export function StatusChip({
  status,
  surface = "light",
  children,
  className,
}: {
  status: StatusTone;
  surface?: "light" | "dark";
  children?: ReactNode;
  className?: string;
}) {
  const tone = tones[status];
  const style = surface === "dark" ? tone.dark : tone.light;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.12em]",
        style.border,
        style.background,
        style.text,
        className,
      )}
    >
      <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {children ?? tone.label}
    </span>
  );
}

export function IllustrativeLabel({
  surface = "light",
  className,
}: {
  surface?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em]",
        surface === "dark"
          ? "border-steel/40 text-steel"
          : "border-steel/50 text-steel-dark",
        className,
      )}
    >
      Illustrative workflow
    </span>
  );
}
