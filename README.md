# Alizane Labs website

Marketing site for Alizane Labs and the Restoration Emergency Engine — Verified
Dispatch Assurance for independent US restoration companies.

Next.js (App Router) · TypeScript · Tailwind CSS v4 · deployed on Vercel.

## Local development

```bash
npm install
cp .env.example .env.local   # then set NEXT_PUBLIC_SITE_URL
npm run dev
```

```bash
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm run build       # production build
```

## Structure

| Path | Purpose |
| --- | --- |
| `app/` | Launch routes plus `api/lead` (server-side lead intake), `sitemap.ts`, `robots.ts` |
| `components/` | Shared layout, section components, and `ui/` primitives (button, card, section, status chip, step list) |
| `content/` | All editable copy: `site.ts` (nav, hero, offer, **pricing**), `faqs.ts`, `legal.ts` |
| `lib/` | `env.ts` (validated env), `lead-schema.ts`, `lead-delivery.ts`, `rate-limit.ts`, `analytics.ts`, `structured-data.ts`, `metadata.ts` |

Pricing lives in one place: `content/site.ts` → `pricing`. Every page reads it.

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes in production | Absolute origin for canonicals, sitemap, Open Graph |
| `NEXT_PUBLIC_SCHEDULING_URL` | No | External scheduler. Unset ⇒ all CTAs route to `/dispatch-audit` |
| `NEXT_PUBLIC_DEMO_PHONE` | No | E.164 demo line, rendered only once a tested number exists |
| `LEAD_WEBHOOK_URL` | Yes in production | Server-side destination for dispatch-audit leads |
| `LEAD_WEBHOOK_TOKEN` | No | Bearer token for the lead webhook |
| `LEAD_NOTIFY_EMAIL` | No | Mailbox passed to the destination for notification routing |

Env is validated at startup in `lib/env.ts`; invalid values fail the build rather
than degrading silently. With no `LEAD_WEBHOOK_URL`, development logs that a lead
arrived (without contact details) and **production rejects the submission with a
visible error** instead of discarding it.

## Content and claims policy

The site must not state "never miss a call", a guaranteed callback time,
guaranteed revenue, universal uptime, or blanket legal compliance, and must not
add testimonials, customer logos, metrics, or case studies that are not real.
Dispatch evidence language is always scoped to calls routed into the Engine.

`content/legal.ts` holds draft privacy, terms, and AI-disclosure copy. Values the
founder still has to supply (legal entity, address, privacy contact, governing
law) are `null` and render as "To be confirmed before launch" rather than being
invented. Legal drafts require founder and counsel review before launch.
