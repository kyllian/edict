import React from "react";
import Form from "next/form";
import Link from "next/link";
import AlphaPagination from "./AlphaPagination";
import SearchInput from "@/app/search/components/SearchInput";
import {DefinitionResult} from "@/app/glossary/models";
import {Metadata} from "next";
import {APP_BASE_URL} from "@/app/utils/constants";

export async function generateMetadata({searchParams}: {
    searchParams: Promise<{ [letter: string]: string }>
}): Promise<Metadata> {
    const {letter} = await searchParams;
    const firstLetter = letter ?? "a";
    const url = `${APP_BASE_URL}/glossary${letter ? `?letter=${letter}` : ''}`;
    
    const title = `"${firstLetter.toUpperCase()}" — Glossary of Magic: the Gathering — Edict`;
    const description = `Browse Magic: The Gathering glossary terms beginning with "${firstLetter.toUpperCase()}". Find definitions for MTG keywords, abilities, and game terms.`;

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

export default async function Page({searchParams}: {
    searchParams: Promise<{ [letter: string]: string }>
}) {
    const {letter} = (await searchParams);
    const firstLetter = letter ?? "a";
    const apiUrl = process.env['services__api__http__0'];
    const response = await fetch(`${apiUrl}/glossary?letter=${firstLetter}`, {cache: "no-store"});
    const results: DefinitionResult[] = response.ok ? await response.json() : [];

    return (
        <main className="mx-auto max-w-5xl flex flex-col">
            <Form action="/search"
                  className="sticky top-0 mx-auto w-full max-w-5xl z-1 bg-base-200 px-4 pb-2 mb-3 shadow-md md:rounded-b-md">
                <input type="hidden" name="type" value="glossary"/>
                <SearchInput q={""} placeholder={"Search glossary"}/>
            </Form>

            <article className="mx-auto max-w-2xl w-full mt-7 px-4 prose">
                <section>
                    <h1>Glossary</h1>
                </section>

                <div className="flex mx-auto"><AlphaPagination letter={firstLetter?.toLowerCase()}/></div>
                <section>
                    <ul className="list pl-0">
                        {results.length > 0 ? (
                            results.map((definition: DefinitionResult) => (
                                <li key={definition.id} className="list-row">
                                    <div>
                                        <Link href={`/glossary/${definition.slug}`}>
                                            {definition.term}
                                        </Link>
                                        <p className="text-xs font-semibold opacity-60">{definition.text}</p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <div className="prose flex justify-center my-20">
                                <h3>No definitions found :(</h3>
                            </div>
                        )}
                    </ul>
                </section>
                <div className="flex mx-auto"><AlphaPagination letter={firstLetter?.toLowerCase()}/></div>
            </article>
        </main>
    );
}
