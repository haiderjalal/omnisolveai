import type { MetadataRoute } from "next";

import { siteConfig } from "@/content/site";
import { isIndexable } from "@/lib/environment";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    // previews and staging: keep crawlers out entirely
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
