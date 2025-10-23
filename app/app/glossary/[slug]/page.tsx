import React from "react";
import Form from "next/form";
import Link from "next/link";
import SearchInput from "@/app/search/components/SearchInput";
import {RuleResult} from "@/app/models";
import {DefinitionResult} from "@/app/glossary/models";
import {Metadata} from "next";

export async function generateMetadata({params}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const {slug} = await params;
    const baseUrl = process.env['NEXT_PUBLIC_BASE_URL'];
    const apiUrl = process.env['services__api__http__0'];
    const url = `${baseUrl}/glossary/${slug}`;
    
    try {
        const response = await fetch(`${apiUrl}/glossary/${slug}`, {cache: "no-store"});
        const result: DefinitionResult | null = response.ok ? await response.json() : null;
        
        if (result) {
            const title = `${result.term} — MTG Glossary — Edict`;
            const description = result.text;
            
            return {
                title,
                description,
                openGraph: {
                    url,
                    title,
                    description,
                },
                twitter: {
                    title,
                    description,
                },
            };
        }
    } catch (error) {
        // Fall through to default metadata
    }
    
    // Default metadata if fetch fails
    const title = "MTG Glossary Term — Edict";
    const description = "Explore Magic: The Gathering glossary definitions with comprehensive rules references.";
    
    return {
        title,
        description,
        openGraph: {
            url,
            title,
            description,
        },
        twitter: {
            title,
            description,
        },
    };
}

export default async function Page({params}: {
    params: Promise<{ slug: string }>
}) {
    const {slug} = await params;
    const baseUrl = process.env['services__api__http__0'];
    const response = await fetch(`${baseUrl}/glossary/${slug}`, {cache: "no-store"});
    const result: DefinitionResult | null = response.ok ? await response.json() : null;

    if (!result) {
        return (
            <h3>No definition found :(</h3>
        );
    }

    return (
        <main className="mx-auto max-w-5xl flex flex-col">
            <Form action="/search"
                  className="sticky top-0 mx-auto w-full max-w-5xl z-1 bg-base-200 px-4 pb-2 mb-3 shadow-md md:rounded-b-md">
                <input type="hidden" name="type" value="glossary"/>
                <SearchInput q={""} placeholder={"Search glossary"}/>
            </Form>

            <article className="mx-auto max-w-lg w-full prose">
                <section>
                    <h2>{result.term}</h2>
                    <p>{result.text}</p>
                    {result.rules.length > 0 && (
                        <>
                            <h4>References</h4>
                            <ul>
                                {result.rules.map((ref: RuleResult) => (
                                    <li key={ref.id}>
                                        <Link href={`/rules/${ref.slug}`}>{ref.number} {ref.text}</Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </section>
            </article>
        </main>
    )
        ;
}
