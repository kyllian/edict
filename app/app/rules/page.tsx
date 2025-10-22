import React from "react";
import Form from "next/form";
import SearchInput from "@/app/search/components/SearchInput";
import Link from "next/link";
import {RuleResult} from "@/app/rules/models";

export default async function Page() {
    const baseUrl = process.env['services__api__http__0'];
    const res = await fetch(`${baseUrl}/rules/sections`, {cache: "no-store"});
    const sections: RuleResult[] = res.ok ? await res.json() : [];

    return (
        <main className="mx-auto max-w-5xl flex flex-col w-full">
            <Form action="/search"
                  className="sticky top-0 mx-auto w-full max-w-5xl z-1 bg-base-200 px-4 pb-2 mb-3 shadow-md md:rounded-b-md">
                <SearchInput q={""}/>
            </Form>

            <article className="mx-auto mt-10 w-full max-w-lg prose">
                <section className="mb-4">
                    <h1>Rules</h1>
                </section>

                <div>
                    {sections.length > 0 ? (
                        sections.map((section, idx) => (
                            <details key={section.id} className="collapse pb-2">
                                <summary className="collapse-title p-0">
                                    {section.number} {section.text}
                                </summary>
                                <div className="collapse-content px-0">
                                    {section.rules && section.rules.length > 0 && (
                                        <ul className="list">
                                            {section.rules.map((sub) => (
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
                        <div className="prose mt-3">
                            <h4>Oops! No rules found. :(</h4>
                        </div>
                    )}
                </div>
            </article>
        </main>
    );
}
