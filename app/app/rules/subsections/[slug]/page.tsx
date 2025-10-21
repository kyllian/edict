import {redirect} from "next/navigation";
import {RuleResult} from "@/app/rules/models";
import Form from "next/form";
import SearchInput from "@/app/search/components/SearchInput";
import Link from "next/link";
import React from "react";

export default async function Page({params}: {
    params: Promise<{ slug: string }>
}) {
    const {slug} = await params;
    const baseUrl = process.env['services__api__http__0'];
    if (!baseUrl) {
        console.log("API base URL not configured");
        redirect("/404"); // redirect to home if API base URL is missing
    }

    const res = await fetch(`${baseUrl}/rules/subsections/${slug}`, {cache: "no-store"});
    const subsection: RuleResult | null = res.ok ? await res.json() : null;
    console.log(subsection);
    if (!subsection) {
        redirect("/404"); // redirect to home if API base URL is missing
    }

    return (
        <div className="min-h-screen">
            <main className="mx-auto max-w-5xl flex flex-col pb-25">
                <Form action="/search"
                      className="sticky top-0 mx-auto w-full max-w-5xl z-1 bg-base-200 px-4 pb-2 mb-3 shadow-md md:rounded-b-md">
                    <SearchInput q={""}/>
                </Form>

                <div className="mt-6 px-4 sm:pl-15">
                    <div className="prose mb-4 font-bold ml-4">
                        <p className="font-bold">{subsection.section}</p>
                        <h1 className="font-bold">{subsection.subsection}</h1>
                    </div>

                    {subsection.rules.length > 0 ? (
                        <div className="space-y-2">
                            {subsection.rules.map((rule, idx) => (
                                <div key={rule.id} className="collapse collapse-arrow border border-base-300">
                                    <input type="radio" name="rules-accordion" defaultChecked={idx === 0}/>
                                    <div className="collapse-title">
                                        {rule.rule}
                                    </div>
                                    <div className="collapse-content">
                                        {rule.rules && rule.rules.length > 0 && (
                                            <ul className="list">
                                                {rule.rules.map((sub) => (
                                                    <li key={sub.id} className="list-row">
                                                        <div className="flex flex-col items-start">
                                                            <Link href={`/404`} className="font-semibold">
                                                                {sub.number} {sub.text}
                                                            </Link>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="prose mt-3">
                            <h3>No sections found</h3>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}