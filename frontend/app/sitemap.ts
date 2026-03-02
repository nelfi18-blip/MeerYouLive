import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://meetyoulive.net",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://meetyoulive.net/login",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://meetyoulive.net/live",
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];
}
