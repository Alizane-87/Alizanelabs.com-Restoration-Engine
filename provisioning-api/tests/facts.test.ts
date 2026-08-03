import { describe, expect, it } from "vitest";

import {
  deriveReviewFlags,
  onboardingFactsJsonSchema,
  onboardingFactsSchema,
} from "@/lib/schemas/facts";
import { buildFacts } from "./helpers/facts";

function codes(facts: Parameters<typeof deriveReviewFlags>[0]): string[] {
  return deriveReviewFlags(facts).map((flag) => flag.code);
}

describe("deriveReviewFlags", () => {
  it("passes a fully quoted extraction", () => {
    expect(deriveReviewFlags(buildFacts())).toEqual([]);
  });

  it("flags a price that has no supporting transcript quote as high severity", () => {
    const flags = deriveReviewFlags(
      buildFacts({
        topServices: [
          { name: "Drain cleaning", description: null, price: "AED 900", priceSourceQuote: null },
        ],
      }),
    );
    expect(flags).toHaveLength(1);
    expect(flags[0]).toMatchObject({ code: "price_without_quote", severity: "high" });
    expect(flags[0]!.message).toContain("AED 900");
  });

  it("does not flag a service that simply has no price", () => {
    expect(
      codes(
        buildFacts({
          topServices: [{ name: "Inspection", description: null, price: null, priceSourceQuote: null }],
        }),
      ),
    ).toEqual([]);
  });

  it("flags missing services, missing hours and an unquoted emergency promise", () => {
    expect(codes(buildFacts({ topServices: [] }))).toContain("no_services");
    expect(
      codes(buildFacts({ businessHours: { entries: [], notes: null, sourceQuote: null } })),
    ).toContain("no_business_hours");
    expect(
      codes(
        buildFacts({
          emergencyProtocol: {
            offersEmergencyService: true,
            availability: "24/7",
            escalationInstructions: null,
            escalationPhone: null,
            sourceQuote: null,
          },
        }),
      ),
    ).toContain("emergency_without_quote");
  });

  it("flags an open day with no opening time, and an unknown emergency protocol", () => {
    expect(
      codes(
        buildFacts({
          businessHours: {
            entries: [{ day: "sunday", opens: null, closes: null, closed: false }],
            notes: null,
            sourceQuote: "we're around on Sundays too",
          },
        }),
      ),
    ).toContain("incomplete_hours_entry");

    expect(
      codes(
        buildFacts({
          emergencyProtocol: {
            offersEmergencyService: null,
            availability: null,
            escalationInstructions: null,
            escalationPhone: null,
            sourceQuote: null,
          },
        }),
      ),
    ).toContain("emergency_unknown");
  });
});

describe("extraction schema", () => {
  it("keeps the JSON schema sent to the model in sync with the validation schema", () => {
    const zodKeys = Object.keys(onboardingFactsSchema.shape).sort();
    expect([...onboardingFactsJsonSchema.required].sort()).toEqual(zodKeys);
    expect(Object.keys(onboardingFactsJsonSchema.properties).sort()).toEqual(zodKeys);
  });

  it("rejects an extraction that drops a required field", () => {
    const { businessHours: _businessHours, ...withoutHours } = buildFacts();
    expect(onboardingFactsSchema.safeParse(withoutHours).success).toBe(false);
  });

  it("rejects more than three services", () => {
    const service = { name: "s", description: null, price: null, priceSourceQuote: null };
    expect(
      onboardingFactsSchema.safeParse(buildFacts({ topServices: Array(4).fill(service) })).success,
    ).toBe(false);
  });
});
