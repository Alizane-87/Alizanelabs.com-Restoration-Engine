import type { OnboardingFacts } from "@/lib/schemas/facts";

export function buildFacts(overrides: Partial<OnboardingFacts> = {}): OnboardingFacts {
  return {
    businessName: "Al Nahda Plumbing",
    businessSummary: "Residential plumbing company in Dubai.",
    industry: "plumbing",
    serviceArea: { value: "Dubai Marina and JLT", sourceQuote: "we cover Dubai Marina and JLT" },
    timezone: "Asia/Dubai",
    businessHours: {
      entries: [{ day: "monday", opens: "08:00", closes: "18:00", closed: false }],
      notes: null,
      sourceQuote: "we're open eight to six on weekdays",
    },
    topServices: [
      {
        name: "Leak repair",
        description: "Pipe and joint leak repair",
        price: "from AED 350",
        priceSourceQuote: "leak repairs start from three hundred and fifty dirhams",
      },
    ],
    emergencyProtocol: {
      offersEmergencyService: true,
      availability: "24/7",
      escalationInstructions: "Call the on-call technician",
      escalationPhone: "+971500000000",
      sourceQuote: "we do emergency call-outs around the clock",
    },
    bookingPolicy: {
      bookingChannel: "phone",
      leadTime: "same day",
      depositRequired: false,
      cancellationPolicy: null,
      sourceQuote: "customers just call us and we come same day",
    },
    faqs: [],
    brandVoice: "friendly, direct",
    doNotSay: [],
    unansweredQuestions: [],
    transcriptQualityNotes: null,
    ...overrides,
  };
}
