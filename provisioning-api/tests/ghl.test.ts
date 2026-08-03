import { describe, expect, it } from "vitest";

import {
  flattenTranscript,
  ghlOnboardingWebhookSchema,
  resolveClient,
  resolveEventId,
} from "@/lib/schemas/ghl";

describe("GHL payload handling", () => {
  it("accepts a string transcript and preserves unknown GHL fields", () => {
    const parsed = ghlOnboardingWebhookSchema.parse({
      callId: "call_1",
      transcript: "  agent: hi\nclient: hello  ",
      customData: { workflowId: "wf_1" },
    });
    expect(flattenTranscript(parsed)).toBe("agent: hi\nclient: hello");
    expect(parsed).toHaveProperty("customData");
  });

  it("flattens a turn-by-turn transcript regardless of which text key is used", () => {
    const parsed = ghlOnboardingWebhookSchema.parse({
      callTranscript: [
        { role: "agent", text: "What are your hours?" },
        { speaker: "client", message: "Eight to six." },
        { role: "client", content: "Closed Fridays." },
        { role: "agent" },
      ],
    });
    expect(flattenTranscript(parsed)).toBe(
      "agent: What are your hours?\nclient: Eight to six.\nclient: Closed Fridays.",
    );
  });

  it("returns an empty transcript when none is present", () => {
    expect(flattenTranscript(ghlOnboardingWebhookSchema.parse({ contactId: "c1" }))).toBe("");
  });

  it("falls back through eventId, id and callId for the idempotency key", () => {
    expect(resolveEventId(ghlOnboardingWebhookSchema.parse({ eventId: "e", id: "i", callId: "c" }))).toBe("e");
    expect(resolveEventId(ghlOnboardingWebhookSchema.parse({ id: "i", callId: "c" }))).toBe("i");
    expect(resolveEventId(ghlOnboardingWebhookSchema.parse({ callId: "c" }))).toBe("c");
    expect(resolveEventId(ghlOnboardingWebhookSchema.parse({ contactId: "c1" }))).toBeNull();
  });

  it("resolves client identity from either GHL naming convention", () => {
    expect(
      resolveClient(
        ghlOnboardingWebhookSchema.parse({ companyName: "Acme HVAC", fullName: "Jane Doe", phone: "+15550000" }),
      ),
    ).toEqual({ businessName: "Acme HVAC", contactName: "Jane Doe", email: null, phone: "+15550000" });
  });
});
