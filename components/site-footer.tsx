import Link from "next/link";

import { footerNav, site } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-navy text-steel">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white">
              {site.name}
            </p>
            <p className="mt-3 text-sm leading-relaxed">{site.descriptor}</p>
            <p className="mt-4 text-xs leading-relaxed">{site.evidenceScope}</p>
          </div>

          {footerNav.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-white">
                {group.heading}
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="max-w-xl">
            Alizane Labs is not an emergency service, insurer, public-safety agency, or
            restoration contractor. In an emergency, call 911.
          </p>
        </div>
      </div>
    </footer>
  );
}
