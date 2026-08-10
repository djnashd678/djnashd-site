import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_PASSWORD) {
    return {
      rules: { userAgent: "*", disallow: "/" },
      host: "https://djnashd.com"
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/"
      },
      ...["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot"].map(
        (userAgent) => ({ userAgent, allow: "/" })
      )
    ],
    sitemap: "https://djnashd.com/sitemap.xml",
    host: "https://djnashd.com"
  };
}
