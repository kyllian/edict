import React from "react";
import Form from "next/form";
import SearchInput from "@/app/search/components/SearchInput";
import Link from "next/link";
import {RuleResult} from "@/app/models";
import {Metadata} from "next";
import {APP_BASE_URL} from "@/app/utils/constants";
import SearchForm from "@/app/search/components/SearchForm";

export async function generateMetadata(): Promise<Metadata> {
    const url = `${APP_BASE_URL}/rules`;
    const title = "Comprehensive Rules of Magic: the Gathering — Edict";
    const description = "Browse the complete Magic: The Gathering Comprehensive Rules organized by sections. Find specific rules on game mechanics, card types, zones, and tournament procedures.";

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
    searchParams: Promise<{ [section: string]: string }>
}) {
    const {section} = await searchParams;
    const apiUrl = process.env['services__api__http__0'];
    const res = await fetch(`${apiUrl}/rules/sections`, {cache: "no-store"});
    const sections: RuleResult[] = res.ok ? await res.json() : [];
    
    return (
        <main className="mx-auto max-w-5xl flex flex-col w-full">
            <SearchForm q={""} placeholder="Search rules" type="rules"></SearchForm>
            <article className="mx-auto mt-10 w-full max-w-2xl prose px-4">
                <section className="mb-4 w-full">
                    <h1>Rules</h1>
                </section>

                <section className="w-full">
                    {sections.length > 0 ? (
                        sections.map((s) => (
                            <details key={s.id} id={s.slug ?? ""} open={section == s.slug}
                                     className="collapse scroll-mt-40">
                                <summary className="collapse-title p-1">
                                    {s.number} {s.text}
                                </summary>
                                <div className="collapse-content px-0">
                                    {s.rules && s.rules.length > 0 && (
                                        <ul className="list bg-base-200 rounded-lg">
                                            {s.rules.map((sub: RuleResult) => (
                                                <li key={sub.id} className="list-row">
                                                    <Link href={`/rules/${sub.slug}`}
                                                          className="opacity-85 font-bold tabular-nums">
                                                        {sub.number}
                                                    </Link>
                                                    <div className="list-col-grow">
                                                        <div className="opacity-60">{sub.text}</div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </details>
                        ))
                    ) : (
                        <div className="prose flex items-center justify-center min-h-[60vh]">
                            <h3>No rules found :(</h3>
                        </div>
                    )}
                </section>
            </article>
        </main>
    );
}
