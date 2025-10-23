import React from "react";
import Form from "next/form";
import SearchInput from "@/app/search/components/SearchInput";
import {RuleType, RuleResult} from "@/app/models";
import Subsection from "@/app/rules/components/Subsection";
import Rule from "@/app/rules/components/Rule";
import Subrule from "@/app/rules/components/Subrule";
import Link from "next/link";
import type {Metadata} from "next";

export async function generateMetadata({params}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const {slug} = await params;
    const baseUrl = process.env['NEXT_PUBLIC_BASE_URL'];
    const apiUrl = process.env['services__api__http__0'];
    const url = `${baseUrl}/rules/${slug}`;
    
    try {
        const response = await fetch(`${apiUrl}/rules/${slug}`, {cache: "no-store"});
        const rule: RuleResult | null = response.ok ? await response.json() : null;
        
        if (rule) {
            const title = `Rule ${rule.number} — ${rule.text.substring(0, 60)}${rule.text.length > 60 ? '...' : ''} — Edict`;
            const description = `${rule.text} Read the complete Magic: The Gathering rule ${rule.number}${rule.subsection ? ` from ${rule.subsection}` : ''} with all subrules and references.`;
            
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
    const title = "MTG Rule — Edict";
    const description = "Explore Magic: The Gathering comprehensive rules with detailed explanations and references.";
    
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
    const response = await fetch(`${baseUrl}/rules/type/${slug}`, {cache: "no-store"});
    const result: RuleType = response.ok ? await response.json() : [];

    return (
        <main className="mx-auto max-w-5xl flex flex-col">
            <Form action="/search"
                  className="sticky top-0 mx-auto w-full max-w-5xl z-1 bg-base-200 px-4 pb-2 mb-3 shadow-md md:rounded-b-md">
                <input type="hidden" name="type" value="rules" />
                <SearchInput q={""} placeholder={"Search rules"}/>
            </Form>

            <article className="mx-auto max-w-lg w-full mt-10 px-4 prose">
                <Link href="/rules" className="link link-hover"><h1>Rules</h1></Link>
                {result == 'subsection' && (
                    <Subsection slug={slug}></Subsection>
                )}
                {result == 'rule' && (
                    <Rule slug={slug}></Rule>
                )}
                {result == 'subrule' && (
                    <Subrule slug={slug}></Subrule>
                )}
            </article>
        </main>
    );
}
