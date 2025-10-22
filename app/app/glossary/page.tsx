"use server";

import React from "react";
import Form from "next/form";
import Link from "next/link";
import AlphaPagination from "./AlphaPagination";
import SearchInput from "@/app/search/components/SearchInput";
import {DefinitionResult} from "@/app/glossary/models";

export default async function Page({searchParams}: {
    searchParams: Promise<{ [letter: string]: string }>
}) {
    const {letter} = await searchParams;
    const baseUrl = process.env['services__api__http__0'];
    const response = await fetch(`${baseUrl}/glossary?letter=${letter}`, {cache: "no-store"});
    const results: DefinitionResult[] = response.ok ? await response.json() : [];

    return (
        <main className="mx-auto max-w-5xl flex flex-col">
            <Form action="/search"
                  className="sticky top-0 mx-auto w-full max-w-5xl z-1 bg-base-200 px-4 pb-2 mb-3 shadow-md md:rounded-b-md">
                <input type="hidden" name="type" value="glossary"/>
                <SearchInput q={""} placeholder={"Search glossary"}/>
            </Form>

            <div className="mx-auto"><AlphaPagination letter={letter.toLowerCase()}/></div>

            <article className="mx-auto max-w-lg w-full mt-7 prose">
                <section>
                    <h1>Glossary</h1>
                </section>
                <section>
                    <ul className="list pl-0">
                        {results.map((definition: DefinitionResult) => (
                            <li key={definition.id} className="list-row">
                                <div>
                                    <Link href={`/glossary/${definition.slug}`}>
                                        {definition.term}
                                    </Link>
                                    <p className="text-xs font-semibold opacity-60">{definition.text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </article>

            <div className="mx-auto"><AlphaPagination letter={letter.toLowerCase()}/></div>
        </main>
    );
}
