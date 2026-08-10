import { IllustrativeLabel, StatusChip, type StatusTone } from "@/components/ui/status-chip";
import { cn } from "@/components/ui/cn";
import { heroTimeline } from "@/content/site";

const rowTone: Record<StatusTone, string> = {
  routed: "text-steel",
  active: "text-steel",
  escalating: "text-amber",
  accepted: "text-verified",
  exception: "text-critical",
};

export function HeroDispatchTimeline() {
  return (
    <figure className="rounded-xl border border-white/10 bg-carbon p-5 sm:p-6">
      <figcaption className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-steel">
          Incident 4821 · After-hours
        </span>
        <IllustrativeLabel surface="dark" />
      </figcaption>

      <ol className="mt-5 flex flex-col">
        {heroTimeline.map((entry, index) => {
          const isLast = index === heroTimeline.length - 1;
          return (
            <li key={entry.time} className="grid grid-cols-[auto_1fr] gap-x-4">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                    entry.state === "accepted"
                      ? "bg-verified"
                      : entry.state === "escalating"
                        ? "bg-amber"
                        : "bg-steel",
                  )}
                >
                  {index === 0 ? (
                    <span
                      aria-hidden="true"
                      className="animate-call-pulse absolute inset-0 rounded-full bg-steel"
                    />
                  ) : null}
                </span>
                {!isLast ? <span className="w-px flex-1 bg-white/12" /> : null}
              </div>

              <div className={cn("pb-5", isLast && "pb-0")}>
                <p className="font-mono text-xs tracking-tight text-steel">{entry.time}</p>
                <p
                  className={cn(
                    "mt-1 text-sm font-medium sm:text-base",
                    entry.state === "accepted" ? rowTone.accepted : "text-white",
                  )}
                >
                  {entry.event}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-xs text-steel">Named human acceptance recorded</span>
        <StatusChip status="accepted" surface="dark">
          Accepted
        </StatusChip>
      </div>
    </figure>
  );
}
