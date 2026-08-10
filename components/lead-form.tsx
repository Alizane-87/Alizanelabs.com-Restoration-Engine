"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import {
  afterHoursHandlingOptions,
  monthlyCallRangeOptions,
  type LeadFieldErrors,
} from "@/lib/lead-schema";

type SubmitState = "idle" | "submitting" | "error";

const fieldClass =
  "w-full rounded-md border border-navy/20 bg-white px-3 py-2.5 text-base text-navy placeholder:text-steel focus:border-navy/50";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-critical">
      {message}
    </p>
  );
}

export function LeadForm() {
  const router = useRouter();
  const formId = useId();
  const started = useRef(false);
  const [state, setState] = useState<SubmitState>("idle");
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  function onFirstInteraction() {
    if (started.current) return;
    started.current = true;
    trackEvent(analyticsEvents.dispatchAuditStart, { location: "dispatch-audit" });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrors({});
    setFormError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      firstName: String(formData.get("firstName") ?? ""),
      company: String(formData.get("company") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      serviceArea: String(formData.get("serviceArea") ?? ""),
      afterHoursHandling: String(formData.get("afterHoursHandling") ?? ""),
      monthlyCallRange: String(formData.get("monthlyCallRange") ?? ""),
      crm: String(formData.get("crm") ?? ""),
      consent: formData.get("consent") === "on",
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        trackEvent(analyticsEvents.dispatchAuditComplete, { location: "dispatch-audit" });
        router.push("/thank-you");
        return;
      }

      const body = (await response.json().catch(() => null)) as {
        message?: string;
        fieldErrors?: LeadFieldErrors;
      } | null;

      setErrors(body?.fieldErrors ?? {});
      setFormError(
        body?.message ??
          "We could not submit the request. Please try again, or contact us directly.",
      );
      setState("error");
    } catch {
      setFormError(
        "We could not reach the server. Please check your connection and try again.",
      );
      setState("error");
    }
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      onFocusCapture={onFirstInteraction}
      className="flex flex-col gap-5"
      aria-describedby={formError ? `${formId}-form-error` : undefined}
    >
      {formError ? (
        <div
          id={`${formId}-form-error`}
          role="alert"
          className="rounded-md border border-critical/40 bg-critical/5 px-4 py-3 text-sm text-critical"
        >
          {formError}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-firstName`} className="text-sm font-medium text-navy">
            First name
          </label>
          <input
            id={`${formId}-firstName`}
            name="firstName"
            autoComplete="given-name"
            required
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? `${formId}-firstName-error` : undefined}
            className={cn(fieldClass, "mt-1.5", errors.firstName && "border-critical")}
          />
          <FieldError id={`${formId}-firstName-error`} message={errors.firstName} />
        </div>

        <div>
          <label htmlFor={`${formId}-company`} className="text-sm font-medium text-navy">
            Company
          </label>
          <input
            id={`${formId}-company`}
            name="company"
            autoComplete="organization"
            required
            aria-invalid={Boolean(errors.company)}
            aria-describedby={errors.company ? `${formId}-company-error` : undefined}
            className={cn(fieldClass, "mt-1.5", errors.company && "border-critical")}
          />
          <FieldError id={`${formId}-company-error`} message={errors.company} />
        </div>

        <div>
          <label htmlFor={`${formId}-email`} className="text-sm font-medium text-navy">
            Work email
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${formId}-email-error` : undefined}
            className={cn(fieldClass, "mt-1.5", errors.email && "border-critical")}
          />
          <FieldError id={`${formId}-email-error`} message={errors.email} />
        </div>

        <div>
          <label htmlFor={`${formId}-phone`} className="text-sm font-medium text-navy">
            Phone
          </label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${formId}-phone-error` : undefined}
            className={cn(fieldClass, "mt-1.5", errors.phone && "border-critical")}
          />
          <FieldError id={`${formId}-phone-error`} message={errors.phone} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${formId}-serviceArea`} className="text-sm font-medium text-navy">
            Primary service area
          </label>
          <input
            id={`${formId}-serviceArea`}
            name="serviceArea"
            required
            placeholder="City, county, or metro you cover"
            aria-invalid={Boolean(errors.serviceArea)}
            aria-describedby={errors.serviceArea ? `${formId}-serviceArea-error` : undefined}
            className={cn(fieldClass, "mt-1.5", errors.serviceArea && "border-critical")}
          />
          <FieldError id={`${formId}-serviceArea-error`} message={errors.serviceArea} />
        </div>

        <div>
          <label
            htmlFor={`${formId}-afterHoursHandling`}
            className="text-sm font-medium text-navy"
          >
            Current after-hours handling
          </label>
          <select
            id={`${formId}-afterHoursHandling`}
            name="afterHoursHandling"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.afterHoursHandling)}
            aria-describedby={
              errors.afterHoursHandling ? `${formId}-afterHoursHandling-error` : undefined
            }
            className={cn(fieldClass, "mt-1.5", errors.afterHoursHandling && "border-critical")}
          >
            <option value="" disabled>
              Select an option
            </option>
            {afterHoursHandlingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError
            id={`${formId}-afterHoursHandling-error`}
            message={errors.afterHoursHandling}
          />
        </div>

        <div>
          <label
            htmlFor={`${formId}-monthlyCallRange`}
            className="text-sm font-medium text-navy"
          >
            Approximate monthly after-hours calls{" "}
            <span className="font-normal text-steel-dark">(optional)</span>
          </label>
          <select
            id={`${formId}-monthlyCallRange`}
            name="monthlyCallRange"
            defaultValue="unknown"
            className={cn(fieldClass, "mt-1.5")}
          >
            {monthlyCallRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${formId}-crm`} className="text-sm font-medium text-navy">
            Current CRM or field-service system{" "}
            <span className="font-normal text-steel-dark">(optional)</span>
          </label>
          <input id={`${formId}-crm`} name="crm" className={cn(fieldClass, "mt-1.5")} />
        </div>
      </div>

      {/* Honeypot: hidden from users and assistive technology. */}
      <div aria-hidden="true" className="absolute left-[-10000px] h-px w-px overflow-hidden">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input id={`${formId}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id={`${formId}-consent`}
            name="consent"
            type="checkbox"
            required
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
            className="mt-1 h-4 w-4 shrink-0 accent-[#08131f]"
          />
          <label htmlFor={`${formId}-consent`} className="text-sm leading-relaxed text-navy">
            Alizane Labs may contact me about the after-hours dispatch audit I requested.
          </label>
        </div>
        <FieldError id={`${formId}-consent-error`} message={errors.consent} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={state === "submitting"}>
          {state === "submitting" ? "Sending…" : "Request the dispatch audit"}
        </Button>
        <p className="text-sm text-steel-dark">
          No credentials, customer records, or technician numbers are collected here.
        </p>
      </div>

      <p aria-live="polite" className="sr-only">
        {state === "submitting" ? "Submitting your request" : ""}
      </p>
    </form>
  );
}
