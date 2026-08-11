"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { TrackedLink } from "@/components/tracked-link";
import { cn } from "@/components/ui/cn";
import { cta, nav, site } from "@/content/site";
import { analyticsEvents } from "@/lib/analytics";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 backdrop-blur supports-[backdrop-filter]:bg-navy/85">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-amber focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy"
      >
        Skip to content
      </a>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center">
          <Image src="/alizane-logo-v5.png" alt={site.name} width={240} height={60} className="h-10 w-auto object-contain" priority />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm transition-colors",
                  active ? "text-white" : "text-steel hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <TrackedLink
            href={cta.header.href}
            event={analyticsEvents.heroDemoCtaClick}
            location="header"
            size="md"
          >
            {cta.header.label}
          </TrackedLink>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-white/25 px-3 py-2 text-sm font-medium text-white lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-white/10 bg-navy lg:hidden"
      >
        <nav aria-label="Primary mobile" className="mx-auto w-full max-w-6xl px-5 py-4 sm:px-8">
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="block rounded px-2 py-3 text-base text-steel hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <TrackedLink
            href={cta.header.href}
            event={analyticsEvents.heroDemoCtaClick}
            location="header-mobile"
            size="lg"
            className="mt-4 w-full"
            onClick={() => setOpen(false)}
          >
            {cta.header.label}
          </TrackedLink>
        </nav>
      </div>
    </header>
  );
}
