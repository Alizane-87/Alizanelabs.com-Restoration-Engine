import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/env";

const routes = [
  { path: "/", priority: 1 },
  { path: "/restoration-emergency-engine", priority: 0.9 },
  { path: "/how-it-works", priority: 0.8 },
  { path: "/pricing", priority: 0.8 },
  { path: "/dispatch-audit", priority: 0.9 },
  { path: "/about", priority: 0.5 },
  { path: "/ai-call-disclosure", priority: 0.4 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
