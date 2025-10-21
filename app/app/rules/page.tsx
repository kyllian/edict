import React from "react";
import {redirect} from "next/navigation";
import Form from "next/form";
import SearchInput from "@/app/search/components/SearchInput";
import Link from "next/link";
import {RuleResult} from "@/app/rules/models";

export default async function Page() {
    const baseUrl = process.env['services__api__http__0'];
    if (!baseUrl) {
        console.log("API base URL not configured");
        redirect("/404"); // redirect to home if API base URL is missing
    }

    const res = await fetch(`${baseUrl}/rules/sections`, {cache: "no-store"});
    const sections: RuleResult[] = res.ok ? await res.json() : [];

    return (
        <div className="min-h-screen">
            <main className="mx-auto max-w-5xl flex flex-col pb-25">
                <Form action="/search"
                      className="sticky top-0 mx-auto w-full max-w-5xl z-1 bg-base-200 px-4 pb-2 mb-3 shadow-md md:rounded-b-md">
                    <SearchInput q={""}/>
                </Form>

                <div className="mt-6 px-4 sm:pl-15">
                    <div className="prose mb-4">
                        <h1 className="font-bold ml-4">Rule Sections</h1>
                    </div>

                    {sections.length > 0 ? (
                        <div className="space-y-2">
                            {sections.map((section, idx) => (
                                <div key={section.id} className="collapse collapse-arrow border border-base-300">
                                    <input type="radio" name="rules-accordion" defaultChecked={idx === 0}/>
                                    <div className="collapse-title">
                                        {section.number} {section.text}
                                    </div>
                                    <div className="collapse-content">
                                        {section.rules && section.rules.length > 0 && (
                                            <ul className="list">
                                                {section.rules.map((sub) => (
                                                    <li key={sub.id} className="list-row">
                                                        <div className="flex flex-col items-start">
                                                            <Link href={`/rules/subsections/${sub.slug}`} className="font-semibold">
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
