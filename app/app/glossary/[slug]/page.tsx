import React from "react";
import Form from "next/form";
import Link from "next/link";
import SearchInput from "@/app/search/components/SearchInput";
import {RuleResult} from "@/app/models";
import {DefinitionResult} from "@/app/glossary/models";
import {Metadata} from "next";
import {APP_BASE_URL} from "@/app/utils/constants";

export async function generateMetadata({params}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const {slug} = await params;
    const apiUrl = process.env['services__api__http__0'];
    const url = `${APP_BASE_URL}/glossary/${slug}`;

    try {
        const response = await fetch(`${apiUrl}/glossary/${slug}`, {cache: "no-store"});
        const result: DefinitionResult | null = response.ok ? await response.json() : null;

        if (result) {
            const title = `${result.term} — Glossary of Magic: the Gathering — Edict`;
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
        console.log(error);
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
    const apiUrl = process.env['services__api__http__0'];
    const response = await fetch(`${apiUrl}/glossary/${slug}`, {cache: "no-store"});
    const result: DefinitionResult | null = response.ok ? await response.json() : null;

    if (!result) {
        return (
            <h3>No definition found :(</h3>
        );
    }

    return (
        <>
            <Form action="/search"
                  className="sticky top-0 mx-auto w-full max-w-5xl z-1 bg-base-200 px-4 pb-2 shadow-md sm:rounded-b-2xl">
                <input type="hidden" name="type" value="glossary"/>
                <SearchInput q={""} placeholder={"Search glossary"}/>
            </Form>

            <article className="mx-auto mt-10 max-w-2xl w-full prose px-4">
                <Link href="/glossary" className="link link-hover"><h1>Glossary</h1></Link>
                <section className="bg-base-200 rounded-lg p-4">
                    <h2 className="mt-0">{result.term}</h2>
                    <p className="mb-0">{result.text}</p>
                </section>
                {result.rules.length > 0 && (
                    <section>
                        <h4>References</h4>
                        <ul className="list pl-0">
                            {result.rules.map((ref: RuleResult) => (
                                <li key={ref.id} className="list-row rounded-lg bg-base-200 px-4">
                                    <Link href={`/rules/${ref.slug}`}
                                          className="font-bold opacity-85 tabular-nums">
                                        {ref.number}
                                    </Link>
                                    <div className="list-col-grow">
                                        <div className="opacity-60">{ref.text}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </article>
        </>
    );
}
