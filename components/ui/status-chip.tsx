import type { ReactNode } from "react";

import { cn } from "@/components/ui/cn";

export type StatusTone = "routed" | "active" | "escalating" | "accepted" | "exception";

const tones: Record<StatusTone, { label: string; className: string; dot: string }> = {
  routed: {
    label: "Routed",
    className: "border-steel/40 bg-steel/10 text-steel",
    dot: "bg-steel",
  },
  active: {
    label: "In progress",
    className: "border-steel/40 bg-steel/10 text-steel",
    dot: "bg-steel",
  },
  escalating: {
    label: "Escalating",
    className: "border-amber/50 bg-amber/10 text-amber",
    dot: "bg-amber",
  },
  accepted: {
    label: "Accepted",
    className: "border-verified/50 bg-verified/10 text-verified",
    dot: "bg-verified",
  },
  exception: {
    label: "Exception",
    className: "border-critical/50 bg-critical/10 text-critical",
    dot: "bg-critical",
  },
};

export function StatusChip({
  status,
  children,
  className,
}: {
  status: StatusTone;
  children?: ReactNode;
  className?: string;
}) {
  const tone = tones[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.12em]",
        tone.className,
        className,
      )}
    >
      <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} />
      {children ?? tone.label}
    </span>
  );
}

export function IllustrativeLabel({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border border-steel/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-steel",
        className,
      )}
    >
      Illustrative workflow
    </span>
  );
}
