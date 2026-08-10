import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
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
