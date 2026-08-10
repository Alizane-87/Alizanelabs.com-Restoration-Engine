import "server-only";

import { env, hasLeadDestination } from "@/lib/env";
import type { LeadInput } from "@/lib/lead-schema";

export type LeadRecord = Omit<LeadInput, "website"> & { submittedAt: string };

export interface LeadDestination {
  readonly name: string;
  deliver(lead: LeadRecord): Promise<void>;
}

/**
 * Posts the lead to a server-side webhook (CRM or automation endpoint).
 * The URL and token never reach the browser.
 */
class WebhookDestination implements LeadDestination {
  readonly name = "webhook";

  constructor(
    private readonly url: string,
    private readonly token?: string,
  ) {}

  async deliver(lead: LeadRecord): Promise<void> {
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(this.token ? { authorization: `Bearer ${this.token}` } : {}),
      },
      body: JSON.stringify({
        source: "alizanelabs.site/dispatch-audit",
        notify: env.LEAD_NOTIFY_EMAIL,
        lead,
      }),
    });

    if (!response.ok) {
      throw new Error(`Lead webhook responded with status ${response.status}`);
    }
  }
}

/**
 * Development fallback. Records that a lead arrived without persisting it and
 * without printing contact details, so nothing is silently pretended to work.
 */
class DevelopmentLogDestination implements LeadDestination {
  readonly name = "development-log";

  async deliver(lead: LeadRecord): Promise<void> {
    if (env.NODE_ENV === "production") {
      throw new Error(
        "No lead destination configured. Set LEAD_WEBHOOK_URL before accepting production leads.",
      );
    }
    console.info(
      `[lead] received at ${lead.submittedAt} from company="${lead.company}" — not delivered (no LEAD_WEBHOOK_URL configured)`,
    );
  }
}

export function getLeadDestination(): LeadDestination {
  if (hasLeadDestination && env.LEAD_WEBHOOK_URL) {
    return new WebhookDestination(env.LEAD_WEBHOOK_URL, env.LEAD_WEBHOOK_TOKEN);
  }
  return new DevelopmentLogDestination();
}
