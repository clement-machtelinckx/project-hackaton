import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
            },
            {
                userAgent: "GPTBot",
                allow: "/",
            },
            {
                userAgent: "Claude-Web",
                allow: "/",
            },
            {
                userAgent: "PerplexityBot",
                allow: "/",
            },
            {
                userAgent: "Google-Extended",
                allow: "/",
            },
        ],
        sitemap: `${siteConfig.url}/sitemap.xml`,
    };
}
