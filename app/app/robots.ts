import type { MetadataRoute } from 'next'
import {APP_BASE_URL} from "@/app/utils/constants";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/',
        },
        sitemap: `${APP_BASE_URL}/sitemap.xml`,
    }
}