import type {MetadataRoute} from 'next'
import {NEXT_PUBLIC_BASE_URL} from "@/app/utils/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = NEXT_PUBLIC_BASE_URL;
    const apiUrl = process.env['services__api__http__0'];

    const sitemap = [
        {
            url: baseUrl,
            priority: 1,
        },
        {
            url: `${baseUrl}/search`,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/rules`,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/glossary`,
            priority: 0.5,
        },
    ];

    const glossaryResponse = await fetch(`${apiUrl}/glossary/slugs`, {cache: "no-store"});
    const glossarySlugs: string[] = glossaryResponse.ok ? await glossaryResponse.json() : [];
    for (const slug of glossarySlugs) {
        sitemap.push(create('glossary', slug, 0.2));
    }
    
    const rulesResponse = await fetch(`${apiUrl}/rules/slugs`, {cache: "no-store"});
    const ruleSlugs: string[] = rulesResponse.ok ? await rulesResponse.json() : [];
    for (const slug of ruleSlugs) {
        sitemap.push(create('rules', slug, 0.3));
    }
    
    function create(type: string, slug: string, priority: number){
        return {
            url: `${baseUrl}/${type}/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: priority,
        }
    }
    
    return sitemap;
}
