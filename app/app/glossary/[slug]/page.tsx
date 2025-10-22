"use server";

import React from "react";
import Form from "next/form";
import Link from "next/link";
import SearchInput from "@/app/search/components/SearchInput";
import {RuleResult} from "@/app/models";
import {DefinitionResult} from "@/app/glossary/models";

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
