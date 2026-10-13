import type { MetadataRoute } from "next";

import { siteConfig } from "@/content/site";

/** The homepage is the only public page for now; add inner pages here as they are built. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteConfig.url, changeFrequency: "monthly", priority: 1 }];
}
