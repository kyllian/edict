import React from "react";
import Form from "next/form";
import SearchInput from "@/app/search/components/SearchInput";
import {RuleType, RuleResult} from "@/app/models";
import Subsection from "@/app/rules/components/Subsection";
import Rule from "@/app/rules/components/Rule";
import Subrule from "@/app/rules/components/Subrule";
import Link from "next/link";
import type {Metadata} from "next";
import {APP_BASE_URL} from "@/app/utils/constants";

const getRuleEndpoint = (url: string, type: string, slug: string) => {
    switch (type) {
        case 'section':
            return `${url}/rules/sections/${slug}`;
        case 'subsection':
            return `${url}/rules/sections/sub/${slug}`;
        case 'subrule':
            return `${url}/rules/sub/${slug}`;
        default:
            return `${url}/rules/${slug}`;
    }
};

export async function generateMetadata({params}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const {slug} = await params;
    const apiUrl = process.env['services__api__http__0'] ?? '';
    const url = `${APP_BASE_URL}/rules/${slug}`;

    const defaultTitle = "MTG Rule — Edict";
    const defaultDescription = "Explore the comprehensive rules of Magic: The Gathering.";

    try {
        const typeResp = await fetch(`${apiUrl}/rules/type/${slug}`, {cache: "no-store"});
        const type: RuleType = typeResp.ok ? await typeResp.json() : null;
        const response = await fetch(getRuleEndpoint(apiUrl, type, slug), {cache: "no-store"});
        const data: RuleResult | null = response.ok ? await response.json() : null;

        const defaultTitle = "MTG Rule — Edict";
        const title = data?.number ? `${data?.number} — Rules of Magic: the Gathering — Edict` : defaultTitle;
        const defaultDescription = "Explore the comprehensive rules of Magic: The Gathering.";
        const description = data?.text ?? defaultDescription;

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
    } catch (error) {
        console.log(error);
    }

    return {
        title: defaultTitle,
        description: defaultDescription,
        openGraph: {
            url,
            title: defaultTitle,
            description: defaultDescription,
        },
        twitter: {
            title: defaultTitle,
            description: defaultDescription,
        },
    };
}

export default async function Page({params}: {
    params: Promise<{ slug: string }>
}) {
    const {slug} = await params;
    const apiUrl = process.env['services__api__http__0'] ?? '';
    const typeResponse = await fetch(`${apiUrl}/rules/type/${slug}`, {cache: "no-store"});
    const type: RuleType = typeResponse.ok ? await typeResponse.json() : 'rule';
    const response = await fetch(getRuleEndpoint(apiUrl, type, slug), {cache: "no-store"});
    const data: RuleResult | null = response.ok ? await response.json() : null;

    return (
        <main className="mx-auto max-w-5xl flex flex-col w-full">
            <Form action="/search"
                  className="sticky top-0 mx-auto w-full max-w-5xl z-1 bg-base-200 px-4 pb-2 shadow-md sm:rounded-b-2xl">
                <input type="hidden" name="type" value="rules"/>
                <SearchInput q={""} placeholder={"Search rules"}/>
            </Form>
            
            <article className="mx-auto max-w-2xl w-full mt-10 prose px-4">
                <Link href="/rules" className="link link-hover"><h1>Rules</h1></Link>
                {data && type === 'subsection' && (
                    <Subsection rule={data}/>
                )}
                {data && type === 'rule' && (
                    <Rule rule={data}/>
                )}
                {data && type === 'subrule' && (
                    <Subrule rule={data}/>
                )}

                {(!data) && (
                    <div className="prose mt-3 rounded-lg">
                        <h4>Oops! No rule found. :(</h4>
                    </div>
                )}
            </article>
        </main>
    );
}
