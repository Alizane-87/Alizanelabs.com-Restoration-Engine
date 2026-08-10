import { cn } from "@/components/ui/cn";

export type Step = { title: string; body: string };

export function StepList({
  steps,
  tone = "light",
  className,
}: {
  steps: readonly Step[];
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <ol className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {steps.map((step, index) => (
        <li
          key={step.title}
          className={cn(
            "relative rounded-lg border p-5",
            tone === "dark" ? "border-white/10 bg-carbon" : "border-navy/10 bg-white",
          )}
        >
          <span
            className={cn(
              "font-mono text-xs font-semibold tracking-[0.18em]",
              tone === "dark" ? "text-amber" : "text-steel-dark",
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3
            className={cn(
              "mt-2 text-base font-semibold",
              tone === "dark" ? "text-white" : "text-navy",
            )}
          >
            {step.title}
          </h3>
          <p
            className={cn(
              "mt-2 text-sm leading-relaxed",
              tone === "dark" ? "text-steel" : "text-steel-dark",
            )}
          >
            {step.body}
          </p>
        </li>
      ))}
    </ol>
  );
}
